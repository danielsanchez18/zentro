import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { CTA } from "@/components/landing/shared/CTA";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <section className="flex flex-col items-center text-center py-16 gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Preguntas frecuentes
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Resolvemos las dudas más comunes para que empieces a usar
                Zentro con total confianza.
              </p>
            </div>
          </section>

          <div className="max-w-3xl mx-auto space-y-10 pb-10">
            {/* GENERAL */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                General
              </h2>
              <Accordion className="w-full space-y-2">
                <AccordionItem value="general-1" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Qué es Zentro?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Zentro es una plataforma SaaS multi-tenant para gestionar tu
                    negocio en un solo lugar: catálogo, inventario, POS, pedidos,
                    CRM, reportes, presencia digital y mucho más.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-2" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Para qué tipo de negocio sirve?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Zentro se adapta a comercio físico o digital, servicios
                    profesionales, restaurantes y empresas omnicanal. Su diseño
                    modular permite activar solo las capacidades que necesitas.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-3" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Necesito instalar algo para usarlo?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    No. Zentro funciona 100% en la web. Puedes usarlo desde
                    cualquier navegador en computadora, tablet o móvil con
                    conexión a internet.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="general-4" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Funciona en móvil y tablet?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Está optimizado para usarse en cualquier dispositivo,
                    siendo ideal para puntos de venta y para gestionar tu
                    negocio sobre la marcha.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* PRECIOS Y PLANES */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Precios y planes
              </h2>
              <Accordion className="w-full space-y-2">
                <AccordionItem value="planes-1" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Puedo probar Zentro gratis?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Puedes crear tu cuenta y empezar gratis. No necesitas
                    tarjeta de crédito para comenzar.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planes-2" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Necesito tarjeta de crédito para la prueba?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    No. El periodo de prueba es sin compromiso y sin tarjeta de
                    crédito.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planes-3" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Puedo cambiar de plan cuando quiera?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Puedes subir o bajar de plan en cualquier momento. Los
                    cambios se aplican según tu ciclo de facturación actual.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planes-4" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Puedo cancelar mi suscripción?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Puedes cancelar tu plan desde tu panel de suscripciones
                    cuando quieras. No hay permanencia forzosa.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="planes-5" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Cómo funciona la facturación?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Según el plan elegido, la facturación puede ser mensual o
                    anual. Recibirás tu factura automáticamente por correo
                    electrónico.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* FUNCIONALIDADES */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Funcionalidades
              </h2>
              <Accordion className="w-full space-y-2">
                <AccordionItem value="func-1" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Funciona para varios locales o sucursales?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Puedes tener una o varias sucursales. Gestionas
                    inventario, POS, caja y ventas por sucursal, con un
                    consolidado a nivel de organización.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="func-2" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Es compatible con venta online y física (omnicanal)?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Zentro unifica ventas físicas (POS), online y de canales
                    externos en una sola plataforma.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="func-3" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Qué diferencia hay entre Organización (Tenant) y Sucursal
                    (Branch)?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    La <strong>Organización</strong> es el tenant (configuración
                    global, roles, permisos, presencia digital y precios base).
                    La <strong>Sucursal</strong> es el contexto operativo (stock,
                    POS, caja, compras y gastos de sede). Algunos módulos son
                    globales y otros operan por sucursal.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="func-4" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Qué módulos incluye Zentro?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Incluye Catálogo, Inventario, POS, Pedidos, Caja, CRM,
                    Reportes, Presencia digital, Configuración, Invitaciones,
                    Roles y Permisos. Puedes activar solo los módulos que
                    necesitas para tu negocio.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* CUENTA Y EQUIPO */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Cuenta y equipo
              </h2>
              <Accordion className="w-full space-y-2">
                <AccordionItem value="equipo-1" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Puedo tener varias organizaciones?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Desde tu Account Hub (<code>/dashboard</code>) puedes
                    crear y alternar entre varias organizaciones con un solo
                    usuario.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="equipo-2" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Cómo invito a mi equipo?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Desde Configuración → Invitaciones puedes enviar
                    invitaciones por correo con un rol específico y alcance
                    (organización o sucursal).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* SEGURIDAD Y SOPORTE */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Seguridad y soporte
              </h2>
              <Accordion className="w-full space-y-2">
                <AccordionItem value="seg-1" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Mis datos están seguros?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Aplicamos buenas prácticas de seguridad, aislamiento
                    multi-tenant por fila, autenticación con JWT y cifrado en
                    tránsito.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="seg-2" className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left">
                    ¿Dónde puedo obtener ayuda?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Puedes obtener ayuda en nuestro{" "}
                    <Link href="/ayuda" className="text-primary hover:underline">
                      Centro de ayuda
                    </Link>
                    , en{" "}
                    <Link href="/faq" className="text-primary hover:underline">
                      Preguntas frecuentes
                    </Link>{" "}
                    o escribiéndonos a través de{" "}
                    <Link href="/contacto" className="text-primary hover:underline">
                      Contacto
                    </Link>
                    . También puedes crear tickets de soporte desde{" "}
                    <Link
                      href="/dashboard/ayuda"
                      className="text-primary hover:underline"
                    >
                      /dashboard/ayuda
                    </Link>
                    .
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* BLOQUE DE CIERRE */}
            <div className="rounded-xl border bg-muted/30 p-6 text-center shadow-sm mt-10">
              <h3 className="text-lg font-semibold mb-2">
                ¿No encuentras tu respuesta?
              </h3>
              <p className="text-muted-foreground mb-4">
                Si no hemos respondido tu duda aquí, nuestro equipo está
                dispuesto a ayudarte.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Escríbenos
              </Link>
            </div>
          </div>

          <CTA />
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
