"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import {
  Activity,
  CalendarDays,
  Check,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { SalesSummary, ReportPeriod } from "@/lib/mock/reportes";
import { reportPeriods, reportPeriodLabel } from "@/lib/mock/reportes";
import styles from "./SalesChartSection.module.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full animate-pulse rounded-lg bg-muted/40" />
  ),
});

type Metric = "sales" | "orders";

interface SalesChartSectionProps {
  summary: SalesSummary;
  period?: ReportPeriod;
  onPeriodChange?: (period: ReportPeriod) => void;
}

const PEN_FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-PE");

// Colores fieles a la estética Kalshi (Imagen 2)
const SERIES_COLORS = {
  pos: "#2563eb", // Azul intenso (Tienda POS)
  web: "#64748b", // Gris pizarra (En línea Web)
  delivery: "#f43f5e", // Rojo / Coral (Delivery / Marketplace)
} as const;

const CURVE_VIEWS = [
  { id: "stepline" as const, label: "Trazo escalonado", icon: Activity },
  { id: "smooth" as const, label: "Trazo suave", icon: TrendingUp },
] as const;

export function SalesChartSection({
  summary,
  period = "30d",
  onPeriodChange,
}: SalesChartSectionProps) {
  const { resolvedTheme } = useTheme();
  const [activeMetric, setActiveMetric] = useState<Metric>("sales");
  const [animatedValue, setAnimatedValue] = useState(0);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [curveType, setCurveType] = useState<"stepline" | "smooth">("stepline");

  // Adaptación de serie temporal según el período ("Hoy", "7d", "30d", etc.)
  // Evita que "Hoy" tenga 1 solo punto o que el gráfico se rompa en móvil.
  const chartData = useMemo(() => {
    // 1. Caso: HOY -> Desglose intradía por bloques horarios
    if (period === "hoy") {
      const hours = [
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
      ];
      // Si hay ventas totales hoy, las distribuimos; si está en 0 (mock), usamos proyección realista del día
      const totalAmount = summary.total > 0 ? summary.total : 4850;
      const totalOrdersCount = summary.count > 0 ? summary.count : 42;

      const hourlyWeights = [0.06, 0.11, 0.19, 0.14, 0.12, 0.18, 0.13, 0.07];

      const posData: number[] = [];
      const webData: number[] = [];
      const deliveryData: number[] = [];

      hours.forEach((_, idx) => {
        const weight = hourlyWeights[idx] ?? 0.1;
        const slotTotal =
          activeMetric === "sales"
            ? totalAmount * weight
            : Math.max(1, Math.round(totalOrdersCount * weight));

        posData.push(
          Math.round(slotTotal * 0.58 * (activeMetric === "sales" ? 100 : 1)) /
            (activeMetric === "sales" ? 100 : 1),
        );
        webData.push(
          Math.round(slotTotal * 0.28 * (activeMetric === "sales" ? 100 : 1)) /
            (activeMetric === "sales" ? 100 : 1),
        );
        deliveryData.push(
          Math.round(slotTotal * 0.14 * (activeMetric === "sales" ? 100 : 1)) /
            (activeMetric === "sales" ? 100 : 1),
        );
      });

      return {
        categories: hours,
        posData,
        webData,
        deliveryData,
        isHourly: true,
      };
    }

    // 2. Caso: ÚLTIMOS 7 DÍAS
    if (period === "7d") {
      let days = summary.byDay;
      // Si el mock de los últimos 7 días está vacío (fechas fijas), aseguramos 7 días consistentes
      const allZeros = days.length === 0 || days.every((d) => d.total === 0);
      if (allZeros) {
        const sampleDays = [
          "18 Sep",
          "19 Sep",
          "20 Sep",
          "21 Sep",
          "22 Sep",
          "23 Sep",
          "24 Sep",
        ];
        const sampleTotals = [1250, 1980, 2450, 2100, 3420, 2890, 3150];
        const sampleOrders = [12, 18, 22, 19, 31, 26, 28];

        days = sampleDays.map((label, i) => ({
          label,
          total: sampleTotals[i] ?? 1000,
          orders: sampleOrders[i] ?? 10,
        }));
      }

      const categories = days.map((d) => d.label);
      const posData = days.map(
        (d) =>
          Math.round(
            (activeMetric === "sales" ? d.total : d.orders) *
              0.57 *
              (activeMetric === "sales" ? 100 : 1),
          ) / (activeMetric === "sales" ? 100 : 1),
      );
      const webData = days.map(
        (d) =>
          Math.round(
            (activeMetric === "sales" ? d.total : d.orders) *
              0.29 *
              (activeMetric === "sales" ? 100 : 1),
          ) / (activeMetric === "sales" ? 100 : 1),
      );
      const deliveryData = days.map(
        (d) =>
          Math.round(
            (activeMetric === "sales" ? d.total : d.orders) *
              0.14 *
              (activeMetric === "sales" ? 100 : 1),
          ) / (activeMetric === "sales" ? 100 : 1),
      );

      return {
        categories,
        posData,
        webData,
        deliveryData,
        isHourly: false,
      };
    }

    // 3. Caso: 30D, 90D, TODO
    let days = summary.byDay;
    if (days.length === 0 || days.every((d) => d.total === 0)) {
      // Fallback seguro con progresión histórica si el store estuviese vacío
      const baseDays = Array.from({ length: 15 }, (_, i) => ({
        label: `${10 + i} Sep`,
        total: 1400 + Math.sin(i) * 600 + i * 80,
        orders: 14 + Math.round(Math.sin(i) * 6) + i,
      }));
      days = baseDays;
    }

    const categories = days.map((d) => d.label);
    const posData = days.map(
      (d) =>
        Math.round(
          (activeMetric === "sales" ? d.total : d.orders) *
            0.56 *
            (activeMetric === "sales" ? 100 : 1),
        ) / (activeMetric === "sales" ? 100 : 1),
    );
    const webData = days.map(
      (d) =>
        Math.round(
          (activeMetric === "sales" ? d.total : d.orders) *
            0.3 *
            (activeMetric === "sales" ? 100 : 1),
        ) / (activeMetric === "sales" ? 100 : 1),
    );
    const deliveryData = days.map(
      (d) =>
        Math.round(
          (activeMetric === "sales" ? d.total : d.orders) *
            0.14 *
            (activeMetric === "sales" ? 100 : 1),
        ) / (activeMetric === "sales" ? 100 : 1),
    );

    return {
      categories,
      posData,
      webData,
      deliveryData,
      isHourly: false,
    };
  }, [period, summary.byDay, summary.total, summary.count, activeMetric]);

  // Totales de la serie para el header / leyenda estilo Kalshi
  const totals = useMemo(() => {
    const sumPos = chartData.posData.reduce((acc, v) => acc + v, 0);
    const sumWeb = chartData.webData.reduce((acc, v) => acc + v, 0);
    const sumDel = chartData.deliveryData.reduce((acc, v) => acc + v, 0);
    const totalAll = Math.max(1, sumPos + sumWeb + sumDel);

    return {
      pos: {
        value: sumPos,
        pct: Math.round((sumPos / totalAll) * 1000) / 10,
      },
      web: {
        value: sumWeb,
        pct: Math.round((sumWeb / totalAll) * 1000) / 10,
      },
      delivery: {
        value: sumDel,
        pct: Math.round((sumDel / totalAll) * 1000) / 10,
      },
      total: totalAll,
    };
  }, [chartData]);

  // Configuración de métricas para el panel derecho (Estructura Imagen 1)
  const metrics = useMemo(() => {
    const totalSales = totals.total;
    const totalOrders =
      activeMetric === "orders" ? totals.total : summary.count || 42;
    const targetSales = Math.max(totalSales * 1.35, 10000);
    const targetOrders = Math.max(totalOrders * 1.3, 50);

    return {
      sales: {
        label: "Ventas",
        value: totalSales,
        max: targetSales,
        description: `Ingresos generados por canales físicos y digitales durante ${
          reportPeriodLabel[period]?.toLowerCase() ?? "el período"
        }.`,
      },
      orders: {
        label: "Pedidos",
        value: totalOrders,
        max: targetOrders,
        description: `Volumen de pedidos completados a través de todos los puntos de atención del negocio.`,
      },
    };
  }, [totals.total, activeMetric, summary.count, period]);

  const selectedMetric = metrics[activeMetric];

  // Animación del número principal en el aside
  useEffect(() => {
    const duration = 500;
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

  // Encontrar el día pico para los highlights
  const peakInfo = useMemo(() => {
    let maxIdx = 0;
    let maxVal = -1;
    chartData.categories.forEach((_, idx) => {
      const sum =
        (chartData.posData[idx] ?? 0) +
        (chartData.webData[idx] ?? 0) +
        (chartData.deliveryData[idx] ?? 0);
      if (sum > maxVal) {
        maxVal = sum;
        maxIdx = idx;
      }
    });

    const label = chartData.categories[maxIdx] ?? "N/A";
    const formatted =
      activeMetric === "sales"
        ? PEN_FORMATTER.format(maxVal)
        : `${Math.round(maxVal)} pedidos`;

    return { label, value: formatted };
  }, [chartData, activeMetric]);

  // Cálculo inteligente de cantidad de etiquetas visibles según pantalla y cantidad de datos
  // Garantiza que en 90 días no se amontonen las fechas y que en "Hoy" (horas) se vean equilibradas
  const defaultTickAmount = useMemo(() => {
    const count = chartData.categories.length;
    if (count <= 8) return count; // Horas (8) o 7 días (7): se muestran todas en desktop
    if (count <= 16) return 8;
    if (count <= 31) return 10;
    return 12; // 90 días: máximo 12 fechas bien espaciadas en desktop
  }, [chartData.categories.length]);

  // Configuración de ApexCharts adaptada a la estética Kalshi (Imagen 2)
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
        fontFamily: "inherit",
        foreColor: "var(--muted-foreground)",
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 450,
          dynamicAnimation: { enabled: true, speed: 300 },
        },
      },
      theme: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      colors: [SERIES_COLORS.pos, SERIES_COLORS.web, SERIES_COLORS.delivery],
      stroke: {
        curve: curveType,
        width: [2.5, 2.5, 2.5],
      },
      dataLabels: { enabled: false },
      markers: {
        size: 0,
        hover: {
          size: 5,
          sizeOffset: 2,
        },
      },
      grid: {
        borderColor: "var(--border)",
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 10, right: 12, bottom: 0, left: 10 },
      },
      xaxis: {
        categories: chartData.categories,
        tickAmount: defaultTickAmount,
        tickPlacement: "between",
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          show: true,
          width: 1,
          stroke: {
            color: "var(--muted-foreground)",
            width: 1,
            dashArray: 0,
          },
        },
        labels: {
          rotate: 0,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          style: {
            colors: "var(--muted-foreground)",
            fontSize: "11px",
            fontWeight: 500,
          },
        },
        tooltip: {
          enabled: true,
          formatter: (val) =>
            chartData.isHourly ? `Hoy ${val}` : `${val}, 2026`,
        },
      },
      yaxis: {
        opposite: false,
        labels: {
          formatter: (value) => {
            if (activeMetric === "sales") {
              if (value >= 1000) return `S/ ${(value / 1000).toFixed(1)}k`;
              return `S/ ${Math.round(value)}`;
            }
            return `${Math.round(value)}`;
          },
          style: {
            colors: ["var(--muted-foreground)"],
            fontSize: "11px",
          },
        },
      },
      legend: { show: false },
      tooltip: {
        shared: true,
        intersect: false,
        theme: resolvedTheme === "dark" ? "dark" : "light",
        custom: ({ series, dataPointIndex, w }) => {
          const cat = w.globals.categoryLabels?.[dataPointIndex] ?? "";
          const posVal = series[0]?.[dataPointIndex] ?? 0;
          const webVal = series[1]?.[dataPointIndex] ?? 0;
          const delVal = series[2]?.[dataPointIndex] ?? 0;
          const totalSlot = posVal + webVal + delVal;

          const formatVal = (v: number) =>
            activeMetric === "sales"
              ? PEN_FORMATTER.format(v)
              : `${Math.round(v)} ped.`;

          const posPct =
            totalSlot > 0 ? Math.round((posVal / totalSlot) * 100) : 0;
          const webPct =
            totalSlot > 0 ? Math.round((webVal / totalSlot) * 100) : 0;
          const delPct =
            totalSlot > 0 ? Math.round((delVal / totalSlot) * 100) : 0;

          return `
            <div style="min-width: 190px; padding: 10px 12px; font-family: inherit;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 8px;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--foreground);">${cat}</span>
                <span style="font-size: 11px; font-weight: 600; color: var(--primary);">${formatVal(totalSlot)}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <span style="display: flex; align-items: center; gap: 6px; color: var(--muted-foreground);">
                    <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${SERIES_COLORS.pos};"></span>
                    Tienda POS
                  </span>
                  <span style="font-weight: 600; color: var(--foreground);">${formatVal(posVal)} <span style="font-size: 10px; color: var(--muted-foreground);">(${posPct}%)</span></span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <span style="display: flex; align-items: center; gap: 6px; color: var(--muted-foreground);">
                    <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${SERIES_COLORS.web};"></span>
                    En línea Web
                  </span>
                  <span style="font-weight: 600; color: var(--foreground);">${formatVal(webVal)} <span style="font-size: 10px; color: var(--muted-foreground);">(${webPct}%)</span></span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <span style="display: flex; align-items: center; gap: 6px; color: var(--muted-foreground);">
                    <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${SERIES_COLORS.delivery};"></span>
                    Delivery
                  </span>
                  <span style="font-weight: 600; color: var(--foreground);">${formatVal(delVal)} <span style="font-size: 10px; color: var(--muted-foreground);">(${delPct}%)</span></span>
                </div>
              </div>
            </div>
          `;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { height: 260 },
            xaxis: {
              tickAmount: Math.min(4, chartData.categories.length),
              labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { fontSize: "10px" },
              },
            },
            yaxis: {
              labels: {
                formatter: (val: number) => {
                  if (activeMetric === "sales") {
                    return `${Math.round(val / 1000)}k`;
                  }
                  return `${Math.round(val)}`;
                },
              },
            },
          },
        },
        {
          breakpoint: 640,
          options: {
            chart: { height: 270 },
            xaxis: {
              tickAmount: Math.min(5, chartData.categories.length),
              labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { fontSize: "10px" },
              },
            },
            yaxis: {
              labels: {
                formatter: (val: number) => {
                  if (activeMetric === "sales") {
                    return `${Math.round(val / 1000)}k`;
                  }
                  return `${Math.round(val)}`;
                },
              },
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 290 },
            xaxis: {
              tickAmount: Math.min(6, chartData.categories.length),
              labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { fontSize: "11px" },
              },
            },
          },
        },
        {
          breakpoint: 1024,
          options: {
            chart: { height: 320 },
            xaxis: {
              tickAmount: Math.min(8, chartData.categories.length),
              labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { fontSize: "11px" },
              },
            },
          },
        },
        {
          breakpoint: 1440,
          options: {
            chart: { height: 340 },
            xaxis: {
              tickAmount: Math.min(10, chartData.categories.length),
              labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { fontSize: "11px" },
              },
            },
          },
        },
      ],
    }),
    [
      resolvedTheme,
      curveType,
      chartData.categories,
      chartData.isHourly,
      activeMetric,
      defaultTickAmount,
    ],
  );

  const series = useMemo(
    () => [
      { name: "Tienda (POS)", data: chartData.posData },
      { name: "En línea (Web)", data: chartData.webData },
      { name: "Delivery / Otros", data: chartData.deliveryData },
    ],
    [chartData.posData, chartData.webData, chartData.deliveryData],
  );

  const progress = Math.min(
    (selectedMetric.value / selectedMetric.max) * 100,
    100,
  );

  const displayedValue =
    activeMetric === "sales"
      ? PEN_FORMATTER.format(animatedValue)
      : NUMBER_FORMATTER.format(Math.round(animatedValue));

  const formatSummaryVal = (v: number) =>
    activeMetric === "sales"
      ? PEN_FORMATTER.format(v)
      : NUMBER_FORMATTER.format(Math.round(v));

  return (
    <section className="overflow-hidden rounded-xl border bg-card text-card-foreground font-heading">
      {/* Header del Card (Estructura Imagen 1 con selector de periodo) */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Ventas y pedidos
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de vista / trazo estilo List */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {CURVE_VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCurveType(id)}
                aria-label={label}
                aria-pressed={curveType === id}
                title={label}
                className={cn(
                  "cursor-pointer rounded-md p-1.5 transition-colors",
                  curveType === id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Grid Principal: Izquierda Gráfico / Derecha Panel Métricas */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Columna Izquierda: Gráfico con Leyenda abajo */}
        <div className="min-w-0 p-4 px-2 pt-0 sm:pt-0 flex flex-col justify-between">
          {/* Gráfico ApexCharts */}
          <div className={`${styles.chart} min-w-0`}>
            <ReactApexChart
              key={`${resolvedTheme}-${period}-${activeMetric}-${curveType}`}
              type="line"
              height={340}
              options={chartOptions}
              series={series}
            />
          </div>

          {/* Leyenda Inferior (abajo de los charts) */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 pt-5 pb-2 border-t border-border/40 text-xs xl:text-sm">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0"
                  style={{ backgroundColor: SERIES_COLORS.pos }}
                />
                <span className="font-medium text-foreground">Tienda</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {totals.pos.pct}%
                </span>
                <span className="hidden sm:inline text-muted-foreground text-xs xl:text-sm">
                  ({formatSummaryVal(totals.pos.value)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0"
                  style={{ backgroundColor: SERIES_COLORS.web }}
                />
                <span className="font-medium text-foreground">En línea</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {totals.web.pct}%
                </span>
                <span className="hidden sm:inline text-muted-foreground text-xs xl:text-sm">
                  ({formatSummaryVal(totals.web.value)})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0"
                  style={{ backgroundColor: SERIES_COLORS.delivery }}
                />
                <span className="font-medium text-foreground">Delivery</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {totals.delivery.pct}%
                </span>
                <span className="hidden sm:inline text-muted-foreground text-xs xl:text-sm">
                  ({formatSummaryVal(totals.delivery.value)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de métricas y pestañas (Imagen 1) */}
        <aside className="border-t p-5 xl:border-l xl:border-t-0 flex flex-col justify-between bg-card/50">
          <div>
            {/* Pestañas Ventas / Pedidos */}
            <div
              className="flex gap-5 border-b border-border"
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
                  className={`relative pb-2 text-sm font-medium transition-colors cursor-pointer ${
                    activeMetric === metric
                      ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {metrics[metric].label}
                </button>
              ))}
            </div>

            {/* Gran valor animado */}
            <div className="pt-5">
              <p className="text-2xl font-semibold tabular-nums text-foreground sm:text-2xl">
                {displayedValue}
              </p>

              {/* Barra de progreso con marcador / knob (Imagen 1) */}
              <div className="mt-3">
                <div className="relative h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                  <span
                    className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-sm"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground font-mono">
                  <span>0</span>
                  <span>
                    {activeMetric === "sales"
                      ? PEN_FORMATTER.format(selectedMetric.max)
                      : NUMBER_FORMATTER.format(selectedMetric.max)}
                  </span>
                </div>
              </div>

              {/* Descripción contextual */}
              <p className="mt-4 text-xs text-muted-foreground">
                {selectedMetric.description}
              </p>
            </div>
          </div>

          {/* Tarjetas de destacados / Highlights (Estilo Imagen 1) */}
          <div className="mt-5 space-y-2 border-t pt-5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Día pico:</span>{" "}
                <span className="text-muted-foreground">{peakInfo.label}</span>
              </div>
              <span className="font-medium text-foreground tabular-nums">
                {peakInfo.value}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Canal líder:
                </span>{" "}
                <span className="text-muted-foreground">Tienda física</span>
              </div>
              <span className="font-medium text-foreground tabular-nums">
                {totals.pos.pct}%
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Promedio:</span>{" "}
                <span className="text-muted-foreground">por punto</span>
              </div>
              <span className="font-medium text-foreground tabular-nums">
                {formatSummaryVal(
                  totals.total / Math.max(1, chartData.categories.length),
                )}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
