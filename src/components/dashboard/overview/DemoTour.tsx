"use client";

import { useEffect } from "react";
import { driver, type DriveStep, type PopoverDOM } from "driver.js";
import "driver.js/dist/driver.css";
import "./demo-tour.css";

const START_EVENT = "zentro:demo-start";
const REQUEST_FLAG = "zentro-demo-request";

interface TourStep {
  /** Selector del elemento a resaltar; sin selector, el paso se muestra centrado. */
  element?: string;
  /** Etiqueta corta que aparece sobre el título ("Organizaciones", "Tu cuenta"…). */
  eyebrow: string;
  title: string;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

/**
 * Recorrido en el orden en que se usa el Hub: entrar a una organización,
 * completar la configuración, responder invitaciones, revisar cobros, avisos
 * y, por último, dónde moverse y dónde está la cuenta.
 */
const TOUR: TourStep[] = [
  {
    eyebrow: "Bienvenida",
    title: "Este es tu Hub",
    description:
      "Tu espacio personal en Zentro: desde aquí entras a tus organizaciones y gestionas tu cuenta. Te mostramos lo esencial en menos de un minuto.",
  },
  {
    element: "[data-demo='organizations']",
    eyebrow: "Organizaciones",
    title: "Entra a tu negocio",
    description:
      "Cada tarjeta es una organización. Pulsa Entrar para abrir su espacio de trabajo, o continúa las que están por configurar.",
    side: "bottom",
    align: "start",
  },
  {
    element: "[data-demo='onboarding']",
    eyebrow: "Primeros pasos",
    title: "Completa tu configuración",
    description:
      "Sigue estos pasos para dejar tu negocio listo: datos básicos y las capacidades que vas a usar.",
    side: "top",
    align: "start",
  },
  {
    element: "[data-demo='invitations']",
    eyebrow: "Invitaciones",
    title: "Únete a otros equipos",
    description:
      "Cuando alguien te invite a su organización, la verás aquí para aceptarla o rechazarla.",
    side: "top",
    align: "start",
  },
  {
    element: "[data-demo='subscriptions']",
    eyebrow: "Suscripciones",
    title: "Planes y próximos cobros",
    description:
      "Revisa el plan de cada organización y cuándo es su próximo cobro. Las facturas están en la página Suscripciones.",
    side: "top",
    align: "start",
  },
  {
    element: "[data-demo='notifications']",
    eyebrow: "Notificaciones",
    title: "Avisos importantes",
    description:
      "Facturas, inicios de sesión y novedades llegan aquí. El número indica cuántos avisos no has leído.",
    side: "bottom",
    align: "end",
  },
  {
    element: "[data-demo='navigation']",
    eyebrow: "Navegación",
    title: "Muévete por el Hub",
    description:
      "Desde aquí llegas a Organizaciones, Invitaciones, Mi cuenta, Suscripciones y Ayuda.",
    side: "right",
    align: "start",
  },
  {
    element: "[data-demo='account']",
    eyebrow: "Tu cuenta",
    title: "Perfil y sesión",
    description: "Accede a Mi cuenta, a tus suscripciones o cierra sesión de forma segura.",
    side: "bottom",
    align: "end",
  },
  {
    eyebrow: "Listo",
    title: "¡Ya conoces tu Hub!",
    description:
      "Puedes repetir este recorrido cuando quieras desde Ayuda → Explorar demo.",
  },
];

/** Solo incluye pasos cuyo elemento existe y es visible en el tamaño actual. */
const buildSteps = (): DriveStep[] =>
  TOUR.filter((step) => {
    if (!step.element) return true;
    const node = document.querySelector<HTMLElement>(step.element);
    return Boolean(node && node.getClientRects().length > 0);
  }).map((step) => ({
    element: step.element,
    popover: {
      title: `<span class="zentro-tour-eyebrow">${step.eyebrow}</span>${step.title}`,
      description: step.description,
      side: step.side ?? "bottom",
      align: step.align ?? "start",
    },
  }));

/** Inserta una barra de progreso segmentada en el popover. */
const renderProgress = (popover: PopoverDOM, current: number, total: number) => {
  const bar = document.createElement("div");
  bar.className = "zentro-tour-progress";
  bar.setAttribute("aria-hidden", "true");
  for (let index = 0; index < total; index++) {
    const segment = document.createElement("span");
    if (index <= current) segment.dataset.done = "true";
    bar.appendChild(segment);
  }
  popover.wrapper.prepend(bar);
};

/**
 * Demo guiada del Hub con driver.js.
 * Se dispara con el evento "zentro:demo-start" (botón Explorar demo del
 * overview) o con el flag de sesión "zentro-demo-request" (desde Ayuda).
 * Estilos en ./demo-tour.css con los tokens del Hub.
 */
export const DemoTour = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let instance: ReturnType<typeof driver> | null = null;

    const start = () => {
      instance?.destroy();
      const steps = buildSteps();
      instance = driver({
        animate: true,
        smoothScroll: true,
        overlayColor: "#0b0b0b",
        overlayOpacity: 0.45,
        stagePadding: 6,
        stageRadius: 12,
        popoverClass: "zentro-driver-popover",
        popoverOffset: 12,
        showProgress: true,
        progressText: "{{current}} de {{total}}",
        nextBtnText: "Siguiente",
        prevBtnText: "Atrás",
        doneBtnText: "Terminar",
        showButtons: ["next", "previous", "close"],
        allowClose: true,
        allowKeyboardControl: true,
        overlayClickBehavior: "close",
        steps,
        onPopoverRender: (popover, { state }) => {
          renderProgress(popover, state.activeIndex ?? 0, steps.length);
        },
      });
      instance.drive(0);
    };

    window.addEventListener(START_EVENT, start);

    // StrictMode monta el efecto dos veces en desarrollo: diferimos la lectura
    // del flag para que sea el montaje final el que inicie el tour.
    const flagTimer = setTimeout(() => {
      if (sessionStorage.getItem(REQUEST_FLAG) === "1") {
        sessionStorage.removeItem(REQUEST_FLAG);
        start();
      }
    }, 300);

    return () => {
      window.removeEventListener(START_EVENT, start);
      clearTimeout(flagTimer);
      instance?.destroy();
    };
  }, []);

  return null;
};
