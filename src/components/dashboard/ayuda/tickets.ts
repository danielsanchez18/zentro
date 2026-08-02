import type { SupportTicket } from "@/components/dashboard/ayuda/types";
import { TICKETS_STORAGE_KEY } from "@/components/dashboard/ayuda/types";

/**
 * Historial de tickets de soporte (modo mock).
 * TODO(0.2): leer desde `GET /support-tickets` y crear con `POST /support-tickets`.
 */
export const SEED_TICKETS: SupportTicket[] = [
  {
    id: "ticket_002",
    reference: "ZNT-204812",
    category: "Soporte técnico",
    tenantName: "Café del Valle",
    subject: "No puedo ver los reportes de ventas",
    message:
      "Desde el martes no cargan los reportes de ventas del día en el panel.",
    status: "IN_PROGRESS",
    createdAt: "2026-07-28T15:30:00.000Z",
  },
  {
    id: "ticket_001",
    reference: "ZNT-199351",
    category: "Duda",
    tenantName: "Ninguna (consulta general)",
    subject: "¿Cómo activo un plan de pago?",
    message: "Quiero saber cómo pasar del plan trial a uno de pago.",
    status: "RESOLVED",
    createdAt: "2026-07-20T10:00:00.000Z",
  },
];

export const loadTickets = (): SupportTicket[] => {
  if (typeof window === "undefined") return SEED_TICKETS;
  const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SupportTicket[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignorar datos corruptos y re-seedear
    }
  }
  window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(SEED_TICKETS));
  return SEED_TICKETS;
};

export const saveTicket = (ticket: SupportTicket) => {
  if (typeof window === "undefined") return;
  const current = loadTickets();
  const next = [ticket, ...current];
  window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(next));
};
