import { AuthHeader } from "@/components/auth/AuthHeader";
import { ResetPasswordForm } from "@/components/forgot-password/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader 
        title="Actualizar contraseña" 
        description="Asegúrate de que sea segura y fácil de recordar." 
      />
      <Suspense fallback={<div className="h-30"></div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
