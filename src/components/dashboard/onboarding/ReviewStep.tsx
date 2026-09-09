import { Building2, Check, MapPin } from "lucide-react";
import { MODULE_MAP, RUBROS_BY_CODE, type IndustryCode, type LocalData, type ModuleKey } from "./constants";

interface ReviewStepProps {
  organizationName: string;
  industry: IndustryCode;
  selected: Record<ModuleKey, boolean>;
  locationEnabled: boolean;
  location: LocalData;
}

export const ReviewStep = ({ organizationName, industry, selected, locationEnabled, location }: ReviewStepProps) => {
  const capabilities = Object.entries(selected)
    .filter(([, enabled]) => enabled)
    .map(([key]) => MODULE_MAP[key as ModuleKey]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Revisa la configuración</h2>
        <p className="mt-1 text-sm text-muted-foreground">Podrás cambiar estas decisiones más adelante.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-5">
          <Building2 className="size-5 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Organización</p>
          <h3 className="font-medium">{organizationName}</h3>
          <p className="mt-3 text-sm text-muted-foreground">Actividad</p>
          <p className="text-sm font-medium">{RUBROS_BY_CODE[industry].label}</p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <MapPin className="size-5 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Ubicación</p>
          <h3 className="font-medium">{locationEnabled ? location.nombre : "Sin ubicación"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {locationEnabled ? location.direccion || "Dirección por completar" : "No se creará ninguna sucursal."}
          </p>
        </article>
      </div>

      <article className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium">Capacidades seleccionadas</h3>
        {capabilities.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <li key={capability.key} className="flex items-center gap-2 text-sm">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="size-3" /></span>
                {capability.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Ninguna por ahora. Podrás activarlas desde la organización.</p>
        )}
      </article>
    </section>
  );
};
