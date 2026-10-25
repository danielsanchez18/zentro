"use client";

import { useState } from "react";
import { History, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { InvitationCard } from "@/components/dashboard/invitaciones/InvitationCard";
import { useDashboardStore } from "@/stores/dashboard-store";
import { toastMsg } from "@/components/ui/toast-message";
import { hubTabs } from "@/components/dashboard/shared/styles";

type Tab = "PENDING" | "HISTORY";

export const InvitationsPage = () => {
  const [tab, setTab] = useState<Tab>("PENDING");
  const dashboard = useDashboardStore();
  const invitations = dashboard.getInvitationSummaries();
  const pending = invitations.filter((invitation) => invitation.status === "PENDING");
  const history = invitations.filter((invitation) => invitation.status !== "PENDING");

  const respond = (id: string, response: "ACCEPTED" | "DECLINED") => {
    dashboard.respondToInvitation(id, response);
    toastMsg.success(
      response === "ACCEPTED" ? "Invitación aceptada" : "Invitación rechazada",
      response === "ACCEPTED"
        ? "Ya puedes entrar a la organización desde tu hub."
        : "La invitación quedó registrada en el historial.",
    );
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "PENDING", label: "Pendientes", count: pending.length },
    { key: "HISTORY", label: "Historial", count: history.length },
  ];
  const visible = tab === "PENDING" ? pending : history;

  return (
    <div className="space-y-2">
      <div className="rounded-sm bg-card px-4 py-3">
        <h1 className="font-sans text-lg font-medium">Invitaciones</h1>
        <p className="text-sm text-muted-foreground">
          Acepta o rechaza las invitaciones para unirte a otras organizaciones.
        </p>
      </div>

      <section aria-label="Listado de invitaciones" className="space-y-5 rounded-sm bg-card px-4 py-3">
        <div role="tablist" aria-label="Filtrar invitaciones" className={hubTabs.list}>
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                hubTabs.tab,
                tab === item.key
                  ? hubTabs.active
                  : hubTabs.idle,
              )}
            >
              {item.label}
              <span className="text-xs text-muted-foreground">{item.count}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border">
            {tab === "PENDING" ? (
              <EmptyState
                icon={MailOpen}
                title="Sin invitaciones pendientes"
                description="Cuando alguien te invite a su organización, lo verás aquí."
              />
            ) : (
              <EmptyState
                icon={History}
                title="Sin historial"
                description="Las invitaciones que aceptes o rechaces aparecerán aquí."
              />
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {visible.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onAccept={() => respond(invitation.id, "ACCEPTED")}
                onDecline={() => respond(invitation.id, "DECLINED")}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
