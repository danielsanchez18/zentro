import type { Metadata } from "next";
import { Categories } from "@/components/landing/faq/Categories";
import { Hero } from "@/components/landing/faq/Hero";
import { Support } from "@/components/landing/faq/Support";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resuelve tus dudas sobre Zentro: precios, funcionalidades, implementación y soporte.",
  openGraph: {
    title: "Preguntas frecuentes | Zentro",
    description:
      "Resuelve tus dudas sobre Zentro: precios, funcionalidades, implementación y soporte.",
  },
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">
        <Categories />
      </div>
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <Support />
        <CTA />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
