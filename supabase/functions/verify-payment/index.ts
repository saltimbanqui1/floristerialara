import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = [
  "https://floristerialara.lovable.app",
  "https://id-preview--986b453d-add0-426f-9f5c-a093e1df7b0c.lovable.app",
  "https://986b453d-add0-426f-9f5c-a093e1df7b0c.lovableproject.com",
  "https://floreslara.es",
  "https://www.floreslara.es",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_SECONDS = 60;

async function checkRateLimit(supabaseAdmin: any, clientIp: string, functionName: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("client_ip", clientIp)
    .eq("function_name", functionName)
    .gte("created_at", windowStart);

  if ((count || 0) >= RATE_LIMIT_MAX) return false;
  await supabaseAdmin.from("rate_limits").insert({ client_ip: clientIp, function_name: functionName });
  return true;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Origin check
  const origin = req.headers.get("origin") || "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 403,
    });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id || typeof session_id !== "string" || !session_id.startsWith("cs_") || session_id.length > 200) {
      console.error("Invalid session_id");
      return new Response(
        JSON.stringify({ error: "Invalid session_id" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const allowed = await checkRateLimit(supabaseAdmin, clientIp, "verify-payment");
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    console.log("Retrieving Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Stripe session status:", session.payment_status);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Check if order already exists
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();

    if (existingOrder) {
      console.log("Order already exists:", existingOrder.id);
      return new Response(
        JSON.stringify({ success: true, order_id: existingOrder.id, already_exists: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const meta = session.metadata || {};
    console.log("Processing order for:", meta.email);

    // Re-validate prices against DB
    let items: any[] = [];
    try { items = JSON.parse(meta.items_json || "[]"); } catch { console.error("Failed to parse items_json"); }

    if (items.length > 0) {
      const productIds = items.map((item: any) => item.id);
      const { data: dbProducts } = await supabaseAdmin
        .from("products")
        .select("id, price")
        .in("id", productIds);

      if (dbProducts) {
        const dbPriceMap: Record<string, number> = {};
        for (const p of dbProducts) dbPriceMap[p.id] = Number(p.price);

        let verifiedSubtotal = 0;
        for (const item of items) {
          const dbPrice = dbPriceMap[item.id];
          if (dbPrice === undefined) { console.warn(`Product ${item.id} not found`); continue; }
          item.price = dbPrice;
          verifiedSubtotal += dbPrice * item.quantity;
        }

        const metaSubtotal = parseFloat(meta.subtotal || "0");
        const metaShipping = parseFloat(meta.shipping_cost || "0");

        if (Math.abs(verifiedSubtotal - metaSubtotal) > 0.01) {
          console.warn("Subtotal mismatch at verification!", { metaSubtotal, verifiedSubtotal });
          meta.subtotal = String(verifiedSubtotal);
          meta.total = String(verifiedSubtotal + metaShipping);
        }
      }
    }

    const shippingNameParts = (meta.shipping_name || "").split(" ");
    const shippingFirstName = shippingNameParts[0] || "";
    const shippingLastName = shippingNameParts.slice(1).join(" ") || "";

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        first_name: meta.first_name,
        last_name: meta.last_name,
        email: meta.email,
        phone: meta.phone,
        billing_address: meta.billing_address || null,
        billing_city: meta.billing_city || null,
        billing_postal_code: meta.billing_postal_code || null,
        billing_province: "Santa Cruz de Tenerife",
        delivery_type: meta.delivery_type || "delivery",
        delivery_date: meta.delivery_date || null,
        delivery_time_slot: meta.time_slot || null,
        card_message: meta.card_message || null,
        shipping_first_name: shippingFirstName || null,
        shipping_last_name: shippingLastName || null,
        shipping_phone: meta.shipping_phone || null,
        shipping_address: meta.shipping_address || null,
        shipping_city: meta.shipping_city || null,
        shipping_postal_code: meta.shipping_postal_code || null,
        shipping_province: meta.delivery_type === "delivery" ? "Santa Cruz de Tenerife" : null,
        shipping_cost: parseFloat(meta.shipping_cost || "0"),
        subtotal: parseFloat(meta.subtotal || "0"),
        total: parseFloat(meta.total || "0"),
        status: "paid",
        stripe_session_id: session_id,
        stripe_payment_intent_id: typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created:", order?.id);

    if (items.length > 0 && order) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image || null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
      if (itemsError) console.error("Order items insert error:", itemsError);
    }

    // Send order confirmation email with HMAC signature
    try {
      const emailPayload = {
        to: meta.email,
        customerName: `${meta.first_name} ${meta.last_name}`,
        orderId: order?.id || "",
        items: items.map((item: any) => ({
          name: item.name, quantity: item.quantity,
          unitPrice: item.price, totalPrice: item.price * item.quantity,
        })),
        subtotal: parseFloat(meta.subtotal || "0"),
        shippingCost: parseFloat(meta.shipping_cost || "0"),
        total: parseFloat(meta.total || "0"),
        deliveryType: meta.delivery_type || "delivery",
        deliveryDate: meta.delivery_date || undefined,
        deliveryTimeSlot: meta.time_slot || undefined,
        shippingAddress: meta.shipping_address || undefined,
        shippingCity: meta.shipping_city || undefined,
        cardMessage: meta.card_message || undefined,
      };

      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const hmacSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

      const bodyStr = JSON.stringify(emailPayload);
      const signature = await signPayload(bodyStr, hmacSecret);

      fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
          "x-internal-signature": signature,
        },
        body: bodyStr,
      }).catch((emailErr) => console.error("Email send failed:", emailErr));
    } catch (emailErr) {
      console.error("Email payload error:", emailErr);
    }

    // Send WhatsApp notification to store owner with HMAC signature
    try {
      const waPayload = {
        orderId: order?.id || "",
        customerName: `${meta.first_name} ${meta.last_name}`,
        customerEmail: meta.email,
        customerPhone: meta.phone,
        billingAddress: meta.billing_address || undefined,
        billingCity: meta.billing_city || undefined,
        billingPostalCode: meta.billing_postal_code || undefined,
        items: items.map((item: any) => ({
          name: item.name, quantity: item.quantity,
          unitPrice: item.price, totalPrice: item.price * item.quantity,
        })),
        subtotal: parseFloat(meta.subtotal || "0"),
        shippingCost: parseFloat(meta.shipping_cost || "0"),
        total: parseFloat(meta.total || "0"),
        deliveryType: meta.delivery_type || "delivery",
        deliveryDate: meta.delivery_date || undefined,
        deliveryTimeSlot: meta.time_slot || undefined,
        shippingName: meta.shipping_name || undefined,
        shippingPhone: meta.shipping_phone || undefined,
        shippingAddress: meta.shipping_address || undefined,
        shippingCity: meta.shipping_city || undefined,
        shippingPostalCode: meta.shipping_postal_code || undefined,
        cardMessage: meta.card_message || undefined,
      };

      const supabaseUrlWa = Deno.env.get("SUPABASE_URL") ?? "";
      const supabaseAnonKeyWa = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      const hmacSecretWa = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

      const waBodyStr = JSON.stringify(waPayload);
      const waSignature = await signPayload(waBodyStr, hmacSecretWa);

      fetch(`${supabaseUrlWa}/functions/v1/send-whatsapp-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKeyWa}`,
          "x-internal-signature": waSignature,
        },
        body: waBodyStr,
      }).catch((waErr) => console.error("WhatsApp send failed:", waErr));
    } catch (waErr) {
      console.error("WhatsApp payload error:", waErr);
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
