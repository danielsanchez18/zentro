import type { Metadata } from "next";

/**
 * Metadata de las vistas del Hub. Sigue el formato de la landing
 * ("Vista - Dashboard Zentro"), y marca las páginas
 * como privadas para que no se indexen.
 */
export const hubMetadata = (view: string, description: string): Metadata => {
  const title = `${view} - Dashboard Zentro`;
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
    twitter: { title, description },
  };
};
