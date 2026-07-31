import type { Metadata } from "next";
import { ForgotPassword } from "@/components/forgot-password/ForgotPassword";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description:
    "Recibe un código en tu correo para restablecer tu contraseña de Zentro de forma segura.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader 
        title="Verifica tu correo" 
        description="Restablece el acceso a tu cuenta." 
      />
      <Suspense fallback={<div className="h-[120px]"></div>}>
        <ForgotPassword />
      </Suspense>
    </main>
  );
}
