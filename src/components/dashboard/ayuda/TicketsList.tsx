"use client";

import { useEffect, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import {
  loadTickets,
  SEED_TICKETS,
} from "@/components/dashboard/ayuda/tickets";
import type {
  SupportTicket,
  TicketStatus,
} from "@/components/dashboard/ayuda/types";

const STATUS_META: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: {
    label: "Abierto",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  IN_PROGRESS: {
    label: "En progreso",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  RESOLVED: {
    label: "Resuelto",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
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
  const [tickets, setTickets] = useState<SupportTicket[]>(SEED_TICKETS);

  useEffect(() => {
    setTickets(loadTickets());
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium">Mis tickets</h2>
        <p className="text-sm text-muted-foreground">
          Historial de los mensajes que enviaste al equipo de soporte.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={MessagesSquare}
            title="Sin tickets"
            description="Cuando envíes un mensaje a soporte, aparecerá aquí con su referencia."
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => {
            const status = STATUS_META[ticket.status];
            return (
              <li
                key={ticket.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {ticket.reference}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
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
