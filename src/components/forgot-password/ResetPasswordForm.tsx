"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPasswordService } from "@/lib/services/auth.service";
import { getResetContext, clearResetContext } from "@/lib/reset-code";
import { useValidateEmailParam } from "@/hooks/use-validate-email-param";
import { showError, showSuccess } from "@/components/ui/toast-message";

/**
 * Precondición del paso de nueva contraseña: el correo de la URL debe coincidir
 * EXACTAMENTE con el que emitió el código (contexto en sessionStorage).
 * Evita cambiar el ?email= a mitad del flujo para resetear una cuenta ajena.
 */
const validateResetContext = async (email: string) => {
  const context = getResetContext();
  if (!context) return false;
  return context.email.toLowerCase() === email.toLowerCase();
};

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { status: emailGateStatus } = useValidateEmailParam({
    email,
    validate: validateResetContext,
    redirectTo: "/ingresar",
    errorTitle: "Flujo de recuperación inválido",
    errorDescription: "Solicita un nuevo código para restablecer tu contraseña.",
  });

  // Sin ?email= en la URL no hay flujo válido → volver al login.
  useEffect(() => {
    if (!email) {
      showError(
        "Flujo de recuperación inválido",
        "Solicita un nuevo código para restablecer tu contraseña."
      );
      router.replace("/ingresar");
    }
  }, [email, router]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");

    if (!email) {
      showError("Correo no encontrado", "Vuelve a iniciar el proceso de recuperación.");
      router.push("/ingresar");
      return;
    }

    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden.");
      return;
    }

    const context = getResetContext();
    if (!context) {
      showError(
        "Código no encontrado",
        "Solicita un nuevo código para restablecer tu contraseña.",
      );
      router.push("/ingresar");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordService(email, context.code, password);
      clearResetContext();
      showSuccess("Contraseña actualizada", "Ya puedes iniciar sesión con tu nueva contraseña.");
      router.push(`/ingresar?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos actualizar tu contraseña. Inténtalo de nuevo.";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailGateStatus !== "valid") {
    return (
      <div className="w-full max-w-sm flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-y-10 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="w-full space-y-5 px-5">

        <div className="relative">
          <Input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
            placeholder="Nueva contraseña"
            required
            autoFocus
            aria-label="Nueva contraseña"
            className={`text-base! pl-13 pr-5 rounded-full h-fit py-2.5 ${
              passwordError ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        <div className="relative">
          <Input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }}
            placeholder="Confirmar contraseña"
            required
            aria-label="Confirmar contraseña"
            className={`text-base! pl-13 pr-5 rounded-full h-fit py-2.5 ${
              confirmError ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        {confirmError && (
          <p className="text-sm text-destructive">{confirmError}</p>
        )}

        <Button type="submit" className="w-full py-2 rounded-full h-fit text-base mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Actualizando…" : "Actualizar contraseña"}
        </Button>

      </form>
    </div>
  );
}
