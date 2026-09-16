"use client";

import { useMemo, useState } from "react";
import { toastMsg } from "@/components/ui/toast-message";
import type { Appointment, AppointmentStatus } from "@/lib/mock/agenda";
import { useAgendaStore } from "@/stores/agenda-store";
import { AgendaHeader } from "./AgendaHeader";
import { AgendaKpis } from "./AgendaKpis";
import { AgendaToolbar, type AgendaView } from "./AgendaToolbar";
import { AgendaCalendar } from "./AgendaCalendar";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";
import { AppointmentPreviewDialog } from "./AppointmentPreviewDialog";

const dateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
export function AgendaModule() {
  const appointments = useAgendaStore((state) => state.appointments);
  const addAppointment = useAgendaStore((state) => state.addAppointment);
  const transitionAppointment = useAgendaStore(
    (state) => state.transitionAppointment,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [preview, setPreview] = useState<Appointment | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [date, setDate] = useState("2026-09-12");
  const [view, setView] = useState<AgendaView>("day");
  const filtered = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          `${appointment.customerName} ${appointment.serviceName} ${appointment.responsibleName ?? ""} ${appointment.number}`
            .toLocaleLowerCase("es")
            .includes(query.trim().toLocaleLowerCase("es")) &&
          (status === "all" || appointment.status === status),
      ),
    [appointments, query, status],
  );
  const move = (amount: number) => {
    const next = new Date(`${date}T12:00:00`);
    if (view === "month") {
      next.setMonth(next.getMonth() + amount);
    } else {
      next.setDate(next.getDate() + amount);
    }
    setDate(dateKey(next));
  };
  const transition = (
    appointment: Appointment,
    nextStatus: AppointmentStatus,
  ) => {
    transitionAppointment(appointment.id, nextStatus);
    const labels: Record<AppointmentStatus, string> = {
      pendiente_confirmacion: "Cita pendiente",
      confirmada: "Cita confirmada",
      en_curso: "Atención iniciada",
      completada: "Cita completada",
      cancelada: "Cita cancelada",
      no_asistio: "No asistencia registrada",
    };
    toastMsg.success(labels[nextStatus], appointment.number);
  };
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <AgendaHeader onAdd={() => setCreateOpen(true)} />
      <AgendaKpis appointments={appointments} />
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <AgendaToolbar
          query={query}
          onQuery={setQuery}
          status={status}
          onStatus={setStatus}
          date={date}
          onDate={setDate}
          view={view}
          onView={setView}
          onMove={move}
          onAdd={() => setCreateOpen(true)}
        />
        <AgendaCalendar
          appointments={filtered}
          date={date}
          onDateChange={setDate}
          view={view}
          onOpen={setPreview}
          onTransition={transition}
        />
      </section>
      <CreateAppointmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={addAppointment}
      />
      <AppointmentPreviewDialog
        appointment={preview}
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      />
    </div>
  );
}
