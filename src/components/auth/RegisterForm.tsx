"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SocialLogin } from "./SocialLogin";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { checkEmailService } from "@/lib/services/auth.service";
import { showError, showSuccess } from "@/components/ui/toast-message";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");

  const { register, isLoading, clearError } = useAuthStore();

  const [email, setEmail] = useState(emailParam || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

      if (exists) {
        setEmailError("");
        showError(
          "Este correo ya está registrado",
          "Inicia sesión con tu cuenta existente."
        );
        return;
      }

      router.push(`?email=${encodeURIComponent(email)}`);
    } catch {
      // Si el check falla (backend caído entre medio), dejamos pasar al
      // siguiente paso y el registro real mostrará el error si es necesario.
      router.push(`?email=${encodeURIComponent(email)}`);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailParam || !firstName || !lastName || !password) return;

    setPasswordError("");
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      await register(emailParam, password, `${firstName} ${lastName}`);
      showSuccess("¡Cuenta creada!", "Bienvenido a Zentro.");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos crear tu cuenta. Inténtalo de nuevo.";
      showError(message);
    }
  };

  if (emailParam) {
    return (
      <form onSubmit={handleRegisterSubmit} className="w-full max-w-md space-y-5 px-5">
        <div className="px-4 py-2.5 flex items-center gap-x-3 bg-muted rounded-full border border-border">
          <Mail className="size-4.5 text-muted-foreground shrink-0" />
          <span className="truncate text-foreground">{emailParam}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 gap-y-3">
          <div className="relative">
            <Input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombres"
              required
              autoFocus
              aria-label="Nombres"
              className="text-base! pl-11 pr-3 h-fit py-2 rounded-full"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <Input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellidos"
              required
              aria-label="Apellidos"
              className="text-base! pl-11 pr-3 h-fit py-2 rounded-full"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(""); clearError(); }}
            placeholder="Crea una contraseña"
            required
            aria-label="Contraseña"
            className={`text-base! pl-11 pr-5 h-fit py-2 rounded-full ${
              passwordError ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        {passwordError && (
          <p className="text-sm text-destructive">{passwordError}</p>
        )}

        <Button type="submit" className="w-full py-2 rounded-full h-fit text-base" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 max-w-md w-full">
      <form onSubmit={handleEmailSubmit} className="w-full space-y-2 px-5">
        <div className="relative">
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            placeholder="Ingresa tu correo electrónico"
            required
            autoFocus
            aria-label="Correo electrónico"
            className={`text-base! pl-13 pr-5 rounded-full h-fit py-2.5 ${
              emailError ? "border-destructive focus-visible:ring-destructive" : ""
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

        <Button type="submit" className="w-full py-2 h-fit mt-5 rounded-full text-base" disabled={isLoading || checkingEmail}>
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
          ¿Ya tienes cuenta?{" "}
          <Link href="/ingresar" className="text-primary font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
