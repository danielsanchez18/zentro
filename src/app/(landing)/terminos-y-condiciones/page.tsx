import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de Zentro.",
};

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Términos y condiciones
          </h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Estos términos y condiciones regulan el uso de la plataforma
              Zentro. Al acceder y utilizar nuestros servicios, aceptas cumplir
              con estos términos.
            </p>
            <h2>1. Uso del servicio</h2>
            <p className="text-muted-foreground">
              Debes utilizar Zentro de acuerdo con la ley y respetando estos
              términos. No está permitido utilizarlo para fines ilegales o que
              perjudiquen a terceros.
            </p>
            <h2>2. Cuentas y seguridad</h2>
            <p className="text-muted-foreground">
              Eres responsable de mantener la confidencialidad de tus
              credenciales y de toda actividad que ocurra bajo tu cuenta.
            </p>
            <h2>3. Propiedad intelectual</h2>
            <p className="text-muted-foreground">
              Todo el contenido, marcas, logos y código de Zentro son propiedad
              de sus respectivos titulares y están protegidos por leyes de
              propiedad intelectual.
            </p>
            <h2>4. Modificaciones</h2>
            <p className="text-muted-foreground">
              Podemos modificar estos términos en cualquier momento. Las
              modificaciones entrarán en vigor al publicarse en esta página.
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
