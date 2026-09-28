"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import type { ApexOptions } from "apexcharts";
import type { LucideIcon } from "lucide-react";
import { PieChart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { BreakItem } from "@/lib/mock/reportes";
import { cn } from "@/lib/utils";
import styles from "./ChannelSalesChart.module.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex size-44 sm:size-52 items-center justify-center rounded-full bg-muted/30 animate-pulse" />
  ),
});

const PEN_FORMATTER = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-PE");

export const CHANNEL_COLOR_MAP: Record<string, string> = {
  "Punto de venta": "#2563eb", // Azul POS
  "Sitio web": "#0d9488", // Verde azulado / Web
  Marketplace: "#f43f5e", // Rosa coral / Delivery
  WhatsApp: "#10b981", // Esmeralda
  Manual: "#8b5cf6", // Violeta
};

export const PAYMENT_METHOD_COLOR_MAP: Record<string, string> = {
  Efectivo: "#10b981", // Esmeralda
  Tarjeta: "#2563eb", // Azul
  "Transferencia bancaria": "#8b5cf6", // Violeta
  Transferencia: "#8b5cf6", // Violeta
  Yape: "#9333ea", // Púrpura Yape
  Plin: "#06b6d4", // Cyan Plin
  "Billetera digital": "#06b6d4", // Cyan
  Crédito: "#f59e0b", // Ámbar
};

export const ORDER_STATUS_COLOR_MAP: Record<string, string> = {
  Entregados: "#10b981", // Esmeralda
  Listos: "#06b6d4", // Cyan
  "En preparación": "#f59e0b", // Ámbar
  Confirmados: "#2563eb", // Azul
  Nuevos: "#8b5cf6", // Violeta
  Cancelados: "#ef4444", // Rojo
};

export const ORDER_SERVICE_COLOR_MAP: Record<string, string> = {
  "Consumo en salón": "#2563eb", // Azul
  Mesa: "#2563eb", // Azul
  "Recojo en tienda": "#f59e0b", // Ámbar
  "Para llevar": "#f59e0b", // Ámbar
  "Envío a domicilio": "#10b981", // Esmeralda
  Delivery: "#10b981", // Esmeralda
};

const FALLBACK_PALETTE = [
  "#2563eb",
  "#0d9488",
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export interface BreakdownDonutChartProps {
  items?: BreakItem[];
  channels?: BreakItem[];
  total?: number;
  valueType?: "currency" | "count";
  totalLabel?: string;
  colorMap?: Record<string, string>;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  showCountInLabel?: boolean;
  countUnit?: string;
  countLabel?: string;
}

export function BreakdownDonutChart({
  items,
  channels,
  total,
  valueType = "currency",
  totalLabel = "Total",
  colorMap = CHANNEL_COLOR_MAP,
  emptyIcon: EmptyIcon = PieChart,
  emptyTitle = "Sin datos disponibles",
  emptyDescription = "No hay registros para este período.",
  showCountInLabel = valueType === "currency",
  countUnit = "ped.",
  countLabel = "Pedidos",
}: BreakdownDonutChartProps) {
  const dataList = items ?? channels ?? [];
  const { resolvedTheme } = useTheme();

  const totalAmount = useMemo(() => {
    if (typeof total === "number" && total > 0) return total;
    return dataList.reduce((sum, item) => sum + item.value, 0);
  }, [dataList, total]);

  const colors = useMemo(() => {
    return dataList.map(
      (c, idx) =>
        colorMap[c.label] ?? FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length],
    );
  }, [dataList, colorMap]);

  const series = useMemo(() => dataList.map((c) => c.value), [dataList]);

  const formatValue = (val: number) =>
    valueType === "currency"
      ? PEN_FORMATTER.format(val)
      : `${NUMBER_FORMATTER.format(val)} ${countUnit}`;

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
        background: "transparent",
        animations: {
          enabled: true,
          speed: 550,
          dynamicAnimation: {
            enabled: true,
            speed: 300,
          },
        },
      },
      colors,
      labels: dataList.map((c) => c.label),
      stroke: {
        show: true,
        width: 2,
        colors: ["var(--card)"],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false, // La leyenda personalizada muestra todos los datos con detalle
      },
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
                fontWeight: 500,
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
                formatter: (val) => formatValue(Number(val)),
              },
              total: {
                show: true,
                showAlways: true,
                label: totalLabel,
                fontSize: "11px",
                fontFamily: "inherit",
                fontWeight: 500,
                color: "var(--muted-foreground)",
                formatter: () => formatValue(totalAmount),
              },
            },
          },
          expandOnClick: true,
        },
      },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        custom: ({ seriesIndex }) => {
          const item = dataList[seriesIndex];
          if (!item) return "";
          const color = colors[seriesIndex];
          const pct =
            totalAmount > 0
              ? ((item.value / totalAmount) * 100).toFixed(1)
              : "0";

          return `
            <div style="min-width: 175px; padding: 10px 12px; font-family: inherit;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 8px;">
                <span style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--foreground);">
                  <span style="width: 8px; height: 8px; border-radius: 9999px; background: ${color};"></span>
                  ${item.label}
                </span>
                <span style="font-size: 11px; font-weight: 700; color: var(--primary);">${pct}%</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                  <span style="color: var(--muted-foreground);">${valueType === "currency" ? `${totalLabel}:` : `${countLabel}:`}</span>
                  <span style="font-weight: 600; color: var(--foreground);">${formatValue(item.value)}</span>
                </div>
                ${
                  valueType === "currency" && typeof item.count === "number"
                    ? `<div style="display: flex; justify-content: space-between; gap: 8px;">
                        <span style="color: var(--muted-foreground);">${countLabel}:</span>
                        <span style="font-weight: 500; color: var(--foreground);">${item.count} ${countUnit}</span>
                      </div>`
                    : ""
                }
              </div>
            </div>
          `;
        },
      },
    }),
    [dataList, colors, resolvedTheme, totalAmount, valueType, totalLabel, countLabel, countUnit],
  );

  if (dataList.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center my-auto w-full h-full min-h-55">
        <EmptyState
          icon={EmptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          className="py-6 my-auto"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", styles.chart)}>
      {/* Gráfico circular (Donut) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="donut"
          width={210}
          height={210}
        />
      </div>

      {/* Leyenda con todos los datos detallados */}
      <div className="flex-1 w-full space-y-5">
        {dataList.map((item, index) => {
          const color = colors[index];
          const pct =
            totalAmount > 0
              ? ((item.value / totalAmount) * 100).toFixed(1)
              : "0";

          return (
            <div key={item.label} className="group flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-2 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate font-medium text-foreground">
                    {item.label}
                  </span>
                  {showCountInLabel && typeof item.count === "number" && (
                    <span className="shrink-0 font-medium">
                      - {item.count} {countUnit}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="font-medium tabular-nums text-foreground">
                    {formatValue(item.value)}
                  </span>
                  <span className="font-medium tabular-nums text-muted-foreground min-w-9 text-right">
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Barra de proporción sutil */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChannelSalesChart = BreakdownDonutChart;
