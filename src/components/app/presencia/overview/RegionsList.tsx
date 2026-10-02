"use client";

import { Globe, TrendingDown, TrendingUp } from "lucide-react";
import type { RegionMetric } from "@/lib/mock/presence-analytics";
import { cn } from "@/lib/utils";

interface RegionsListProps {
  regions: RegionMetric[];
}

/** De dónde llegan las visitas. */
export const RegionsList = ({ regions }: RegionsListProps) => {
  const total = regions.reduce((sum, item) => sum + item.visitors, 0);
  const max = Math.max(...regions.map((item) => item.visitors), 1);

  if (regions.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Sin datos de regiones en este periodo.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {regions.map((item) => {
        const pct = total > 0 ? (item.visitors / total) * 100 : 0;
        const positive = item.deltaPct >= 0;
        const DeltaIcon = positive ? TrendingUp : TrendingDown;

        return (
          <div key={item.region} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium text-foreground">
                  {item.region}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    positive ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  <DeltaIcon className="size-3" />
                  {positive ? "+" : ""}
                  {item.deltaPct}%
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {item.visitors}
                </span>
                <span className="min-w-11 text-right font-medium tabular-nums text-muted-foreground">
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(item.visitors / max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};