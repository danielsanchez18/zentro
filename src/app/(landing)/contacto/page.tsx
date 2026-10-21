import type { Metadata } from "next";
import { Channels } from "@/components/landing/contact/Channels";
import { ContactForm } from "@/components/landing/contact/ContactForm";
import { Hero } from "@/components/landing/contact/Hero";
import { Resources } from "@/components/landing/contact/Resources";
import { CTA } from "@/components/landing/shared/CTA";
import { Footer } from "@/components/landing/shared/Footer";
import { Navbar } from "@/components/landing/shared/Nabar";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tienes dudas sobre Zentro? Ponte en contacto con nuestro equipo. Te responderemos lo antes posible.",
  openGraph: {
    title: "Contacto - Zentro",
    description:
      "¿Tienes dudas sobre Zentro? Ponte en contacto con nuestro equipo. Te responderemos lo antes posible.",
  },
};

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
        <section className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          <div className="order-last lg:order-first">
            <Channels />
          </div>
          <ContactForm />
        </section>
        <Resources />
        <CTA />
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
