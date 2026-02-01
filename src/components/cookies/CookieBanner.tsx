import { useCookies } from "@/contexts/CookieContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import CookieSettings from "./CookieSettings";

const CookieBanner = () => {
  const { showBanner, acceptAll, openSettings, showSettings } = useCookies();

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-charcoal shadow-lg border-t border-border"
          >
            <div className="container-narrow mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-primary-foreground">
                    Utilizamos cookies propias y de terceros para mejorar tu experiencia 
                    de navegación. Puedes aceptar todas las cookies o configurar tus 
                    preferencias.{" "}
                    <button
                      onClick={openSettings}
                      className="underline hover:text-primary transition-colors"
                    >
                      Más información
                    </button>
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button
                    variant="outline"
                    onClick={openSettings}
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-charcoal"
                  >
                    Configurar
                  </Button>
                  <Button
                    onClick={acceptAll}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Aceptar todo
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <CookieSettings open={showSettings} />
    </>
  );
};

export default CookieBanner;
