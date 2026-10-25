import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { TwoFactorLoginForm } from "@/components/auth/TwoFactorLoginForm";

export const metadata: Metadata = {
  title: "Verificación en dos pasos",
  description: "Ingresa el código de tu app autenticadora para entrar a Zentro.",
  robots: { index: false, follow: false },
};

export default function VerificacionPage() {
  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader
        title="Verificación en dos pasos"
        description="Ingresa el código de 6 dígitos de tu app autenticadora."
      />
      <Suspense fallback={<div className="h-30"></div>}>
        <TwoFactorLoginForm />
      </Suspense>
    </main>
  );
}
