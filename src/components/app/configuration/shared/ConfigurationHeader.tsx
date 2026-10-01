"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface ConfigurationHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
}

/**
 * Encabezado estándar de sección dentro del Centro de configuración.
 * Soporta título, descripción, enlace de regreso opcional y botón de acción.
 */
export const ConfigurationHeader = ({
  title,
  description,
  backHref,
  backLabel = "Configuración",
  action,
}: ConfigurationHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="text-sm hover:underline underline-offset-2"
          >
            <span>{backLabel}</span>
          </Link>
        )}
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
