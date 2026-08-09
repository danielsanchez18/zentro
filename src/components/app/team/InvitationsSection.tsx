"use client";

import { useMemo, useState } from "react";
import { Mail, RefreshCw, SearchX, X, XCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Search } from "../shared/Search";
import { StatusBadge } from "../shared/StatusBadge";
import type { MemberInvitation } from "@/lib/mock/team";

interface InvitationsSectionProps {
  invitations: MemberInvitation[];
  /** Marca la invitación como REVOKED (queda en el historial). */
  onRevoke: (id: string) => void;
  /** Simula el reenvío: revoca la anterior y deja la nueva PENDING. */
  onReinvite: (id: string) => void;
}

const statOf = (invitations: MemberInvitation[], status: string) =>
  invitations.filter((i) => i.status === status).length;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Tab «Invitaciones» del módulo Equipo.
 *
 * Muestra el historial completo (pendientes + cerradas) con el ciclo de vida
 * de cada invitación y acciones de seguimiento para las pendientes.
 */
export const InvitationsSection = ({
  invitations,
  onRevoke,
  onReinvite,
}: InvitationsSectionProps) => {
  const [query, setQuery] = useState("");

  const pending = statOf(invitations, "PENDING");
  const accepted = statOf(invitations, "ACCEPTED");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invitations;
    return invitations.filter((i) => i.email.toLowerCase().includes(q));
  }, [invitations, query]);

  return (
    <div className="sm:p-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card space-y-5">
      <div className="w-full md:max-w-md">
        <Search
          placeholder="Buscar por correo"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin invitaciones"
            description={
              query
                ? `No encontramos invitaciones que coincidan con “${query}”.`
                : "Cuando invites a alguien, su invitación aparecerá aquí."
            }
          />
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((invitation) => (
            <li
              key={invitation.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {invitation.email}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {invitation.role} · Enviada por {invitation.sentBy} ·{" "}
                  {formatDate(invitation.sentAt)}
                  {invitation.status === "PENDING" &&
                    ` · Expira ${formatDate(invitation.expiresAt)}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {invitation.status === "PENDING" ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => onReinvite(invitation.id)}
                      className="px-3 rounded-full text-sm"
                    >
                      <Mail className="size-3.5" />
                      Reenviar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRevoke(invitation.id)}
                      className="px-3 rounded-full text-sm"
                    >
                      <X className="size-3.5" />
                      Revocar
                    </Button>
                  </>
                ) : (
                  <StatusBadge status={invitation.status} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};