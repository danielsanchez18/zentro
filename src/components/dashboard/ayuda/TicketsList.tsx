"use client";

import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  loadTickets,
  SEED_TICKETS,
} from "@/components/dashboard/ayuda/tickets";
import type {
  SupportTicket,
  TicketStatus,
} from "@/components/dashboard/ayuda/types";
import { type HubTone } from "@/components/dashboard/shared/styles";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";

const STATUS_META: Record<TicketStatus, { label: string; tone: HubTone }> = {
  OPEN: {
    label: "Abierto",
    tone: "warning",
  },
  IN_PROGRESS: {
    label: "En progreso",
    tone: "info",
  },
  RESOLVED: {
    label: "Resuelto",
    tone: "success",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Historial de tickets de soporte.
 * TODO(0.2): conectar con el backend (`GET /support-tickets`).
 */
export const TicketsList = () => {
  // El Hub solo se renderiza en cliente (tras el guard de auth), así que se puede leer storage al iniciar.
  const [tickets] = useState<SupportTicket[]>(() =>
    typeof window === "undefined" ? SEED_TICKETS : loadTickets(),
  );

  return (
    <div className="space-y-3 w-full">
      <p className="text-sm text-muted-foreground">
        Historial de los mensajes que enviaste al equipo de soporte.
      </p>

      {tickets.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border">
          <EmptyState
            icon={MessagesSquare}
            title="Sin tickets"
            description="Cuando envíes un mensaje a soporte, aparecerá aquí con su referencia."
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {tickets.map((ticket) => {
            const status = STATUS_META[ticket.status];
            return (
              <li
                key={ticket.id}
                className="rounded-sm border border-border p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {ticket.reference}
                    </span>
                    <HubStatusChip tone={status.tone} label={status.label} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium">{ticket.subject}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {ticket.message}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  {ticket.category} · {ticket.tenantName}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
