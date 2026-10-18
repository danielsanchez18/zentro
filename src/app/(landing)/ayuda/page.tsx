import type { Metadata } from "next";
import { HowItWorks } from "@/components/landing/home/HowItWorks";
import { Guides } from "@/components/landing/help/Guides";
import { Hero } from "@/components/landing/help/Hero";
import { Support } from "@/components/landing/help/Support";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description:
    "Encuentra respuestas, guías y soporte para sacar el máximo provecho a Zentro.",
  openGraph: {
    title: "Centro de ayuda | Zentro",
    description:
      "Encuentra respuestas, guías y soporte para sacar el máximo provecho a Zentro.",
  },
};

export default function AyudaPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <Guides />
        <HowItWorks />
        <Support />
        <CTA />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
