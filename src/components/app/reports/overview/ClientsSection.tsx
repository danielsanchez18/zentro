"use client";

import { TopClientsSection, type ClientTopItem } from "./TopClientsSection";
import {
  AppointmentsStatusSection,
  type AppointmentStatusItem,
  APPOINTMENT_STATUS_COLOR_MAP,
} from "./AppointmentsStatusSection";
import { NewClientsSection, type NewClientItem } from "./NewClientsSection";

export type { ClientTopItem, NewClientItem, AppointmentStatusItem };
export {
  TopClientsSection,
  AppointmentsStatusSection,
  NewClientsSection,
  APPOINTMENT_STATUS_COLOR_MAP,
};

interface ClientsSectionProps {
  top: ClientTopItem[];
  newCount: number;
  newClients: NewClientItem[];
  appointments: AppointmentStatusItem[];
}

export function ClientsSection({
  top,
  newCount,
  newClients,
  appointments,
}: ClientsSectionProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2 items-start min-w-0 w-full max-w-full">
      {/* 1. Top clientes */}
      <TopClientsSection top={top} newCount={newCount} />

      {/* Columna derecha: Citas por estado y Clientes nuevos */}
      <div className="flex flex-col gap-4 min-w-0 w-full max-w-full">
        {/* 2. Citas por estado */}
        <AppointmentsStatusSection appointments={appointments} />

        {/* 3. Clientes nuevos */}
        <NewClientsSection newClients={newClients} />
      </div>
    </div>
  );
}
