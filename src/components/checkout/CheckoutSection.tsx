import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Truck, Store, Copy, Check } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Import product images
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
};

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Validation schema
const checkoutSchema = z.object({
  // Billing info
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  firstName: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  lastName: z.string().min(1, "Los apellidos son obligatorios").max(50, "Máximo 50 caracteres"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos").max(15, "Máximo 15 dígitos"),
  billingAddress: z.string().min(1, "La dirección es obligatoria"),
  billingCity: z.string().min(1, "La ciudad es obligatoria"),
  billingPostalCode: z.string().min(4, "El código postal es obligatorio"),
  
  // Shipping info - always required unless pickup
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  
  // Delivery options
  deliveryDate: z.date({ required_error: "Selecciona una fecha de entrega" }),
  cardMessage: z.string().max(200, "Máximo 200 caracteres").optional(),
  deliveryType: z.enum(["delivery", "pickup"], {
    required_error: "Selecciona tipo de entrega",
  }),
  timeSlot: z.string().min(1, "Selecciona una franja horaria"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutSectionProps {
  selectedProduct: SelectedProduct | null;
  onClearProduct: () => void;
}

const DELIVERY_COST = 7.00;

const CheckoutSection = ({ selectedProduct, onClearProduct }: CheckoutSectionProps) => {
  const { toast } = useToast();
  const [copiedBilling, setCopiedBilling] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      billingAddress: "",
      billingCity: "",
      billingPostalCode: "",
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      cardMessage: "",
      deliveryType: "delivery",
      timeSlot: "",
    },
  });

  const deliveryType = form.watch("deliveryType");
  const isPickup = deliveryType === "pickup";

  // Calculate totals
  const subtotal = selectedProduct?.price || 0;
  const deliveryCost = isPickup ? 0 : DELIVERY_COST;
  const total = subtotal + deliveryCost;

  // Copy billing to shipping
  const copyBillingToShipping = () => {
    const { firstName, lastName, phone, billingAddress, billingCity, billingPostalCode } = form.getValues();
    form.setValue("shippingName", `${firstName} ${lastName}`.trim());
    form.setValue("shippingPhone", phone);
    form.setValue("shippingAddress", billingAddress);
    form.setValue("shippingCity", billingCity);
    form.setValue("shippingPostalCode", billingPostalCode);
    setCopiedBilling(true);
    setTimeout(() => setCopiedBilling(false), 2000);
  };

  const onSubmit = (data: CheckoutFormData) => {
    // Validate shipping address if delivery (not pickup)
    if (!isPickup) {
      if (!data.shippingName || !data.shippingPhone || !data.shippingAddress) {
        toast({
          title: "Datos incompletos",
          description: "Por favor, completa los datos del destinatario.",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "¡Pedido enviado!",
      description: "Te contactaremos pronto para confirmar tu pedido.",
    });
    
    console.log("Order data:", { product: selectedProduct, formData: data, total });
  };

  if (!selectedProduct) {
    return null;
  }

  const productImage = productImages[selectedProduct.id] || "/placeholder.svg";

  return (
    <section id="checkout" className="section-padding bg-background">
      <div className="container-narrow px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-2">
            Finalizar Pedido
          </h2>
          <p className="text-muted-foreground">
            Completa tus datos para recibir tu pedido
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="card-organic overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg font-serif">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={productImage}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-medium text-foreground text-lg">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProduct.description}</p>
                      <p className="text-primary font-semibold mt-2">{subtotal.toFixed(2)} €</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onClearProduct}
                      className="text-destructive hover:text-destructive"
                    >
                      Cambiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Two Column Form Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Billing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="card-organic h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Tus Datos (Facturación)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos *</FormLabel>
                            <FormControl>
                              <Input placeholder="Apellidos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input placeholder="612 345 678" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección *</FormLabel>
                          <FormControl>
                            <Input placeholder="Calle, número, piso..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="billingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad *</FormLabel>
                            <FormControl>
                              <Input placeholder="La Laguna" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal *</FormLabel>
                            <FormControl>
                              <Input placeholder="38200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Shipping (Visible by Default) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className={cn(
                  "card-organic h-full",
                  isPickup && "opacity-50"
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-serif">Datos del Destinatario (Envío)</CardTitle>
                      {!isPickup && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyBillingToShipping}
                          className="gap-2 text-xs"
                        >
                          {copiedBilling ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Usar mis datos
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {isPickup && (
                      <p className="text-sm text-muted-foreground">
                        No es necesario para recogida en tienda
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="shippingName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo del destinatario {!isPickup && "*"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nombre y apellidos" 
                              disabled={isPickup}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono de contacto {!isPickup && "*"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="612 345 678" 
                              type="tel" 
                              disabled={isPickup}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección de entrega {!isPickup && "*"}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Calle, número, piso..." 
                              disabled={isPickup}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="La Laguna" 
                                disabled={isPickup}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="38200" 
                                disabled={isPickup}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="card-organic">
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Opciones de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Delivery Type */}
                  <FormField
                    control={form.control}
                    name="deliveryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Tipo de entrega *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("timeSlot", ""); // Reset time slot
                            }}
                            defaultValue={field.value}
                            className="grid md:grid-cols-2 gap-3"
                          >
                            <div className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                              field.value === "delivery" 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            )}>
                              <RadioGroupItem value="delivery" id="delivery" />
                              <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Entrega a domicilio</span>
                                </div>
                              </Label>
                              <span className="font-medium text-primary">+7,00 €</span>
                            </div>

                            <div className={cn(
                              "flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                              field.value === "pickup" 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            )}>
                              <RadioGroupItem value="pickup" id="pickup" />
                              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Store className="h-4 w-4 text-primary" />
                                  <span className="font-medium">Recogida en tienda</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">C/ San Antonio, 30 - La Laguna</p>
                              </Label>
                              <span className="font-medium text-primary">Gratis</span>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time Slot */}
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Franja horaria *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-3"
                          >
                            {isPickup ? (
                              <>
                                <div className={cn(
                                  "flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer",
                                  field.value === "pickup-morning" 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                )}>
                                  <RadioGroupItem value="pickup-morning" id="pickup-morning" />
                                  <Label htmlFor="pickup-morning" className="cursor-pointer font-medium">
                                    10:00 a 14:00h
                                  </Label>
                                </div>
                                <div className={cn(
                                  "flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer",
                                  field.value === "pickup-afternoon" 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                )}>
                                  <RadioGroupItem value="pickup-afternoon" id="pickup-afternoon" />
                                  <Label htmlFor="pickup-afternoon" className="cursor-pointer font-medium">
                                    17:00 a 20:00h
                                  </Label>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className={cn(
                                  "flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer",
                                  field.value === "delivery-morning" 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                )}>
                                  <RadioGroupItem value="delivery-morning" id="delivery-morning" />
                                  <Label htmlFor="delivery-morning" className="cursor-pointer font-medium">
                                    10:00 a 15:00h
                                  </Label>
                                </div>
                                <div className={cn(
                                  "flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer",
                                  field.value === "delivery-afternoon" 
                                    ? "border-primary bg-primary/5" 
                                    : "border-border hover:border-primary/50"
                                )}>
                                  <RadioGroupItem value="delivery-afternoon" id="delivery-afternoon" />
                                  <Label htmlFor="delivery-afternoon" className="cursor-pointer font-medium">
                                    16:00 a 19:00h
                                  </Label>
                                </div>
                              </>
                            )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Delivery Date */}
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-medium">Fecha de entrega *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full md:w-80 pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                              }}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                              locale={es}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Card Message */}
                  <FormField
                    control={form.control}
                    name="cardMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Mensaje para la tarjeta (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe tu dedicatoria aquí..."
                            className="resize-none"
                            rows={3}
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground text-right">
                          {field.value?.length || 0}/200 caracteres
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="card-organic bg-foreground text-background">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between md:gap-8 text-background/80">
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between md:gap-8 text-background/80">
                        <span>Envío</span>
                        <span>{deliveryCost === 0 ? "Gratis" : `${deliveryCost.toFixed(2)} €`}</span>
                      </div>
                      <Separator className="bg-background/20" />
                      <div className="flex justify-between md:gap-8 text-xl font-serif font-medium">
                        <span>Total (IVA incluido)</span>
                        <span>{total.toFixed(2)} €</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="bg-background text-foreground hover:bg-muted text-lg py-6 px-8 font-medium md:min-w-[200px]"
                    >
                      Hacer Pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default CheckoutSection;
