"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 60;

// TODO(0.2): reemplazar por el código real devuelto por el backend
// POST /users/me/verify-email (eliminar cuando esté integrado).
const MOCK_EMAIL_VERIFICATION_CODE = "123456";

interface VerifyEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified: () => void;
}

export const VerifyEmailDialog = ({
  open,
  onOpenChange,
  email,
  onVerified,
}: VerifyEmailDialogProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Al abrir el diálogo se limpia el estado anterior; al desmontar se corta
  // el contador de reenvío.
  useEffect(() => {
    if (open) {
      setCode("");
      setError("");
      setVerifying(false);
    }
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [open]);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && cooldownRef.current) {
          clearInterval(cooldownRef.current);
          cooldownRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // TODO(0.2): POST /users/me/verify-email/confirm y /users/me/verify-email (reenvío)
  const handleVerify = () => {
    setError("");
    if (code.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }
    if (code !== MOCK_EMAIL_VERIFICATION_CODE) {
      setError("El código no es correcto. Revisa tu correo.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerified();
      onOpenChange(false);
    }, 600);
  };

  const handleResend = () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setError("");
    setTimeout(() => {
      setResending(false);
      startCooldown();
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="sm:px-1">
          <DialogTitle className="font-sans">Verificar correo electrónico</DialogTitle>
          <DialogDescription>
            Te enviamos un código de 6 dígitos a <strong>{email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-1">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            autoFocus
            aria-label="Código de verificación"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-12 text-lg rounded-md border"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                Reenviando…
              </>
            ) : cooldown > 0 ? (
              `Reenviar en ${cooldown}s`
            ) : (
              <>
                <RefreshCw className="size-3" />
                Reenviar código
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-fit rounded-full px-3 py-1.5 text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="h-fit rounded-full px-3 py-1.5 text-sm"
          >
            {verifying && <Loader2 className="size-4 animate-spin" />}
            {verifying ? "Verificando…" : "Verificar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
