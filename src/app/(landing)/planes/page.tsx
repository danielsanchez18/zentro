import type { Metadata } from "next";
import { Features } from "@/components/landing/prices/Features";
import { Plans } from "@/components/landing/prices/Plans";
import { Clients } from "@/components/landing/shared/Clients";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Questions } from "@/components/landing/shared/Questions";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Planes y precios",
  description:
    "Elige el plan perfecto para tu negocio. Desde el plan gratuito hasta el plan empresarial, Zentro escala contigo.",
  openGraph: {
    title: "Planes y precios | Zentro",
    description:
      "Elige el plan perfecto para tu negocio. Desde el plan gratuito hasta el plan empresarial, Zentro escala contigo.",
  },
};

export default function PlanesPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">
          <Plans />
        </div>
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <Features />
          <Clients />
          <Questions />
          <CTA />
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  )
}
