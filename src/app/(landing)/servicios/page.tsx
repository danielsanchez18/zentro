import type { Metadata } from "next";
import { Stats } from "@/components/landing/home/Stats";
import { Download } from "@/components/landing/services/Download";
import { Features } from "@/components/landing/services/Features";
import { Hero } from "@/components/landing/services/Hero";
import { Modules } from "@/components/landing/services/Modules";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Descubre todos los servicios de Zentro: dashboard, analytics, pagos, mensajería y ecommerce integrados en una plataforma.",
  openGraph: {
    title: "Servicios | Zentro",
    description:
      "Descubre todos los servicios de Zentro: dashboard, analytics, pagos, mensajería y ecommerce integrados en una plataforma.",
  },
};

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <Features />
        <Modules />
      </div>
      <Download />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <Stats />
        <CTA />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
