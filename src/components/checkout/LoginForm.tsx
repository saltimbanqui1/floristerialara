import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToGuest: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToGuest }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/checkout`,
          },
        });

        if (error) throw error;
        toast.success("Cuenta creada. Por favor, verifica tu email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
        onSuccess();
      }
    } catch (error: any) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email o contraseña incorrectos");
      } else if (error.message.includes("User already registered")) {
        toast.error("Este email ya está registrado. Intenta iniciar sesión.");
      } else {
        toast.error(error.message || "Error al procesar la solicitud");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream rounded-lg p-6">
      <h3 className="font-serif text-lg font-medium text-charcoal mb-4">
        {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loginEmail">Correo electrónico</Label>
          <Input
            id="loginEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loginPassword">Contraseña</Label>
          <Input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full btn-botanical"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-primary hover:underline"
        >
          {isSignUp
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>

      <div className="mt-6 pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={onSwitchToGuest}
        >
          Continuar como invitado
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
