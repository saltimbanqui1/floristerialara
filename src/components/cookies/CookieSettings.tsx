import { useState, useEffect } from "react";
import { useCookies } from "@/contexts/CookieContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CookieSettingsProps {
  open: boolean;
}

const CookieSettings = ({ open }: CookieSettingsProps) => {
  const { preferences, closeSettings, savePreferences, rejectAll, acceptAll } = useCookies();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences, open]);

  const handleSave = () => {
    savePreferences(localPrefs);
  };

  return (
    <Dialog open={open} onOpenChange={closeSettings}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-charcoal">
            Configuración de Cookies
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Cookies necesarias</Label>
              <p className="text-xs text-muted-foreground">
                Esenciales para el funcionamiento del sitio
              </p>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Cookies analíticas</Label>
              <p className="text-xs text-muted-foreground">
                Nos ayudan a mejorar el sitio web
              </p>
            </div>
            <Switch
              checked={localPrefs.analytics}
              onCheckedChange={(checked) =>
                setLocalPrefs({ ...localPrefs, analytics: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Cookies de marketing</Label>
              <p className="text-xs text-muted-foreground">
                Para mostrarte ofertas personalizadas
              </p>
            </div>
            <Switch
              checked={localPrefs.marketing}
              onCheckedChange={(checked) =>
                setLocalPrefs({ ...localPrefs, marketing: checked })
              }
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={rejectAll} className="flex-1">
            Rechazar todo
          </Button>
          <Button variant="outline" onClick={handleSave} className="flex-1">
            Guardar preferencias
          </Button>
          <Button onClick={acceptAll} className="flex-1 btn-botanical">
            Aceptar todo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;
