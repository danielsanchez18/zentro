"use client";

import { useState } from "react";
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
                    <span
                      className={cn(
                        "flex h-8 items-center rounded-sm border border-border px-2.5 py-1 text-[13px] font-medium uppercase tracking-wide",
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
