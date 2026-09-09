"use client";

import { Building2, MailOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { InvitationCard } from "@/components/dashboard/invitaciones/InvitationCard";
import { InvitationStatusChip } from "@/components/dashboard/invitaciones/InvitationStatusChip";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toastMsg } from "@/components/ui/toast-message";

export const InvitationsPage = () => {
  const dashboard = useDashboardStore();
  const invitations = dashboard.getInvitationSummaries();
  const pending = invitations.filter((invitation) => invitation.status === "PENDING");
  const history = invitations.filter((invitation) => invitation.status !== "PENDING");
  const respond = (id: string, response: "ACCEPTED" | "DECLINED") => {
    dashboard.respondToInvitation(id, response);
    toastMsg.success(response === "ACCEPTED" ? "Invitación aceptada" : "Invitación rechazada", response === "ACCEPTED" ? "Ya puedes entrar a la organización desde tu hub." : "La invitación quedó registrada en el historial.");
  };
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
          {pending.length > 0 && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={MailOpen}
              title="Sin invitaciones pendientes"
              description="Cuando alguien te invite a su organización, lo verás aquí."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {pending.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} onAccept={() => respond(invitation.id, "ACCEPTED")} onDecline={() => respond(invitation.id, "DECLINED")} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="historial-title">
        <h2 id="historial-title" className="text-base font-medium">
          Historial
        </h2>

        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Aún no hay historial de invitaciones.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {history.map((invitation) => (
              <li
                key={invitation.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex gap-3">
                  <div className="flex mt-0.5 size-9 min-w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-base font-medium">{invitation.orgName}</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.invitedBy} te invitó como {invitation.role} ·
                      Recibida {invitation.receivedAt}
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
