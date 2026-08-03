import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS, type StepId } from "./constants";

interface StepProgressProps {
  step: StepId;
}

/**
 * Progreso de los 3 sub-pasos del wizard (Actividad · Tu local · Módulos).
 *
 * Línea editorial monocromo: los pasos completados se rellenan en charcoal,
 * el paso activo lleva aro y la línea avanza con el color hasta el punto actual.
 */
export const StepProgress = ({ step }: StepProgressProps) => {
  const activeStepIndex = STEPS.findIndex((s) => s.id === step);
  const currentLabel = STEPS[activeStepIndex]?.label;

  return (
    <div className="space-y-3">
      <ol
        aria-label="Progreso de configuración"
        className="flex items-center"
      >
        {STEPS.map((s, index) => {
          const isCompleted = index < activeStepIndex;
          const isActive = s.id === step;
          const isReached = index <= activeStepIndex;

          return (
            <li
              key={s.id}
              aria-current={isActive ? "step" : undefined}
              className="flex flex-1 items-center last:flex-none"
            >
              {/* Círculo de estado */}
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                  isCompleted
                    ? "bg-foreground border-foreground text-background"
                    : isActive
                      ? "border-foreground text-foreground"
                      : "border-border bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span className="text-xs font-medium tracking-tighter tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </span>

              {/* Indicador de paso (desktop) */}
              <span
                className={cn(
                  "ml-2.5 hidden whitespace-nowrap text-sm md:inline",
                  isActive
                    ? "font-medium text-foreground"
                    : isCompleted
                      ? "text-foreground/70"
                      : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>

              {/* Línea conectora */}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mx-3 h-px min-w-6 flex-1"
                >
                  <span
                    className={cn(
                      "block h-full bg-border",
                      isCompleted && "bg-foreground transition-colors duration-300"
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Indicador contextual (mobile) */}
      <p className="text-sm text-muted-foreground md:hidden" aria-live="polite">
        Paso {activeStepIndex + 1} de {STEPS.length} · {currentLabel}
      </p>
    </div>
  );
};