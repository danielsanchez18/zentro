import { create } from "zustand";

interface WorkspaceNavStore {
  /** Drawer (Sheet) del sidebar abierto en pantallas pequeñas (< lg). */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

/**
 * Estado de navegación del Tenant Workspace (/app/:slug).
 *
 * `mobileOpen` controla el drawer del sidebar en pantallas pequeñas:
 * - El botón «Menu» del breadcrumb (visible solo en < lg) lo abre.
 * - Se fuerza a `false` al cruzar a desktop (>= lg) para que el sidebar
 *   estático asuma el control y el drawer nunca quede abierto sobre él.
 */
export const useWorkspaceNav = create<WorkspaceNavStore>((set) => ({
  mobileOpen: false,
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));