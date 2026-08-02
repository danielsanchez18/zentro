"use client";

import { useState } from "react";
import { Check, Loader2, RefreshCw } from "lucide-react";
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
import { MOCK_EMAIL_VERIFICATION_CODE } from "@/lib/mock/data";

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

  // TODO(0.2): POST /users/me/verify-email (reenviar) y /users/me/verify-email/confirm
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verificar correo electrónico</DialogTitle>
          <DialogDescription>
            Te enviamos un código de 6 dígitos a <strong>{email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setError("")}
          >
            <RefreshCw className="size-3" />
            Reenviar código
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleVerify} disabled={verifying}>
            {verifying && <Loader2 className="size-4 animate-spin" />}
            Verificar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
