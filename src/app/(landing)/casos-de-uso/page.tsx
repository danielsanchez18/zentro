import type { Metadata } from "next";
import { HowItWorks } from "@/components/landing/home/HowItWorks";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";
import { Hero } from "@/components/landing/use-cases/Hero";
import { Industries } from "@/components/landing/use-cases/Industries";
import { OtherIndustries } from "@/components/landing/use-cases/OtherIndustries";

export const metadata: Metadata = {
  title: "Casos de uso",
  description:
    "Zentro se adapta a cualquier tipo de negocio: comercio, servicios, restaurantes y más.",
  openGraph: {
    title: "Casos de uso - Zentro",
    description:
      "Zentro se adapta a cualquier tipo de negocio: comercio, servicios, restaurantes y más.",
  },
};

export default function CasosDeUsoPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <Industries />
        <HowItWorks />
        <OtherIndustries />
        <CTA />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
