"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SocialLogin } from "./SocialLogin";
import Link from "next/link";
import { SendCodeDialog } from "../forgot-password/SendCodeDialog";
import { useAuthStore } from "@/stores/auth-store";
import { checkEmailService } from "@/lib/services/auth.service";
import { useValidateEmailParam } from "@/hooks/use-validate-email-param";
import { showError } from "@/components/ui/toast-message";

/**
 * Precondición del paso 2 de login: el correo de la URL debe existir.
 * Si alguien forja /ingresar?email=... con un correo inexistente, se
 * redirige al paso 1 con el error correspondiente.
 */
const validateLoginEmail = async (email: string) => {
  const { exists } = await checkEmailService(email);
  return exists;
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");

  const { login, isLoading, clearError } = useAuthStore();

  const { status: emailGateStatus } = useValidateEmailParam({
    email: emailParam ?? "",
    validate: validateLoginEmail,
    redirectTo: "/ingresar",
    errorTitle: "Este correo no está registrado",
    errorDescription: "Revisa que esté bien escrito o crea una cuenta nueva.",
  });

  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Ingresa un formato de correo válido.");
      return;
    }

    setCheckingEmail(true);
    clearError();

    try {
      const { exists } = await checkEmailService(email);

      if (!exists) {
        setEmailError("");
        showError(
          "Este correo no está registrado",
          "Revisa que esté bien escrito o crea una cuenta nueva."
        );
        return;
      }

      router.push(`?email=${encodeURIComponent(email)}`);
    } catch {
      // Si el check falla (backend caído entre medio), dejamos pasar al
      // siguiente paso y el login real mostrará el error si es necesario.
      router.push(`?email=${encodeURIComponent(email)}`);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailParam || !password) return;

    try {
      await login(emailParam, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos iniciar sesión. Inténtalo de nuevo.";
      showError(message, "Verifica tus credenciales e inténtalo de nuevo.");
    }
  };

  if (emailParam) {
    if (emailGateStatus !== "valid") {
      return (
        <div className="w-full max-w-sm flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm space-y-5 px-5">
        <div className="px-5 py-2.5 flex items-center gap-x-3 bg-muted p-2 rounded-full border border-border">
          <Mail className="size-4.5 text-muted-foreground" />
          <span className="truncate text-foreground text-base">{emailParam}</span>
        </div>

        <div className="relative">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            placeholder="Ingrese su contraseña"
            required
            autoFocus
            aria-label="Contraseña"
            className="text-base! pl-13 pr-5 rounded-full h-fit py-2.5"
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        <Button type="submit" className="w-full h-fit rounded-full py-2 text-base" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Verificando…" : "Iniciar sesión"}
        </Button>

        <div className="w-full text-center">
          <p className="text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?{" "}
            <SendCodeDialog email={emailParam} />
          </p>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 max-w-sm w-full">
      <form onSubmit={handleEmailSubmit} noValidate className="w-full space-y-2 px-5">
        <div className="relative">
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="Ingrese su correo electrónico"
            required
            autoFocus
            aria-label="Correo electrónico"
            className={`md:text-base pl-13 pr-6 rounded-full h-fit py-2 ${
              emailError
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
          />
          <Mail
            className={`absolute left-5 top-1/2 -translate-y-1/2 size-4.5 pointer-events-none ${
              emailError ? "text-destructive" : "text-muted-foreground"
            }`}
          />
        </div>

        {emailError && (
          <p className="text-sm text-destructive">{emailError}</p>
        )}

        <Button type="submit" className="w-full h-fit rounded-full py-2 mt-5 text-base" disabled={isLoading || checkingEmail}>
          {checkingEmail ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando…
            </>
          ) : isLoading ? (
            "Verificando…"
          ) : (
            "Continuar con correo electrónico"
          )}
        </Button>
      </form>

      <SocialLogin />

      <div className="w-full px-5 text-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registrar" className="text-primary font-semibold hover:underline">
            Empieza ahora
          </Link>
        </p>
      </div>
    </div>
  );
}
