"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  Crown,
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
import { TEAM_ROLES, type TeamMember, type TeamRole } from "@/lib/mock/team";

const ROLE_META: Record<TeamRole, { icon: LucideIcon; description: string }> = {
  Owner: {
    icon: Crown,
    description: "Control total de la organización",
  },
  Admin: {
    icon: Shield,
    description: "Gestiona equipo y configuración",
  },
  Vendedor: {
    icon: ShoppingBag,
    description: "Realiza ventas y gestiona clientes",
  },
  Cajero: {
    icon: Wallet,
    description: "Opera el punto de venta",
  },
  Contador: {
    icon: Calculator,
    description: "Accede a reportes y finanzas",
  },
};

interface RoleChangeDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (member: TeamMember, role: TeamRole) => void;
}

export const RoleChangeDialog = ({
  member,
  open,
  onOpenChange,
  onConfirm,
}: RoleChangeDialogProps) => {
  const [role, setRole] = useState<TeamRole>(member?.role ?? TEAM_ROLES[0]);

  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

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

        <div className="grid gap-2">
          {TEAM_ROLES.map((r) => {
            const selected = r === role;
            const { icon: Icon, description } = ROLE_META[r];
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors cursor-pointer",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-accent/50",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {r}
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                {selected && (
                  <div className="ml-auto size-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
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