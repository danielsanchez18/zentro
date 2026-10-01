import { create } from "zustand";
import {
  seedLocations,
  type LocationFunctionKey,
  type WorkspaceLocation,
} from "@/lib/mock/locations";

const nowIso = () => new Date().toISOString();

export interface UpsertLocationInput {
  id?: string;
  organizationId: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  isPrimary?: boolean;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  functions: LocationFunctionKey[];
  published: boolean;
  headline?: string | null;
  description?: string | null;
}

interface LocationsStore {
  locations: WorkspaceLocation[];
  upsertLocation: (input: UpsertLocationInput) => void;
  removeLocation: (id: string) => void;
  toggleFunction: (id: string, fn: LocationFunctionKey) => void;
  togglePublished: (id: string) => void;
  setPrimary: (id: string) => void;
  locationsByOrganization: (organizationId: string) => WorkspaceLocation[];
}

export const useLocationsStore = create<LocationsStore>((set, get) => ({
  locations: seedLocations(),

  upsertLocation: (input) =>
    set((state) => {
      const now = nowIso();
      if (input.id) {
        return {
          locations: state.locations.map((location) =>
            location.id === input.id
              ? {
                  ...location,
                  name: input.name,
                  status: input.status,
                  isPrimary: input.isPrimary ?? location.isPrimary,
                  address: input.address ?? null,
                  phone: input.phone ?? null,
                  openingHours: input.openingHours ?? null,
                  functions: input.functions,
                  publicProfile: {
                    published: input.published,
                    headline: input.headline ?? null,
                    description: input.description ?? null,
                    coverImage: location.publicProfile.coverImage ?? null,
                  },
                }
              : location,
          ),
        };
      }

      // Alta: si es la única ubicación activa o se marca como principal,
      // desmarcar las demás como principal.
      const isPrimary = input.isPrimary ?? state.locations.length === 0;
      const id = `loc_${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      const newLocation: WorkspaceLocation = {
        id,
        organizationId: input.organizationId,
        name: input.name,
        status: input.status,
        isPrimary,
        address: input.address ?? null,
        phone: input.phone ?? null,
        openingHours: input.openingHours ?? null,
        functions: input.functions,
        publicProfile: {
          published: input.published,
          headline: input.headline ?? null,
          description: input.description ?? null,
          coverImage: null,
        },
      };

      return {
        locations: isPrimary
          ? [
              ...state.locations.map((location) =>
                location.organizationId === input.organizationId
                  ? { ...location, isPrimary: false }
                  : location,
              ),
              newLocation,
            ]
          : [...state.locations, newLocation],
      };
    }),

  removeLocation: (id) =>
    set((state) => {
      const target = state.locations.find((location) => location.id === id);
      if (!target) return state;
      let locations = state.locations.filter((location) => location.id !== id);
      // Si eliminamos la principal, promover la primera activa restante.
      if (target.isPrimary) {
        const next = locations.find(
          (location) =>
            location.organizationId === target.organizationId &&
            location.status === "ACTIVE",
        );
        if (next) {
          locations = locations.map((location) =>
            location.id === next.id ? { ...location, isPrimary: true } : location,
          );
        }
      }
      return { locations };
    }),

  toggleFunction: (id, fn) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? {
              ...location,
              functions: location.functions.includes(fn)
                ? location.functions.filter((item) => item !== fn)
                : [...location.functions, fn],
            }
          : location,
      ),
    })),

  togglePublished: (id) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id
          ? {
              ...location,
              publicProfile: {
                ...location.publicProfile,
                published: !location.publicProfile.published,
              },
            }
          : location,
      ),
    })),

  setPrimary: (id) =>
    set((state) => {
      const target = state.locations.find((location) => location.id === id);
      if (!target) return state;
      return {
        locations: state.locations.map((location) => {
          if (location.organizationId !== target.organizationId)
            return location;
          if (location.id === id) return { ...location, isPrimary: true };
          return { ...location, isPrimary: false };
        }),
      };
    }),

  locationsByOrganization: (organizationId) =>
    get().locations.filter(
      (location) => location.organizationId === organizationId,
    ),
}));