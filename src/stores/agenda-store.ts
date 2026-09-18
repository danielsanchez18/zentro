import { create } from "zustand";
import {
  agendaAppointments,
  type Appointment,
  type AppointmentHistoryKind,
  type AppointmentStatus,
} from "@/lib/mock/agenda";

interface AgendaStore {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, changes: Partial<Appointment>, history?: { kind: AppointmentHistoryKind; title: string; detail?: string }) => void;
  transitionAppointment: (id: string, status: AppointmentStatus, reason?: string) => void;
  removeAppointment: (id: string) => void;
}

export const useAgendaStore = create<AgendaStore>((set) => ({
  appointments: agendaAppointments,
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [
        {
          ...appointment,
          history: appointment.history ?? [{
            id: `history_${appointment.id}_created`,
            kind: "created",
            title: "Cita creada",
            detail: "Registro creado desde Agenda.",
            createdAt: appointment.createdAt,
            actorName: "Usuario actual",
          }],
        },
        ...state.appointments,
      ],
    })),
  updateAppointment: (id, changes, history) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) => {
        if (appointment.id !== id) return appointment;
        const updatedAt = new Date().toISOString();
        return {
          ...appointment,
          ...changes,
          updatedAt,
          history: history ? [{
            id: `history_${id}_${updatedAt}`,
            ...history,
            createdAt: updatedAt,
            actorName: "Usuario actual",
          }, ...(appointment.history ?? [])] : appointment.history,
        };
      }),
    })),
  transitionAppointment: (id, status, reason) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) => {
        if (appointment.id !== id) return appointment;
        const updatedAt = new Date().toISOString();
        const labels: Record<AppointmentStatus, string> = {
          pendiente_confirmacion: "Marcada como pendiente",
          confirmada: "Cita confirmada",
          en_curso: "Atención iniciada",
          completada: "Cita completada",
          cancelada: "Cita cancelada",
          no_asistio: "No asistencia registrada",
        };
        return {
          ...appointment,
          status,
          cancellationReason: status === "cancelada" || status === "no_asistio" ? reason : appointment.cancellationReason,
          updatedAt,
          history: [{
            id: `history_${id}_${updatedAt}`,
            kind: "status_changed",
            title: labels[status],
            detail: reason,
            createdAt: updatedAt,
            actorName: "Usuario actual",
          }, ...(appointment.history ?? [])],
        };
      }),
    })),
  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((appointment) => appointment.id !== id),
    })),
}));
