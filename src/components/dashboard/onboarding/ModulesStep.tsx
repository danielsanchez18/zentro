import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { hubStatus } from "@/components/dashboard/shared/styles";
import { MODULES, RUBROS_BY_CODE, type IndustryCode, type ModuleKey } from "./constants";

interface ModulesStepProps {
  rubro: IndustryCode | null;
  selected: Record<ModuleKey, boolean>;
  onToggle: (key: ModuleKey) => void;
}

/**
 * Capacidades sugeridas por actividad. Ninguna recomendación es obligatoria.
 */
export const ModulesStep = ({ rubro, selected, onToggle }: ModulesStepProps) => {
  const currentRubro = rubro ? RUBROS_BY_CODE[rubro] : undefined;
  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium tracking-tight">¿Qué quieres hacer con Zentro?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentRubro ? (
              <>
                Recomendación para <span className="font-medium text-foreground">{currentRubro.label}</span>. Puedes
                cambiarla ahora o después.
              </>
            ) : (
              "Podrás activarlas o desactivarlas después desde el panel."
            )}
          </p>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">{selectedCount}</span> de {MODULES.length} seleccionadas
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => {
          const recommended = currentRubro?.suggested.includes(m.key);
          const checked = selected[m.key];
          return (
            <li key={m.key}>
              <label
                className={cn(
                  "flex h-full cursor-pointer flex-col rounded-sm border bg-card p-4 transition-colors",
                  checked ? "border-hub-accent ring-2 ring-hub-accent/40" : "border-border hover:border-foreground/30",
                )}
              >
                <input type="checkbox" checked={checked} onChange={() => onToggle(m.key)} className="sr-only" />

                <span className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-(--hub-radius-control) transition-colors",
                      checked ? "bg-hub-accent/20 text-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <m.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-sm text-muted-foreground">{m.descripcion}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                      checked
                        ? "border-hub-accent bg-hub-accent text-hub-accent-foreground"
                        : "border-border bg-card text-transparent",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </span>

                <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {m.features.map((f) => (
                    <li key={f} className="text-sm leading-snug text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>

                {recommended && (
                  <span className="mt-auto pt-4">
                    <span className={cn(hubStatus, "border-hub-accent/40 bg-hub-accent/15 text-foreground")}>
                      Recomendado
                    </span>
                  </span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
