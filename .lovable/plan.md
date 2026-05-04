## Plan: arreglar notificaciones de pedidos (email + WhatsApp)

El dominio `notify.floreslara.es` está verificado, pero los emails están **desactivados** a nivel de proyecto (por eso aparece "Emails disabled for this project" en el log). Para WhatsApp no hay logs del último pedido, así que necesitamos diagnosticar qué pasa.

### 1. Reactivar emails de Lovable Cloud

- Activar el envío de emails del proyecto (interruptor interno).
- Confirmar que el dominio `notify.floreslara.es` sigue verificado (ya lo está).
- Reintentar manualmente reenviar el email de confirmación del último pedido (`2022ab8d-…`) para validar que funciona end-to-end.
- Verificar en la tabla de log que el siguiente intento aparece como `sent` y no como `dlq`.

### 2. Mejorar diagnóstico de `send-whatsapp-notification`

Añadir logs detallados para que en el próximo pedido sepamos exactamente qué pasa:

- Log al entrar (con `orderId`).
- Log de la verificación HMAC (ok / falla).
- Log de las variables Twilio detectadas (sin exponer valores: solo `from` enmascarado y longitud de `to`).
- Log del payload final enviado a Twilio (To/From enmascarados, longitud del Body).
- Log completo de la respuesta de Twilio (status + código de error + mensaje), incluso en caso de éxito.
- Log de cualquier excepción con stack trace.

También añadir un log explícito en `verify-payment` justo antes y después del `fetch` a `send-whatsapp-notification`, para confirmar que la invocación se dispara (hoy es fire-and-forget y no sabemos si llega).

### 3. Revisar / validar Twilio WhatsApp

Comprobaremos los 3 secretos:

- `TWILIO_API_KEY` (gestionado por el conector).
- `TWILIO_WHATSAPP_FROM` — debe ser un número aprobado por Twilio para WhatsApp en formato `+E.164`. Posibilidades:
  - **Sandbox de Twilio** (`+14155238886`): el destinatario tiene que haber enviado primero `join <palabra-clave>` desde su WhatsApp. Si no, los mensajes nunca llegan aunque la API responda 201.
  - **Número WhatsApp Business propio**: debe estar registrado y aprobado en Twilio Console.
- `TWILIO_WHATSAPP_TO` — debe estar en `+E.164` (ej. `+34629455043`).

Acciones:
- Tras desplegar los nuevos logs, hacer un pedido de prueba (1 €) y revisar los logs de ambas funciones.
- Si Twilio responde con error 63007/63016/21211 → te guiaré paso a paso para corregir el número o salir del sandbox.
- Si no hay logs en absoluto → el problema está en `verify-payment` antes de invocar WhatsApp.

### Detalles técnicos

- Archivos a editar:
  - `supabase/functions/send-whatsapp-notification/index.ts` — añadir logs.
  - `supabase/functions/verify-payment/index.ts` — log antes/después del fetch a WhatsApp.
- No se cambian secretos automáticamente; si hay que cambiar `TWILIO_WHATSAPP_FROM` te lo indicaré con el valor exacto a poner.
- Reactivar emails se hace con la herramienta `toggle_project_emails` (no requiere migración ni cambios de código).

### Resultado esperado

- El próximo pedido genera un email de confirmación entregado al cliente y a `info@floreslara.com`.
- Los logs de WhatsApp muestran exactamente por qué llega o no llega el mensaje, y podemos corregir Twilio en consecuencia.
