"use client";

import { Clock, Mail, Monitor, User } from "lucide-react";
import type { TeamMember } from "@/lib/mock/team";
import { StatusBadge } from "../shared/StatusBadge";
import { LastSeenChip } from "./Table";
import { MemberActionsMenu } from "./MemberActionsMenu";

interface MemberCardProps {
  member: TeamMember;
  onPreview: (member: TeamMember) => void;
  onRequestRoleChange: (member: TeamMember) => void;
  onRequestToggleAccess: (member: TeamMember) => void;
  onRequestRemove: (member: TeamMember) => void;
}

/**
 * Vista «cards» del integrante (alternativa a la tabla).
 *
 * Estructura:
 *  [Foto] Nombre ⋯
 *         Rol
 *  - - - - - - - - -
 *  Correo · Última actividad
 *  - - - - - - - - -
 *  Estado
 *
 * La card completa es clicable → abre el preview del perfil.
 */
export const MemberCard = ({
  member,
  onPreview,
  onRequestRoleChange,
  onRequestToggleAccess,
  onRequestRemove,
}: MemberCardProps) => {
  return (
    <div
      onClick={() => onPreview(member)}
      className="group cursor-pointer rounded-xl border border-border p-4 transition-all hover:border-primary"
    >
      {/* Foto · Nombre + rol · acciones ⋯ */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-accent flex justify-center items-center size-10 shrink-0 overflow-hidden rounded-full">
            <User className="size-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <MemberActionsMenu
          member={member}
          onPreview={onPreview}
          onRequestRoleChange={onRequestRoleChange}
          onRequestToggleAccess={onRequestToggleAccess}
          onRequestRemove={onRequestRemove}
        />
      </div>

      <div className="my-3 border-t border-border" />

      {/* Correo y última actividad */}
      <dl className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="size-3.5" />
          <dd className="truncate text-sm">{member.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="size-3.5" />
          <dd>
            <LastSeenChip lastSeen={member.lastSeen} />
          </dd>
        </div>
      </dl>

      <div className="my-3 border-t border-border" />

      {/* Estado */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Estado
        </span>
        <StatusBadge status={member.status} />
      </div>
    </div>
  );
};