"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { showError, showSuccess } from "@/components/ui/toast-message";
import {
  confirmPendingLinkService,
  getPendingLinkService,
  sendPendingLinkCodeService,
  type PendingLinkInfo,
} from "@/lib/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

type Method = "password" | "code";

const PROVIDER_NAME: Record<PendingLinkInfo["provider"], string> = { GOOGLE: "Google", APPLE: "Apple" };

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

/**
 * Pantalla "Confirma que eres tú": se llega desde el callback de Google cuando
 * el correo ya pertenece a una cuenta que no tiene Google vinculado. Una cuenta
 * por correo; el vínculo solo ocurre con la contraseña o un código al correo.
 */
export function ConfirmLinkForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const [info, setInfo] = useState<PendingLinkInfo | null>(null);
  const [method, setMethod] = useState<Method>("password");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const leave = (description: string) => {
      showError("No se pudo vincular", description);
      router.replace("/ingresar");
    };
    if (!token) return leave("El enlace no es válido. Vuelve a entrar con Google.");
    getPendingLinkService(token)
      .then((data) => {
        setInfo(data);
        if (!data.hasPassword) setMethod("code");
      })
      .catch((err) => leave(messageOf(err, "El enlace expiró. Vuelve a entrar con Google.")));
  }, [token, router]);

  const sendCode = async () => {
    setSending(true);
    setError("");
    try {
      await sendPendingLinkCodeService(token);
      setCodeSent(true);
    } catch (err) {
      setError(messageOf(err, "No pudimos enviar el código."));
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (method === "password" && !password) return setError("Ingresa tu contraseña.");
    if (method === "code" && code.length !== 6) return setError("Ingresa el código de 6 dígitos.");
    setLoading(true);
    try {
      const result = await confirmPendingLinkService(token, method === "password" ? { password } : { code });
      if (result?.twoFactorRequired) {
        showSuccess(`${PROVIDER_NAME[info!.provider]} vinculado`, "Falta el código de tu app autenticadora.");
        router.replace(`/ingresar/verificacion?challenge=${encodeURIComponent(result.challenge)}`);
        return;
      }
      await restoreSession();
      showSuccess(`${PROVIDER_NAME[info!.provider]} vinculado`, "La próxima vez podrás entrar directamente.");
      router.replace("/dashboard");
    } catch (err) {
      setError(messageOf(err, "No pudimos confirmar. Inténtalo de nuevo."));
      setLoading(false);
    }
  };

  if (!info) {
    return (
      <div className="w-full max-w-sm flex justify-center py-10">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const provider = PROVIDER_NAME[info.provider];

  return (
    <div className="flex flex-col items-center gap-y-6 w-full max-w-sm">
      <p className="px-5 text-center text-sm text-muted-foreground">
        <strong className="text-foreground">{info.email}</strong> ya está registrado en Zentro. Para vincular {provider},{" "}
        {method === "password" ? "ingresa tu contraseña." : "te enviaremos un código a ese correo."}
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-5 px-5">
        {method === "password" ? (
          <div className="relative">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Contraseña de Zentro"
              aria-label="Contraseña"
              autoFocus
              className="text-base! pl-13 pr-5 rounded-full h-fit py-2.5"
            />
            <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
          </div>
        ) : !codeSent ? (
          <Button
            type="button"
            variant="outline"
            className="w-full py-2 rounded-full h-fit text-base"
            onClick={() => void sendCode()}
            disabled={sending}
          >
            {sending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Mail className="mr-2 size-4" />}
            Enviar código a mi correo
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus aria-label="Código">
              <InputOTPGroup className="gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} className="w-12 h-12 text-lg rounded-md border" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={sending}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {sending ? "Reenviando…" : "Reenviar código"}
            </button>
          </div>
        )}

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {(method === "password" || codeSent) && (
          <Button type="submit" className="w-full py-2 rounded-full h-fit text-base" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Confirmando…" : `Confirmar y vincular ${provider}`}
          </Button>
        )}

        <div className="flex flex-col items-center gap-2 text-sm">
          {info.hasPassword && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMethod(method === "password" ? "code" : "password");
                setError("");
              }}
            >
              {method === "password" ? "¿Olvidaste tu contraseña? Usar código por correo" : "Usar mi contraseña"}
            </button>
          )}
          <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => router.replace("/ingresar")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
