import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, AlertTriangle } from "lucide-react";
import CartSheet from "@/components/cart/CartSheet";

const TestPago = () => {
  const { addItem, openCart, items } = useCart();
  const navigate = useNavigate();

  // Block indexing
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleAddTest = () => {
    addItem({
      id: "test-lara",
      name: "Test Lara",
      price: 1.0,
      image: "/placeholder.svg",
      description: "Producto de prueba interno",
    });
    openCart();
  };

  const goToCheckout = () => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("checkout");
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="font-serif text-2xl flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Página de prueba interna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta página NO es visible en el catálogo público. Permite comprar el
            producto <strong>Test Lara (1€)</strong> para probar el flujo de
            pago end-to-end con una tarjeta real.
          </p>
          <p className="text-sm text-muted-foreground">
            Después de la compra, podrás reembolsar el cobro desde el panel de
            Stripe (perderás solo la comisión Stripe ~0,29€).
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleAddTest} className="w-full" size="lg">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Añadir Test Lara (1€) al carrito
            </Button>

            {items.some((i) => i.id === "test-lara") && (
              <Button
                onClick={goToCheckout}
                variant="secondary"
                className="w-full"
              >
                Ir al checkout
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground pt-2 border-t">
            Recuerda: usa tu propia tarjeta real. Las tarjetas de prueba (4242
            …) no funcionan en modo live de Stripe.
          </p>
        </CardContent>
      </Card>
      <CartSheet />
    </div>
  );
};

export default TestPago;
