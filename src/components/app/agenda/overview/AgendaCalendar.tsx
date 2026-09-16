"use client";

import type { Appointment, AppointmentStatus } from "@/lib/mock/agenda";
import type { AgendaView } from "./AgendaToolbar";
import { AgendaDayView } from "./views/AgendaDayView";
import { AgendaWeekView } from "./views/AgendaWeekView";
import { AgendaMonthView } from "./views/AgendaMonthView";
import { AgendaListView } from "./views/AgendaListView";

interface AgendaCalendarProps {
  appointments: Appointment[];
  date: string;
  onDateChange: (date: string) => void;
  view: AgendaView;
  onOpen: (appointment: Appointment) => void;
  onTransition: (appointment: Appointment, status: AppointmentStatus) => void;
}

export function AgendaCalendar({
  appointments,
  date,
  onDateChange,
  view,
  onOpen,
  onTransition,
}: AgendaCalendarProps) {
  if (view === "list") {
    return (
      <AgendaListView
        appointments={appointments}
        onOpen={onOpen}
        onTransition={onTransition}
      />
    );
  }

  if (view === "day") {
    return (
      <AgendaDayView
        appointments={appointments}
        date={date}
        onDateChange={onDateChange}
        onOpen={onOpen}
        onTransition={onTransition}
      />
    );
  }

  if (view === "month") {
    return (
      <AgendaMonthView
        appointments={appointments}
        date={date}
        onDateChange={onDateChange}
        onOpen={onOpen}
        onTransition={onTransition}
      />
    );
  }

  return (
    <AgendaWeekView
      appointments={appointments}
      date={date}
      onDateChange={onDateChange}
      onOpen={onOpen}
      onTransition={onTransition}
    />
  );
}
