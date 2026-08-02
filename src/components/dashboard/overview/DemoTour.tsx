"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoStep {
  selector: string;
  title: string;
  description: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    selector: "[data-demo='greeting']",
    title: "Tu panel de control",
    description:
      "Este es tu resumen diario. Aquí verás las actividades pendientes de tus organizaciones.",
  },
  {
    selector: "[data-demo='tenant']",
    title: "Tu organización",
    description:
      "Entra directamente a tu organización o, si tienes varias, elige con este selector a dónde quieres ir.",
  },
  {
    selector: "[data-demo='onboarding']",
    title: "Primeros pasos",
    description:
      "Sigue esta lista para configurar tu cuenta: crea la organización, completa tus datos y activa un plan.",
  },
  {
    selector: "[data-demo='organizations']",
    title: "Mis organizaciones",
    description:
      "Desde aquí administras las organizaciones donde participas. Crea una nueva o abre una existente.",
  },
  {
    selector: "[data-demo='invitations']",
    title: "Invitaciones",
    description:
      "Cuando alguien te invite a su organización, podrás aceptar o rechazar la invitación aquí.",
  },
  {
    selector: "[data-demo='subscriptions']",
    title: "Suscripciones",
    description:
      "Revisa los planes y las facturas de todas tus organizaciones, y descarga tus comprobantes.",
  },
];

const START_EVENT = "zentro:demo-start";
const REQUEST_FLAG = "zentro-demo-request";

interface CutRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Position {
  rect: CutRect;
  tooltip: { top: number; left: number };
}

export const DemoTour = () => {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);

  const targetsRef = useRef<DemoStep[]>([]);
  const stepIndexRef = useRef(0);

  const positionStep = (index: number) => {
    const targets = targetsRef.current;
    if (index < 0 || index >= targets.length) return;
    const el = document.querySelector(targets[index].selector);
    if (!el) return;

    el.scrollIntoView({ block: "center" });

    window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 150;
      let left = r.left + r.width / 2 - tooltipWidth / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
      const below = r.bottom + tooltipHeight + 16 < window.innerHeight;
      const top = below
        ? r.bottom + 16
        : Math.max(12, r.top - tooltipHeight - 16);

      setPosition({
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        tooltip: { top, left },
      });
    }, 60);
  };

  const startTour = () => {
    targetsRef.current = DEMO_STEPS.filter((step) =>
      document.querySelector(step.selector),
    );
    if (targetsRef.current.length === 0) return;
    stepIndexRef.current = 0;
    setStepIndex(0);
    setRunning(true);
    positionStep(0);
  };

  const closeTour = () => {
    setRunning(false);
    setPosition(null);
  };

  const goTo = (index: number) => {
    stepIndexRef.current = index;
    setStepIndex(index);
    positionStep(index);
  };

  // Disparo desde botones externos (OnboardingBanner, Ayuda) o por URL flag.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStart = () => startTour();
    window.addEventListener(START_EVENT, onStart);

    const flag = sessionStorage.getItem(REQUEST_FLAG);
    if (flag === "1") {
      sessionStorage.removeItem(REQUEST_FLAG);
      startTour();
    }

    return () => window.removeEventListener(START_EVENT, onStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mientras el tour corre: bloquea scroll, cierra con Escape y reposiciona al redimensionar.
  useEffect(() => {
    if (!running) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTour();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    const onResize = () => positionStep(stepIndexRef.current);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  if (!running || !position) return null;

  const targetCount = targetsRef.current.length;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { rect } = position;

  const cuts: CutRect[] = [
    { top: 0, left: 0, width: vw, height: rect.top },
    { top: rect.top + rect.height, left: 0, width: vw, height: vh - rect.top - rect.height },
    { top: rect.top, left: 0, width: rect.left, height: rect.height },
    { top: rect.top, left: rect.left + rect.width, width: vw - rect.left - rect.width, height: rect.height },
  ].filter((cut) => cut.width > 0 && cut.height > 0);

  const isLast = stepIndex === targetCount - 1;

  const next = () => {
    if (stepIndexRef.current < targetCount - 1) {
      goTo(stepIndexRef.current + 1);
    } else {
      closeTour();
    }
  };

  const prev = () => {
    if (stepIndexRef.current > 0) goTo(stepIndexRef.current - 1);
  };

  return (
    <>
      {/* Recorte oscurecido que bloquea la interacción fuera del elemento. */}
      <div className="fixed inset-0 z-60" aria-hidden>
        {cuts.map((cut, index) => (
          <div
            key={index}
            className="absolute bg-black/35"
            style={{ top: cut.top, left: cut.left, width: cut.width, height: cut.height }}
            onClick={closeTour}
          />
        ))}
      </div>

      {/* Anillo alrededor del elemento destacado. */}
      <div
        className="pointer-events-none fixed z-61 rounded-lg ring-2 ring-primary"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />

      {/* Tarjeta del paso. */}
      <div
        role="dialog"
        aria-label={targetsRef.current[stepIndex].title}
        className="fixed z-62 w-75 max-w-[calc(100vw-24px)] rounded-xl border border-border bg-popover p-4 shadow-2xl"
        style={{ top: position.tooltip.top, left: position.tooltip.left }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              Paso {stepIndex + 1} de {targetCount}
            </p>
          </div>
          <button
            type="button"
            aria-label="Cerrar demo"
            onClick={closeTour}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <h3 className="mt-3 text-sm font-medium">
          {targetsRef.current[stepIndex].title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {targetsRef.current[stepIndex].description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-sm"
            onClick={closeTour}
          >
            Omitir
          </Button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Paso anterior"
                onClick={prev}
              >
                <ChevronLeft />
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              className="rounded-full text-sm"
              onClick={next}
            >
              {isLast ? "Finalizar" : "Siguiente"}
              {!isLast && <ChevronRight className="size-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
