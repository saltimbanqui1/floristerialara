import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    if (!session_id) throw new Error("Missing session_id");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ success: false, status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const meta = session.metadata || {};

    // Check if order already exists for this session
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();

    if (existingOrder) {
      return new Response(
        JSON.stringify({ success: true, order_id: existingOrder.id, already_exists: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // === SERVER-SIDE PRICE RE-VALIDATION ===
    // Parse items from metadata (these were already validated in create-checkout)
    let items: any[] = [];
    try {
      items = JSON.parse(meta.items_json || "[]");
    } catch {
      console.error("Failed to parse items_json");
    }

    // Re-validate prices against DB before inserting the order
    if (items.length > 0) {
      const productIds = items.map((item: any) => item.id);
      const { data: dbProducts } = await supabaseAdmin
        .from("products")
        .select("id, price")
        .in("id", productIds);

      if (dbProducts) {
        const dbPriceMap: Record<string, number> = {};
        for (const p of dbProducts) {
          dbPriceMap[p.id] = Number(p.price);
        }

        let verifiedSubtotal = 0;
        for (const item of items) {
          const dbPrice = dbPriceMap[item.id];
          if (dbPrice === undefined) {
            console.warn(`Product ${item.id} not found in DB during verification`);
            continue;
          }
          // Override item price with DB price
          item.price = dbPrice;
          verifiedSubtotal += dbPrice * item.quantity;
        }

        const metaSubtotal = parseFloat(meta.subtotal || "0");
        const metaShipping = parseFloat(meta.shipping_cost || "0");
        const metaTotal = parseFloat(meta.total || "0");

        if (Math.abs(verifiedSubtotal - metaSubtotal) > 0.01) {
          console.warn("Subtotal mismatch at verification!", {
            metaSubtotal,
            verifiedSubtotal,
          });
          // Use the verified values
          meta.subtotal = String(verifiedSubtotal);
          meta.total = String(verifiedSubtotal + metaShipping);
        }
      }
    }

    // Parse shipping name into first/last
    const shippingNameParts = (meta.shipping_name || "").split(" ");
    const shippingFirstName = shippingNameParts[0] || "";
    const shippingLastName = shippingNameParts.slice(1).join(" ") || "";

    // Create order with validated values
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

    // Create order items with DB-validated prices
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

      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items insert error:", itemsError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, order_id: order?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
