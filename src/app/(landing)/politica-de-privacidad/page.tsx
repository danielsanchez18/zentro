import type { Metadata } from "next";
import { LegalDocument } from "@/components/landing/legal/LegalDocument";
import { LegalHero } from "@/components/landing/legal/LegalHero";
import { privacy } from "@/components/landing/legal/privacy";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Zentro recopila, usa y protege tu información.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <Navbar />
      <LegalHero
        title="Política de"
        highlight="privacidad"
        description="Cómo recopilamos, usamos y protegemos la información de tu negocio."
        updatedAt={privacy.updatedAt}
      />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 pb-20">
        <LegalDocument
          doc={privacy}
          related={{
            label: "Términos y condiciones",
            href: "/terminos-y-condiciones",
          }}
        />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
