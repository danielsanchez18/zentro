"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { dashboardOnboarding } from "@/lib/mock/dashboard";

/**
 * Primeros pasos (onboarding) — banner del hub.
 * TODO(0.2): leer progreso real desde `GET /users/me/onboarding`.
 */
const STEP_LABELS = {
  CREATE_ORGANIZATION: "Crea tu organización",
  COMPLETE_BUSINESS_PROFILE: "Completa los datos de tu negocio",
  REVIEW_CAPABILITIES: "Revisa las capacidades de tu negocio",
} as const;

const SKIP_FLAG = "zentro-onboarding-skipped";
const DEMO_START_EVENT = "zentro:demo-start";

export const OnboardingBanner = () => {
  const steps = dashboardOnboarding.steps.map((step) => ({
    ...step,
    label: STEP_LABELS[step.key],
    done: step.completedAt !== null,
  }));
  const [skipped, setSkipped] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SKIP_FLAG) === "1";
  });

  const doneCount = steps.filter((step) => step.done).length;

  const handleSkip = () => {
    sessionStorage.setItem(SKIP_FLAG, "1");
    setSkipped(true);
    toastMsg.info("Guía oculta", "Puedes reabrirla desde Ayuda → Preguntas frecuentes.");
  };

  const handleStartDemo = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(DEMO_START_EVENT));
  };

  if (skipped) return null;

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
            className="rounded-sm px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Omitir
          </button>
          <button
            type="button"
            onClick={handleStartDemo}
            className="flex items-center gap-1.5 rounded-sm bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
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
            className={cn("h-1.5 flex-1 rounded-full", step.done ? "bg-foreground" : "bg-muted")}
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
                step.done ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
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
