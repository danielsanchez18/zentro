import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { CTA } from "@/components/landing/shared/CTA";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tienes dudas sobre Zentro? Ponte en contacto con nuestro equipo. Te responderemos lo antes posible.",
  openGraph: {
    title: "Contacto | Zentro",
    description:
      "¿Tienes dudas sobre Zentro? Ponte en contacto con nuestro equipo. Te responderemos lo antes posible.",
  },
};

export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <section className="flex flex-col items-center text-center py-16 gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Hablemos
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                ¿Tienes alguna duda sobre Zentro o necesitas una demo para tu
                equipo? Escríbenos y te ayudaremos.
              </p>
            </div>
          </section>

          <div className="grid gap-10 lg:grid-cols-2 max-w-5xl mx-auto pb-10">
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <MessageCircle className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Soporte general
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      Para dudas, errores o ayuda con la plataforma.
                    </p>
                    <p className="text-sm font-medium">soporte@zentro.app</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1">
                      Ventas y demo
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      Para planes empresariales, integraciones o demos
                      personalizados.
                    </p>
                    <p className="text-sm font-medium">ventas@zentro.app</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <p className="text-muted-foreground">
                  Normalmente respondemos en un plazo de{" "}
                  <span className="font-medium text-foreground">
                    24-48 horas hábiles
                  </span>
                  .
                </p>
              </div>
            </div>

            <form className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm font-medium">
                  Nombre completo
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="empresa" className="text-sm font-medium">
                  Empresa (opcional)
                </label>
                <Input
                  id="empresa"
                  name="empresa"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium">
                  Mensaje
                </label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto rounded-full">
                Enviar mensaje
              </Button>

              <p className="text-xs text-muted-foreground">
                Al enviar este formulario, aceptas nuestra Política de
                privacidad.
              </p>
            </form>
          </div>

          <CTA />
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
