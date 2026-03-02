import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const MAX_RETRIES = 4;
const RETRY_DELAYS = [2000, 4000, 6000, 8000];

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const attemptRef = useRef(0);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async (attempt: number): Promise<void> => {
      if (hasSucceeded.current) return;

      try {
        console.log(`Verify payment attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error) {
          console.error("Verify payment error:", error);
          throw error;
        }

        if (data?.success) {
          hasSucceeded.current = true;
          setStatus("success");
          setOrderId(data.order_id);
          clearCart();
          return;
        }

        // Payment not yet confirmed by Stripe - retry
        throw new Error(data?.status || "not_paid");
      } catch (err) {
        console.error(`Attempt ${attempt + 1} failed:`, err);

        if (attempt < MAX_RETRIES && !hasSucceeded.current) {
          const delay = RETRY_DELAYS[attempt] || 8000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return verifyPayment(attempt + 1);
        }

        if (!hasSucceeded.current) {
          setStatus("error");
        }
      }
    };

    verifyPayment(0);
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
                attemptRef.current = 0;
                const sessionId = searchParams.get("session_id");
                if (sessionId) {
                  const retry = async (attempt: number): Promise<void> => {
                    try {
                      const { data, error } = await supabase.functions.invoke("verify-payment", {
                        body: { session_id: sessionId },
                      });
                      if (error) throw error;
                      if (data?.success) {
                        hasSucceeded.current = true;
                        setStatus("success");
                        setOrderId(data.order_id);
                        clearCart();
                        return;
                      }
                      throw new Error("not confirmed");
                    } catch {
                      if (attempt < 2) {
                        await new Promise(r => setTimeout(r, 3000));
                        return retry(attempt + 1);
                      }
                      setStatus("error");
                    }
                  };
                  retry(0);
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
