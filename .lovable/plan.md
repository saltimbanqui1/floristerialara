

## Estado actual confirmado

**📧 Email destinatario tienda:** `manuplo2006@gmail.com`
- Hardcodeado en `supabase/functions/send-order-email/index.ts` línea 188
- Marcado como "TEMPORAL: cambiado para pruebas"
- ⚠️ Recordatorio: este email **no llega actualmente** (Resend rechaza el dominio sin verificar). Solo cambiarlo aquí no hace que empiece a funcionar.

**📱 WhatsApp destinatario tienda:** configurado vía secret `TWILIO_WHATSAPP_TO` en Lovable Cloud (no en código). El número exacto no lo veo desde aquí porque es un secret, pero confías en que es `655176536` — lo damos por bueno.

**📱 WhatsApp remitente (sandbox Twilio):** secret `TWILIO_WHATSAPP_FROM` (probablemente el sandbox `+14155238886`).

---

## Cambios a realizar

**1. Email tienda** → cambiar `manuplo2006@gmail.com` por el del dueño en `send-order-email/index.ts` línea 188.

**2. WhatsApp tienda** → actualizar el secret `TWILIO_WHATSAPP_TO` con el número del dueño (formato internacional: `+34XXXXXXXXX`). No requiere tocar código.

---

## Sobre el cambio de número y Twilio (tu duda principal)

**Estás usando el sandbox de Twilio WhatsApp** (es lo que viene por defecto con el connector). Eso implica:

- ⚠️ **El nuevo número del dueño DEBE darse de alta en el sandbox** antes de poder recibir mensajes. Si no, Twilio bloqueará los envíos silenciosamente.
- Para activarlo: el dueño tiene que enviar un WhatsApp con el código `join <palabra-clave>` al número sandbox de Twilio (`+1 415 523 8886`). La palabra clave la ves en tu Twilio Console → Messaging → Try it out → Send a WhatsApp message.
- Sin ese paso, **los pedidos seguirán cobrándose pero el aviso WhatsApp no llegará** y solo lo verás en los logs como error de Twilio.

**Alternativa profesional (recomendada a futuro):** salir del sandbox aprobando un número WhatsApp Business propio con plantillas registradas en Meta. Es más trabajo (1-2 semanas de aprobación) pero quita la limitación del "join" y permite enviar a cualquier cliente.

---

## Información que necesito de ti

Antes de tocar nada, dime:

1. **Email del dueño** para recibir copia de pedidos (ej: `dueño@floreslara.es`)
2. **Número WhatsApp del dueño** en formato internacional (ej: `+34629455043`)
3. **¿Confirmas que el dueño hará el "join sandbox"** desde su WhatsApp antes de probar? (si no, no llegarán los avisos)

---

## Pasos que ejecutaré (modo default)

1. Editar `send-order-email/index.ts` línea 188 con el email del dueño + quitar el comentario "TEMPORAL".
2. Pedirte que actualices el secret `TWILIO_WHATSAPP_TO` mediante el flujo de secrets de Lovable Cloud (lo lanzo yo con la herramienta de secretos).
3. Recordarte el paso del "join sandbox" por WhatsApp.
4. Sugerir hacer un pedido de prueba final en `/test-pago` con el nuevo número activo.

