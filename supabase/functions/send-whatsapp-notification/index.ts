import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-signature",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface WhatsAppPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress?: string;
  billingCity?: string;
  billingPostalCode?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryType: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  cardMessage?: string;
}

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const sigBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  return await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
}

function buildMessage(data: WhatsAppPayload): string {
  const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
  const itemsText = data.items
    .map((i) => `• ${i.name} × ${i.quantity} — ${eur(i.totalPrice)}`)
    .join("\n");

  const isDelivery = data.deliveryType === "delivery";
  const deliveryBlock = isDelivery
    ? `📦 *Entrega a domicilio:*\n${data.shippingName || data.customerName}\n📞 ${data.shippingPhone || data.customerPhone}\n${data.shippingAddress || "—"}\n${data.shippingCity || "—"} (${data.shippingPostalCode || "—"})\n📅 ${formatDate(data.deliveryDate)}\n⏰ ${data.deliveryTimeSlot || "—"}`
    : `🏪 *Recogida en tienda:*\n📅 ${formatDate(data.deliveryDate)}\n⏰ ${data.deliveryTimeSlot || "—"}`;

  const cardMsg = data.cardMessage
    ? `\n\n💐 *Mensaje en tarjeta:*\n"${data.cardMessage}"`
    : "";

  return `🛒 *Nuevo pedido — Floristería Lara*

*Pedido #${data.orderId.slice(0, 8).toUpperCase()}*

🌿 *Producto:*
${itemsText}

💰 *Totales:*
Subtotal: ${eur(data.subtotal)}
Envío: ${eur(data.shippingCost)}
*Total: ${eur(data.total)}*

👤 *Cliente (facturación):*
${data.customerName}
✉️ ${data.customerEmail}
📞 ${data.customerPhone}
${data.billingAddress ? `${data.billingAddress}\n` : ""}${data.billingCity ? `${data.billingCity} (${data.billingPostalCode || "—"})` : ""}

${deliveryBlock}${cardMsg}

_Pago confirmado vía Stripe_`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify HMAC signature (called only from verify-payment edge function)
    const bodyText = await req.text();
    const signature = req.headers.get("x-internal-signature") || "";
    const hmacSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!signature || !(await verifySignature(bodyText, signature, hmacSecret))) {
      console.error("Invalid signature");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    const data: WhatsAppPayload = JSON.parse(bodyText);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");
    const TO = Deno.env.get("TWILIO_WHATSAPP_TO");

    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !FROM || !TO) {
      console.error("Missing Twilio config", {
        hasLovable: !!LOVABLE_API_KEY, hasTwilio: !!TWILIO_API_KEY,
        hasFrom: !!FROM, hasTo: !!TO,
      });
      return new Response(JSON.stringify({ error: "Twilio not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
      });
    }

    const message = buildMessage(data);
    console.log("Sending WhatsApp for order:", data.orderId);

    const response = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: FROM.startsWith("whatsapp:") ? TO : `whatsapp:${TO.replace(/^whatsapp:/, "")}`,
        From: FROM.startsWith("whatsapp:") ? FROM : `whatsapp:${FROM}`,
        Body: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", response.status, result);
      return new Response(JSON.stringify({ error: "Twilio send failed", details: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
      });
    }

    console.log("WhatsApp sent, SID:", result.sid);
    return new Response(JSON.stringify({ success: true, sid: result.sid }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    console.error("send-whatsapp-notification error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});
