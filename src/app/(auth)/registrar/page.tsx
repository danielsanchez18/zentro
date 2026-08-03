import { AuthHeader } from "@/components/auth/AuthHeader";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Regístrate en Zentro gratis y empieza a centralizar la gestión de tu negocio en minutos.",
};

export default async function RegistrarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const hasEmail = !!params?.email;

    return(
        <main className="min-h-dvh py-20 flex flex-col items-center w-full max-w-sm mx-auto justify-center gap-y-10">
            <AuthHeader
                title={hasEmail ? "Completa tus datos" : "Crea tu cuenta en segundos"}
                description={hasEmail ? "Ya casi terminamos, solo necesitamos tus datos." : "Empieza hoy y empieza a gestionar tu negocio ahora."}
            />
    
            <Suspense fallback={<div className="h-30"></div>}>
                <RegisterForm />
            </Suspense>
    
        </main>
    )
}