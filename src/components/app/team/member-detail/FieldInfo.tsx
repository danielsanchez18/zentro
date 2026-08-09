import type { ReactNode } from "react";

interface FieldInfoProps {
  label: string;
  children: ReactNode;
}

/** Fila de detalle etiqueta → valor (usada en las tarjetas del detalle). */
export const FieldInfo = ({ label, children }: FieldInfoProps) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-xs uppercase tracking-wide text-muted-foreground pt-0.5 whitespace-nowrap">
      {label}
    </dt>
    <dd className="text-sm font-medium text-end break-all">{children}</dd>
  </div>
);