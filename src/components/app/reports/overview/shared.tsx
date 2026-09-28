"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ReportSection({
  title,
  subtitle,
  action,
  className,
  contentClassName,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card font-heading min-w-0 w-full max-w-full overflow-hidden",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          {/* {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )} */}
        </div>
        {action}
      </header>
      <div
        className={cn(
          "flex flex-1 flex-col p-4 sm:p-5 min-w-0 w-full max-w-full",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Fila de desglose con barra de progreso proporcional (sin librería). */
export function BreakRow({
  label,
  value,
  formatted,
  count,
  total,
}: {
  label: string;
  value: number;
  formatted: string;
  count?: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 font-medium tabular-nums text-foreground">
          {formatted}
          {typeof count === "number" && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              · {count}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary/70"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export const money = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(value);

export const shortDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
      }).format(new Date(value))
    : "—";
