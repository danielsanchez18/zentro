"use client";

import { useMemo, useState } from "react";
import { Mail, RefreshCw, SearchX, User, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Search } from "../shared/Search";
import { StatusBadge } from "../shared/StatusBadge";
import type { MemberInvitation } from "@/lib/mock/team";

interface InvitationsSectionProps {
  invitations: MemberInvitation[];
  onRevoke: (id: string) => void;
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

const initials = (email: string) => {
  const local = email.split("@")[0];
  const words = local.split(/[._-]+/).filter(Boolean);
  if (words.length === 0) return email.slice(0, 2).toUpperCase();
  return words
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Tab «Invitaciones» del módulo Equipo.
 * Muestra el historial completo como una grilla de cards.
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
                ? `No encontramos invitaciones que coincidan con "${query}".`
                : "Cuando invites a alguien, su invitación aparecerá aquí."
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((invitation) => (
            <div
              key={invitation.id}
              className="rounded-xl border border-border p-4 transition-colors"
            >
              {/* Header: avatar + email */}
              <div className="flex items-center gap-3">
                <div className="bg-accent flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {initials(invitation.email)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {invitation.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invitation.role}
                  </p>
                </div>
              </div>

              <div className="my-3 border-t border-border" />

              {/* Metadata */}
              <dl className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-3.5" />
                  <span>Enviada por {invitation.sentBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5" />
                  <span>{formatDate(invitation.sentAt)}</span>
                  {invitation.status === "PENDING" && (
                    <span className="text-amber-600 dark:text-amber-400">
                      · Expira {formatDate(invitation.expiresAt)}
                    </span>
                  )}
                </div>
              </dl>

              {/* Footer: actions or status badge */}
              <div className="my-3 border-t border-border" />
              {invitation.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => onReinvite(invitation.id)}
                    className="flex-1 px-3 rounded-full text-sm"
                  >
                    <Mail className="size-3.5" />
                    Reenviar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onRevoke(invitation.id)}
                    className="flex-1 px-3 rounded-full text-sm"
                  >
                    <X className="size-3.5" />
                    Revocar
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <StatusBadge status={invitation.status} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};