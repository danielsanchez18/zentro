"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MessageSquareText, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TEAM_ROLES, type TeamRole } from "@/lib/mock/team";

/** Roles que se pueden otorgar desde esta pantalla (el Owner no se invita). */
const INVITABLE_ROLES = TEAM_ROLES.filter((r) => r !== "Owner");
const DEFAULT_ROLE: TeamRole = "Vendedor";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 500;

const ROLE_OPTIONS = INVITABLE_ROLES.map((role) => ({
  label: role,
  value: role,
}));

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Devuelve el correo normalizado, el rol elegido y el mensaje (opcional). */
  onSend: (email: string, role: TeamRole, message?: string) => void;
}

/**
 * Dialog de «Invitar miembro».
 *
 * Pide el correo (validado), el rol que recibirá el invitado (los que son
 * invitables; el Owner se excluye porque es único por organización) y un
 * mensaje personalizado opcional. El envío queda a cargo del padre (List) para
 * que cree el miembro en su estado local.
 */
export const InviteMemberDialog = ({
  open,
  onOpenChange,
  onSend,
}: InviteMemberDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>(DEFAULT_ROLE);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const showError = touched && !emailValid;

  // Al abrir el dialog se limpia el estado anterior.
  useEffect(() => {
    if (open) {
      setEmail("");
      setRole(DEFAULT_ROLE);
      setMessage("");
      setTouched(false);
    }
  }, [open]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValid) {
      setTouched(true);
      return;
    }
    onSend(email.trim(), role, message.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="m-1 font-heading">
          <DialogTitle>Invitar miembro</DialogTitle>
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
            <p>
              El plan{" "}
              <span className="font-medium text-primary">Trial</span> permite{" "}
              <span className="font-medium text-primary">3/5</span> usuarios
            </p>
            <span className="size-1 min-w-1 bg-muted-foreground rounded-full" />
            <Button variant="link" className="p-0 h-fit">
              Ver Planes <ArrowUpRight />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2 mx-1">
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
                className="h-fit pl-10 pr-4 py-2"
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

          <div className="grid gap-2 mx-1">
            <label htmlFor="invite-role" className="text-sm font-medium">
              Rol
            </label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as TeamRole)}
              items={ROLE_OPTIONS}
            >
              <SelectTrigger
                id="invite-role"
                className="w-full h-fit rounded-lg px-4 py-2"
              >
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {INVITABLE_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 mx-1">
            <div className="flex items-baseline justify-between gap-3">
              <label
                htmlFor="invite-message"
                className="text-sm font-medium"
              >
                Mensaje personalizado
              </label>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <span className="tabular-nums font-heading ">
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

          <DialogFooter className="gap-x-1 px-5">
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
              disabled={!emailValid}
              className="px-3 rounded-full"
            >
              Enviar invitación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};