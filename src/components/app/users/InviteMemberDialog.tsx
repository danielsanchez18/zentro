"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MockRole } from "@/lib/mock/users";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: MockRole[];
  memberLimit: number;
  membersCount: number;
  onInvite: (email: string, roleId: string) => void;
  currentUserEmail: string;
}

/** Modal para invitar a un miembro al negocio. */
export function InviteMemberDialog({
  open,
  onOpenChange,
  roles,
  memberLimit,
  membersCount,
  onInvite,
  currentUserEmail,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string>(
    roles.find((r) => !r.system)?.id ?? roles[0]?.id ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("El email es obligatorio.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Ingresa un email válido.");
      return;
    }
    if (trimmed.toLowerCase() === currentUserEmail.toLowerCase()) {
      setError("No puedes invitarte a ti mismo: ya eres miembro.");
      return;
    }
    setError(null);
    onInvite(trimmed, roleId);
    setEmail("");
    onOpenChange(false);
  };

  const atLimit = membersCount >= memberLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar miembro</DialogTitle>
          <DialogDescription>
            Enviaremos un email con un enlace de activación (válido por 7 días).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="invite-role" className="text-sm font-medium">
              Rol
            </label>
            <Select
              value={roleId}
              onValueChange={(v) => setRoleId(String(v))}
              items={roles.map((r) => ({
                label: r.system ? `${r.name} (sistema)` : r.name,
                value: r.id,
              }))}
            >
              <SelectTrigger className="w-full" id="invite-role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                    {role.system ? " (sistema)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {atLimit && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Has llegado al límite de {memberLimit} miembros de tu plan. Mejora
              tu plan para seguir invitando.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={atLimit}>
            <UserPlus className="size-4" />
            Enviar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}