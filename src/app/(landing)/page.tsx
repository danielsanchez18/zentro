import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Demo } from "@/components/landing/home/Demo";
import { Hero } from "@/components/landing/home/Hero";
import { Reviews } from "@/components/landing/home/Reviews";
import { About } from "@/components/landing/home/About";
import { Modules } from "@/components/landing/home/Modules";
import { Features } from "@/components/landing/home/Features";
import { Stats } from "@/components/landing/home/Stats";
import { Clients } from "@/components/landing/shared/Clients";
import { Questions } from "@/components/landing/shared/Questions";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";

export const metadata: Metadata = {
  title: "Zentro — Centraliza y multiplica tu negocio",
  description:
    "Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma. Prueba Zentro gratis.",
  openGraph: {
    title: "Zentro — Centraliza y multiplica tu negocio",
    description:
      "Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col font-sans">
        <Navbar />
        <section className="w-full py-10 max-sm:pb-20 bg-cover bg-center">
            <div className="w-full max-w-300 mx-auto px-5 sm:px-7 xl:px-10">
                <Hero />
                <Demo />
            </div>
        </section>
        <section className="w-full py-10">
            <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">
                <Reviews />
                <About />
                <Modules />
                <Features />
                <Stats />
                <Clients />
                <div id="preguntas-frecuentes">
                    <Questions />
                </div>
                <CTA />
            </div>

        </section>
        <Footer />
    </div>
  );
}
