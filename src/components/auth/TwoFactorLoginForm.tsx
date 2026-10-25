"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { showError } from "@/components/ui/toast-message";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

/**
 * Segundo paso del inicio de sesión con 2FA (contraseña o Google). El desafío
 * firmado dura 5 minutos; se canjea con el código de la app o uno de respaldo.
 */
export function TwoFactorLoginForm() {
  const router = useRouter();
  const challenge = useSearchParams().get("challenge") ?? "";
  const completeTwoFactor = useAuthStore((state) => state.completeTwoFactor);
  const [useRecovery, setUseRecovery] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!challenge) {
      showError("Verificación inválida", "Vuelve a iniciar sesión.");
      router.replace("/ingresar");
    }
  }, [challenge, router]);

  const submit = async (value: string) => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await completeTwoFactor(challenge, value.trim());
      router.replace("/dashboard");
    } catch (err) {
      // 401: el desafío expiró → volver a empezar.
      if (err instanceof ApiError && err.statusCode === 401) {
        showError("La verificación expiró", "Vuelve a iniciar sesión.");
        router.replace("/ingresar");
        return;
      }
      setError(messageOf(err, "El código no es correcto."));
      setCode("");
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-sm space-y-5 px-5"
      onSubmit={(event) => {
        event.preventDefault();
        void submit(code);
      }}
    >
      {useRecovery ? (
        <div className="relative">
          <Input
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder="XXXX-XXXX"
            aria-label="Código de respaldo"
            autoFocus
            maxLength={9}
            className="text-base! pl-13 pr-5 rounded-full h-fit py-2.5 font-mono tracking-widest"
          />
          <KeyRound className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>
      ) : (
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError("");
              // Envía solo al completar los 6 dígitos.
              if (value.length === 6) void submit(value);
            }}
            autoFocus
            aria-label="Código de verificación"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} className="w-12 h-12 text-lg rounded-md border" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button
        type="submit"
        className="w-full py-2 rounded-full h-fit text-base"
        disabled={loading || (useRecovery ? code.replace("-", "").length !== 8 : code.length !== 6)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Verificando…" : "Verificar"}
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setUseRecovery(!useRecovery);
            setCode("");
            setError("");
          }}
        >
          {useRecovery ? "Usar el código de mi app" : "¿No tienes tu celular? Usa un código de respaldo"}
        </button>
        <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => router.replace("/ingresar")}>
          Volver a iniciar sesión
        </button>
      </div>
    </form>
  );
}
