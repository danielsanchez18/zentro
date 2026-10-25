"use client";

import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { useDashboardStore } from "@/stores/dashboard-store";
import { hubButton } from "@/components/dashboard/shared/styles";

/**
 * Primeros pasos (onboarding) — banner del hub.
 * Los pasos se derivan de las organizaciones y su configuración; la omisión se
 * guarda en el store. TODO(0.2): `GET/PUT /users/me/onboarding`.
 */
const STEP_LABELS = {
  CREATE_ORGANIZATION: "Crea tu organización",
  COMPLETE_BUSINESS_PROFILE: "Completa los datos de tu negocio",
  REVIEW_CAPABILITIES: "Revisa las capacidades de tu negocio",
} as const;

const DEMO_START_EVENT = "zentro:demo-start";

export const OnboardingBanner = () => {
  const dashboard = useDashboardStore();
  const steps = dashboard.getHubOnboardingSteps().map((step) => ({ ...step, label: STEP_LABELS[step.key] }));
  const skipped = dashboard.onboardingSkippedAt !== null;

  const doneCount = steps.filter((step) => step.done).length;

  const handleSkip = () => {
    dashboard.skipHubOnboarding();
    toastMsg.info("Guía oculta", "Puedes reabrirla desde Ayuda → ¿Empezando con Zentro?");
  };

  const handleStartDemo = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(DEMO_START_EVENT));
  };

  // Se oculta si el usuario la omitió o ya completó todo.
  if (skipped || doneCount === steps.length) return null;

  return (
    <section
      data-demo="onboarding"
      aria-labelledby="onboarding-title"
      className="rounded-sm bg-card px-4 py-3 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="onboarding-title" className="font-sans text-base font-medium">
            Primeros pasos
          </h2>
          <p className="text-sm text-muted-foreground">
            {doneCount} de {steps.length} completados
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSkip}
            className={hubButton.ghost}
          >
            Omitir
          </button>
          <button
            type="button"
            onClick={handleStartDemo}
            className={hubButton.secondary}
          >
            <Sparkles className="size-4" />
            Explorar demo
          </button>
        </div>
      </div>

      <div
        className="flex gap-1"
        role="progressbar"
        aria-label="Progreso de primeros pasos"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={steps.length}
      >
        {steps.map((step) => (
          <span
            key={step.key}
            className={cn("h-1.5 flex-1 rounded-full", step.done ? "bg-hub-accent" : "bg-muted")}
          />
        ))}
      </div>

      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.key}
            className={cn(
              "flex items-center gap-3 rounded-sm border border-border p-2",
              step.done && "bg-muted/50",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-sm text-sm font-medium",
                step.done ? "bg-hub-accent text-hub-accent-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {step.done ? <Check className="size-4" /> : index + 1}
            </span>
            <span className={cn("text-sm", step.done ? "text-muted-foreground line-through" : "font-medium")}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
