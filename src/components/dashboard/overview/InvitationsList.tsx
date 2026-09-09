"use client";

import { Check, Clock3, MailOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toastMsg } from "@/components/ui/toast-message";

/**
 * Invitaciones pendientes del usuario.
 * TODO(0.2): leer desde `GET /invitations` y manejar aceptar/declinar.
 */
export const InvitationsList = () => {
  const dashboard = useDashboardStore();
  const invitations = dashboard.getInvitationSummaries().filter((invitation) => invitation.status === "PENDING");
  const respond = (id: string, response: "ACCEPTED" | "DECLINED") => {
    dashboard.respondToInvitation(id, response);
    toastMsg.success(response === "ACCEPTED" ? "Invitación aceptada" : "Invitación rechazada", response === "ACCEPTED" ? "La organización ya aparece en tu hub." : "La invitación se movió al historial.");
  };
  return (
    <section data-demo="invitations" aria-labelledby="invitaciones-title">
      <div className="flex items-center gap-2">
        <h2 id="invitaciones-title" className="text-base font-medium">
          Invitaciones
        </h2>
        {invitations.length > 0 && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {invitations.length}
          </span>
        )}
      </div>

      {invitations.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={MailOpen}
            title="Sin invitaciones pendientes"
            description="Cuando alguien te invite a su organización, lo verás aquí."
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="flex flex-wrap items-center justify-between gap-3 gap-y-5 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex gap-3">
                <div className="flex mt-0.5 size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Clock3 className="size-4" />
                </div>
                <div>
                  <p className="text-base font-medium">{invitation.orgName}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.invitedBy} te invitó como {invitation.role} ·
                    expira en {invitation.expiresIn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="text-sm px-3 rounded-full" onClick={() => respond(invitation.id, "DECLINED")}>
                  <X /> Rechazar
                </Button>
                <Button type="button" className="text-sm px-3 rounded-full" onClick={() => respond(invitation.id, "ACCEPTED")}>
                  <Check /> Aceptar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
