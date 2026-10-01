"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  Crown,
  Megaphone,
  PackageSearch,
  Shield,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { assignableRoles, type TeamMember } from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  Crown,
  Shield,
  ShoppingBag,
  Wallet,
  Calculator,
  PackageSearch,
  Megaphone,
};

/** Resuelve el ícono de rol a un componente lucide (fallback: Shield). */
export const roleIcon = (iconName: string): LucideIcon =>
  FALLBACK_ICONS[iconName] ?? Shield;

interface RoleChangeDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Devuelve el id del miembro y el id del rol elegido. */
  onConfirm: (memberId: string, roleId: string) => void;
}

/**
 * Dialog de «Cambiar rol».
 *
 * Lista los perfiles asignables (excluye Owner; no se puede otorgar la
 * propiedad desde aquí) y muestra, para cada uno, su descripción y un resumen
 * de los permisos que traerá.
 */
export const RoleChangeDialog = ({
  member,
  open,
  onOpenChange,
  onConfirm,
}: RoleChangeDialogProps) => {
  const roles = useTeamStore((s) => s.roles);
  const [roleId, setRoleId] = useState<string>("");

  const options = useMemo(() => assignableRoles(roles), [roles]);

  useEffect(() => {
    if (member) {
      const target = options.find((r) => r.id === member.roleId) ?? options[0];
      setRoleId(target?.id ?? "");
    }
  }, [member, options]);

  const selected = options.find((r) => r.id === roleId);
  const hasPermissions = (r: typeof options[number]) =>
    Object.values(r.permissions).some((lvl) => lvl !== "none");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar rol</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo rol para{" "}
            <span className="font-medium text-foreground">
              {member?.name ?? "…"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2.5">
          <div className="flex flex-wrap gap-2">
            {options.map((r) => {
              const Icon = roleIcon(r.icon);
              const isSelected = r.id === roleId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleId(r.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>

          {selected && (
            <p className="text-sm text-muted-foreground">
              {selected.description}
              {!hasPermissions(selected) && " · Sin permisos asignados aún"}
            </p>
          )}
        </div>

        <DialogFooter className="gap-x-1">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-3 rounded-full"
          >
            Cancelar
          </Button>
          <Button
            disabled={!member || !selected || selected.id === member.roleId}
            onClick={() => member && selected && onConfirm(member.id, selected.id)}
            className="px-3 rounded-full"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};