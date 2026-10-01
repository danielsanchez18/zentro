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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { TeamMember } from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";

interface MemberActionsMenuProps {
  member: TeamMember;
  onPreview: (member: TeamMember) => void;
  onRequestRoleChange: (member: TeamMember) => void;
  onRequestToggleAccess: (member: TeamMember) => void;
  onRequestRemove: (member: TeamMember) => void;
}

/**
 * Menú de acciones (⋮) de un integrante.
 *
 * Protecciones (regla de producto 09/09/2026):
 * - El Owner (titular) no se puede deshabilitar, eliminar ni cambiar de rol.
 * - Solamente puede editarse su perfil (ver detalle) y transferir la
 *   propiedad (flujo futuro, desde el detalle).
 */
export const MemberActionsMenu = ({
  member,
  onPreview,
  onRequestRoleChange,
  onRequestToggleAccess,
  onRequestRemove,
}: MemberActionsMenuProps) => {
  const isOwner = useTeamStore(
    (s) => s.findRoleById(member.roleId)?.kind === "owner",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
        aria-label={`Acciones de ${member.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={() => onPreview(member)}
          className="py-1.5 px-2"
        >
          <Eye />
          Ver detalle
        </DropdownMenuItem>

        {!isOwner && (
          <>
            <DropdownMenuItem
              disabled={isOwner}
              onClick={() => onRequestRoleChange(member)}
              className="py-1.5 px-2"
            >
              <ShieldCheck />
              Cambiar rol
            </DropdownMenuItem>
          </>
        )}

        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-sm font-medium text-muted-foreground px-2">
              El rol Owner es del titular y no puede modificarse desde aquí.
            </DropdownMenuLabel>
          </>
        )}

        {!isOwner && (
          <>
            <DropdownMenuSeparator />

            {member.status === "deshabilitado" ? (
              <DropdownMenuItem
                onClick={() => onRequestToggleAccess(member)}
                className="py-1.5 px-2"
              >
                <UserCheck />
                Habilitar acceso
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onRequestToggleAccess(member)}
                className="py-1.5 px-2"
              >
                <UserX />
                Deshabilitar acceso
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRequestRemove(member)}
              className="py-1.5 px-2"
            >
              <Trash2 />
              Eliminar de la empresa
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
