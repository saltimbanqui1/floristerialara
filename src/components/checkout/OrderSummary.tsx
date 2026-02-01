import { useCart } from "@/contexts/CartContext";

const OrderSummary = () => {
  const { items, totalPrice } = useCart();

  return (
    <div className="bg-cream rounded-lg p-6 sticky top-24">
      <h3 className="font-serif text-lg font-medium text-charcoal mb-4">
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-charcoal">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">
              {(item.price * item.quantity).toFixed(2)} €
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-light">Subtotal</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-light">Envío</span>
          <span className="text-leaf">A calcular</span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span className="text-charcoal">Total</span>
          <span className="text-primary">{totalPrice.toFixed(2)} €</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        * Los gastos de envío se calcularán en el siguiente paso
      </p>
    </div>
  );
};

export default OrderSummary;
