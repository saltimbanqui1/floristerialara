import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = [
  "https://floristerialara.lovable.app",
  "https://id-preview--986b453d-add0-426f-9f5c-a093e1df7b0c.lovable.app",
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

// Map product IDs to Stripe price IDs
const PRICE_MAP: Record<string, string> = {
  presencia: "price_1T2sVbDjVxta6u89RZs75Yv5",
  cedro: "price_1T2sVmDjVxta6u89XBdgpRDj",
  olivo: "price_1T2sVzDjVxta6u89fFtSAjnc",
  amor: "price_1T2sWCDjVxta6u89L48G1sTl",
  suave: "price_1T2sWQDjVxta6u89G0Tv85ED",
  ebano: "price_1T2sWcDjVxta6u89DBZfEAlD",
  picea: "price_1T2sWoDjVxta6u899B2Eq9fI",
  esplendor: "price_1T2sX3DjVxta6u89Yfs5Lh3L",
  "test-1euro": "price_1T59fsDjVxta6u89Uja435K7",
};

const RATE_LIMIT_MAX = 10; // max requests
const RATE_LIMIT_WINDOW_SECONDS = 60; // per minute

async function checkRateLimit(supabaseAdmin: any, clientIp: string, functionName: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { count } = await supabaseAdmin
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("client_ip", clientIp)
    .eq("function_name", functionName)
    .gte("created_at", windowStart);

  if ((count || 0) >= RATE_LIMIT_MAX) {
    return false; // rate limited
  }

  await supabaseAdmin.from("rate_limits").insert({ client_ip: clientIp, function_name: functionName });
  return true;
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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const allowed = await checkRateLimit(supabaseAdmin, clientIp, "create-checkout");
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    const body = await req.json();
    const { items, formData, shippingCost, subtotal, total } = body;

    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // === SERVER-SIDE PRICE VALIDATION ===
    const productIds = items.map((item: any) => item.id);
    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id, price, name")
      .in("id", productIds);

    if (productsError || !dbProducts) {
      throw new Error("Failed to fetch product prices for validation");
    }

    const dbPriceMap: Record<string, number> = {};
    const dbNameMap: Record<string, string> = {};
    for (const p of dbProducts) {
      dbPriceMap[p.id] = Number(p.price);
      dbNameMap[p.id] = p.name;
    }

    let serverSubtotal = 0;
    for (const item of items) {
      if (dbPriceMap[item.id] === undefined) {
        throw new Error(`Product not found in database: ${item.id}`);
      }
      serverSubtotal += dbPriceMap[item.id] * item.quantity;
    }

    let serverShippingCost = 0;
    if (formData.deliveryType === "delivery" && formData.shippingPostalCode) {
      const { data: zone } = await supabaseAdmin
        .from("delivery_zones")
        .select("delivery_cost")
        .eq("postal_code", formData.shippingPostalCode)
        .eq("is_active", true)
        .maybeSingle();

      if (zone) {
        serverShippingCost = Number(zone.delivery_cost);
      } else {
        throw new Error(`Postal code not in delivery zone: ${formData.shippingPostalCode}`);
      }
    }

    const serverTotal = serverSubtotal + serverShippingCost;

    if (
      Math.abs(serverSubtotal - subtotal) > 0.01 ||
      Math.abs(serverShippingCost - shippingCost) > 0.01 ||
      Math.abs(serverTotal - total) > 0.01
    ) {
      console.warn("Price mismatch detected!", {
        client: { subtotal, shippingCost, total },
        server: { subtotal: serverSubtotal, shippingCost: serverShippingCost, total: serverTotal },
      });
    }

    const line_items = items.map((item: any) => {
      const priceId = PRICE_MAP[item.id];
      if (!priceId) {
        throw new Error(`Unknown product: ${item.id}`);
      }
      return { price: priceId, quantity: item.quantity };
    });

    if (serverShippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Gastos de envío" },
          unit_amount: Math.round(serverShippingCost * 100),
        },
        quantity: 1,
      });
    }

    const metadata: Record<string, string> = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      billing_address: formData.billingAddress || "",
      billing_city: formData.billingCity || "",
      billing_postal_code: formData.billingPostalCode || "",
      delivery_type: formData.deliveryType,
      time_slot: formData.timeSlot || "",
      delivery_date: formData.deliveryDate || "",
      card_message: formData.cardMessage || "",
      shipping_cost: String(serverShippingCost),
      subtotal: String(serverSubtotal),
      total: String(serverTotal),
    };

    if (formData.deliveryType === "delivery") {
      metadata.shipping_name = formData.shippingName || "";
      metadata.shipping_phone = formData.shippingPhone || "";
      metadata.shipping_address = formData.shippingAddress || "";
      metadata.shipping_city = formData.shippingCity || "";
      metadata.shipping_postal_code = formData.shippingPostalCode || "";
    }

    metadata.items_json = JSON.stringify(
      items.map((item: any) => ({
        id: item.id,
        name: dbNameMap[item.id] || item.name,
        price: dbPriceMap[item.id],
        quantity: item.quantity,
        image: item.image || "",
      }))
    );

    const session = await stripe.checkout.sessions.create({
      customer_email: formData.email,
      line_items,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata,
      locale: "es",
      // Métodos de pago automáticos (tarjeta, Apple Pay, Google Pay, etc.)
      // Link desactivado para simplificar el flujo de invitado
      payment_method_options: {
        link: { enabled: false },
      },
      phone_number_collection: { enabled: false },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
