import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Primeros pasos (onboarding) — banner del hub.
 * TODO(0.2): leer progreso real desde `GET /users/me/onboarding`.
 */
const STEPS = [
  { key: "create_org", label: "Crea tu organización", done: true },
  { key: "business_data", label: "Completa los datos de tu negocio", done: false },
  { key: "activate_plan", label: "Activa un plan", done: false },
] as const;

export const OnboardingBanner = () => {
  const doneCount = STEPS.filter((step) => step.done).length;

  return (
    <section
      aria-labelledby="onboarding-title"
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="onboarding-title" className="font-medium">
            Primeros pasos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {doneCount} de {STEPS.length} completados
          </p>
        </div>
        <Button type="button" variant="outline" className="text-sm px-3 rounded-full">
          Omitir
        </Button>
      </div>

      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={STEPS.length}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
        />
      </div>

      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.key} className="flex gap-2 text-sm">
            {step.done ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
            )}
            <span className={step.done ? "" : "text-muted-foreground"}>
              <span className="sr-only">Paso {index + 1}: </span>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
