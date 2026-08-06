import { Building2 } from "lucide-react";
import type { MockMember, MockRole } from "@/lib/mock/users";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { MemberActions } from "./MemberActions";

interface MemberRowProps {
  member: MockMember;
  role?: MockRole;
  canAct: boolean;
  onSuspend: (member: MockMember) => void;
  onReactivate: (member: MockMember) => void;
  onRemove: (member: MockMember) => void;
  onChangeRole: (member: MockMember) => void;
}

/** Fila de la tabla de miembros. */
export function MemberRow({
  member,
  role,
  canAct,
  onSuspend,
  onReactivate,
  onRemove,
  onChangeRole,
}: MemberRowProps) {
  return (
    <TableRow>

      {/* Identidad */}
      <TableCell>
        <div className="flex min-w-0 items-center gap-3 font-heading">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
            {member.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium">
              {member.name}
              {member.isSelf && (
                <span>(Tú)</span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Rol */}
      <TableCell>
        <div className="flex items-center gap-2 text-sm">
          {/* <ShieldCheck className="size-4 shrink-0 text-muted-foreground md:hidden" /> */}
          <span className={role?.system ? "font-medium" : ""}>{role?.name ?? "—"}</span>
        </div>
      </TableCell>

      {/* Sucursales */}
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="size-4 shrink-0 md:hidden" />
          {member.branches === "ALL" ? "Todas" : `${member.branches.length} sucursal(es)`}
        </div>
      </TableCell>

      {/* Estado */}
      <TableCell>
        <StatusBadge status={member.status} />
      </TableCell>

      {/* Acciones */}
      <TableCell className="text-right">
        <div className="flex justify-end">
          <MemberActions
            member={member}
            canAct={canAct}
            onSuspend={onSuspend}
            onReactivate={onReactivate}
            onRemove={onRemove}
            onChangeRole={onChangeRole}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}