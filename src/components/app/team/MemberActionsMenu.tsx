"use client";

import {
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
import type { TeamMember } from "@/lib/mock/team";

interface MemberActionsMenuProps {
  member: TeamMember;
  onPreview: (member: TeamMember) => void;
  onRequestRoleChange: (member: TeamMember) => void;
  onToggleAccess: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Menú de acciones (⋮) de un integrante.
 *
 * Lo comparten la vista de tabla y la de cards para que las acciones sean
 * idénticas. Detiene la propagación del clic para no abrir el preview desde la
 * fila/card subyacente.
 */
export const MemberActionsMenu = ({
  member,
  onPreview,
  onRequestRoleChange,
  onToggleAccess,
  onRemove,
}: MemberActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
        aria-label={`Acciones de ${member.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onPreview(member)} className="py-1.5 px-2">
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
  );
};