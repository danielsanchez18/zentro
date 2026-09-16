import { create } from "zustand";
import { agendaAppointments, type Appointment, type AppointmentStatus } from "@/lib/mock/agenda";

interface AgendaStore {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, changes: Partial<Appointment>) => void;
  transitionAppointment: (id: string, status: AppointmentStatus) => void;
}

export const useAgendaStore = create<AgendaStore>((set) => ({
  appointments: agendaAppointments,
  addAppointment: (appointment) => set((state) => ({ appointments: [appointment, ...state.appointments] })),
  updateAppointment: (id, changes) => set((state) => ({ appointments: state.appointments.map((appointment) => appointment.id === id ? { ...appointment, ...changes, updatedAt: new Date().toISOString() } : appointment) })),
  transitionAppointment: (id, status) => set((state) => ({ appointments: state.appointments.map((appointment) => appointment.id === id ? { ...appointment, status, updatedAt: new Date().toISOString() } : appointment) })),
}));
