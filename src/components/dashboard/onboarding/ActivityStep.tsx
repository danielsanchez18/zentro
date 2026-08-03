import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULE_MAP, RUBROS, type IndustryCode } from "./constants";

interface ActivityStepProps {
  rubro: IndustryCode | null;
  onSelect: (code: IndustryCode) => void;
}

/**
 * Paso 1 — Selector de rubro/industria.
 */
export const ActivityStep = ({ rubro, onSelect }: ActivityStepProps) => {
  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-lg font-medium tracking-tight">¿A qué se dedica tu negocio?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige la opción que mejor lo describa y te sugeriremos los módulos ideales.
        </p>
      </div>

      <div
        role="list"
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
      >
        {RUBROS.map((r) => {
          const Icon = r.icon;
          const isActive = rubro === r.code;
          const moduleCount = r.suggested.length;

          return (
            <button
              key={r.code}
              type="button"
              role="gridcell"
              aria-pressed={isActive}
              onClick={() => onSelect(r.code)}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200",
                isActive
                  ? "border-foreground bg-card"
                  : "border-border bg-card hover:border-foreground/30"
              )}
            >
              {isActive && (
                <span
                  className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-foreground text-background"
                  aria-hidden="true"
                >
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
              )}

              <span className="flex items-center justify-start gap-3">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-muted/40 text-foreground/70"
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
              </span>

              <span className="text-base font-medium tracking-tight">{r.label}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {r.description}
              </span>

              <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                {r.indispensable.length > 0 && (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground">
                    {r.indispensable
                      .map((k) => MODULE_MAP[k].label)
                      .join(" · ")}{" "}
                    incluidos
                  </span>
                )}
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground">
                  {moduleCount} módulo{moduleCount === 1 ? "" : "s"} recomendado
                  {moduleCount === 1 ? "" : "s"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};