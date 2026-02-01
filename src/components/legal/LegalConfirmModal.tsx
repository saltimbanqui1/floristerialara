import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { PrivacyPolicyModal, TermsModal } from "./LegalModals";

interface LegalConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  externalUrl: string;
}

const LegalConfirmModal = ({
  open,
  onOpenChange,
  productName,
  externalUrl,
}: LegalConfirmModalProps) => {
  const [accepted, setAccepted] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleProceed = () => {
    if (accepted && externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
      onOpenChange(false);
      setAccepted(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setAccepted(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-charcoal flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Finalizar compra
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-charcoal mb-2">
                Vas a comprar: <strong className="text-primary">{productName}</strong>
              </p>
              <p className="text-sm text-charcoal-light">
                Serás redirigido a nuestra tienda online segura para completar tu compra.
              </p>
            </div>

            <div className="bg-cream p-4 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptLegal"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="acceptLegal"
                  className="cursor-pointer text-sm leading-relaxed text-charcoal"
                >
                  He leído y acepto la{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacy(true);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Política de Privacidad
                  </button>{" "}
                  y las{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTerms(true);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Condiciones de Compra
                  </button>{" "}
                  de Floristería Lara.
                </Label>
              </div>
            </div>

            <Button
              onClick={handleProceed}
              disabled={!accepted}
              className="w-full py-6 text-base font-semibold gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" />
              Proceder al pago seguro
              <ExternalLink className="w-4 h-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Se abrirá una nueva pestaña con nuestra tienda online segura
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <PrivacyPolicyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
    </>
  );
};

export default LegalConfirmModal;
