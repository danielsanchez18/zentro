import { Clock, MapPin, Phone, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { LocalData } from "./constants";

interface LocalStepProps {
  local: LocalData;
  onChange: (field: keyof LocalData, value: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

const FIELDS: {
  key: keyof LocalData;
  label: string;
  placeholder: string;
  icon: typeof MapPin;
}[] = [
  { key: "nombre", label: "Nombre", placeholder: "Ej: Sede Miraflores", icon: Store },
  { key: "direccion", label: "Dirección", placeholder: "Ej: Av. Larco 1234", icon: MapPin },
  { key: "telefono", label: "Teléfono", placeholder: "+51 999 999 999", icon: Phone },
  { key: "horario", label: "Horario", placeholder: "Lun-Vie 09:00-18:00", icon: Clock },
];

/**
 * Ubicación opcional. El switch explícito evita crear una sucursal implícita.
 */
export const LocalStep = ({ local, onChange, enabled, onEnabledChange }: LocalStepProps) => {
  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium tracking-tight">¿Quieres agregar una ubicación?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Una ubicación puede representar una tienda, consultorio, almacén o punto de atención.
          </p>
        </div>
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-1.5 text-xs font-medium uppercase text-foreground">
          Opcional
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="add-location" className="text-sm font-medium">Agregar una ubicación ahora</label>
            <p className="text-sm text-muted-foreground">Si la omites, tu organización se creará sin sucursales.</p>
          </div>
          <Switch id="add-location" checked={enabled} onCheckedChange={onEnabledChange} />
        </div>

        {enabled && <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
          {FIELDS.map(({ key, label, placeholder, icon: Icon }) => (
            <div
              key={key}
              className={key === "direccion" || key === "nombre" ? "sm:col-span-2" : undefined}
            >
              <label
                htmlFor={`local-${key}`}
                className="mb-1.5 block text-[13px] font-medium text-foreground/80"
              >
                {label}
              </label>
              <div className="relative">
                <Icon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <Input
                  id={`local-${key}`}
                  value={local[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="h-10 pl-9 text-sm"
                />
              </div>
            </div>
          ))}
        </div>}

        <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
          Nada se crea hasta que actives esta opción y confirmes el resumen.
        </p>
      </div>
    </section>
  );
};
