import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { ConfirmLinkForm } from "@/components/auth/ConfirmLinkForm";

export const metadata: Metadata = {
  title: "Vincular cuenta",
  description: "Confirma que eres tú para vincular Google a tu cuenta de Zentro.",
  robots: { index: false, follow: false },
};

export default function VincularCuentaPage() {
  return (
    <main className="min-h-dvh py-20 flex flex-col items-center justify-center gap-y-10">
      <AuthHeader
        title="Ya tienes una cuenta"
        description="Confirma que eres tú para vincular Google. Solo lo haremos una vez."
      />
      <Suspense fallback={<div className="h-30"></div>}>
        <ConfirmLinkForm />
      </Suspense>
    </main>
  );
}
