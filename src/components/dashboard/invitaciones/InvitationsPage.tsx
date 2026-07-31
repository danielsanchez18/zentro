"use client";

import { Building2, MailOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { InvitationCard } from "@/components/dashboard/invitaciones/InvitationCard";
import { InvitationStatusChip } from "@/components/dashboard/invitaciones/InvitationStatusChip";
import type { Invitation } from "@/components/dashboard/invitaciones/types";

// TODO(0.2): leer desde GET /invitations
const PENDING: Invitation[] = [
  {
    id: "inv_001",
    orgName: "La Fonda del Chef",
    invitedBy: "Lucía Torres",
    role: "Miembro",
    status: "PENDING",
    expiresIn: "6 días",
    receivedAt: "hace 1 día",
  },
  {
    id: "inv_002",
    orgName: "Panadería El Trigal",
    invitedBy: "Marco Silva",
    role: "Admin",
    status: "PENDING",
    expiresIn: "2 días",
    receivedAt: "hace 5 días",
  },
];

const HISTORY: Invitation[] = [
  {
    id: "inv_003",
    orgName: "Café del Valle",
    invitedBy: "Valeria Ríos",
    role: "Admin",
    status: "ACCEPTED",
    receivedAt: "hace 3 semanas",
  },
  {
    id: "inv_004",
    orgName: "Chifa Unión",
    invitedBy: "José Huamán",
    role: "Miembro",
    status: "DECLINED",
    receivedAt: "hace 1 mes",
  },
  {
    id: "inv_005",
    orgName: "Bodega Don Pepe",
    invitedBy: "Pepe Lozano",
    role: "Miembro",
    status: "EXPIRED",
    receivedAt: "hace 2 meses",
  },
];

export const InvitationsPage = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Invitaciones</h1>
        <p className="text-sm text-muted-foreground">
          Acepta o rechaza las invitaciones a otras organizaciones.
        </p>
      </div>

      <section aria-labelledby="pendientes-title">
        <h2
          id="pendientes-title"
          className="flex items-center gap-2 text-base font-medium"
        >
          Pendientes
          {PENDING.length > 0 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {PENDING.length}
            </span>
          )}
        </h2>

        {PENDING.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={MailOpen}
              title="Sin invitaciones pendientes"
              description="Cuando alguien te invite a su organización, lo verás aquí."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {PENDING.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="historial-title">
        <h2 id="historial-title" className="text-base font-medium">
          Historial
        </h2>

        {HISTORY.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Aún no hay historial de invitaciones.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {HISTORY.map((invitation) => (
              <li
                key={invitation.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-base font-medium">{invitation.orgName}</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.invitedBy} te invitó como {invitation.role} ·
                      recibida {invitation.receivedAt}
                    </p>
                  </div>
                </div>
                <InvitationStatusChip status={invitation.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
