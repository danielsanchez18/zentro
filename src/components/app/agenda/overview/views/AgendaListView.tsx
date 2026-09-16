"use client";

import { CalendarX2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { Appointment, AppointmentStatus } from "@/lib/mock/agenda";
import { AppointmentCard } from "../AppointmentCard";

interface AgendaListViewProps {
  appointments: Appointment[];
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}

export function AgendaListView({
  appointments,
  onOpen,
  onTransition,
}: AgendaListViewProps) {
  const sorted = [...appointments].sort((a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );

  if (!sorted.length) {
    return (
      <div className="p-8">
        <EmptyState
          icon={CalendarX2}
          title="No hay citas"
          description="No encontramos resultados con estos filtros."
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
      {sorted.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onOpen={onOpen}
          onTransition={onTransition}
        />
      ))}
    </div>
  );
}
