"use client";

import {
  User,
  MoreHorizontal,
  Eye,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MemberStatus, TeamMember } from "@/lib/mock/team";

interface TableProps {
  members: TeamMember[];
  /** Se dispara al hacer clic en una fila o en «Ver detalle» del menú. */
  onPreview: (member: TeamMember) => void;
  onRequestRoleChange: (member: TeamMember) => void;
  onToggleAccess: (id: string) => void;
  onRemove: (id: string) => void;
}

const STATUS_STYLES: Record<MemberStatus, string> = {
  activo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  invitado: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  deshabilitado: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<MemberStatus, string> = {
  activo: "Activo",
  invitado: "Pendiente",
  deshabilitado: "Deshabilitado",
};

/** Chip de estado (Estilo base-nova, como InvitationStatusChip). */
export const StatusChip = ({ status }: { status: MemberStatus }) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
      STATUS_STYLES[status],
    )}
  >
    {STATUS_LABEL[status]}
  </span>
);

/** Badge de «última conexión» con el mismo estilo base-nova. */
export const LastSeenChip = ({ lastSeen }: { lastSeen: string }) => {
  if (lastSeen === "online") {
    return (
      <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium uppercase font-sans tracking-wide bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium uppercase font-sans tracking-wide bg-muted text-muted-foreground">
      {lastSeen === "nunca" ? "Nunca se conectó" : lastSeen}
    </span>
  );
};

export const Table = ({
  members,
  onPreview,
  onRequestRoleChange,
  onToggleAccess,
  onRemove,
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
                <StatusChip status={member.status} />
              </td>
              <td className="px-5 py-3 text-sm text-nowrap">
                <LastSeenChip lastSeen={member.lastSeen} />
              </td>
              <td className="px-5 py-3 text-right text-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                    aria-label={`Acciones de ${member.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => onPreview(member)}
                      className="py-1.5 px-2"
                    >
                      <Eye />
                      Ver detalle
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onRequestRoleChange(member)}
                      className="py-1.5 px-2"
                    >
                      <ShieldCheck />
                      Cambiar rol
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {member.status === "deshabilitado" ? (
                      <DropdownMenuItem
                        onClick={() => onToggleAccess(member.id)}
                        className="py-1.5 px-2"
                      >
                        <UserCheck />
                        Habilitar acceso
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onToggleAccess(member.id)}
                        className="py-1.5 px-2"
                      >
                        <UserX />
                        Deshabilitar acceso
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onRemove(member.id)}
                      className="py-1.5 px-2"
                    >
                      <Trash2 />
                      Eliminar de la empresa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};