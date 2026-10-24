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
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** `true` desde el breakpoint `md` (768px). */
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");
