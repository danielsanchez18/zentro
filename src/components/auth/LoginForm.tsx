"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SocialLogin } from "./SocialLogin";
import Link from "next/link";
import { SendCodeDialog } from "../forgot-password/SendCodeDialog";

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
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
    // Simulación: pasa al paso de contraseña
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    router.push(`?email=${encodeURIComponent(email)}`);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailParam || !password) return;

    setIsLoading(true);
    // Simulación: valida que no esté vacío y redirige
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    router.push("/dashboard");
  };

  if (emailParam) {
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            autoFocus
            className="text-base pl-13 pr-5 rounded-full h-fit py-2.5"
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        <Button type="submit" className="w-full h-fit rounded-full py-2 text-base" disabled={isLoading}>
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

        <Button type="submit" className="w-full h-fit rounded-full py-2 mt-5 text-base" disabled={isLoading}>
          {isLoading ? "Verificando…" : "Continuar con correo electrónico"}
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
