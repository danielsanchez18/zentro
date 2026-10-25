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
import { toastMsg } from "@/components/ui/toast-message";
import { errorMessage } from "@/components/dashboard/cuenta/ui";
import { sendEmailVerification } from "@/lib/services/account.service";
import { useAccountStore } from "@/stores/account-store";

const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

/** Al abrirse envía el código (POST /users/me/email-verification) y lo confirma. */
export const VerifyEmailDialog = ({ open, onOpenChange, email }: VerifyEmailDialogProps) => {
  const confirmEmail = useAccountStore((state) => state.confirmEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
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

  const sendCode = async () => {
    setResending(true);
    setError("");
    try {
      await sendEmailVerification();
      startCooldown();
    } catch (err) {
      setError(errorMessage(err, "No pudimos enviar el código."));
    } finally {
      setResending(false);
    }
  };

  // Primer envío al abrir; los reenvíos respetan el cooldown.
  useEffect(() => {
    if (open && !sentRef.current) {
      sentRef.current = true;
      void sendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCode("");
      setError("");
      setVerifying(false);
    }
    onOpenChange(nextOpen);
  };

  const handleVerify = async () => {
    setError("");
    if (code.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }
    setVerifying(true);
    try {
      await confirmEmail(code);
      toastMsg.success("Correo verificado", `${email} quedó verificado.`);
      handleOpenChange(false);
    } catch (err) {
      setError(errorMessage(err, "El código no es correcto."));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    if (resending || cooldown > 0) return;
    void sendCode();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onClick={() => handleOpenChange(false)}
            className="h-fit rounded-full px-3 py-1.5 text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => void handleVerify()}
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
