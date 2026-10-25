"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { hubButton } from "@/components/dashboard/shared/styles";

const STEPS = [
  "Creando tu espacio de trabajo",
  "Activando las capacidades elegidas",
  "Preparando tu panel",
] as const;

const STEP_MS = 1100;

/**
 * Ilustración animada (SVG + CSS, sin archivos externos): bloques que se
 * apilan formando el edificio de la organización, con destellos lima.
 * Las animaciones viven en hub.css (.hub-setup-*) y respetan
 * prefers-reduced-motion.
 */
const SetupIllustration = ({ done }: { done: boolean }) => (
  <div className={cn("hub-setup relative mx-auto size-40", done && "is-done")} aria-hidden="true">
    <div className="hub-setup-glow absolute inset-4 rounded-full bg-hub-accent/30 blur-2xl" />
    <svg viewBox="0 0 160 160" className="relative size-full">
      {/* órbita */}
      <circle cx="80" cy="80" r="66" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="4 6" className="hub-setup-orbit text-foreground" />
      <circle cx="146" cy="80" r="5" className="hub-setup-orbit fill-hub-accent" />
      {/* base */}
      <rect x="38" y="118" width="84" height="8" rx="4" className="fill-foreground/10" />
      {/* bloques del edificio */}
      <rect x="46" y="94" width="68" height="22" rx="5" className="hub-setup-block fill-foreground" style={{ animationDelay: "0ms" }} />
      <rect x="54" y="70" width="52" height="22" rx="5" className="hub-setup-block fill-foreground/80" style={{ animationDelay: "350ms" }} />
      <rect x="62" y="46" width="36" height="22" rx="5" className="hub-setup-block fill-hub-accent" style={{ animationDelay: "700ms" }} />
      {/* ventanas */}
      <g className="hub-setup-windows fill-hub-accent">
        <rect x="56" y="101" width="8" height="8" rx="2" />
        <rect x="76" y="101" width="8" height="8" rx="2" />
        <rect x="96" y="101" width="8" height="8" rx="2" />
        <rect x="66" y="77" width="8" height="8" rx="2" />
        <rect x="86" y="77" width="8" height="8" rx="2" />
      </g>
      {/* destellos */}
      <path d="M124 38 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" className="hub-setup-spark fill-hub-accent" />
      <path d="M34 52 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" className="hub-setup-spark fill-hub-accent" style={{ animationDelay: "600ms" }} />
    </svg>
    {/* check final */}
    <span className="hub-setup-check absolute right-3 bottom-6 flex size-10 items-center justify-center rounded-full bg-hub-accent text-hub-accent-foreground ring-4 ring-card">
      <Check className="size-5" strokeWidth={3} />
    </span>
  </div>
);

interface SetupCompleteDialogProps {
  open: boolean;
  organizationName: string;
  onGoToWorkspace: () => void;
  onGoToOrganizations: () => void;
}

/**
 * Modal que se muestra al finalizar el onboarding: simula la preparación de
 * la organización paso a paso y luego ofrece entrar al workspace.
 */
export const SetupCompleteDialog = ({
  open,
  organizationName,
  onGoToWorkspace,
  onGoToOrganizations,
}: SetupCompleteDialogProps) => {
  const [current, setCurrent] = useState(0);
  const done = current >= STEPS.length;

  useEffect(() => {
    if (!open || done) return;
    const timer = setTimeout(() => setCurrent((value) => value + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [open, current, done]);

  return (
    <Dialog open={open} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="gap-0 p-6 text-center sm:max-w-sm">
        <SetupIllustration done={done} />

        <DialogTitle className="mt-4 font-sans text-lg font-medium">
          {done ? "¡Tu organización está lista!" : "Estamos configurando tu organización"}
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm">
          {done
            ? `${organizationName} ya puede empezar a operar en Zentro.`
            : `Preparando ${organizationName}. Esto tomará solo unos segundos.`}
        </DialogDescription>

        <ol className="mt-5 space-y-2 text-left">
          {STEPS.map((label, index) => {
            const state = index < current ? "done" : index === current ? "active" : "pending";
            return (
              <li
                key={label}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-(--hub-radius-control) border border-border px-3 text-sm transition-colors",
                  state === "done" && "bg-muted/60",
                  state === "pending" && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    state === "done" ? "bg-hub-accent text-hub-accent-foreground" : "bg-muted",
                  )}
                >
                  {state === "done" ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : state === "active" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : null}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        <div data-hub-footer className="mt-6 flex">
          <button type="button" className={hubButton.secondary} onClick={onGoToOrganizations} disabled={!done}>
            Ver organizaciones
          </button>
          <button type="button" className={hubButton.primary} onClick={onGoToWorkspace} disabled={!done}>
            Entrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
