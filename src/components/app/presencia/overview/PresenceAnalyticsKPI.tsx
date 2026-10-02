"use client";

import {
  Activity,
  Eye,
  MousePointerClick,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PresenceAnalytics } from "@/lib/mock/presence-analytics";

interface PresenceAnalyticsKPIProps {
  analytics: PresenceAnalytics;
}

/**
 * KPIs de analítica del sitio. Cada uno muestra su variación contra el periodo
 * anterior: es el dato que permite saber si el sitio está mejorando, no solo
 * cuánto acumula.
 */
export const PresenceAnalyticsKPI = ({
  analytics,
}: PresenceAnalyticsKPIProps) => {
  const stats = [
    {
      title: "Visitantes",
      value: analytics.visitors,
      delta: analytics.visitorsDeltaPct,
      icon: Users,
    },
    {
      title: "Vistas",
      value: analytics.views,
      delta: analytics.viewsDeltaPct,
      icon: Eye,
    },
    {
      title: "Interacciones",
      value: analytics.interactions,
      delta: analytics.interactionsDeltaPct,
      hint: `${analytics.interactionRate}% de las vistas`,
      icon: MousePointerClick,
    },
    {
      title: "Tiempo promedio",
      // El resto de KPIs son conteos; este se muestra en minutos y segundos.
      value: formatDuration(analytics.avgSessionSeconds),
      raw: analytics.avgSessionSeconds,
      icon: Timer,
      hint: `${analytics.bounceRate}% de rebote`,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="border border-border bg-card rounded-xl px-5 py-4 font-heading"
        >
          <div className="space-y-2">
            <div className="flex justify-between text-primary/70 items-center">
              <p className="text-sm">{item.title}</p>
              <item.icon className="size-4.5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-xl">{item.value}</p>
              <div className="flex items-center gap-2">
                {"delta" in item && item.delta !== undefined && (
                  <DeltaBadge value={item.delta} />
                )}
                {item.hint && (
                  <span className="text-xs text-primary/70">{item.hint}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DeltaBadge = ({ value }: { value: number }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
        positive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-600 dark:text-red-400",
      )}
    >
      <Icon className="size-3" />
      {positive ? "+" : ""}
      {value}%
    </span>
  );
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
};