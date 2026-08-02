"use client";

import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "./demo-tour.css";

const START_EVENT = "zentro:demo-start";
const REQUEST_FLAG = "zentro-demo-request";

const DEMO_STEPS: DriveStep[] = [
  {
    element: "[data-demo='greeting']",
    popover: {
      title: "Tu panel de control",
      description:
        "Este es tu resumen diario. Aquí verás las actividades pendientes de tus organizaciones.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-demo='tenant']",
    popover: {
      title: "Tu organización",
      description:
        "Entra directamente a tu organización o, si tienes varias, elige con este selector a dónde quieres ir.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-demo='onboarding']",
    popover: {
      title: "Primeros pasos",
      description:
        "Sigue esta lista para configurar tu cuenta: crea la organización, completa tus datos y activa un plan.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-demo='organizations']",
    popover: {
      title: "Mis organizaciones",
      description:
        "Desde aquí administras las organizaciones donde participas. Crea una nueva o abre una existente.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-demo='invitations']",
    popover: {
      title: "Invitaciones",
      description:
        "Cuando alguien te invite a su organización, podrás aceptar o rechazar la invitación aquí.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-demo='subscriptions']",
    popover: {
      title: "Suscripciones",
      description:
        "Revisa los planes y las facturas de todas tus organizaciones, y descarga tus comprobantes.",
      side: "bottom",
      align: "center",
    },
  },
];

/**
 * Demo guiada del hub usando driver.js.
 *
 * driver.js se encarga del foco (highlight) y de re-posicionar el popover
 * al hacer scroll/resize, lo que evita el descuadre con los componentes.
 *
 * Disparo:
 *  - Evento window "zentro:demo-start" (botón Explorar demo del hub).
 *  - Flag de sesión "zentro-demo-request" (botón Explorar demo de Ayuda).
 *
 * Los estilos del popover se sobrescriben en `./demo-tour.css` para usar
 * los tokens de tema de la aplicación.
 */
export const DemoTour = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const instance = driver({
      animate: true,
      smoothScroll: true,
      overlayColor: "#000",
      overlayOpacity: 0.35,
      stagePadding: 6,
      stageRadius: 10,
      popoverClass: "zentro-driver-popover",
      showProgress: true,
      progressText: "Paso {{current}} de {{total}}",
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      doneBtnText: "Finalizar",
      showButtons: ["next", "previous", "close"],
      allowClose: true,
      allowKeyboardControl: true,
      overlayClickBehavior: "close",
      skipMissingElement: true,
      steps: DEMO_STEPS,
    });

    const start = () => instance.drive(0);
    window.addEventListener(START_EVENT, start);

    // StrictMode monta el efecto dos veces en desarrollo. Si leemos el flag y
    // arrancamos en el primer montaje, el cleanup del doble montaje destruye la
    // instancia que acababa de arrancar. Al diferir a un timeout, el primer
    // montaje lo cancela antes de consumir el flag y es el segundo (final) el
    // que realmente inicia el tour.
    const flagTimer = setTimeout(() => {
      if (sessionStorage.getItem(REQUEST_FLAG) === "1") {
        sessionStorage.removeItem(REQUEST_FLAG);
        start();
      }
    }, 0);

    return () => {
      window.removeEventListener(START_EVENT, start);
      clearTimeout(flagTimer);
      instance.destroy();
    };
  }, []);

  return null;
};
