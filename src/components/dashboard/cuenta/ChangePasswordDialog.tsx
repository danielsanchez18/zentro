"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { changePassword, verifyCurrentPassword } from "@/lib/services/account.service";
import { useAccountStore } from "@/stores/account-store";
import { errorMessage } from "@/components/dashboard/cuenta/ui";

type Step = "current" | "new" | "success";

/**
 * Ilustración de marca para "Contraseña guardada": candado oscuro que se cierra,
 * puntos de contraseña en lima, destellos y check final. Animaciones en hub.css
 * (.hub-lock-*), respetan prefers-reduced-motion.
 */
const PasswordSavedIllustration = () => (
  <div className={cn("hub-setup hub-lock relative mx-auto size-32")} aria-hidden="true">
    <div className="absolute inset-4 rounded-full bg-hub-accent/25 blur-2xl" />
    <svg viewBox="0 0 128 128" className="relative size-full">
      {/* arco del candado */}
      <path
        d="M44 58 V44 a20 20 0 0 1 40 0 V58"
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        className="hub-lock-shackle stroke-foreground/80"
      />
      {/* cuerpo */}
      <rect x="28" y="54" width="72" height="54" rx="12" className="fill-foreground" />
      {/* contraseña: cuatro puntos */}
      {[46, 58, 70, 82].map((cx, index) => (
        <circle
          key={cx}
          cx={cx}
          cy="81"
          r="4.5"
          className="hub-lock-dot fill-hub-accent"
          style={{ animationDelay: `${150 + index * 120}ms` }}
        />
      ))}
      {/* destellos */}
      <path d="M104 22 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z" className="hub-setup-spark fill-hub-accent" />
      <path d="M18 34 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" className="hub-setup-spark fill-hub-accent" style={{ animationDelay: "600ms" }} />
    </svg>
    <span className="hub-setup-check absolute right-1 bottom-2 flex size-9 items-center justify-center rounded-full bg-hub-accent text-hub-accent-foreground ring-4 ring-card">
      <Check className="size-4.5" strokeWidth={3} />
    </span>
  </div>
);

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** false → la cuenta solo entra con Google: se crea una contraseña sin pedir la actual. */
  hasPassword: boolean;
}

export const ChangePasswordDialog = ({ open, onOpenChange, hasPassword }: ChangePasswordDialogProps) => {
  const initialStep: Step = hasPassword ? "current" : "new";
  const [step, setStep] = useState<Step>(initialStep);
  const [creating, setCreating] = useState(!hasPassword);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep(initialStep);
    setCreating(!hasPassword);
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
    setLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  // Paso 1: el servidor confirma la contraseña actual antes de pedir la nueva.
  const handleVerifyCurrent = async () => {
    if (!current || loading) return;
    setError("");
    setLoading(true);
    try {
      await verifyCurrentPassword(current);
      setStep("new");
    } catch (err) {
      setError(errorMessage(err, "La contraseña actual es incorrecta."));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    if (next.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) {
      setError("La contraseña debe incluir letras y números.");
      return;
    }
    if (!creating && next === current) {
      setError("La nueva contraseña debe ser distinta de la actual.");
      return;
    }
    if (next !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: creating ? undefined : current, newPassword: next });
      // Refresca hasPassword y los métodos de acceso.
      await Promise.all([
        useAccountStore.getState().loadProfile(),
        useAccountStore.getState().loadMethods(),
      ]).catch(() => undefined);
      setStep("success");
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 400 && !creating) {
        setStep("current");
        setCurrent("");
      }
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={step !== "success"}>
        <DialogHeader className="sm:px-1 gap-y-0">
          <DialogTitle className="font-sans text-lg font-medium">
            {step === "current"
              ? "Cambiar contraseña"
              : step === "new"
                ? creating
                  ? "Crear contraseña"
                  : "Nueva contraseña"
                : creating
                  ? "Contraseña creada"
                  : "Contraseña actualizada"}
          </DialogTitle>
          <DialogDescription>
            {step === "current"
              ? "Confirma tu contraseña actual para continuar."
              : step === "new"
                ? creating
                  ? "Tu cuenta entra con Google. Crea una contraseña para poder entrar también con tu correo."
                  : "Mínimo 8 caracteres, con letras y números, distinta de la actual."
                : creating
                  ? "Ya puedes iniciar sesión con tu correo y esta contraseña."
                  : "Tu contraseña se actualizó. Cerramos tus sesiones en otros dispositivos."}
          </DialogDescription>
        </DialogHeader>

        {step === "current" && (
          <div className="flex flex-col gap-y-3 pt-2 sm:px-1">
            <label htmlFor="pw-current" className="text-sm font-medium">
              Contraseña actual
            </label>
            <Input
              id="pw-current"
              type="password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleVerifyCurrent();
              }}
              placeholder="••••••••"
              autoFocus
              className="text-sm px-4 py-2 h-fit"
            />
          </div>
        )}

        {step === "new" && (
          <div className="space-y-4 sm:px-1 pt-2">
            <div className="flex flex-col gap-y-3">
              <label htmlFor="pw-next" className="text-sm font-medium">
                Nueva contraseña
              </label>
              <Input
                id="pw-next"
                type="password"
                value={next}
                onChange={(event) => setNext(event.target.value)}
                placeholder="••••••••"
                autoFocus
                className="text-sm px-4 py-2 h-fit"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <label htmlFor="pw-confirm" className="text-sm font-medium">
                Repite la contraseña
              </label>
              <Input
                id="pw-confirm"
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleSave();
                }}
                placeholder="••••••••"
                className="text-sm px-4 py-2 h-fit"
              />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex justify-center py-2">
            <PasswordSavedIllustration />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-2 sm:mx-1 text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter className="mt-2">
          {step === "current" && (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)} className="px-3 text-sm rounded-full">
                Cancelar
              </Button>
              <Button onClick={() => void handleVerifyCurrent()} disabled={!current || loading} className="px-3 text-sm rounded-full">
                {loading && <Loader2 className="size-4 animate-spin" />}
                Continuar
              </Button>
            </>
          )}
          {step === "new" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (creating) {
                    handleOpenChange(false);
                    return;
                  }
                  setStep("current");
                  setCurrent("");
                  setError("");
                }}
                className="px-3 text-sm rounded-full"
              >
                {creating ? "Cancelar" : "Volver"}
              </Button>
              <Button
                onClick={() => void handleSave()}
                disabled={!next || !confirm || loading}
                className="px-3 text-sm rounded-full"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Guardar contraseña
              </Button>
            </>
          )}
          {step === "success" && (
            <Button onClick={() => handleOpenChange(false)} className="px-3 text-sm rounded-full">Listo</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
