import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { CTA } from "@/components/landing/shared/CTA";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";
import Link from "next/link";
import { ArrowRight, Book, LifeBuoy, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description:
    "Encuentra respuestas, guías y soporte para sacar el máximo provecho a Zentro.",
};

export default function AyudaPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <section className="flex flex-col items-center text-center py-16 gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Centro de ayuda
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Encuentra respuestas rápidas o
                contacta con nuestro equipo de soporte.
              </p>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto pb-10">
            <Link
              href="/faq"
              className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Book className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
                    Preguntas frecuentes
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </h2>
                  <p className="text-muted-foreground">
                    Respuestas rápidas a las dudas más comunes sobre Zentro.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/ayuda"
              className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <LifeBuoy className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
                    Ayuda desde tu cuenta
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </h2>
                  <p className="text-muted-foreground">
                    Accede al centro de ayuda dentro de tu panel para crear
                    tickets de soporte.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/contacto"
              className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <MessageCircle className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
                    Contacta con nosotros
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </h2>
                  <p className="text-muted-foreground">
                    ¿Necesitas ayuda personalizada? Escríbenos y te
                    responderemos lo antes posible.
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <CTA />
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
