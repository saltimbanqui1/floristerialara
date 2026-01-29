import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  size: string;
  image?: string;
}

const products: Product[] = [
  { id: "presencia", name: "Presencia", price: 48.00, description: "Arreglo floral elegante", size: "Arreglo floral - 48,00 €" },
  { id: "cedro", name: "Cédro", price: 68.00, description: "Caja de plantas naturales", size: "Caja de plantas naturales - 68,00 €" },
  { id: "olivo", name: "Olivo", price: 41.00, description: "Composición natural", size: "Composición natural - 41,00 €" },
  { id: "amor", name: "Amor", price: 45.00, description: "Ramo romántico", size: "Ramo romántico - 45,00 €" },
  { id: "suave", name: "Suave", price: 90.00, description: "Arreglo premium", size: "Arreglo premium - 90,00 €" },
  { id: "ebano", name: "Ébano", price: 48.00, description: "Composición elegante", size: "Composición elegante - 48,00 €" },
  { id: "picea", name: "Picea", price: 33.15, originalPrice: 39.00, description: "Arreglo especial", size: "Arreglo especial - 33,15 €" },
  { id: "esplendor", name: "Esplendor", price: 115.00, description: "Arreglo de lujo", size: "Arreglo de lujo - 115,00 €" },
];

const ProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [deliveryOption, setDeliveryOption] = useState<string>("");
  const [pickupOption, setPickupOption] = useState<string>("");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    deliveryAddress: "",
    giftMessage: "",
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
    setDeliveryOption("");
    setPickupOption("");
    setFormData({
      recipientName: "",
      recipientPhone: "",
      deliveryAddress: "",
      giftMessage: "",
    });
    setDeliveryDate(undefined);
  };

  const handlePurchase = () => {
    if (!selectedProduct || !deliveryDate || !formData.recipientName || !formData.recipientPhone) {
      return;
    }

    const deliveryType = deliveryOption 
      ? `Entrega a domicilio (${deliveryOption})` 
      : pickupOption 
        ? `Recogida en tienda (${pickupOption})` 
        : "No especificado";

    const deliveryCost = deliveryOption ? 7.00 : 0;
    const totalPrice = selectedProduct.price + deliveryCost;

    const message = encodeURIComponent(
      `¡Hola! Quiero comprar:\n\n` +
      `📦 Producto: ${selectedProduct.name}\n` +
      `💰 Precio: ${selectedProduct.price.toFixed(2)} €\n` +
      `📏 Tamaño: ${selectedProduct.size}\n\n` +
      `📅 Fecha de entrega: ${format(deliveryDate, "PPP", { locale: es })}\n` +
      `👤 Destinatario: ${formData.recipientName}\n` +
      `📞 Teléfono: ${formData.recipientPhone}\n` +
      `📍 Dirección: ${formData.deliveryAddress || "Recogida en tienda"}\n` +
      `🚚 Tipo de entrega: ${deliveryType}\n` +
      (formData.giftMessage ? `💌 Mensaje: ${formData.giftMessage}\n` : "") +
      `\n💵 Total: ${totalPrice.toFixed(2)} €`
    );

    window.open(`https://wa.me/34922251318?text=${message}`, "_blank");
    setIsDialogOpen(false);
  };

  return (
    <section id="productos" className="section-padding bg-cream">
      <div className="container-narrow px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mb-2">
            Nuestros Productos
          </h2>
          <p className="text-charcoal-light max-w-xl mx-auto text-sm">
            Selecciona el arreglo que más te guste y realiza tu pedido
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card
                className="card-organic cursor-pointer hover:shadow-medium transition-all duration-300 group overflow-hidden"
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                    Foto próximamente
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-petal text-charcoal text-xs font-medium px-2 py-1 rounded">
                      Oferta
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-serif font-medium text-charcoal text-sm mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold text-sm">
                      {product.price.toFixed(2)} €
                    </span>
                    {product.originalPrice && (
                      <span className="text-charcoal-light line-through text-xs">
                        {product.originalPrice.toFixed(2)} €
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-charcoal">
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xl font-semibold text-primary">
                  {selectedProduct.price.toFixed(2)} €
                </span>
                <span className="text-sm text-leaf">
                  Disponible - (Imp. Incluidos)
                </span>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">Tamaño</Label>
                <div className="p-3 bg-cream rounded-lg text-sm text-charcoal">
                  {selectedProduct.size}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">
                  Fecha de entrega para tu pedido *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">
                  Nombre y apellidos destinatario/a *
                </Label>
                <Input
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">
                  Teléfono contacto destinataria/o *
                </Label>
                <Input
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  className="bg-background"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">
                  Dirección para la entrega de tu pedido
                </Label>
                <Input
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-charcoal">
                  Escribe aquí el texto para acompañar al ramo
                </Label>
                <Textarea
                  value={formData.giftMessage}
                  onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                  className="bg-background resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2 p-3 bg-cream rounded-lg">
                <Label className="text-sm font-medium text-charcoal">
                  Entrega a domicilio (+7,00 €)
                </Label>
                <p className="text-xs text-charcoal-light mb-2">
                  Si no marca ninguna opción de entrega se entiende que recoge en tienda
                </p>
                <RadioGroup value={deliveryOption} onValueChange={(value) => {
                  setDeliveryOption(value);
                  setPickupOption("");
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10-15" id="delivery-morning" />
                    <Label htmlFor="delivery-morning" className="text-sm cursor-pointer">
                      10 a 15 horas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16-19" id="delivery-afternoon" />
                    <Label htmlFor="delivery-afternoon" className="text-sm cursor-pointer">
                      16 a 19 horas
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 p-3 bg-cream rounded-lg">
                <Label className="text-sm font-medium text-charcoal">
                  Recogida en tienda C/ San Antonio 30, La Laguna
                </Label>
                <RadioGroup value={pickupOption} onValueChange={(value) => {
                  setPickupOption(value);
                  setDeliveryOption("");
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10-14" id="pickup-morning" />
                    <Label htmlFor="pickup-morning" className="text-sm cursor-pointer">
                      10 a 14 horas (0€)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="17-20" id="pickup-afternoon" />
                    <Label htmlFor="pickup-afternoon" className="text-sm cursor-pointer">
                      17 a 20 horas (0€)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="text-charcoal-light">Subtotal:</span>
                  <span className="font-medium">{selectedProduct.price.toFixed(2)} €</span>
                </div>
                {deliveryOption && (
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-charcoal-light">Envío a domicilio:</span>
                    <span className="font-medium">7,00 €</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-3 border-t border-border pt-3">
                  <span className="font-medium text-charcoal">Total:</span>
                  <span className="text-xl font-semibold text-primary">
                    {(selectedProduct.price + (deliveryOption ? 7 : 0)).toFixed(2)} €
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                className="w-full btn-botanical text-base py-5"
                disabled={!deliveryDate || !formData.recipientName || !formData.recipientPhone}
              >
                Lo quiero comprar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProductsSection;