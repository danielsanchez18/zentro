"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { verifyCodeService, forgotPasswordService } from "@/lib/services/auth.service";
import { saveResetCode } from "@/lib/reset-code";
import { showError, showInfo } from "@/components/ui/toast-message";

const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpia el intervalo si el componente se desmonta
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1 && cooldownRef.current) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");

    if (!email) {
      showError("Correo no encontrado", "Vuelve a iniciar el proceso de recuperación.");
      router.push("/ingresar");
      return;
    }

    setChecking(true);
    try {
      await verifyCodeService(email, code);
      saveResetCode(code);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "El código es incorrecto.";
      setCodeError(message);
      setCode("");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setResending(true);
    try {
      const { devCode } = await forgotPasswordService(email);
      showInfo(
        "Código reenviado",
        devCode
          ? `En desarrollo el código es ${devCode}.`
          : `Te enviamos un nuevo código a ${email}.`,
      );
      startCooldown();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos reenviar el código. Inténtalo de nuevo.";
      showError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-10 w-full max-w-sm">
      <form onSubmit={handleConfirm} className="w-full space-y-5 px-5">
        <div className="space-y-2 text-center mb-8">
          <p className="text-base text-muted-foreground">
            Ingresa el código de seguridad que enviamos a <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {/* Input Code */}
        <div className="flex items-center justify-center gap-x-3 w-full">
          <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus aria-label="Código de verificación">
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg rounded-md border" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {codeError && (
          <p className="text-sm text-destructive text-center">{codeError}</p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full py-2 rounded-full h-fit text-base"
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reenviando…
              </>
            ) : cooldown > 0 ? (
              `Reenviar en ${cooldown}s`
            ) : (
              "Reenviar código"
            )}
          </Button>
          <Button type="submit" className="w-full py-2 rounded-full h-fit text-base" disabled={checking}>
            {checking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {checking ? "Verificando…" : "Confirmar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
