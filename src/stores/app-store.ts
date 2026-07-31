import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiMode } from '@/lib/api/api-config';

export type ForcedMode = 'mock' | 'api' | null;

interface AppState {
  mockMode: boolean;
  apiStatus: ApiMode;
  lastPing: number | null;
  /** Modo elegido manualmente por el usuario (null = auto-detección al login) */
  forcedMode: ForcedMode;
  setMockMode: (mode: boolean) => void;
  setApiStatus: (status: ApiMode) => void;
  setLastPing: (ts: number) => void;
  forceMode: (mode: 'mock' | 'api') => void;
  resetForcedMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mockMode: true,
      apiStatus: 'mock',
      lastPing: null,
      forcedMode: null,
      setMockMode: (mode) => set({ mockMode: mode }),
      setApiStatus: (status) => set({ apiStatus: status }),
      setLastPing: (ts) => set({ lastPing: ts }),
      forceMode: (mode) =>
        set({
          forcedMode: mode,
          mockMode: mode === 'mock',
          apiStatus: mode === 'mock' ? 'mock' : 'api',
        }),
      resetForcedMode: () => set({ forcedMode: null }),
    }),
    {
      name: 'zentro-app',
      partialize: (state) => ({ forcedMode: state.forcedMode }),
    },
  ),
);
