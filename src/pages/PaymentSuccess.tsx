import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const MAX_RETRIES = 8;
const RETRY_DELAY = 2000;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const verifyPayment = async (): Promise<void> => {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (cancelled || hasSucceeded.current) return;

        console.log(`Verify attempt ${attempt + 1}/${MAX_RETRIES}`);

        // Strategy 1: Call verify-payment edge function
        try {
          const { data, error } = await supabase.functions.invoke("verify-payment", {
            body: { session_id: sessionId },
          });

          if (!error && data?.success) {
            hasSucceeded.current = true;
            setStatus("success");
            setOrderId(data.order_id);
            clearCart();
            return;
          }
        } catch (err) {
          console.warn("verify-payment call failed:", err);
        }

        // Strategy 2: Poll orders table directly as fallback
        try {
          const { data: order } = await supabase
            .from("orders")
            .select("id, status")
            .eq("stripe_session_id", sessionId)
            .maybeSingle();

          if (order && order.status === "paid") {
            hasSucceeded.current = true;
            setStatus("success");
            setOrderId(order.id);
            clearCart();
            return;
          }
        } catch (err) {
          console.warn("DB poll failed:", err);
        }

        // Wait before next attempt
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }

      if (!hasSucceeded.current && !cancelled) {
        setStatus("error");
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-serif font-medium text-foreground">
              Verificando tu pago...
            </h1>
            <p className="text-muted-foreground">
              Por favor, espera un momento. Esto puede tardar unos segundos.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl font-serif font-medium text-foreground">
              ¡Pago completado!
            </h1>
            <p className="text-muted-foreground">
              Tu pedido ha sido registrado correctamente. Recibirás un correo electrónico con el resumen de tu pedido y tu recibo en los próximos minutos.
            </p>
            <p className="text-sm text-muted-foreground">
              Te contactaremos pronto para confirmar los detalles de entrega.
            </p>
            {orderId && (
              <p className="text-sm text-muted-foreground">
                Referencia del pedido: <span className="font-mono font-medium text-foreground">{orderId.slice(0, 8)}</span>
              </p>
            )}
            <Button
              onClick={() => navigate("/")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Volver a la tienda
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-serif font-medium text-foreground">
              Hubo un problema
            </h1>
            <p className="text-muted-foreground">
              No pudimos verificar tu pago. Si el cobro fue realizado, contacta con nosotros y lo resolveremos.
            </p>
            <Button
              onClick={() => {
                setStatus("loading");
                hasSucceeded.current = false;
                const sessionId = searchParams.get("session_id");
                if (sessionId) {
                  const retry = async () => {
                    for (let i = 0; i < 3; i++) {
                      try {
                        const { data, error } = await supabase.functions.invoke("verify-payment", {
                          body: { session_id: sessionId },
                        });
                        if (!error && data?.success) {
                          hasSucceeded.current = true;
                          setStatus("success");
                          setOrderId(data.order_id);
                          clearCart();
                          return;
                        }
                      } catch {}
                      try {
                        const { data: order } = await supabase
                          .from("orders")
                          .select("id, status")
                          .eq("stripe_session_id", sessionId)
                          .maybeSingle();
                        if (order?.status === "paid") {
                          hasSucceeded.current = true;
                          setStatus("success");
                          setOrderId(order.id);
                          clearCart();
                          return;
                        }
                      } catch {}
                      await new Promise(r => setTimeout(r, 2000));
                    }
                    setStatus("error");
                  };
                  retry();
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Reintentar verificación
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
            >
              Volver a la tienda
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
