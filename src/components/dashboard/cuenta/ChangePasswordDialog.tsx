"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
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

// TODO(0.2): validar contra el backend (POST /auth/change-password).
// En modo mock la contraseña actual del usuario es "123456".
const MOCK_CURRENT_PASSWORD = "123456";

type Step = "current" | "new" | "success";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  const [step, setStep] = useState<Step>("current");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reinicia el flujo cada vez que se abre el modal.
  useEffect(() => {
    if (open) {
      setStep("current");
      setCurrent("");
      setNext("");
      setConfirm("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleVerifyCurrent = () => {
    setError("");
    if (current === MOCK_CURRENT_PASSWORD) {
      setStep("new");
    } else {
      setError("La contraseña actual es incorrecta.");
    }
  };

  const handleSave = () => {
    setError("");
    if (next.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (next !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={step !== "success"}>
        <DialogHeader className="px-2 gap-y-0">
          <DialogTitle className="font-sans text-lg font-medium">
            {step === "current"
              ? "Cambiar contraseña"
              : step === "new"
                ? "Nueva contraseña"
                : "Contraseña actualizada"}
          </DialogTitle>
          <DialogDescription>
            {step === "current"
              ? "Confirma tu contraseña actual para continuar."
              : step === "new"
                ? "Elige una contraseña de al menos 8 caracteres."
                : "Tu contraseña se actualizó correctamente."}
          </DialogDescription>
        </DialogHeader>

        {step === "current" && (
          <div className="flex flex-col gap-y-3 pt-2 px-2">
            <label htmlFor="pw-current" className="text-sm font-medium">
              Contraseña actual
            </label>
            <Input
              id="pw-current"
              type="password"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleVerifyCurrent();
              }}
              placeholder="••••••••"
              autoFocus
              className="text-sm px-4 py-2 h-fit"
            />
          </div>
        )}

        {step === "new" && (
          <div className="space-y-4 px-2 pt-2">
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
                  if (event.key === "Enter") handleSave();
                }}
                placeholder="••••••••"
                className="text-sm px-4 py-2 h-fit"
              />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex justify-center py-2 mb-2 px-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="size-6" />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-4 py-2 mx-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter className="mt-2">
          {step === "current" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="px-3 text-sm rounded-full">
                Cancelar
              </Button>
              <Button onClick={handleVerifyCurrent} disabled={!current} className="px-3 text-sm rounded-full">
                Continuar
              </Button>
            </>
          )}
          {step === "new" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setStep("current");
                  setCurrent("");
                  setError("");
                }}
                className="px-3 text-sm rounded-full"
              >
                Volver
              </Button>
              <Button
                onClick={handleSave}
                disabled={!next || !confirm || loading}
                className="px-3 text-sm rounded-full"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Guardar contraseña
              </Button>
            </>
          )}
          {step === "success" && (
            <Button onClick={() => onOpenChange(false)} className="px-3 text-sm rounded-full">Listo</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
