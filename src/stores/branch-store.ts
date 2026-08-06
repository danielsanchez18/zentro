import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BranchContext {
  id: string;
  name: string;
  type: "principal" | "adicional";
}

interface BranchStore {
  /** Sucursales de la empresa activa. */
  branches: BranchContext[];
  /** Id de la sucursal activa. */
  activeBranchId: string | null;
  setBranches: (branches: BranchContext[]) => void;
  setActiveBranchId: (id: string) => void;
  /** Vuelve a la sucursal principal (al cambiar de empresa). */
  resetToPrincipal: () => void;
}

/**
 * Contexto de sucursal activa dentro del Tenant Dashboard.
 * Se persiste en localStorage para recordar la última sucursal.
 * TODO(0.2): los datos vendrán de GET /orgs/:id/branches.
 */
export const useBranchStore = create<BranchStore>()(
  persist(
    (set) => ({
      branches: [{ id: "principal", name: "Principal", type: "principal" }],
      activeBranchId: "principal",
      setBranches: (branches) => set({ branches }),
      setActiveBranchId: (activeBranchId) => set({ activeBranchId }),
      resetToPrincipal: () => set({ activeBranchId: "principal" }),
    }),
    {
      name: "zentro-branch",
    },
  ),
);
