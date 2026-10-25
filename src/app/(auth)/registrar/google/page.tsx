import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ConfirmGoogleSignupForm } from "@/components/auth/ConfirmGoogleSignupForm";

export const metadata: Metadata = {
  title: "Crear cuenta con Google",
  description: "Confirma tus datos para crear tu cuenta de Zentro con Google.",
  robots: { index: false, follow: false },
};

export default function RegistrarGooglePage() {
  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader
        title="Crea tu cuenta"
        description="Esta cuenta de Google aún no está registrada en Zentro. Revisa tus datos."
      />
      <Suspense fallback={<div className="h-30"></div>}>
        <ConfirmGoogleSignupForm />
      </Suspense>
    </main>
  );
}
