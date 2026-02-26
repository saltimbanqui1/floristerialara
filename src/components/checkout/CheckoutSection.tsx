import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Truck, Store, Copy, Check, AlertCircle, MapPin, Minus, Plus, Trash2, Loader2, MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PrivacyPolicyModal, TermsModal } from "@/components/legal/LegalModals";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

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

// Delivery zone type from database
interface DeliveryZone {
  postal_code: string;
  municipality: string;
  zone_name: string;
  delivery_cost: number;
}

const getShippingInfo = (postalCode: string, isPickup: boolean, deliveryZones: DeliveryZone[]): { 
  cost: number; 
  zoneName: string; 
  isValid: boolean; 
  errorMessage?: string;
} => {
  if (isPickup) {
    return { cost: 0, zoneName: "Recogida", isValid: true };
  }

  if (!postalCode || postalCode.length < 5) {
    return { cost: 0, zoneName: "", isValid: true };
  }

  const zone = deliveryZones.find(z => z.postal_code === postalCode);
  if (zone) {
    const cost = Math.max(zone.delivery_cost, 7);
    return { cost, zoneName: zone.zone_name, isValid: true };
  }

  return { 
    cost: 0, 
    zoneName: "", 
    isValid: false, 
    errorMessage: "Fuera de rango, consultar por WhatsApp" 
  };
};

const checkoutSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  firstName: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  lastName: z.string().min(1, "Los apellidos son obligatorios").max(50, "Máximo 50 caracteres"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos").max(15, "Máximo 15 dígitos"),
  billingAddress: z.string().min(1, "La dirección es obligatoria"),
  billingCity: z.string().min(1, "La ciudad es obligatoria"),
  billingPostalCode: z.string().min(4, "El código postal es obligatorio"),
  
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  
  deliveryDate: z.date({ required_error: "Selecciona una fecha de entrega" }),
  cardMessage: z.string().max(200, "Máximo 200 caracteres").optional(),
  deliveryType: z.enum(["delivery", "pickup"], {
    required_error: "Selecciona tipo de entrega",
  }),
  timeSlot: z.string().min(1, "Selecciona una franja horaria"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutSection = () => {
  const { toast } = useToast();
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const [copiedBilling, setCopiedBilling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      const { data } = await supabase
        .from("delivery_zones")
        .select("postal_code, municipality, zone_name, delivery_cost")
        .eq("is_active", true);
      if (data) setDeliveryZones(data);
    };
    fetchZones();
  }, []);

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
  const shippingPostalCode = form.watch("shippingPostalCode") || "";
  const isPickup = deliveryType === "pickup";

  const shippingInfo = useMemo(() => {
    return getShippingInfo(shippingPostalCode, isPickup, deliveryZones);
  }, [shippingPostalCode, isPickup, deliveryZones]);

  const subtotal = totalPrice;
  const deliveryCost = shippingInfo.cost;
  const total = subtotal + deliveryCost;

  const canPlaceOrder = isPickup || (shippingInfo.isValid && shippingPostalCode.length >= 5);

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

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isPickup) {
      if (!data.shippingName || !data.shippingPhone || !data.shippingAddress) {
        toast({
          title: "Datos incompletos",
          description: "Por favor, completa los datos del destinatario.",
          variant: "destructive",
        });
        return;
      }

      if (!shippingInfo.isValid) {
        toast({
          title: "Código postal no válido",
          description: "No realizamos envíos a esta zona. Por favor, elige recogida en tienda.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      const { data: responseData, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "",
          })),
          formData: {
            ...data,
            deliveryDate: data.deliveryDate ? format(data.deliveryDate, "yyyy-MM-dd") : "",
          },
          shippingCost: deliveryCost,
          subtotal,
          total,
        },
      });

      if (error) throw error;

      // Handle both parsed object and string responses
      let checkoutUrl: string | undefined;
      if (typeof responseData === "string") {
        try {
          const parsed = JSON.parse(responseData);
          checkoutUrl = parsed.url;
        } catch {
          checkoutUrl = undefined;
        }
      } else {
        checkoutUrl = responseData?.url;
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("Response data:", responseData);
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Error al procesar el pago",
        description: "Hubo un problema al conectar con la pasarela de pago. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

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
                  <CardTitle className="text-lg font-serif">Tu Carrito ({items.length} {items.length === 1 ? 'producto' : 'productos'})</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start py-3 border-b border-border last:border-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={productImages[item.id] || item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-medium text-foreground">{item.name}</h3>
                        <p className="text-primary font-semibold mt-1">{item.price.toFixed(2)} €</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  ))}
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

              {/* Right Column - Shipping */}
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
                            <FormLabel>Código Postal {!isPickup && "*"}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="38200" 
                                disabled={isPickup}
                                maxLength={5}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Shipping Cost Feedback */}
                    {!isPickup && shippingPostalCode.length >= 5 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {shippingInfo.isValid ? (
                          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground">
                              Gastos de envío para esta zona: <strong className="text-primary">{shippingInfo.cost.toFixed(2)} €</strong>
                              <span className="text-muted-foreground ml-1">({shippingInfo.zoneName})</span>
                            </span>
                          </div>
                        ) : (
                          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <span className="font-semibold">{shippingInfo.errorMessage}</span>
                              <a
                                href={`https://wa.me/34629455043?text=${encodeURIComponent("Hola, me gustaría consultar sobre envío a mi código postal: " + shippingPostalCode)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 ml-2 font-semibold underline underline-offset-2 hover:opacity-80"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                Contactar por WhatsApp
                              </a>
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    )}

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
                              form.setValue("timeSlot", "");
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
                                <p className="text-xs text-muted-foreground mt-1">El coste varía según la zona</p>
                              </Label>
                              <span className="font-medium text-primary text-sm">desde 7,00 €</span>
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
              <Card className="card-organic overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg font-serif">Desglose del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                      <span className="font-medium">{subtotal.toFixed(2)} €</span>
                    </div>
                    
                    <div className="flex justify-between text-foreground">
                      <span className="flex items-center gap-2">
                        Gastos de envío
                        {!isPickup && shippingInfo.zoneName && (
                          <span className="text-xs text-muted-foreground">({shippingInfo.zoneName})</span>
                        )}
                      </span>
                      <span className="font-medium">
                        {isPickup ? (
                          <span className="text-primary">Gratis</span>
                        ) : shippingPostalCode.length >= 5 && shippingInfo.isValid ? (
                          `${deliveryCost.toFixed(2)} €`
                        ) : (
                          <span className="text-muted-foreground text-sm">Introduce CP de envío</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>IVA (incluido)</span>
                      <span>Incluido</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-xl font-serif font-medium text-foreground">
                    <span>Total</span>
                    <span className="text-primary">
                      {(isPickup || (shippingPostalCode.length >= 5 && shippingInfo.isValid)) 
                        ? `${total.toFixed(2)} €`
                        : `${subtotal.toFixed(2)} € + envío`
                      }
                    </span>
                  </div>

                  {!isPickup && !shippingInfo.isValid && shippingPostalCode.length >= 5 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="flex flex-wrap items-center gap-1">
                        <span className="font-semibold">Fuera de rango, consultar por WhatsApp</span>
                        <a
                          href={`https://wa.me/34629455043?text=${encodeURIComponent("Hola, me gustaría consultar sobre envío a mi código postal: " + shippingPostalCode)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 hover:opacity-80"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Contactar
                        </a>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Privacy Policy Checkbox */}
                  <div className="flex items-start gap-3 mt-4 p-3 rounded-lg border border-border bg-muted/30">
                    <Checkbox
                      id="accept-terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="accept-terms" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                      He leído y acepto la{" "}
                      <button type="button" onClick={() => setShowPrivacy(true)} className="text-primary underline underline-offset-2 hover:opacity-80">
                        Política de Privacidad
                      </button>{" "}
                      y las{" "}
                      <button type="button" onClick={() => setShowTerms(true)} className="text-primary underline underline-offset-2 hover:opacity-80">
                        Condiciones de Compra
                      </button>.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={!canPlaceOrder || isProcessing || !acceptedTerms}
                    className={cn(
                      "w-full text-lg py-6 font-medium mt-4",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      (!canPlaceOrder || isProcessing || !acceptedTerms) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Procesando pago...
                      </>
                    ) : (
                      "Pagar con Stripe"
                    )}
                  </Button>

                  {!canPlaceOrder && !isPickup && (
                    <p className="text-center text-sm text-destructive font-medium">
                      Código postal fuera de zona de reparto
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </Form>

        <PrivacyPolicyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
        <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      </div>
    </section>
  );
};

export default CheckoutSection;