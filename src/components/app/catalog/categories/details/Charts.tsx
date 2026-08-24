"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import { Button } from "@/components/ui/button";
import styles from "./Charts.module.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-87.5 animate-pulse rounded-lg bg-muted/50" />
  ),
});

type Metric = "orders" | "sales";

interface ChartsProps {
  productCount: number;
  categoryName?: string;
}

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MONTHLY_SALES = [
  23000, 45000, 55000, 57000, 56000, 61000, 58000, 63000, 60000, 66000,
  34000, 79000,
];

const PEN_FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-PE");

// Personaliza aquí la apariencia del gráfico y de su tooltip.
const CHART_UI = {
  barColor: "var(--chart-3)",
  hoverColor: "var(--muted)",
  tooltipText: "var(--foreground)",
  tooltipTitle: "var(--primary)",
  tooltipGap: "8px",
} as const;

export function Charts({ productCount, categoryName }: ChartsProps) {
  const { resolvedTheme } = useTheme();
  const [activeMetric, setActiveMetric] = useState<Metric>("orders");
  const [animatedValue, setAnimatedValue] = useState(0);

  const metrics = useMemo(
    () => ({
      orders: {
        label: "Pedidos",
        value: 3526 + productCount * 12,
        max: 5000,
        description: `Pedidos realizados con productos de ${
          categoryName ?? "esta categoría"
        } durante el periodo seleccionado.`,
      },
      sales: {
        label: "Ventas",
        value: 22639.6 + productCount * 85,
        max: 50000,
        description: `Ingresos generados por los productos de ${
          categoryName ?? "esta categoría"
        } durante el periodo seleccionado.`,
      },
    }),
    [categoryName, productCount],
  );

  const selectedMetric = metrics[activeMetric];

  useEffect(() => {
    const duration = 650;
    const startedAt = performance.now();
    let animationFrame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(selectedMetric.value * easedProgress);

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [selectedMetric.value]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        foreColor: "var(--muted-foreground)",
        background: "transparent",
        animations: { enabled: true, speed: 550 },
      },
      theme: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      colors: [CHART_UI.barColor],
      plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          columnWidth: "45%",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      fill: { opacity: 0.8 },
      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 0,
        padding: { left: 6, right: 6 },
      },
      xaxis: {
        categories: MONTHS,
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          show: true,
          position: "back",
          width: "barWidth",
          stroke: { width: 0 },
          fill: {
            type: "solid",
            color: CHART_UI.hoverColor,
            opacity: 0.55,
          },
          dropShadow: { enabled: false },
        },
        labels: {
          style: { colors: "var(--muted-foreground)", fontSize: "12px" },
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${Math.round(value / 1000)}k`,
          style: {
            colors: ["var(--muted-foreground)"],
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        custom: ({ series, seriesIndex, dataPointIndex }) => {
          const month = MONTHS[dataPointIndex] ?? "";
          const value = series[seriesIndex]?.[dataPointIndex] ?? 0;

          return `
            <div style="min-width: 170px; padding: 12px; color: ${CHART_UI.tooltipText};">
              <div style="color: ${CHART_UI.tooltipTitle}; font-size: 13px; font-weight: 600; margin-bottom: 10px;">${month}</div>
              <div style="display: flex; align-items: center; gap: ${CHART_UI.tooltipGap}; font-size: 13px; line-height: 1;">
                <span style="width: 8px; height: 8px; flex: none; border-radius: 999px; background: ${CHART_UI.barColor};"></span>
                <span>Ventas:</span>
                <strong style="font-weight: 600;">${PEN_FORMATTER.format(value)}</strong>
              </div>
            </div>
          `;
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: { plotOptions: { bar: { columnWidth: "72%" } } },
        },
      ],
    }),
    [resolvedTheme],
  );

  const progress = Math.min(
    (selectedMetric.value / selectedMetric.max) * 100,
    100,
  );

  const displayedValue =
    activeMetric === "sales"
      ? PEN_FORMATTER.format(animatedValue)
      : NUMBER_FORMATTER.format(Math.round(animatedValue));

  return (
    <section className="overflow-hidden rounded-xl border bg-card text-card-foreground">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-base font-medium">
            {selectedMetric.label}
          </h2>
        </div>

        <Button
          variant="outline"
          className="rounded-full px-3 text-xs"
          aria-label="Cambiar periodo de estadísticas"
        >
          25 Jul - 25 Ago
        </Button>
      </header>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className={`${styles.chart} min-w-0 px-1 pb-1 pt-4`}>
          <ReactApexChart
            key={resolvedTheme}
            type="bar"
            height={350}
            options={chartOptions}
            series={[{ name: "Ventas", data: MONTHLY_SALES }]}
          />
        </div>

        <aside className="border-t p-5 xl:border-l xl:border-t-0">
          <div
            className="flex border-b"
            role="tablist"
            aria-label="Métrica de rendimiento"
          >
            {(Object.keys(metrics) as Metric[]).map((metric) => (
              <button
                key={metric}
                type="button"
                role="tab"
                aria-selected={activeMetric === metric}
                onClick={() => setActiveMetric(metric)}
                className={`relative px-3 pb-3 text-sm font-medium transition-colors first:pl-0 ${
                  activeMetric === metric
                    ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary first:after:left-0"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {metrics[metric].label}
              </button>
            ))}
          </div>

          <div className="pt-5">
            <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {displayedValue}
            </p>

            <div className="mt-5">
              <div className="relative h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>
                  {activeMetric === "sales"
                    ? PEN_FORMATTER.format(selectedMetric.max)
                    : NUMBER_FORMATTER.format(selectedMetric.max)}
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {selectedMetric.description}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
