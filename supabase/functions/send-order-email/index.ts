import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HMAC verification — only verify-payment can call this function
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const sigBytes = new Uint8Array(signature.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

interface OrderEmailPayload {
  to: string;
  customerName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryType: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  shippingAddress?: string;
  shippingCity?: string;
  cardMessage?: string;
}

function buildEmailHtml(data: OrderEmailPayload): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: Inter, Arial, sans-serif; font-size: 14px; color: #333;">
          ${escapeHtml(item.name)} × ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: Inter, Arial, sans-serif; font-size: 14px; color: #333; text-align: right;">
          ${item.totalPrice.toFixed(2)} €
        </td>
      </tr>`
    )
    .join("");

  const deliveryInfo =
    data.deliveryType === "pickup"
      ? `<p style="margin: 0; color: #555;">Recogida en tienda</p>`
      : `
        <p style="margin: 0 0 4px; color: #555;">${escapeHtml(data.shippingAddress || "")}</p>
        <p style="margin: 0 0 4px; color: #555;">${escapeHtml(data.shippingCity || "")}</p>
      `;

  const dateInfo = data.deliveryDate
    ? `<p style="margin: 0; color: #555;"><strong>Fecha:</strong> ${escapeHtml(data.deliveryDate)}${data.deliveryTimeSlot ? ` (${escapeHtml(data.deliveryTimeSlot)})` : ""}</p>`
    : "";

  const cardMessageSection = data.cardMessage
    ? `
      <div style="margin-top: 20px; padding: 16px; background: #fef9f0; border-left: 3px solid #d4a574; border-radius: 4px;">
        <p style="margin: 0 0 4px; font-weight: 600; color: #333; font-size: 13px;">💐 Mensaje en la tarjeta:</p>
        <p style="margin: 0; color: #555; font-style: italic;">"${escapeHtml(data.cardMessage)}"</p>
      </div>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f5f1eb; font-family: Inter, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
    <div style="text-align: center; padding: 32px 24px; background: linear-gradient(135deg, #4a6741, #5a7a50); border-radius: 12px 12px 0 0;">
      <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; color: #fff; font-weight: 600;">
        Floristería Lara
      </h1>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">¡Gracias por tu pedido!</p>
    </div>
    <div style="background: #ffffff; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <p style="font-size: 16px; color: #333; margin: 0 0 4px;">Hola <strong>${escapeHtml(data.customerName)}</strong>,</p>
      <p style="font-size: 14px; color: #555; margin: 0 0 24px;">Tu pedido ha sido confirmado y estamos preparándolo con mucho cariño.</p>
      <div style="background: #f5f1eb; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #777;">Referencia del pedido</p>
        <p style="margin: 4px 0 0; font-size: 18px; font-family: monospace; font-weight: 700; color: #333; letter-spacing: 1px;">${data.orderId.slice(0, 8).toUpperCase()}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead><tr>
          <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #4a6741; font-size: 12px; color: #777; text-transform: uppercase;">Producto</th>
          <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #4a6741; font-size: 12px; color: #777; text-transform: uppercase;">Precio</th>
        </tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <div style="border-top: 2px solid #eee; padding-top: 12px;">
        <table style="width: 100%;">
          <tr><td style="padding: 4px 0; font-size: 14px; color: #555;">Subtotal</td><td style="padding: 4px 0; font-size: 14px; color: #555; text-align: right;">${data.subtotal.toFixed(2)} €</td></tr>
          <tr><td style="padding: 4px 0; font-size: 14px; color: #555;">Envío</td><td style="padding: 4px 0; font-size: 14px; color: #555; text-align: right;">${data.shippingCost.toFixed(2)} €</td></tr>
          <tr><td style="padding: 8px 0 0; font-size: 18px; font-weight: 700; color: #333;">Total</td><td style="padding: 8px 0 0; font-size: 18px; font-weight: 700; color: #333; text-align: right;">${data.total.toFixed(2)} €</td></tr>
        </table>
      </div>
      ${cardMessageSection}
      <div style="margin-top: 24px; padding: 16px; background: #f8f8f8; border-radius: 8px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; color: #333; font-weight: 600;">📦 Entrega</h3>
        ${deliveryInfo}
        ${dateInfo}
      </div>
      <div style="margin-top: 32px; text-align: center;">
        <p style="font-size: 13px; color: #777; margin: 0 0 12px;">¿Tienes alguna duda sobre tu pedido?</p>
        <a href="https://wa.me/34629455043" target="_blank" style="display: inline-block; background: #25D366; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Escríbenos por WhatsApp</a>
      </div>
    </div>
    <div style="text-align: center; padding: 24px 16px;">
      <p style="margin: 0; font-size: 12px; color: #999;">Floristería Lara, S.L. (B-38081113)<br/>C/ San Antonio, 30 — 38202 La Laguna, Tenerife</p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify HMAC signature — only internal calls from verify-payment are accepted
    const signature = req.headers.get("x-internal-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    const bodyText = await req.text();
    const hmacSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const valid = await verifySignature(bodyText, signature, hmacSecret);

    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: OrderEmailPayload = JSON.parse(bodyText);

    if (!payload.to || !payload.orderId) {
      throw new Error("Missing required fields: to, orderId");
    }

    const html = buildEmailHtml(payload);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Floristería Lara <pedidos@floristerialara.lovable.app>",
        to: [payload.to],
        subject: `🌸 Confirmación de pedido #${payload.orderId.slice(0, 8).toUpperCase()} — Floristería Lara`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      throw new Error(`Resend error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, email_id: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Send order email error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
