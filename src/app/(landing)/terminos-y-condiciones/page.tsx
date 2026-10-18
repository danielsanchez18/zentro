import type { Metadata } from "next";
import { LegalDocument } from "@/components/landing/legal/LegalDocument";
import { LegalHero } from "@/components/landing/legal/LegalHero";
import { terms } from "@/components/landing/legal/terms";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de Zentro.",
};

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <LegalHero
        title="Términos y"
        highlight="condiciones"
        description="Las reglas que regulan el uso de Zentro y de nuestros servicios."
        updatedAt={terms.updatedAt}
      />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 pb-20">
        <LegalDocument
          doc={terms}
          related={{
            label: "Política de privacidad",
            href: "/politica-de-privacidad",
          }}
        />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
