import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillingData } from "@/types/cart";
import { spanishProvinces, countries } from "@/data/spanishProvinces";

interface BillingFormProps {
  data: BillingData;
  onChange: (data: BillingData) => void;
  errors?: Partial<Record<keyof BillingData, string>>;
}

const BillingForm = ({ data, onChange, errors }: BillingFormProps) => {
  const updateField = <K extends keyof BillingData>(
    field: K,
    value: BillingData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-medium text-charcoal mb-4">
        Datos de Facturación
      </h3>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico *</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="tu@email.com"
          className={errors?.email ? "border-destructive" : ""}
        />
        {errors?.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Tu nombre"
            className={errors?.firstName ? "border-destructive" : ""}
          />
          {errors?.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Tus apellidos"
            className={errors?.lastName ? "border-destructive" : ""}
          />
          {errors?.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono *</Label>
        <Input
          id="phone"
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
        <Label htmlFor="country">País *</Label>
        <Select
          value={data.country}
          onValueChange={(value) => updateField("country", value)}
        >
          <SelectTrigger className={errors?.country ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.country && (
          <p className="text-xs text-destructive">{errors.country}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección *</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Calle, número, piso..."
          className={errors?.address ? "border-destructive" : ""}
        />
        {errors?.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Tu ciudad"
            className={errors?.city ? "border-destructive" : ""}
          />
          {errors?.city && (
            <p className="text-xs text-destructive">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Código Postal *</Label>
          <Input
            id="postalCode"
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

      {data.country === "España" && (
        <div className="space-y-2">
          <Label htmlFor="province">Provincia *</Label>
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
      )}
    </div>
  );
};

export default BillingForm;
