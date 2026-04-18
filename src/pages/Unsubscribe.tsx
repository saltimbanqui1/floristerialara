import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        const data = await res.json();
        if (data.valid === true) setState({ kind: "valid" });
        else if (data.valid === false && data.reason === "already_unsubscribed")
          setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    };
    validate();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } }
      );
      if (error) throw error;
      if (data?.success) setState({ kind: "success" });
      else if (data?.reason === "already_unsubscribed") setState({ kind: "already" });
      else setState({ kind: "error", message: "No se pudo procesar la solicitud." });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message || "Error inesperado." });
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="font-serif text-3xl text-primary mb-2">Floristería Lara</h1>
        <p className="text-sm text-muted-foreground mb-8">Gestionar suscripción de correo</p>

        {state.kind === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Validando enlace…</p>
          </div>
        )}

        {state.kind === "valid" && (
          <>
            <h2 className="font-serif text-2xl mb-3">¿Confirmar baja?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Si confirmas, dejarás de recibir correos de Floristería Lara en esta dirección.
            </p>
            <Button onClick={handleConfirm} className="w-full">
              Confirmar baja
            </Button>
          </>
        )}

        {state.kind === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Procesando…</p>
          </div>
        )}

        {state.kind === "success" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="font-serif text-2xl">Baja confirmada</h2>
            <p className="text-sm text-muted-foreground">
              Ya no recibirás más correos. Gracias por habernos acompañado.
            </p>
          </div>
        )}

        {state.kind === "already" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h2 className="font-serif text-2xl">Ya estás dado de baja</h2>
            <p className="text-sm text-muted-foreground">
              Esta dirección ya no recibe nuestros correos.
            </p>
          </div>
        )}

        {state.kind === "invalid" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="font-serif text-2xl">Enlace no válido</h2>
            <p className="text-sm text-muted-foreground">
              El enlace ha caducado o no es correcto. Si necesitas ayuda, contáctanos por WhatsApp al 629 455 043.
            </p>
          </div>
        )}

        {state.kind === "error" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="font-serif text-2xl">Algo ha fallado</h2>
            <p className="text-sm text-muted-foreground">{state.message}</p>
            <Button variant="outline" onClick={() => setState({ kind: "valid" })}>
              Reintentar
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
};

export default Unsubscribe;
