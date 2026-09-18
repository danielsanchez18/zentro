import { create } from "zustand";
import { persist } from "zustand/middleware";
import { agendaResources, type AgendaResource } from "@/lib/mock/agenda";

export interface DaySchedule {
  id: string;
  label: string;
  enabled: boolean;
  from: string;
  to: string;
}

export interface AgendaBlock {
  id: string;
  date: string;
  reason: string;
  allDay?: boolean;
}

export interface AgendaGeneralSettings {
  defaultDurationMin: number;
  bufferBetweenMin: number;
  minAdvanceBookingHours: number;
  autoNotifyWhatsapp: boolean;
  autoNotifyEmail: boolean;
  timezone: string;
}

export const INITIAL_DAYS: DaySchedule[] = [
  { id: "monday", label: "Lunes", enabled: true, from: "08:00", to: "18:00" },
  { id: "tuesday", label: "Martes", enabled: true, from: "08:00", to: "18:00" },
  { id: "wednesday", label: "Miércoles", enabled: true, from: "08:00", to: "18:00" },
  { id: "thursday", label: "Jueves", enabled: true, from: "08:00", to: "18:00" },
  { id: "friday", label: "Viernes", enabled: true, from: "08:00", to: "18:00" },
  { id: "saturday", label: "Sábado", enabled: true, from: "09:00", to: "14:00" },
  { id: "sunday", label: "Domingo", enabled: false, from: "09:00", to: "14:00" },
];

export const INITIAL_GENERAL_SETTINGS: AgendaGeneralSettings = {
  defaultDurationMin: 45,
  bufferBetweenMin: 10,
  minAdvanceBookingHours: 2,
  autoNotifyWhatsapp: true,
  autoNotifyEmail: true,
  timezone: "America/Lima (GMT-5)",
};

interface AgendaSettingsState {
  days: DaySchedule[];
  resources: AgendaResource[];
  blocks: AgendaBlock[];
  general: AgendaGeneralSettings;

  setDays: (days: DaySchedule[]) => void;
  updateDay: (id: string, partial: Partial<DaySchedule>) => void;
  copyScheduleToWorkdays: (sourceDayId: string) => void;

  setResources: (resources: AgendaResource[]) => void;
  addResource: (resource: Omit<AgendaResource, "id">) => void;
  toggleResource: (id: string, active: boolean) => void;
  removeResource: (id: string) => void;

  setBlocks: (blocks: AgendaBlock[]) => void;
  addBlock: (date: string, reason: string) => void;
  removeBlock: (id: string) => void;

  updateGeneral: (partial: Partial<AgendaGeneralSettings>) => void;
  resetToDefaults: () => void;
}

export const useAgendaSettingsStore = create<AgendaSettingsState>()(
  persist(
    (set) => ({
      days: INITIAL_DAYS,
      resources: agendaResources,
      blocks: [
        {
          id: "block_1",
          date: "2026-10-08",
          reason: "Feriado nacional (Combate de Angamos)",
          allDay: true,
        },
      ],
      general: INITIAL_GENERAL_SETTINGS,

      setDays: (days) => set({ days }),
      updateDay: (id, partial) =>
        set((state) => ({
          days: state.days.map((d) => (d.id === id ? { ...d, ...partial } : d)),
        })),
      copyScheduleToWorkdays: (sourceDayId) =>
        set((state) => {
          const source = state.days.find((d) => d.id === sourceDayId);
          if (!source) return state;
          const workdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
          return {
            days: state.days.map((d) =>
              workdays.includes(d.id)
                ? { ...d, enabled: source.enabled, from: source.from, to: source.to }
                : d
            ),
          };
        }),

      setResources: (resources) => set({ resources }),
      addResource: (res) =>
        set((state) => ({
          resources: [
            ...state.resources,
            { ...res, id: `resource_${Date.now()}` },
          ],
        })),
      toggleResource: (id, active) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, status: active ? "activo" : "inactivo" } : r
          ),
        })),
      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
        })),

      setBlocks: (blocks) => set({ blocks }),
      addBlock: (date, reason) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            { id: `block_${Date.now()}`, date, reason, allDay: true },
          ],
        })),
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),

      updateGeneral: (partial) =>
        set((state) => ({
          general: { ...state.general, ...partial },
        })),

      resetToDefaults: () =>
        set({
          days: INITIAL_DAYS,
          resources: agendaResources,
          blocks: [],
          general: INITIAL_GENERAL_SETTINGS,
        }),
    }),
    {
      name: "zentro-agenda-settings",
    }
  )
);
