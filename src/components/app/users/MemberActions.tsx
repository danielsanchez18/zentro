import { Ban, MoreHorizontal, Pencil, RotateCcw, User, UserRoundX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import type { MockMember } from "@/lib/mock/users";

interface MemberActionsProps {
  member: MockMember;
  canAct: boolean;
  onSuspend: (member: MockMember) => void;
  onReactivate: (member: MockMember) => void;
  onRemove: (member: MockMember) => void;
  onChangeRole: (member: MockMember) => void;
}

/** Menú de acciones de un miembro (solo visible si canAct). */
export function MemberActions({
  member,
  canAct,
  onSuspend,
  onReactivate,
  onRemove,
  onChangeRole,
}: MemberActionsProps) {
  if (!canAct) return <span className="size-8" aria-hidden="true" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Acciones de ${member.name}`}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm flex items-center gap-x-2">
            <User className="size-4" />
            {member.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={member.status === "SUSPENDED"}
            onSelect={() => onChangeRole(member)}
            className="cursor-pointer py-1.5"
          >
            <Pencil className="size-4" />
            Cambiar rol
          </DropdownMenuItem>
          {member.status === "ACTIVE" ? (
            <DropdownMenuItem
              onSelect={() => onSuspend(member)}
              className="cursor-pointer py-1.5"
            >
              <Ban className="size-4" />
              Suspender acceso
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => onReactivate(member)}
              className="cursor-pointer py-1.5"
            >
              <RotateCcw className="size-4" />
              Reactivar acceso
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => onRemove(member)}
            className="cursor-pointer py-1.5"
          >
            <UserRoundX className="size-4" />
            Eliminar del negocio
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}