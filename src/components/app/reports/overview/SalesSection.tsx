"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  CreditCard,
  PieChart,
  Truck,
} from "lucide-react";
import type { SalesSummary, ReportPeriod } from "@/lib/mock/reportes";
import { EmptyState } from "@/components/ui/empty-state";
import { ReportSection } from "./shared";
import { SalesChartSection } from "./SalesChartSection";
import {
  BreakdownDonutChart,
  CHANNEL_COLOR_MAP,
  PAYMENT_METHOD_COLOR_MAP,
  ORDER_STATUS_COLOR_MAP,
  ORDER_SERVICE_COLOR_MAP,
} from "./ChannelSalesChart";

export function SalesSection({
  summary,
  period,
  onPeriodChange,
}: {
  summary: SalesSummary;
  period?: ReportPeriod;
  onPeriodChange?: (period: ReportPeriod) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Gráfico principal: Estructura Imagen 1 + Gráfico Kalshi Imagen 2 */}
      <SalesChartSection
        summary={summary}
        period={period}
        onPeriodChange={onPeriodChange}
      />

      <div className="grid gap-4 xl:grid-cols-2 min-w-0 w-full max-w-full">
        {/* Canales */}
        <ReportSection
          title="Ventas por canal"
          subtitle="Distribución de ingresos"
        >
          {summary.byChannel.length === 0 ? (
            <EmptySection
              icon={PieChart}
              title="Sin ventas por canal"
              description="No hay registros de ventas para los canales en este período."
            />
          ) : (
            <BreakdownDonutChart
              items={summary.byChannel}
              total={summary.total}
              valueType="currency"
              totalLabel="Total canal"
              colorMap={CHANNEL_COLOR_MAP}
              emptyIcon={PieChart}
              emptyTitle="Sin ventas por canal"
              emptyDescription="No hay registros de ventas para los canales en este período."
              showCountInLabel
            />
          )}
        </ReportSection>

        {/* Método de pago */}
        <ReportSection
          title="Por método de pago"
          subtitle="Pedidos + movimientos de caja"
        >
          {summary.byMethod.length === 0 ? (
            <EmptySection
              icon={CreditCard}
              title="Sin métodos de pago"
              description="No hay cobros ni movimientos registrados en este período."
            />
          ) : (
            <BreakdownDonutChart
              items={summary.byMethod}
              total={summary.byMethod.reduce((s, x) => s + x.value, 0)}
              valueType="currency"
              totalLabel="Total método"
              colorMap={PAYMENT_METHOD_COLOR_MAP}
              emptyIcon={CreditCard}
              emptyTitle="Sin métodos de pago"
              emptyDescription="No hay cobros ni movimientos registrados en este período."
              showCountInLabel
            />
          )}
        </ReportSection>

        {/* Pedidos por estado */}
        <ReportSection
          title="Pedidos por estado"
          subtitle="Pedidos pagados del período"
        >
          {summary.byStatus.length === 0 ? (
            <EmptySection
              icon={CheckCircle2}
              title="Sin pedidos por estado"
              description="No se encontraron pedidos en este período."
            />
          ) : (
            <BreakdownDonutChart
              items={summary.byStatus}
              total={summary.byStatus.reduce((s, x) => s + x.value, 0)}
              valueType="count"
              totalLabel="Total pedidos"
              colorMap={ORDER_STATUS_COLOR_MAP}
              emptyIcon={CheckCircle2}
              emptyTitle="Sin pedidos por estado"
              emptyDescription="No se encontraron pedidos en este período."
              showCountInLabel={false}
            />
          )}
        </ReportSection>

        {/* Pedidos por tipo de servicio */}
        <ReportSection
          title="Pedidos por servicio"
          subtitle="Mesa, recojo o delivery"
        >
          {summary.byService.length === 0 ? (
            <EmptySection
              icon={Truck}
              title="Sin servicios registrados"
              description="No hay pedidos clasificados por tipo de servicio."
            />
          ) : (
            <BreakdownDonutChart
              items={summary.byService}
              total={summary.byService.reduce((s, x) => s + x.value, 0)}
              valueType="count"
              totalLabel="Total pedidos"
              colorMap={ORDER_SERVICE_COLOR_MAP}
              emptyIcon={Truck}
              emptyTitle="Sin servicios registrados"
              emptyDescription="No hay pedidos clasificados por tipo de servicio."
              showCountInLabel={false}
            />
          )}
        </ReportSection>
      </div>
    </div>
  );
}

function EmptySection({
  title = "Sin datos disponibles",
  description = "No hay registros para mostrar en este período.",
  icon = BarChart3,
}: {
  title?: string;
  description?: string;
  icon?: LucideIcon;
} = {}) {
  return (
    <div className="flex flex-1 items-center justify-center my-auto w-full h-full min-h-55">
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        className="py-6 my-auto"
      />
    </div>
  );
}
