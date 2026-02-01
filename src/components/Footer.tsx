import { useState } from "react";
import { Heart, Cookie } from "lucide-react";
import { useCookies } from "@/contexts/CookieContext";
import {
  PrivacyPolicyModal,
  TermsModal,
  DataTreatmentModal,
} from "@/components/legal/LegalModals";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openSettings } = useCookies();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDataTreatment, setShowDataTreatment] = useState(false);

  return (
    <>
      <footer className="bg-charcoal py-8">
        <div className="container-narrow px-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl text-primary-foreground">
                  Floristería Lara
                </span>
              </div>

              <p className="text-charcoal-light text-sm text-center">
                © {currentYear} Floristería Lara, S.L. (B-38081113). Todos los derechos reservados.
              </p>

              <p className="text-charcoal-light text-sm flex items-center gap-1">
                Hecho con <Heart className="w-4 h-4 text-petal fill-petal" /> en La
                Laguna
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-charcoal-light hover:text-primary-foreground transition-colors"
              >
                Política de Privacidad
              </button>
              <span className="text-charcoal-light">|</span>
              <button
                onClick={() => setShowTerms(true)}
                className="text-charcoal-light hover:text-primary-foreground transition-colors"
              >
                Condiciones de Compra
              </button>
              <span className="text-charcoal-light">|</span>
              <button
                onClick={() => setShowDataTreatment(true)}
                className="text-charcoal-light hover:text-primary-foreground transition-colors"
              >
                Tratamiento de Datos
              </button>
              <span className="text-charcoal-light">|</span>
              <button
                onClick={openSettings}
                className="text-charcoal-light hover:text-primary-foreground transition-colors flex items-center gap-1"
              >
                <Cookie className="w-4 h-4" />
                Configurar Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <DataTreatmentModal open={showDataTreatment} onOpenChange={setShowDataTreatment} />
    </>
  );
};

export default Footer;
