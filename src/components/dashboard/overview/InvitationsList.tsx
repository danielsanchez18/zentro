"use client";

import Link from "next/link";
import { Clock3, MailOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toastMsg } from "@/components/ui/toast-message";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import { hubButton, hubChip } from "@/components/dashboard/shared/styles";
import { cn } from "@/lib/utils";

/**
 * Invitaciones pendientes del usuario.
 * TODO(0.2): leer desde `GET /invitations` y manejar aceptar/declinar.
 */
export const InvitationsList = () => {
  const dashboard = useDashboardStore();
  const invitations = dashboard.getInvitationSummaries().filter((invitation) => invitation.status === "PENDING");
  const respond = (id: string, response: "ACCEPTED" | "DECLINED") => {
    dashboard.respondToInvitation(id, response);
    toastMsg.success(
      response === "ACCEPTED" ? "Invitación aceptada" : "Invitación rechazada",
      response === "ACCEPTED" ? "La organización ya aparece en tu hub." : "La invitación se movió al historial.",
    );
  };

  return (
    <section
      data-demo="invitations"
      aria-labelledby="invitaciones-title"
      className="rounded-sm bg-card px-4 py-3 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="invitaciones-title" className="font-sans text-base font-medium">
            Invitaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            {invitations.length === 0
              ? "No tienes invitaciones pendientes."
              : `${invitations.length} pendiente${invitations.length === 1 ? "" : "s"} de respuesta`}
          </p>
        </div>
        <Link
          href="/dashboard/invitaciones"
          className={hubButton.secondary}
        >
          Ver historial
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border">
          <EmptyState
            icon={MailOpen}
            title="Sin invitaciones pendientes"
            description="Cuando alguien te invite a su organización, lo verás aquí."
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
                  <CompanyIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{invitation.orgName}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.invitedBy} te invitó como{" "}
                    <span className="text-foreground">{invitation.role}</span>
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-1.5 sm:w-auto">
                <span className={cn(hubChip, "mr-auto bg-muted text-muted-foreground sm:mr-2")}>
                  <Clock3 className="size-3.5" />
                  Expira en {invitation.expiresIn}
                </span>
                <button
                  type="button"
                  onClick={() => respond(invitation.id, "DECLINED")}
                  className={hubButton.secondary}
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => respond(invitation.id, "ACCEPTED")}
                  className={hubButton.primary}
                >
                  Aceptar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
