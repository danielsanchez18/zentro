"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/mock/team";
import { StatusBadge } from "../shared/StatusBadge";
import { MemberActionsMenu } from "./MemberActionsMenu";

interface TableProps {
  members: TeamMember[];
  /** Se dispara al hacer clic en una fila o en «Ver detalle» del menú. */
  onPreview: (member: TeamMember) => void;
  onRequestRoleChange: (member: TeamMember) => void;
  onRequestToggleAccess: (member: TeamMember) => void;
  onRequestRemove: (member: TeamMember) => void;
}

/** Badge de «última conexión» con el mismo estilo base-nova. */
export const LastSeenChip = ({ lastSeen }: { lastSeen: string }) => {
  if (lastSeen === "online") {
    return (
      <div className="flex items-center gap-x-1.5">
        <div className="size-1.5 rounded-full bg-green-500" />
        <span className="text-sm">Online</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-x-1.5 text-muted-foreground">
      <div className="size-1.5 rounded-full bg-neutral-500 dark:bg-neutral-400" />
      <span className="text-sm first-letter:uppercase">{lastSeen === "nunca" ? "Nunca se conectó" : lastSeen}</span>
    </div>

  );
};

export const Table = ({
  members,
  onPreview,
  onRequestRoleChange,
  onRequestToggleAccess,
  onRequestRemove,
}: TableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full">
        <thead>
          <tr className="bg-accent">
            <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
              Nombre
            </th>
            <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
              Rol
            </th>
            <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
              Estado
            </th>
            <th className="px-5 py-3 text-left text-xs font-heading uppercase font-semibold text-nowrap">
              Última conexión
            </th>
            <th className="px-5 py-3 text-right text-xs font-heading uppercase font-semibold text-nowrap">
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => (
            <tr
              key={member.id}
              className="cursor-pointer hover:bg-muted/30"
              onClick={() => onPreview(member)}
            >
              <td className="px-5 py-3 text-sm text-nowrap">
                <div className="flex items-center gap-2">
                  <div className="bg-accent flex justify-center items-center size-10 overflow-hidden rounded-full">
                    <User className="size-4.5" />
                  </div>
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <span className="block text-muted-foreground text-xs">
                      {member.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <span className="font-medium text-sm">{member.role}</span>
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <StatusBadge status={member.status} />
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <LastSeenChip lastSeen={member.lastSeen} />
              </td>
              <td className="px-5 py-3 text-right text-nowrap">
                <MemberActionsMenu
                  member={member}
                  onPreview={onPreview}
                  onRequestRoleChange={onRequestRoleChange}
                  onRequestToggleAccess={onRequestToggleAccess}
                  onRequestRemove={onRequestRemove}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};