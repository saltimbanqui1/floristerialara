import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowLeft, Trash2, Plus, Minus, Store, Truck } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const checkoutSchema = z.object({
  // Billing info
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  firstName: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  lastName: z.string().min(1, "Los apellidos son obligatorios").max(50, "Máximo 50 caracteres"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos").max(15, "Máximo 15 dígitos"),
  country: z.string().min(1, "El país es obligatorio"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  province: z.string().min(1, "La provincia es obligatoria"),
  address: z.string().min(1, "La dirección es obligatoria"),
  postalCode: z.string().min(4, "El código postal es obligatorio"),
  
  // Shipping info
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  
  // Delivery options
  deliveryDate: z.date({ required_error: "Selecciona una fecha de entrega" }),
  cardMessage: z.string().max(200, "Máximo 200 caracteres").optional(),
  deliveryOption: z.enum(["delivery-morning", "delivery-afternoon", "pickup"], {
    required_error: "Selecciona una opción de entrega",
  }),
}).refine((data) => {
  // If not using same billing data for shipping and delivery option is not pickup
  if (data.deliveryOption !== "pickup") {
    return true; // Will validate shipping fields separately
  }
  return true;
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Mock cart data (would come from context/state in real app)
const mockCartItems = [
  {
    id: "1",
    name: "Ramo Presencia",
    description: "Ramo premium con rosas rojas y eucalipto",
    image: "/src/assets/products/presencia.jpg",
    price: 48.00,
    quantity: 1,
  },
];

const DELIVERY_COST = 7.00;

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      country: "España",
      city: "",
      province: "",
      address: "",
      postalCode: "",
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      shippingCity: "",
      shippingPostalCode: "",
      cardMessage: "",
      deliveryOption: "delivery-morning",
    },
  });

  const deliveryOption = form.watch("deliveryOption");
  const isPickup = deliveryOption === "pickup";

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = isPickup ? 0 : DELIVERY_COST;
  const total = subtotal + deliveryCost;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const onSubmit = (data: CheckoutFormData) => {
    // Validate shipping address if not pickup and not using same address
    if (!isPickup && !useSameAddress) {
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
      title: "¡Pedido procesado!",
      description: "Te contactaremos pronto para confirmar tu pedido.",
    });
    
    // Here you would redirect to payment or confirmation
    console.log("Form data:", data);
  };

  // Sync shipping fields when using same address
  useEffect(() => {
    if (useSameAddress) {
      const { firstName, lastName, phone, address, city, postalCode } = form.getValues();
      form.setValue("shippingName", `${firstName} ${lastName}`);
      form.setValue("shippingPhone", phone);
      form.setValue("shippingAddress", address);
      form.setValue("shippingCity", city);
      form.setValue("shippingPostalCode", postalCode);
    }
  }, [useSameAddress, form]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-narrow py-4 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Seguir Comprando
            </Button>
            <h1 className="text-xl md:text-2xl font-serif font-medium">Checkout</h1>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="container-narrow py-8 px-4 md:px-8">
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
                  <CardTitle className="text-xl font-serif">Resumen del Carrito</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {cartItems.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Tu carrito está vacío
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {/* Table Header - Desktop */}
                      <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/30 text-sm font-medium text-muted-foreground">
                        <div className="col-span-6">Producto</div>
                        <div className="col-span-2 text-center">Cantidad</div>
                        <div className="col-span-2 text-right">Precio</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Product Info */}
                            <div className="col-span-1 md:col-span-6 flex gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-medium text-foreground">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-destructive text-sm mt-2 flex items-center gap-1 hover:underline"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            
                            {/* Quantity */}
                            <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Unit Price */}
                            <div className="hidden md:block md:col-span-2 text-right text-muted-foreground">
                              {item.price.toFixed(2)} €
                            </div>
                            
                            {/* Total */}
                            <div className="col-span-1 md:col-span-2 text-right font-medium">
                              {(item.price * item.quantity).toFixed(2)} €
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Two Column Layout for Forms */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Billing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-6"
              >
                <Card className="card-organic">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Tus Datos</CardTitle>
                    <p className="text-sm text-muted-foreground">Información de facturación</p>
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <Separator className="my-4" />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País *</FormLabel>
                          <FormControl>
                            <Input placeholder="España" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
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
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia *</FormLabel>
                            <FormControl>
                              <Input placeholder="Santa Cruz de Tenerife" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
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

                    <FormField
                      control={form.control}
                      name="postalCode"
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
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Shipping & Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Shipping Address */}
                {!isPickup && (
                  <Card className="card-organic">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">¿A quién se lo enviamos?</CardTitle>
                      <p className="text-sm text-muted-foreground">Datos del destinatario</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Same Address Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                        <div>
                          <Label htmlFor="same-address" className="font-medium cursor-pointer">
                            Es para mí
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Usar mis mismos datos de facturación
                          </p>
                        </div>
                        <Switch
                          id="same-address"
                          checked={useSameAddress}
                          onCheckedChange={setUseSameAddress}
                        />
                      </div>

                      {!useSameAddress && (
                        <>
                          <FormField
                            control={form.control}
                            name="shippingName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre completo del destinatario *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nombre y apellidos" {...field} />
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
                                <FormLabel>Teléfono de contacto *</FormLabel>
                                <FormControl>
                                  <Input placeholder="612 345 678" type="tel" {...field} />
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
                                <FormLabel>Dirección de entrega *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Calle, número, piso..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="shippingCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ciudad</FormLabel>
                                  <FormControl>
                                    <Input placeholder="La Laguna" {...field} />
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
                                    <Input placeholder="38200" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Delivery Options */}
                <Card className="card-organic">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Opciones de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deliveryOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className={cn(
                                "flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                                field.value === "delivery-morning" 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              )}>
                                <RadioGroupItem value="delivery-morning" id="delivery-morning" />
                                <Label htmlFor="delivery-morning" className="flex-1 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span className="font-medium">Entrega a domicilio (10:00 - 15:00h)</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">Recíbelo por la mañana</p>
                                </Label>
                                <span className="font-medium text-primary">+7,00 €</span>
                              </div>

                              <div className={cn(
                                "flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer",
                                field.value === "delivery-afternoon" 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              )}>
                                <RadioGroupItem value="delivery-afternoon" id="delivery-afternoon" />
                                <Label htmlFor="delivery-afternoon" className="flex-1 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span className="font-medium">Entrega a domicilio (16:00 - 19:00h)</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">Recíbelo por la tarde</p>
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
                                  <p className="text-sm text-muted-foreground mt-1">C/ San Agustín, 42 - La Laguna</p>
                                </Label>
                                <span className="font-medium text-primary">Gratis</span>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    {/* Delivery Date */}
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de entrega *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
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
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
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
                          <FormLabel>Mensaje para la tarjeta (opcional)</FormLabel>
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

                {/* Order Summary */}
                <Card className="card-organic bg-foreground text-background">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif text-background">Total del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-background/80">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-background/80">
                      <span>Envío</span>
                      <span>{deliveryCost === 0 ? "Gratis" : `${deliveryCost.toFixed(2)} €`}</span>
                    </div>
                    <Separator className="bg-background/20" />
                    <div className="flex justify-between text-xl font-serif font-medium">
                      <span>Total (IVA incluido)</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 bg-background text-foreground hover:bg-muted text-lg py-6 font-medium"
                      disabled={cartItems.length === 0}
                    >
                      Hacer Pedido
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default Checkout;
