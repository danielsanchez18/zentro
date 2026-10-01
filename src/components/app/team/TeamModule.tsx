"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Users, MailCheck, ShieldCheck, UserKey } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { Title } from "./Title";
import { KPIS } from "./KPIS";
import { List } from "./List";
import { InvitationsSection } from "./InvitationsSection";
import { RolesSection } from "./roles/RolesSection";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { useTeamStore } from "@/stores/team-store";

interface TeamModuleProps {
  slug: string;
}

type TeamTab = "members" | "invitations" | "roles";

export const TABS: { id: TeamTab; label: string; icon: typeof Users }[] = [
  { id: "members", label: "Miembros", icon: Users },
  { id: "invitations", label: "Invitaciones", icon: MailCheck },
  { id: "roles", label: "Roles y permisos", icon: UserKey },
];

/**
 * Contenedor del módulo Equipo y permisos.
 *
 * Los datos (miembros, invitaciones, roles) viven en `useTeamStore` (mock por
 * ahora; al conectar la API solo cambia el origen del store). Este componente
 * orquesta los tabs, el estado del dialog de invitación y los toasts.
 */
export const TeamModule = ({ slug }: TeamModuleProps) => {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as TeamTab | null;

  const [inviteOpen, setInviteOpen] = useState(false);
  const [tab, setTab] = useState<TeamTab>(() =>
    urlTab === "roles" || urlTab === "invitations" ? urlTab : "members",
  );

  useEffect(() => {
    if (urlTab === "roles" || urlTab === "invitations" || urlTab === "members") {
      setTab(urlTab);
    }
  }, [urlTab]);
  const members = useTeamStore((s) => s.members);
  const invitations = useTeamStore((s) => s.invitations);
  const sendInvitation = useTeamStore((s) => s.sendInvitation);
  const revokeInvitation = useTeamStore((s) => s.revokeInvitation);

  const pendingCount = useMemo(
    () => invitations.filter((i) => i.status === "PENDING").length,
    [invitations],
  );

  const handleSendInvite = (
    email: string,
    roleId: string,
    locationScope: "ALL" | "SELECTED",
    locationIds: string[],
    message?: string,
  ) => {
    const normalized = email.trim().toLowerCase();
    const active = invitations.find(
      (i) => i.email.toLowerCase() === normalized && i.status === "PENDING",
    );
    if (active) {
      setInviteOpen(false);
      toastMsg.info(
        "Invitación ya activa",
        `${normalized} ya tiene una invitación pendiente. Revócala o reenvíala desde el historial.`,
      );
      return;
    }

    const invitation = sendInvitation({
      email: normalized,
      roleId,
      locationScope,
      locationIds,
      message,
    });
    setTab("invitations");
    setInviteOpen(false);
    toastMsg.success(
      "Invitación enviada",
      message
        ? `Correo enviado a ${normalized} como ${invitation.roleName}. Mensaje incluido: “${message}”.`
        : `Correo enviado a ${normalized} como ${invitation.roleName}.`,
    );
  };

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title onInvite={() => setInviteOpen(true)} />
      <KPIS members={members} pendingInvitations={pendingCount} />

      {/* Tabs: Miembros / Invitaciones / Roles y permisos */}
      <div>
        <div className="flex w-full items-center gap-1 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-selected={tab === id}
              className={cn(
                "relative -mb-px flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                tab === id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
              {id === "invitations" && pendingCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-1.5 leading-none text-[11px] font-semibold text-primary">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 sm:mt-6">
          {tab === "members" ? (
            <List slug={slug} />
          ) : tab === "invitations" ? (
            <InvitationsSection
              invitations={invitations}
              onRevoke={revokeInvitation}
            />
          ) : (
            <RolesSection slug={slug} />
          )}
        </div>
      </div>

      {/* El dialog de invitación es compartido por ambos tabs. */}
      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSend={handleSendInvite}
      />
    </div>
  );
};
