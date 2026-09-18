"use client";

import { useMemo, useState } from "react";
import { toastMsg } from "@/components/ui/toast-message";
import type {
  Appointment,
  AppointmentModality,
  AppointmentStatus,
} from "@/lib/mock/agenda";
import { useAgendaStore } from "@/stores/agenda-store";
import { AgendaHeader } from "./AgendaHeader";
import { AgendaKpis } from "./AgendaKpis";
import { AgendaToolbar, type AgendaView } from "./AgendaToolbar";
import { AgendaCalendar } from "./AgendaCalendar";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";
import { AppointmentPreviewDialog } from "./AppointmentPreviewDialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { AppointmentPaymentDialog } from "./AppointmentPaymentDialog";

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
  const updateAppointment = useAgendaStore((state) => state.updateAppointment);
  const removeAppointment = useAgendaStore((state) => state.removeAppointment);
  const [createOpen, setCreateOpen] = useState(false);
  const [preview, setPreview] = useState<Appointment | null>(null);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [paying, setPaying] = useState<Appointment | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AppointmentStatus | "all">("all");
  const [service, setService] = useState("all");
  const [responsible, setResponsible] = useState("all");
  const [modality, setModality] = useState<AppointmentModality | "all">("all");
  const [date, setDate] = useState("2026-09-12");
  const [view, setView] = useState<AgendaView>("day");
  const filtered = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          `${appointment.customerName} ${appointment.serviceName} ${appointment.responsibleName ?? ""} ${appointment.number}`
            .toLocaleLowerCase("es")
            .includes(query.trim().toLocaleLowerCase("es")) &&
          (status === "all" || appointment.status === status) &&
          (service === "all" || appointment.serviceId === service) &&
          (responsible === "all" ||
            (responsible === "unassigned"
              ? !appointment.responsibleId
              : appointment.responsibleId === responsible)) &&
          (modality === "all" || appointment.modality === modality),
      ),
    [appointments, query, status, service, responsible, modality],
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
    reason?: string,
  ) => {
    transitionAppointment(appointment.id, nextStatus, reason);
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
  const currentPreview = preview
    ? appointments.find((appointment) => appointment.id === preview.id) ?? null
    : null;
  const hasConflict = (
    candidate: Pick<
      Appointment,
      "startsAt" | "endsAt" | "responsibleId" | "resourceId"
    >,
    excludedId?: string,
  ) =>
    appointments.some(
      (appointment) =>
        appointment.id !== excludedId &&
        ((Boolean(candidate.responsibleId) &&
          appointment.responsibleId === candidate.responsibleId) ||
          (Boolean(candidate.resourceId) &&
            appointment.resourceId === candidate.resourceId)) &&
        !["cancelada", "no_asistio"].includes(appointment.status) &&
        new Date(candidate.startsAt) < new Date(appointment.endsAt) &&
        new Date(candidate.endsAt) > new Date(appointment.startsAt),
    );
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
          service={service}
          onService={setService}
          responsible={responsible}
          onResponsible={setResponsible}
          modality={modality}
          onModality={setModality}
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
        onCreate={(appointment) => {
          if (hasConflict(appointment)) {
            toastMsg.error(
              "Horario no disponible",
              "El responsable o recurso ya tiene otra cita durante ese horario.",
            );
            return false;
          }
          addAppointment(appointment);
          return true;
        }}
      />
      <AppointmentPreviewDialog
        appointment={currentPreview}
        open={Boolean(currentPreview)}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
        onEdit={(appointment) => setEditing(appointment)}
        onTransition={transition}
        onDelete={(appointment) => {
          removeAppointment(appointment.id);
          setPreview(null);
          toastMsg.info("Cita eliminada", appointment.number);
        }}
        onPayment={(appointment) => setPaying(appointment)}
      />
      <EditAppointmentDialog
        appointment={editing}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSave={(changes, rescheduled, detail) => {
          if (!editing) return;
          const candidate = { ...editing, ...changes };
          if (hasConflict(candidate, editing.id)) {
            toastMsg.error(
              "Horario no disponible",
              "El responsable o recurso ya tiene otra cita durante ese horario.",
            );
            return false;
          }
          updateAppointment(editing.id, changes, {
            kind: rescheduled ? "rescheduled" : "updated",
            title: rescheduled ? "Cita reprogramada" : "Cita actualizada",
            detail: detail || "Se actualizaron los datos de la cita.",
          });
          setEditing(null);
          toastMsg.success(
            rescheduled ? "Cita reprogramada" : "Cambios guardados",
            editing.number,
          );
          return true;
        }}
      />
      <AppointmentPaymentDialog
        appointment={
          paying
            ? appointments.find((appointment) => appointment.id === paying.id) ?? null
            : null
        }
        open={Boolean(paying)}
        onOpenChange={(open) => {
          if (!open) setPaying(null);
        }}
        onSave={(paidAmount, paymentStatus) => {
          if (!paying) return;
          updateAppointment(
            paying.id,
            { paidAmount, paymentStatus },
            {
              kind: "payment_changed",
              title: paymentStatus === "pagado" ? "Pago completado" : "Adelanto registrado",
              detail: `Total abonado: S/ ${paidAmount.toFixed(2)}.`,
            },
          );
          toastMsg.success(
            paymentStatus === "pagado" ? "Pago completado" : "Adelanto registrado",
            paying.number,
          );
          setPaying(null);
        }}
      />
    </div>
  );
}
