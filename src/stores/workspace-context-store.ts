import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceContextState {
  activeLocationByOrganization: Record<string, string | null>;
  setActiveLocation: (organizationId: string, locationId: string | null) => void;
}

export const useWorkspaceContext = create<WorkspaceContextState>()(
  persist(
    (set) => ({
      activeLocationByOrganization: {},
      setActiveLocation: (organizationId, locationId) =>
        set((state) => ({
          activeLocationByOrganization: {
            ...state.activeLocationByOrganization,
            [organizationId]: locationId,
          },
        })),
    }),
    { name: "zentro-workspace-context" },
  ),
);
