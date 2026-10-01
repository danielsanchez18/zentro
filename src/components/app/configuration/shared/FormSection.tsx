import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  classNameCustom?: string;
}

/**
 * Contenedor de sección para formularios grandes de configuración.
 * Estilo visual estándar alineado con el resto de formularios del sistema.
 */
export function FormSection({
  title,
  description,
  action,
  children,
  classNameCustom,
}: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card h-fit font-heading">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className={cn("p-5", classNameCustom)}>{children}</div>
    </section>
  );
}

export const configInputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-2.25 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
