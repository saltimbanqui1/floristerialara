

El usuario quiere emails de confirmación de pedido profesionales. Ya tienen la edge function `send-order-email` que usa Resend con un dominio temporal (`pedidos@floristerialara.lovable.app`) que no funciona en producción para `info@floreslara.com`.

**Mi recomendación**: usar **Lovable Emails** (built-in, sin API keys, sin verificar dominios manualmente, con cola de reintentos y supresión automática). El dominio del cliente es `floreslara.es` y se puede delegar el subdominio `notify.floreslara.es` a Lovable.

**Plan a alto nivel**:

1. **Configurar dominio email** (`notify.floreslara.es`) — el usuario abre un diálogo, confirma, y Lovable provisiona DNS automáticamente.

2. **Montar infraestructura email** — crea tablas (cola, supresión, log), cron job de envío y RPCs necesarias.

3. **Crear plantilla transaccional `order-confirmation`** en React Email que reemplaza el HTML actual hardcodeado en `send-order-email`. Usará la paleta de la tienda (verde botánico, crema floral, Cormorant Garamond, Inter). Recibirá props: nombre cliente, orderId, items, subtotal, envío, total, tipo entrega, dirección, fecha, mensaje tarjeta.

4. **Adaptar `verify-payment`** para que en vez de invocar `send-order-email`, invoque `send-transactional-email` con la plantilla `order-confirmation` y el `idempotencyKey` derivado del orderId. Mantener notificación al dueño como segundo invoke con la misma plantilla pero a `info@floreslara.com`.

5. **Retirar la edge function antigua `send-order-email`** una vez la nueva esté operativa (la dejo como deprecated, no la borro de golpe).

6. **Comportamiento durante propagación DNS**: las plantillas y código quedan listos al instante; los envíos reales empiezan automáticamente cuando el DNS se verifica (puede tardar hasta 72h). El usuario ve el progreso en Cloud → Emails.

**Archivos afectados**:
- Nuevo: `supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx` + `registry.ts`
- Nuevo: `supabase/functions/send-transactional-email/index.ts` (lo crea el scaffold)
- Nuevo: `supabase/functions/handle-email-unsubscribe/index.ts` + `handle-email-suppression/index.ts` (scaffold)
- Nueva página: `/cancelar-suscripcion` (página unsubscribe en React)
- Modificado: `supabase/functions/verify-payment/index.ts` (cambiar el invoke)
- Config: actualización `supabase/config.toml` con las nuevas funciones

**Lo que NO cambia**:
- WhatsApp Twilio sigue igual (ya funciona)
- Lógica de pedidos, Stripe, carrito, RLS — sin tocar
- El email sigue enviándose al cliente Y al dueño (`info@floreslara.com`) — dos invocaciones separadas

**Primer paso (requiere aprobación tuya)**: configurar el dominio `notify.floreslara.es`. Tras aprobar el plan, te abriré el diálogo para que lo confirmes con un clic.

