import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, ShieldCheck, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { BillingData, ShippingData } from "@/types/cart";
import BillingForm from "@/components/checkout/BillingForm";
import ShippingForm from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import LoginForm from "@/components/checkout/LoginForm";
import {
  PrivacyPolicyModal,
  TermsModal,
  DataTreatmentModal,
} from "@/components/legal/LegalModals";
import { toast } from "sonner";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

type CheckoutMode = "choose" | "login" | "guest";

const emptyBilling: BillingData = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  country: "España",
  city: "",
  province: "",
  address: "",
  postalCode: "",
};

const emptyShipping: ShippingData = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  province: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const [mode, setMode] = useState<CheckoutMode>("choose");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Form states
  const [billing, setBilling] = useState<BillingData>(emptyBilling);
  const [shipping, setShipping] = useState<ShippingData>(emptyShipping);
  const [useDifferentShipping, setUseDifferentShipping] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Legal modals
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDataTreatment, setShowDataTreatment] = useState(false);

  // Errors
  const [billingErrors, setBillingErrors] = useState<
    Partial<Record<keyof BillingData, string>>
  >({});
  const [shippingErrors, setShippingErrors] = useState<
    Partial<Record<keyof ShippingData, string>>
  >({});

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setMode("guest"); // Show billing form for logged-in users
          // Pre-fill email
          setBilling((prev) => ({
            ...prev,
            email: session.user.email || "",
          }));
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setMode("guest");
        setBilling((prev) => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  const validateBilling = (): boolean => {
    const errors: Partial<Record<keyof BillingData, string>> = {};

    if (!billing.email.trim()) errors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email))
      errors.email = "Email no válido";

    if (!billing.firstName.trim()) errors.firstName = "El nombre es obligatorio";
    if (!billing.lastName.trim())
      errors.lastName = "Los apellidos son obligatorios";
    if (!billing.phone.trim()) errors.phone = "El teléfono es obligatorio";
    if (!billing.country) errors.country = "Selecciona un país";
    if (!billing.address.trim()) errors.address = "La dirección es obligatoria";
    if (!billing.city.trim()) errors.city = "La ciudad es obligatoria";
    if (!billing.postalCode.trim())
      errors.postalCode = "El código postal es obligatorio";
    if (billing.country === "España" && !billing.province)
      errors.province = "Selecciona una provincia";

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateShipping = (): boolean => {
    if (!useDifferentShipping) return true;

    const errors: Partial<Record<keyof ShippingData, string>> = {};

    if (!shipping.firstName.trim())
      errors.firstName = "El nombre es obligatorio";
    if (!shipping.lastName.trim())
      errors.lastName = "Los apellidos son obligatorios";
    if (!shipping.phone.trim()) errors.phone = "El teléfono es obligatorio";
    if (!shipping.address.trim())
      errors.address = "La dirección es obligatoria";
    if (!shipping.city.trim()) errors.city = "La ciudad es obligatoria";
    if (!shipping.postalCode.trim())
      errors.postalCode = "El código postal es obligatorio";
    if (!shipping.province) errors.province = "Selecciona una provincia";

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = async () => {
    // Validate all forms
    const billingValid = validateBilling();
    const shippingValid = validateShipping();

    if (!billingValid || !shippingValid) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    if (createAccount && !user) {
      if (!password || password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      // Create account
      const { error } = await supabase.auth.signUp({
        email: billing.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error("Error al crear la cuenta: " + error.message);
        return;
      }

      toast.success("Cuenta creada. Revisa tu email para confirmarla.");
    }

    // Open external payment URLs
    if (items.length === 1 && items[0].externalBuyUrl) {
      window.open(items[0].externalBuyUrl, "_blank");
    } else {
      // For multiple items, open the first one or a general page
      const firstUrl = items.find((item) => item.externalBuyUrl)?.externalBuyUrl;
      if (firstUrl) {
        window.open(firstUrl, "_blank");
      } else {
        window.open("https://www.floristerialaraonline.com", "_blank");
      }
    }

    toast.success("Redirigiendo al pago seguro...");
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-cream border-b">
        <div className="container-narrow px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-charcoal hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-serif text-xl">Floristería Lara</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-leaf">
              <ShieldCheck className="w-4 h-4" />
              <span>Compra segura</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container-narrow px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-charcoal mb-8">
            Finalizar Compra
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Choose mode */}
              {mode === "choose" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode("login")}
                    className="p-6 bg-cream rounded-lg border-2 border-transparent hover:border-primary transition-colors text-left group"
                  >
                    <User className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-serif text-lg font-medium text-charcoal mb-2">
                      Ya soy cliente
                    </h3>
                    <p className="text-sm text-charcoal-light">
                      Inicia sesión para recuperar tus datos guardados
                    </p>
                  </button>

                  <button
                    onClick={() => setMode("guest")}
                    className="p-6 bg-cream rounded-lg border-2 border-transparent hover:border-primary transition-colors text-left group"
                  >
                    <UserPlus className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-serif text-lg font-medium text-charcoal mb-2">
                      Comprar como invitado
                    </h3>
                    <p className="text-sm text-charcoal-light">
                      Continúa sin crear una cuenta
                    </p>
                  </button>
                </div>
              )}

              {/* Login form */}
              {mode === "login" && (
                <LoginForm
                  onSuccess={() => setMode("guest")}
                  onSwitchToGuest={() => setMode("guest")}
                />
              )}

              {/* Guest / Billing form */}
              {mode === "guest" && (
                <>
                  {user && (
                    <div className="bg-leaf/10 text-leaf p-4 rounded-lg flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Conectado como {user.email}</span>
                    </div>
                  )}

                  <BillingForm
                    data={billing}
                    onChange={setBilling}
                    errors={billingErrors}
                  />

                  {/* Create account option */}
                  {!user && (
                    <div className="flex items-start gap-3 p-4 bg-cream rounded-lg">
                      <Checkbox
                        id="createAccount"
                        checked={createAccount}
                        onCheckedChange={(checked) =>
                          setCreateAccount(checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="createAccount"
                          className="cursor-pointer font-medium"
                        >
                          Crear una cuenta de cliente
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Guarda tus datos para futuras compras
                        </p>
                        {createAccount && (
                          <div className="mt-3">
                            <Label htmlFor="password">Contraseña *</Label>
                            <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Mínimo 6 caracteres"
                              className="mt-1"
                              minLength={6}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Different shipping address */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="differentShipping"
                      checked={useDifferentShipping}
                      onCheckedChange={(checked) =>
                        setUseDifferentShipping(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="differentShipping"
                      className="cursor-pointer font-medium"
                    >
                      Usar una dirección distinta para el envío
                    </Label>
                  </div>

                  {useDifferentShipping && (
                    <ShippingForm
                      data={shipping}
                      onChange={setShipping}
                      errors={shippingErrors}
                    />
                  )}

                  {/* Terms acceptance */}
                  <div className="p-4 bg-cream rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) =>
                          setAcceptedTerms(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="acceptTerms"
                        className="cursor-pointer text-sm leading-relaxed"
                      >
                        Estoy de acuerdo con el{" "}
                        <button
                          type="button"
                          onClick={() => setShowDataTreatment(true)}
                          className="text-primary hover:underline"
                        >
                          Tratamiento de datos
                        </button>
                        , la{" "}
                        <button
                          type="button"
                          onClick={() => setShowPrivacy(true)}
                          className="text-primary hover:underline"
                        >
                          Política de Privacidad
                        </button>{" "}
                        y las{" "}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-primary hover:underline"
                        >
                          Condiciones de Compra
                        </button>
                        . *
                      </Label>
                    </div>
                  </div>

                  {/* Payment button */}
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full btn-botanical text-lg py-6 gap-2"
                    disabled={!acceptedTerms}
                  >
                    <Lock className="w-5 h-5" />
                    Proceder al pago seguro
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Serás redirigido a nuestra pasarela de pago seguro para
                    completar tu compra
                  </p>
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Legal Modals */}
      <PrivacyPolicyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <DataTreatmentModal
        open={showDataTreatment}
        onOpenChange={setShowDataTreatment}
      />
    </div>
  );
};

export default Checkout;
