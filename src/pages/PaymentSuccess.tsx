import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });

        if (error) throw error;

        if (data?.success) {
          setStatus("success");
          setOrderId(data.order_id);
          clearCart();
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("error");
      }
    };

    verifyPayment();
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
              Por favor, espera un momento.
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
              Tu pedido ha sido registrado correctamente. Te contactaremos pronto para confirmar los detalles de entrega.
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
