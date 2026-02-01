import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShippingData } from "@/types/cart";
import { spanishProvinces } from "@/data/spanishProvinces";

interface ShippingFormProps {
  data: ShippingData;
  onChange: (data: ShippingData) => void;
  errors?: Partial<Record<keyof ShippingData, string>>;
}

const ShippingForm = ({ data, onChange, errors }: ShippingFormProps) => {
  const updateField = <K extends keyof ShippingData>(
    field: K,
    value: ShippingData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-cream rounded-lg border border-border">
      <h3 className="font-serif text-lg font-medium text-charcoal mb-4">
        Dirección de Envío
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shippingFirstName">Nombre *</Label>
          <Input
            id="shippingFirstName"
            value={data.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Nombre del destinatario"
            className={errors?.firstName ? "border-destructive" : ""}
          />
          {errors?.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingLastName">Apellidos *</Label>
          <Input
            id="shippingLastName"
            value={data.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Apellidos del destinatario"
            className={errors?.lastName ? "border-destructive" : ""}
          />
          {errors?.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingPhone">Teléfono *</Label>
        <Input
          id="shippingPhone"
          type="tel"
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="+34 600 000 000"
          className={errors?.phone ? "border-destructive" : ""}
        />
        {errors?.phone && (
          <p className="text-xs text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingAddress">Dirección completa *</Label>
        <Input
          id="shippingAddress"
          value={data.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Calle, número, piso, puerta..."
          className={errors?.address ? "border-destructive" : ""}
        />
        {errors?.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="shippingCity">Ciudad *</Label>
          <Input
            id="shippingCity"
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Ciudad de entrega"
            className={errors?.city ? "border-destructive" : ""}
          />
          {errors?.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shippingPostalCode">Código Postal *</Label>
          <Input
            id="shippingPostalCode"
            value={data.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="38000"
            className={errors?.postalCode ? "border-destructive" : ""}
          />
          {errors?.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingProvince">Provincia *</Label>
        <Select
          value={data.province}
          onValueChange={(value) => updateField("province", value)}
        >
          <SelectTrigger className={errors?.province ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona una provincia" />
          </SelectTrigger>
          <SelectContent>
            {spanishProvinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.province && (
          <p className="text-xs text-destructive">{errors.province}</p>
        )}
      </div>

      <div className="text-sm text-muted-foreground bg-background p-3 rounded">
        <strong>País:</strong> España (Solo realizamos envíos en España)
      </div>
    </div>
  );
};

export default ShippingForm;
