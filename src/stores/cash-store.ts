import { create } from "zustand";
import { cashMovementsMock, cashSessionsMock, cashSettingsMock, cashTerminalsMock, type CashMovement, type CashSettings, type CashTerminal, type CashSession } from "@/lib/mock/cash";

interface CashStore {
  terminals: CashTerminal[]; sessions: CashSession[]; movements: CashMovement[]; settings: CashSettings;
  openSession: (session: CashSession) => void;
  addMovement: (movement: CashMovement) => void;
  closeSession: (id: string, countedCash: number, expectedCash: number, closedByName: string, notes?: string) => void;
  addTerminal: (terminal: CashTerminal) => void;
  updateTerminal: (id: string, values: Partial<CashTerminal>) => void;
  removeTerminal: (id: string) => void;
  updateSettings: (values: Partial<CashSettings>) => void;
}

export const useCashStore = create<CashStore>((set) => ({
  terminals: cashTerminalsMock,
  sessions: cashSessionsMock,
  movements: cashMovementsMock,
  settings: cashSettingsMock,
  openSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
  addMovement: (movement) => set((state) => ({ movements: [movement, ...state.movements] })),
  closeSession: (id, countedCash, expectedCash, closedByName, notes) => set((state) => ({ sessions: state.sessions.map((session) => session.id === id ? { ...session, status: "cerrada", closedAt: new Date().toISOString(), countedCash, expectedCash, difference: countedCash - expectedCash, closedByName, notes } : session) })),
  addTerminal: (terminal) => set((state) => ({ terminals: [...state.terminals, terminal] })),
  updateTerminal: (id, values) => set((state) => ({ terminals: state.terminals.map((terminal) => terminal.id === id ? { ...terminal, ...values } : terminal) })),
  removeTerminal: (id) => set((state) => ({ terminals: state.sessions.some((session) => session.terminalId === id) ? state.terminals : state.terminals.filter((terminal) => terminal.id !== id) })),
  updateSettings: (values) => set((state) => ({ settings: { ...state.settings, ...values } })),
}));
