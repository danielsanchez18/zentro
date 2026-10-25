import Image from "next/image";
import { Clock, MapPin, Pencil, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { hubButton } from "@/components/dashboard/shared/styles";
import { MODULE_MAP, RUBROS_BY_CODE, type IndustryCode, type LocalData, type ModuleKey, type StepId } from "./constants";

interface ReviewStepProps {
  organizationName: string;
  industry: IndustryCode;
  selected: Record<ModuleKey, boolean>;
  showLocations: boolean;
  locations: LocalData[];
  onEdit: (step: StepId) => void;
}

const Section = ({
  title,
  meta,
  onEdit,
  children,
}: {
  title: string;
  meta: string;
  onEdit: () => void;
  children: React.ReactNode;
}) => (
  <article className="flex flex-col rounded-sm border border-border p-3">
    <header className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      <button type="button" className={cn(hubButton.ghost, "h-7 px-2")} onClick={onEdit}>
        <Pencil />
        Editar
      </button>
    </header>
    <div className="mt-3 border-t border-border pt-3">{children}</div>
  </article>
);

export const ReviewStep = ({ organizationName, industry, selected, showLocations, locations, onEdit }: ReviewStepProps) => {
  const rubro = RUBROS_BY_CODE[industry];
  const RubroIcon = rubro.icon;
  const capabilities = (Object.keys(selected) as ModuleKey[]).filter((key) => selected[key]).map((key) => MODULE_MAP[key]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">Revisa y confirma</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Así quedará tu organización. Podrás cambiar todo esto después desde su configuración.
        </p>
      </div>

      {/* Portada: organización y actividad */}
      <div className="relative overflow-hidden rounded-sm">
        <div className="relative aspect-[21/9] max-h-56 w-full sm:aspect-[4/1]">
          <Image src={rubro.image} alt="" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 text-white">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/80">
              <RubroIcon className="size-3.5" />
              {rubro.label}
            </p>
            <p className="truncate font-sans text-xl font-semibold">{organizationName}</p>
          </div>
          <button
            type="button"
            onClick={() => onEdit("actividad")}
            className={cn(hubButton.secondary, "bg-white/90 text-foreground hover:bg-white")}
          >
            <Pencil />
            Cambiar actividad
          </button>
        </div>
      </div>

      <div className={cn("grid gap-2", showLocations && "lg:grid-cols-2")}>
        <Section
          title="Capacidades"
          meta={`${capabilities.length} de ${Object.keys(selected).length} activadas`}
          onEdit={() => onEdit("modulos")}
        >
          {capabilities.length > 0 ? (
            <ul className={cn("grid gap-2 sm:grid-cols-2", showLocations && "lg:grid-cols-1 xl:grid-cols-2")}>
              {capabilities.map((capability) => (
                <li key={capability.key} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-(--hub-radius-control) bg-hub-accent/20 text-foreground">
                    <capability.icon className="size-4.5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{capability.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{capability.descripcion}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Ninguna por ahora. Podrás activarlas desde la organización.</p>
          )}
        </Section>

        {showLocations && (
          <Section
            title="Ubicaciones"
            meta={locations.length > 0 ? `${locations.length} por crear` : "Sin ubicaciones"}
            onEdit={() => onEdit("local")}
          >
            {locations.length > 0 ? (
              <ul className="space-y-2">
                {locations.map((location, index) => (
                  <li key={`${location.nombre}-${index}`} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-(--hub-radius-control) bg-muted text-foreground">
                      <Store className="size-4.5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{location.nombre}</span>
                        {index === 0 && <HubStatusChip tone="success" icon={Store} label="Principal" className="h-6 px-2 text-xs" />}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        <span className="truncate">{location.direccion || "Dirección por completar"}</span>
                      </span>
                      {location.horario && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span className="truncate">{location.horario}</span>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tu organización se creará sin sucursales. Podrás agregarlas cuando las necesites.
              </p>
            )}
          </Section>
        )}
      </div>
    </section>
  );
};
