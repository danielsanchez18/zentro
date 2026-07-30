"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SocialLogin } from "./SocialLogin";
import Link from "next/link";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Ingresa un formato de correo válido.");
      return;
    }

    setIsLoading(true);
    // Simula verificación de email disponible
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    router.push(`?email=${encodeURIComponent(email)}`);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailParam || !firstName || !lastName || !password) return;

    setIsLoading(true);
    // Simula creación de cuenta
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    router.push("/dashboard");
  };

  if (emailParam) {
    return (
      <form onSubmit={handleRegisterSubmit} className="w-full max-w-md space-y-5">
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea una contraseña"
            required
            className="text-base! pl-11 pr-5 h-fit py-2 rounded-full"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

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

        <Button type="submit" className="w-full py-2 h-fit mt-5 rounded-full text-base" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continuar con correo electrónico
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
