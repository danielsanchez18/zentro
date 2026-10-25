"use client";

import { useSyncExternalStore } from "react";

/**
 * Suscribe un componente a una media query.
 * En servidor devuelve `false` (se asume mobile-first).
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      // Respaldo: algunos entornos (emulación de dispositivos, zoom) cambian el
      // viewport sin emitir "change" en la media query.
      window.addEventListener("resize", onChange);
      return () => {
        media.removeEventListener("change", onChange);
        window.removeEventListener("resize", onChange);
      };
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** `true` desde el breakpoint `md` (768px). */
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
