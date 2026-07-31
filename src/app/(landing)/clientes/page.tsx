import type { Metadata } from "next";
import { Hero } from "@/components/landing/clients/Hero";
import { List } from "@/components/landing/clients/List";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";

export const metadata: Metadata = {
  title: "Clientes",
  description:
    "Empresas que confían en Zentro para centralizar su gestión, optimizar su inventario y multiplicar sus ventas.",
  openGraph: {
    title: "Clientes | Zentro",
    description:
      "Empresas que confían en Zentro para centralizar su gestión, optimizar su inventario y multiplicar sus ventas.",
  },
};

export default function ClientesPage() {
  return (
    <>
      <Navbar />
       <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
          <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
            <Hero /> 
            <List /> 
            <CTA />
          </div>
        </div>
      <Footer />
    </>
  )
}
