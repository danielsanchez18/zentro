"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
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
import { TEAM_ROLES, type TeamMember, type TeamRole } from "@/lib/mock/team";

interface RoleChangeDialogProps {
  /** Integrante cuyo rol se edita (null = cerrado sin destino). */
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (member: TeamMember, role: TeamRole) => void;
}

/**
 * Dialog de «Cambiar rol».
 * Se usa desde el menú de acciones de la tabla de Equipo. Debe vivimir dentro
 * de un componente cliente (p. ej. List) que maneje el estado del miembro.
 */
export const RoleChangeDialog = ({
  member,
  open,
  onOpenChange,
  onConfirm,
}: RoleChangeDialogProps) => {
  const [role, setRole] = useState<TeamRole>(member?.role ?? TEAM_ROLES[0]);

  // Al abrir para un miembro, preselecciona su rol actual.
  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar rol</DialogTitle>
          <DialogDescription>
            Selecciona el nuevo rol para{" "}
            <span className="font-medium text-foreground">
              {member?.name ?? "…"}
            </span>
            . El cambio aplica de inmediato.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2" role="radiogroup" aria-label="Roles">
          {TEAM_ROLES.map((r) => {
            const selected = r === role;
            return (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer text-start",
                  "hover:bg-accent/50",
                  selected && "border-primary/50 bg-primary/5 text-primary hover:bg-primary/5",
                )}
              >
                {r}
                {selected && <Check className="size-4 text-primary" />}
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-x-1">
          <Button variant="outline" onClick={() => onOpenChange(false)}
            className="px-3 rounded-full">
            Cancelar
          </Button>
          <Button
            disabled={!member || role === member.role}
            onClick={() => member && onConfirm(member, role)}
            className="px-3 rounded-full"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};