import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zentro — Iniciar sesión",
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const hasEmail = !!params?.email;

  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader
        title={hasEmail ? "Continúa con tu correo" : "Iniciar sesión"}
        description={
          hasEmail
            ? "Para continuar, ingresa tu contraseña."
            : "Ingresa tus credenciales para entrar al sistema."
        }
      />

      <Suspense fallback={<div className="h-30" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
