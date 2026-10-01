import { create } from "zustand";
import {
  findAuditEventType,
  seedAuditEvents,
  type AuditEvent,
  type AuditEventType,
} from "@/lib/mock/audit";

export interface LogEventInput {
  organizationId: string;
  actor: string;
  actorRole?: string;
  type: AuditEventType;
  description: string;
  target?: string;
  locationId?: string | null;
  /** Gravedad y acción sensible (opcionales; se derivan si no se pasan). */
  severity?: AuditEvent["severity"];
  sensitiveAction?: AuditEvent["sensitiveAction"];
}

interface AuditStore {
  events: AuditEvent[];
  /** Registra un evento nuevo (quedará al inicio, más reciente primero). */
  logEvent: (input: LogEventInput) => void;
  /** Eventos de una organización, ordenados de más reciente a más antiguo. */
  eventsByOrganization: (organizationId: string) => AuditEvent[];
  /** KPIs: total, sensibles y actores únicos. */
  kpisByOrganization: (organizationId: string) => {
    total: number;
    sensitive: number;
    uniqueActors: number;
    lastEventAt: string | null;
  };
  /** Actores que tienen al menos un evento en la organización. */
  actorsByOrganization: (organizationId: string) => string[];
}

const sortByDateDesc = (a: AuditEvent, b: AuditEvent) =>
  new Date(b.at).getTime() - new Date(a.at).getTime();

export const useAuditStore = create<AuditStore>((set, get) => ({
  events: [...seedAuditEvents].sort(sortByDateDesc),

  logEvent: (input) =>
    set((state) => {
      const id = `ae_${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      // El módulo y la gravedad por defecto se derivan del catálogo (mock/audit.ts).
      const event: AuditEvent = {
        id,
        organizationId: input.organizationId,
        at: new Date().toISOString(),
        actor: input.actor,
        actorRole: input.actorRole,
        type: input.type,
        module: findAuditEventType(input.type).module,
        description: input.description,
        target: input.target,
        locationId: input.locationId ?? null,
        severity: input.severity ?? "routine",
        sensitiveAction: input.sensitiveAction,
      };
      return { events: [event, ...state.events] };
    }),

  eventsByOrganization: (organizationId) =>
    get()
      .events.filter((event) => event.organizationId === organizationId)
      .sort(sortByDateDesc),

  kpisByOrganization: (organizationId) => {
    const events = get().eventsByOrganization(organizationId);
    const uniqueActors = new Set(events.map((event) => event.actor)).size;
    return {
      total: events.length,
      sensitive: events.filter((event) => event.severity === "sensitive").length,
      uniqueActors,
      lastEventAt: events.length > 0 ? events[0].at : null,
    };
  },

  actorsByOrganization: (organizationId) => {
    const actors = new Set(
      get()
        .events.filter((event) => event.organizationId === organizationId)
        .map((event) => event.actor),
    );
    return [...actors].sort();
  },
}));