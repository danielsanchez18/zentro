"use client";

import { useMemo, useState } from "react";
import { Users, MailCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastMsg } from "@/components/ui/toast-message";
import { Title } from "./Title";
import { KPIS } from "./KPIS";
import { List } from "./List";
import { InvitationsSection } from "./InvitationsSection";
import { InviteMemberDialog } from "./InviteMemberDialog";
import {
  type TeamMember,
  type MemberInvitation,
  type TeamRole,
} from "@/lib/mock/team";

interface TeamModuleProps {
  slug: string;
  members: TeamMember[];
  /** Historial de invitaciones (mock); se conectará a la API más adelante. */
  invitations?: MemberInvitation[];
}

type TeamTab = "members" | "invitations";

export const TABS: { id: TeamTab; label: string; icon: typeof Users }[] = [
  { id: "members", label: "Miembros", icon: Users },
  { id: "invitations", label: "Invitaciones", icon: MailCheck },
];

const addDays = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/**
 * Contenedor del módulo Equipo y permisos.
 *
 * Mantiene el estado del dialog de invitación y el historial de invitaciones,
 * separado de la lista de miembros. `Title` (botón "Invitar miembro"),
 * la lista de miembros y el tab de invitaciones comparten este estado.
 */
export const TeamModule = ({
  slug,
  members,
  invitations: initialInvitations = [],
}: TeamModuleProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [tab, setTab] = useState<TeamTab>("members");
  // Historial de invitaciones (pendientes + cerradas).
  const [invitations, setInvitations] =
    useState<MemberInvitation[]>(initialInvitations);

  const pendingCount = useMemo(
    () => invitations.filter((i) => i.status === "PENDING").length,
    [invitations],
  );

  const handleSendInvite = (
    email: string,
    role: TeamRole,
    message?: string,
  ) => {
    const normalized = email.trim().toLowerCase();

    // Regla de negocio: como mucho 1 invitación activa por correo.
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

    const now = new Date().toISOString();
    const invitation: MemberInvitation = {
      id: `inv_${now}`,
      email: normalized,
      role,
      status: "PENDING",
      sentBy: "Daniel Sánchez", // mock: usuario de la sesión
      sentAt: now,
      expiresAt: addDays(now, 7),
    };

    setInvitations((prev) => [invitation, ...prev]);
    setTab("invitations");
    setInviteOpen(false);
    toastMsg.success(
      "Invitación enviada",
      message
        ? `Correo enviado a ${normalized} como ${role}. Mensaje incluido: “${message}”.`
        : `Correo enviado a ${normalized} como ${role}.`,
    );
  };

  const handleRevoke = (id: string) => {
    const target = invitations.find((i) => i.id === id);
    setInvitations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "REVOKED" } : i)),
    );
    toastMsg.info(
      "Invitación revocada",
      target ? `El enlace de ${target.email} ya no es válido.` : undefined,
    );
  };

  const handleReinvite = (id: string) => {
    const target = invitations.find((i) => i.id === id);
    if (!target) return;

    const now = new Date().toISOString();
    // Reenviar revoca la anterior y genera una nueva PENDING (recibiría un
    // correo nuevo en el flujo real).
    setInvitations((prev) => [
      {
        id: `inv_${now}`,
        email: target.email,
        role: target.role,
        status: "PENDING" as const,
        sentBy: "Daniel Sánchez",
        sentAt: now,
        expiresAt: addDays(now, 7),
      },
      ...prev.map((i) =>
        i.id === id ? { ...i, status: "REVOKED" as const } : i,
      ),
    ]);
    toastMsg.success("Invitación reenviada", `Nuevo enlace enviado a ${target.email}.`);
  };

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title onInvite={() => setInviteOpen(true)} />
      <KPIS members={members} pendingInvitations={pendingCount} />

      {/* Tabs: Miembros / Invitaciones */}
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
            <List
              initialMembers={members}
              slug={slug}
            />
          ) : (
            <InvitationsSection
              invitations={invitations}
              onRevoke={handleRevoke}
              onReinvite={handleReinvite}
            />
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