"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, Loader2, Mail, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/components/ui/toast-message";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import {
  confirmOAuthSignupService,
  getOAuthSignupService,
  type OAuthSignupInfo,
} from "@/lib/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

/** "Juan Carlos Pérez Díaz" → nombre "Juan Carlos", apellido "Pérez Díaz". */
const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstCount = parts.length >= 4 ? 2 : 1;
  return { first: parts.slice(0, firstCount).join(" "), last: parts.slice(firstCount).join(" ") };
};

/**
 * Registro con Google: el correo de Google no tiene cuenta en Zentro. Antes de
 * crearla se muestran los datos (el correo de Google será el principal) y se
 * puede corregir el nombre. Nada se crea hasta confirmar.
 */
export function ConfirmGoogleSignupForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const [info, setInfo] = useState<OAuthSignupInfo | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const leave = (description: string) => {
      showError("No se pudo continuar", description);
      router.replace("/ingresar");
    };
    if (!token) return leave("El enlace no es válido. Vuelve a continuar con Google.");
    getOAuthSignupService(token)
      .then((data) => {
        const { first, last } = splitName(data.name);
        setFirstName(first);
        setLastName(last);
        setInfo(data);
      })
      .catch((err) => leave(messageOf(err, "El registro expiró. Vuelve a continuar con Google.")));
  }, [token, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("Ingresa tu nombre y tu apellido.");
      return;
    }
    setLoading(true);
    try {
      await confirmOAuthSignupService(token, `${firstName.trim()} ${lastName.trim()}`);
      await restoreSession();
      showSuccess("¡Bienvenido a Zentro!", "Tu cuenta fue creada.");
      router.replace("/dashboard");
    } catch (err) {
      setError(messageOf(err, "No pudimos crear tu cuenta. Inténtalo de nuevo."));
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

  const inputClass = "text-base! pl-13 pr-5 rounded-full h-fit py-2.5";
  const iconClass = "absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 px-5">
      <div className="space-y-3">
        <div className="relative">
          <Input value={info.email} readOnly aria-label="Correo principal" className={`${inputClass} bg-muted/50`} />
          <Mail className={iconClass} />
        </div>
        <div className="relative">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
            aria-label="Nombre"
            maxLength={60}
            className={inputClass}
          />
          <UserRound className={iconClass} />
        </div>
        <div className="relative">
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellido"
            aria-label="Apellido"
            maxLength={60}
            className={inputClass}
          />
          <UserRound className={iconClass} />
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-sm bg-muted px-3 py-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          <strong className="text-foreground">{info.email}</strong> será tu correo principal: ahí te enviaremos todos los
          avisos. Entrarás con Google y luego podrás crear una contraseña en Mi cuenta.
        </span>
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button type="submit" className="w-full py-2 rounded-full h-fit text-base" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
        {loading ? "Creando cuenta…" : "Crear cuenta con Google"}
      </Button>

      <div className="flex justify-center text-sm">
        <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => router.replace("/ingresar")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
