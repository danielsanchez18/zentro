"use client";

import { MousePointerClick } from "lucide-react";
import type { InteractionMetric } from "@/lib/mock/presence-analytics";

interface InteractionsListProps {
  interactions: InteractionMetric[];
}

/**
 * Qué hace la gente en el sitio. Muestra clics por elemento y qué porcentaje
 * termina en una conversión, que es lo que permite detectar un CTA que genera
 * clicks pero no resultados.
 */
export const InteractionsList = ({ interactions }: InteractionsListProps) => {
  if (interactions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Sin interacciones registradas en este periodo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((item) => (
        <div
          key={item.kind}
          className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5 text-sm"
        >
          <span className="flex min-w-0 items-center gap-2">
            <MousePointerClick className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium text-foreground">
              {item.label}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="font-medium tabular-nums text-foreground">
              {item.clicks}
            </span>
            <span className="min-w-12 text-right font-medium tabular-nums text-muted-foreground">
              {item.conversionPct}% conv.
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};