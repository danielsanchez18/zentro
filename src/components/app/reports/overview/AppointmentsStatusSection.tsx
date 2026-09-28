"use client";

import { useMemo } from "react";
import { Calendar } from "lucide-react";
import type { BreakItem } from "@/lib/mock/reportes";
import { cn } from "@/lib/utils";
import { ReportSection } from "./shared";
import { BreakdownDonutChart } from "./ChannelSalesChart";

export interface AppointmentStatusItem {
  status: string;
  count: number;
  revenue: number;
}

interface AppointmentsStatusSectionProps {
  appointments: AppointmentStatusItem[];
  className?: string;
}

export const APPOINTMENT_STATUS_COLOR_MAP: Record<string, string> = {
  Completadas: "#10b981", // Verde esmeralda
  Confirmadas: "#2563eb", // Azul
  "En curso": "#06b6d4", // Cyan
  Pendientes: "#f59e0b", // Ámbar
  Canceladas: "#ef4444", // Rojo
  "No asistieron": "#64748b", // Gris pizarra
};

export function AppointmentsStatusSection({
  appointments,
  className,
}: AppointmentsStatusSectionProps) {
  const appointmentItems: BreakItem[] = useMemo(
    () =>
      appointments.map((item) => ({
        label: item.status,
        value: item.count,
        count: item.count,
      })),
    [appointments],
  );

  const totalAppointments = useMemo(
    () => appointments.reduce((sum, item) => sum + item.count, 0),
    [appointments],
  );

  return (
    <ReportSection
      title="Citas por estado"
      className={cn("h-fit", className)}
      subtitle={`${totalAppointments} citas en el período`}
    >
      <BreakdownDonutChart
        items={appointmentItems}
        total={totalAppointments}
        valueType="count"
        totalLabel="Total citas"
        countUnit="citas"
        countLabel="Citas"
        colorMap={APPOINTMENT_STATUS_COLOR_MAP}
        emptyIcon={Calendar}
        emptyTitle="Sin citas en este período"
        emptyDescription="No hay citas registradas en la agenda para este período."
      />
    </ReportSection>
  );
}
