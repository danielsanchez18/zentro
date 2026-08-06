"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles, X } from "lucide-react";

/** Días ganados redondeando hacia arriba (fracciones cuentan como 1). */
function daysUntil(dateIso: string): number {
  const target = new Date(dateIso);
  const diffMs = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

interface PlanBannerProps {
  /** Slug del tenant — se usa para la ruta "Ver mi plan" y para persistir el dismiss. */
  slug: string;
  /** Nombre legible del plan o "Sin plan". */
  plan: string;
  /** Estado de suscripción: ACTIVE, TRIAL, PAST_DUE, CANCELED. */
  status?: string;
  /** Fin del trial (ISO) — se usa para calcular días restantes. */
  trialEndsAt?: string | null;
}

/**
 * Banner compacto del plan actual del tenant. En trial muestra los días
 * restantes con un CTA a "Ver mi plan"; si venció, lo marca. Es descartable
 * (persiste en localStorage por tenant) para no estorbar tras la primera vista.
 */
export const PlanBanner = ({
  slug,
  plan,
  status,
  trialEndsAt,
}: PlanBannerProps) => {
  const dismissKey = `zentro:plan-banner:hide:${slug}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(dismissKey) === "1");
    } catch {
      /* localStorage no disponible (última de privacidad) → nunca ocultar. */
    }
  }, [dismissKey]);

  const planPath = `/app/${slug}/plan`;

  // Si ya hay un plan vigente (no trial) y no expiró, el banner no es útil.
  const isTrial = status === "TRIAL";
  const isTrialExpired =
    isTrial && !!trialEndsAt && daysUntil(trialEndsAt) === 0;
  const showUpgrade = isTrial || isTrialExpired;
  const trialDays = isTrial && trialEndsAt ? daysUntil(trialEndsAt) : 0;

  if (dismissed || (!showUpgrade && !(plan && plan !== "Sin plan"))) return null;

  return (
    <div className="group relative overflow-hidden">
      <button
        type="button"
        aria-label="Ocultar aviso de plan"
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem(dismissKey, "1");
          } catch {
            /* noop */
          }
        }}
        className="absolute right-0 top-0 flex items-center justify-center text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>

      <div className="pr-4">
        <div className="flex items-center gap-x-1.5">
          <Sparkles className="size-3.5 text-primary" />
          <p className="text-sm font-medium text-foreground">
            {isTrialExpired ? "Tu prueba ha terminado" : `Plan ${plan || "Trial"}`}
          </p>
        </div>

        {isTrial && !isTrialExpired && (
          <p className="mt-1 text-sm text-muted-foreground">
            Te quedan{" "}
            <span className="font-medium text-foreground">
              {trialDays} {trialDays === 1 ? "día" : "días"}
            </span>{" "}
            de prueba.
          </p>
        )}
        {isTrialExpired && (
          <p className="mt-1 text-sm text-muted-foreground">
            Elige un plan para seguir usando Zentro.
          </p>
        )}
        {!isTrial && plan && plan !== "Sin plan" && (
          <p className="mt-1 text-sm text-muted-foreground">
            Tu plan {plan} está activo.
          </p>
        )}

        <Link
          href={planPath}
          className="mt-2 inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:underline"
        >
          {isTrialExpired ? "Ver planes" : "Ver mi plan"}
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
};