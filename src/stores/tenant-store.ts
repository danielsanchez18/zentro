import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TenantContext {
  orgId: string;
  slug: string;
  name: string;
}

interface TenantStore {
  activeTenant: TenantContext | null;
  setActiveTenant: (tenant: TenantContext | null) => void;
}

/**
 * Contexto de tenant activo del usuario.
 * Se persiste en localStorage para recordar la última org abierta.
 * TODO(0.2): usarlo como `X-Tenant-Id` en las llamadas del workspace.
 */
export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      activeTenant: null,
      setActiveTenant: (tenant) => set({ activeTenant: tenant }),
    }),
    {
      name: "zentro-tenant",
    },
  ),
);
