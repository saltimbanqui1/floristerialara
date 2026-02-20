import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <XCircle className="w-16 h-16 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Pago cancelado
        </h1>
        <p className="text-muted-foreground">
          Tu pedido no ha sido procesado. No se ha realizado ningún cobro. Puedes volver y completar tu compra cuando quieras.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Volver a la tienda
        </Button>
      </div>
    </div>
  );
};

export default PaymentCanceled;
