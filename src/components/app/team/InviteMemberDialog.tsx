"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Mail, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { assignableRoles, type LocationScope } from "@/lib/mock/team";
import { useTeamStore } from "@/stores/team-store";
import { roleIcon } from "./RoleChangeDialog";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 500;

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Devuelve correo normalizado, id de rol, alcance y mensaje (opcional). */
  onSend: (
    email: string,
    roleId: string,
    locationScope: LocationScope,
    locationIds: string[],
    message?: string,
  ) => void;
}

/**
 * Dialog de «Invitar miembro».
 *
 * Flujo en un solo paso: correo → perfil de acceso (chips) → mensaje (opcional) → enviar.
 * El rol elegido define tanto los permisos como el alcance de ubicaciones.
 * El Owner nunca aparece como opción (no se puede invitar un propietario).
 */
export const InviteMemberDialog = ({
  open,
  onOpenChange,
  onSend,
}: InviteMemberDialogProps) => {
  const roles = useTeamStore((s) => s.roles);

  const options = useMemo(() => assignableRoles(roles), [roles]);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const showError = touched && !emailValid;

  // Al abrir el dialog se limpia el estado anterior.
  useEffect(() => {
    if (open) {
      setEmail("");
      setRoleId(options[0]?.id ?? "");
      setMessage("");
      setTouched(false);
    }
  }, [open, options]);

  const selectedRole = options.find((r) => r.id === roleId);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValid || !selectedRole) {
      setTouched(true);
      return;
    }
    onSend(
      email.trim(),
      roleId,
      selectedRole.locationScope,
      selectedRole.locationIds,
      message.trim() || undefined,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invitar miembro</DialogTitle>
          <DialogDescription>
            Envía una invitación para sumar un nuevo integrante al equipo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Correo */}
          <div className="grid gap-2">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Correo del invitado
            </label>
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                placeholder="correo@empresa.cl"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={showError}
                className="h-fit pl-10 pr-4 py-2 text-sm"
              />
            </div>
            {!showError && (
              <p className="text-sm text-muted-foreground">
                El invitado recibirá un correo con un enlace de activación,
                válido por 7 días.
              </p>
            )}
            {showError && (
              <p className="text-sm text-destructive">
                Ingresa un correo electrónico válido.
              </p>
            )}
          </div>

          {/* Perfil sugerido */}
          <div className="grid gap-2.5">
            <label className="text-sm font-medium">Perfil de acceso</label>
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
            {selectedRole && (
              <p className="text-sm text-muted-foreground">
                {selectedRole.description}
              </p>
            )}
          </div>

          {/* Mensaje personalizado */}
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="invite-message" className="text-sm font-medium">
                Mensaje personalizado
              </label>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <span className="tabular-nums font-heading">
                  {message.length}/{MESSAGE_MAX}
                </span>
              </span>
            </div>
            <textarea
              id="invite-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={MESSAGE_MAX}
              placeholder="Agrega un mensaje de bienvenida (opcional)…"
              className="resize-none h-fit px-4 py-2 w-full rounded-lg border border-input bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <DialogFooter className="gap-x-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-3 rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!emailValid || !roleId}
              className="px-3 rounded-full"
            >
              <UserPlus className="size-4" />
              Enviar invitación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
