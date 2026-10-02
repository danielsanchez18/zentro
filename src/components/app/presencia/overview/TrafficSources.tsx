"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import {
  TRAFFIC_SOURCE_LABELS,
  type TrafficSource,
} from "@/lib/mock/presence-analytics";
import { cn } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex size-44 items-center justify-center rounded-full bg-muted/30 animate-pulse" />
  ),
});

/** Colores coherentes con los charts de Reportes. */
const SOURCE_COLORS: Record<TrafficSource, string> = {
  buscador: "#2563eb",
  directo: "#0d9488",
  social: "#f43f5e",
  enlace: "#f59e0b",
};

const FALLBACK = ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981"];

interface TrafficSourcesProps {
  sources: { source: TrafficSource; visitors: number }[];
}

/**
 * Origen del tráfico. Es el corte que responde "¿de dónde viene la gente?", la
 * pregunta que decide si el sitio se promociona o se posiciona en buscadores.
 */
export const TrafficSources = ({ sources }: TrafficSourcesProps) => {
  const { resolvedTheme } = useTheme();

  const total = useMemo(
    () => sources.reduce((sum, item) => sum + item.visitors, 0),
    [sources],
  );

  const colors = useMemo(
    () =>
      sources.map(
        (item, index) =>
          SOURCE_COLORS[item.source] ?? FALLBACK[index % FALLBACK.length],
      ),
    [sources],
  );

  const series = useMemo(
    () => sources.map((item) => item.visitors),
    [sources],
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent",
        animations: { enabled: true, speed: 550 },
      },
      colors,
      labels: sources.map((item) => TRAFFIC_SOURCE_LABELS[item.source]),
      stroke: { show: true, width: 2, colors: ["var(--card)"] },
      dataLabels: { enabled: false },
      legend: { show: false },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "11px",
                fontFamily: "inherit",
                color: "var(--muted-foreground)",
                offsetY: -4,
              },
              value: {
                show: true,
                fontSize: "15px",
                fontFamily: "inherit",
                fontWeight: 600,
                color: "var(--foreground)",
                offsetY: 4,
                formatter: (val) => `${Math.round(Number(val))}`,
              },
              total: {
                show: true,
                showAlways: true,
                label: "Visitantes",
                fontSize: "11px",
                fontFamily: "inherit",
                color: "var(--muted-foreground)",
                formatter: () => `${total}`,
              },
            },
          },
          expandOnClick: true,
        },
      },
      tooltip: { theme: resolvedTheme === "dark" ? "dark" : "light" },
    }),
    [sources, colors, total, resolvedTheme],
  );

  if (sources.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Sin datos de origen en este periodo.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width={200}
        height={200}
      />

      <div className="w-full space-y-4">
        {sources.map((item, index) => {
          const pct = total > 0 ? (item.visitors / total) * 100 : 0;
          return (
            <div key={item.source} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="truncate font-medium text-foreground">
                    {TRAFFIC_SOURCE_LABELS[item.source]}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className="font-medium tabular-nums text-foreground">
                    {item.visitors}
                  </span>
                  <span className="min-w-9 text-right font-medium tabular-nums text-muted-foreground">
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: colors[index] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};