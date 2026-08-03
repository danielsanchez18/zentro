import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MODULES,
  RUBROS_BY_CODE,
  type IndustryCode,
  type ModuleKey,
} from "./constants";

interface ModulesStepProps {
  rubro: IndustryCode | null;
  selected: Record<ModuleKey, boolean>;
  onToggle: (key: ModuleKey) => void;
}

/**
 * Paso 3 — Selección de módulos. Sugeridos pre-marcados con etiqueta "Recomendado";
 * los indispensables muestran ⚠️ y requieren confirmación para desactivarse.
 */
export const ModulesStep = ({ rubro, selected, onToggle }: ModulesStepProps) => {
  const currentRubro = rubro ? RUBROS_BY_CODE[rubro] : undefined;
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = MODULES.length;

  return (
    <section className="space-y-7">
      <div>
        <h2 className="text-lg font-medium tracking-tight">¿Qué módulos quieres activar?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentRubro ? (
            <>
              Recomendación para{" "}
              <span className="font-medium text-foreground">{currentRubro.label}</span>
              . Puedes cambiar la selección o editarla después.
            </>
          ) : (
            "Podrás activarlos o desactivarlos después desde el panel."
          )}
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isRecomendado = currentRubro?.suggested.includes(m.key);
          const isIndispensable = currentRubro?.indispensable.includes(m.key);
          const checked = selected[m.key];
          return (
            <li key={m.key}>
              <label
                className={cn(
                  "group relative flex cursor-pointer gap-3.5 rounded-xl h-full border bg-card p-4 transition-all duration-200",
                  checked
                    ? "border-foreground"
                    : "border-border hover:border-foreground/30"
                )}
              >
                <span aria-hidden="true" className="flex shrink-0 gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(m.key)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
                      checked
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-transparent group-hover:border-foreground/40"
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col gap-5">
                  <span className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        checked
                          ? "border-foreground/15 bg-foreground/5 text-foreground"
                          : "border-border bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4.5" strokeWidth={1.5} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {m.label}
                        {isIndispensable && (
                          <AlertTriangle
                            className="size-3.5 shrink-0 text-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{m.descripcion}</span>
                    </span>
                  </span>

                  <ul className="grid gap-1.5">
                    {m.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-1.5 text-sm leading-snug text-muted-foreground"
                      >
                        <span
                          className={cn(
                            "mt-1 size-1 shrink-0 rounded-full",
                            checked ? "bg-foreground/60" : "bg-border"
                          )}
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {(isRecomendado || isIndispensable) && (
                    <span className="mt-0.5 flex shrink-0 items-center gap-3">
                      {isRecomendado && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-1 text-xs w-fit font-medium",
                            checked
                              ? "border-foreground/15 bg-foreground/5 text-foreground"
                              : "border-border bg-muted/40 text-foreground/60"
                          )}
                        >
                          Recomendado
                        </span>
                      )}
                      {isIndispensable && (
                        <span className="text-sm text-muted-foreground">
                          Esencial para tu rubro
                        </span>
                      )}
                    </span>
                  )}
                </span>

              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-primary/10 px-4 py-2">
        <span className="text-sm text-foreground">Módulos activos</span>
        <span className="text-sm tabular-nums text-foreground px-3 py-1 rounded-lg bg-background/50 border border-border">
          {selectedCount}
          <span className="text-foreground/70"> de {total}</span>
        </span>
      </div>
    </section>
  );
};