"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import type { PresenceDailyPoint } from "@/lib/mock/presence-analytics";
import { cn } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-87.5 animate-pulse rounded-lg bg-muted/50" />,
});

type Metric = "visitors" | "views" | "interactions";

const METRICS: { id: Metric; label: string; color: string }[] = [
  { id: "visitors", label: "Visitantes", color: "#2563eb" },
  { id: "views", label: "Vistas", color: "#0d9488" },
  { id: "interactions", label: "Interacciones", color: "#f59e0b" },
];

interface TrafficChartProps {
  daily: PresenceDailyPoint[];
}

/** Serie temporal de tráfico con selector de métrica. */
export const TrafficChart = ({ daily }: TrafficChartProps) => {
  const { resolvedTheme } = useTheme();
  const [metric, setMetric] = useState<Metric>("visitors");

  const active = METRICS.find((item) => item.id === metric)!;

  const series = useMemo(
    () => [
      {
        name: active.label,
        data: daily.map((point) => point[metric]),
      },
    ],
    [daily, metric, active.label],
  );

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "inherit",
        foreColor: "var(--muted-foreground)",
        background: "transparent",
        animations: { enabled: true, speed: 550 },
        zoom: { enabled: false },
      },
      theme: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      colors: [active.color],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 95],
        },
      },
      markers: { size: 0, hover: { size: 5 } },
      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 0,
        padding: { left: 6, right: 6 },
      },
      xaxis: {
        categories: daily.map((point) => point.day),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "var(--muted-foreground)", fontSize: "12px" },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${Math.round(value)}`,
          style: { colors: ["var(--muted-foreground)"], fontSize: "12px" },
        },
      },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          const value = series[seriesIndex]?.[dataPointIndex] ?? 0;
          const day = daily[dataPointIndex]?.day ?? "";
          return `
            <div style="min-width: 150px; padding: 12px; color: var(--foreground);">
              <div style="color: ${active.color}; font-size: 13px; font-weight: 600; margin-bottom: 10px;">${day}</div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; line-height: 1;">
                <span style="width: 8px; height: 8px; flex: none; border-radius: 999px; background: ${active.color};"></span>
                <span>${active.label}:</span>
                <strong style="font-weight: 600;">${value}</strong>
              </div>
            </div>
          `;
        },
      },
    }),
    [daily, active, resolvedTheme],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">
          Tráfico en el tiempo
        </h2>
        <div className="flex gap-1.5">
          {METRICS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMetric(item.id)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                metric === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-muted/50",
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {daily.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Sin datos de tráfico en este periodo.
        </p>
      ) : (
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
      )}
    </div>
  );
};