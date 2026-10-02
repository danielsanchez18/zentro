import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de Zentro.",
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Política de privacidad
          </h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              En Zentro nos tomamos muy en serio la privacidad de tus datos.
              Esta política explica cómo recopilamos, usamos y protegemos tu
              información.
            </p>
            <h2>1. Información que recopilamos</h2>
            <p className="text-muted-foreground">
              Recopilamos información necesaria para proporcionar nuestros
              servicios, incluyendo datos de tu cuenta, uso de la plataforma y
              comunicaciones.
            </p>
            <h2>2. Uso de la información</h2>
            <p className="text-muted-foreground">
              Utilizamos tus datos únicamente para prestar, mejorar y mantener
              nuestros servicios, así como para garantizar su seguridad.
            </p>
            <h2>3. Protección de datos</h2>
            <p className="text-muted-foreground">
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tu información contra accesos no autorizados.
            </p>
            <h2>4. Tus derechos</h2>
            <p className="text-muted-foreground">
              Puedes acceder, corregir o solicitar la eliminación de tus datos
              personales en cualquier momento.
            </p>
            <p className="text-sm text-muted-foreground mt-8">
              Última actualización: {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
