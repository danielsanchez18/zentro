import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FormSection, productInputClass } from "./FormSection";
import { Globe, Laptop, Store } from "lucide-react";

interface ProductPricingProps {
  price: string;
  compareAtPrice: string;
  available: boolean;
  scheduledAt?: string;
  onChange: (field: "price" | "compareAtPrice" | "available" | "scheduledAt", value: string | boolean) => void;
}

export function ProductPricing({ price, compareAtPrice, available, scheduledAt, onChange }: ProductPricingProps) {
  const [localScheduledAt, setLocalScheduledAt] = useState<string>(scheduledAt || "");

  const handleDateChange = (val: string) => {
    setLocalScheduledAt(val);
    onChange("scheduledAt", val);
  };

  return (
    <FormSection title="Precio y disponibilidad" description="Define el precio base y si puede venderse desde ahora.">
      
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
        
        <Field label="Precio original" hint="Precio regular del producto.">
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">S/.</span>
            <input required inputMode="decimal" value={price} onChange={(e) => onChange("price", e.target.value)} placeholder="0.00" className={`${productInputClass} pr-11`} />
          </div>
        </Field>
        
        <Field label="Precio oferta" hint="Opcional. Precio al que se venderá el producto.">
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">S/.</span>
            <input inputMode="decimal" value={compareAtPrice} onChange={(e) => onChange("compareAtPrice", e.target.value)} placeholder="0.00" className={`${productInputClass} pr-11`} />
          </div>
        </Field>

        <Field label="Estado">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant={available ? "default" : "outline"} onClick={() => onChange("available", true)}>Disponible</Button>
            <Button type="button" variant={!available ? "default" : "outline"} onClick={() => onChange("available", false)}>No disponible</Button>
            <Button type="button" variant="outline">Borrador</Button>
            <Button type="button" variant="outline">Próximamente</Button>
            <Button type="button" variant="outline">Agotado</Button>
          </div>
        </Field>

        <Field label="Programar disponibilidad" hint="Opcional. Define la fecha y hora en la que el producto estará disponible.">
          <DateTimePicker
            value={scheduledAt ?? localScheduledAt}
            onChange={handleDateChange}
            placeholder="Seleccionar fecha y hora..."
          />
        </Field>

        <Field label="Disponible en ">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline">
              <Laptop />
              Web
            </Button>
            <Button type="button" variant="outline">
              <Store />
              Tienda
            </Button>
            <Button type="button" variant="outline">
              <Globe />
              Marketplace
            </Button>
          </div>
        </Field>
      </div>
      
    </FormSection>
  );
}
