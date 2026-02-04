import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Product images
import presenciaImg from "@/assets/products/presencia.jpg";
import cedroImg from "@/assets/products/cedro.jpg";
import olivoImg from "@/assets/products/olivo.jpg";
import amorImg from "@/assets/products/amor.jpg";
import suaveImg from "@/assets/products/suave.jpg";
import ebanoImg from "@/assets/products/ebano.jpg";
import piceaImg from "@/assets/products/picea.jpg";
import esplendorImg from "@/assets/products/esplendor.jpg";

const productImages: Record<string, string> = {
  presencia: presenciaImg,
  cedro: cedroImg,
  olivo: olivoImg,
  amor: amorImg,
  suave: suaveImg,
  ebano: ebanoImg,
  picea: piceaImg,
  esplendor: esplendorImg,
  "orquidea-premium": "/placeholder.svg",
  "rosas-rojas": "/placeholder.svg",
};

const CartSheet = () => {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const handleCheckout = () => {
    closeCart();
    setTimeout(() => {
      const checkoutSection = document.getElementById("checkout");
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <ShoppingBag className="w-5 h-5" />
            Tu Carrito ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Tu carrito está vacío</p>
              <p className="text-muted-foreground text-sm mt-1">
                Añade productos para empezar tu pedido
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  closeCart();
                  const productsSection = document.getElementById("productos");
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Ver productos
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 py-4 border-b border-border"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={productImages[item.id] || item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-foreground truncate">
                      {item.name}
                    </h4>
                    <p className="text-primary font-semibold mt-1">
                      {item.price.toFixed(2)} €
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Total:</span>
              <span className="font-serif font-semibold text-primary text-xl">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full btn-botanical text-base py-6"
              size="lg"
            >
              Finalizar pedido
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
