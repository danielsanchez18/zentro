import { ForgotPassword } from "@/components/forgot-password/ForgotPassword";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Suspense } from "react";

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
