import type { Metadata } from "next";
import { Navbar } from "@/components/landing/shared/Nabar";
import { Footer } from "@/components/landing/shared/Footer";
import { CTA } from "@/components/landing/shared/CTA";
import { UpArrowButton } from "@/components/landing/shared/UpArrowButton";
import { Store, Briefcase, Utensils, Building2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Casos de uso",
  description:
    "Zentro se adapta a cualquier tipo de negocio: comercio, servicios, restaurantes y más.",
  openGraph: {
    title: "Casos de uso | Zentro",
    description:
      "Zentro se adapta a cualquier tipo de negocio: comercio, servicios, restaurantes y más.",
  },
};

const useCases = [
  {
    title: "Comercio físico y retail",
    description:
      "Gestiona inventario por sucursal, ventas en POS, caja y reportes de ventas en tiempo real.",
    icon: Store,
    features: ["POS integrado", "Inventario por sucursal", "Control de caja", "Reportes de ventas"],
  },
  {
    title: "Servicios profesionales",
    description:
      "Agenda, CRM, recursos y gestión de clientes para estudios, consultorías o talleres.",
    icon: Briefcase,
    features: ["Agenda y citas", "CRM de clientes", "Presupuestos", "Seguimiento de servicios"],
  },
  {
    title: "Restaurantes y food service",
    description:
      "Pedidos, mesas, cocina, delivery y control de insumos por sucursal.",
    icon: Utensils,
    features: ["Pedidos y mesas", "POS para restaurante", "Delivery", "Control por sucursal"],
  },
  {
    title: "Empresas omnicanal",
    description:
      "Unifica ventas online y físicas, canales externos y múltiples unidades de cumplimiento.",
    icon: Building2,
    features: ["Omnicanal", "Múltiples canales", "Consolidado de ventas", "Múltiples sucursales"],
  },
];

export default function CasosDeUsoPage() {
  return (
    <>
      <Navbar />
      <div className="mx-4 rounded-2xl bg-linear-to-b from-muted dark:from-card via-card to-transparent">
        <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10 py-10">
          <section className="flex flex-col items-center text-center py-16 gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Casos de uso
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
                Zentro se adapta a tu modelo de negocio. Desde comercios hasta
                empresas omnicanal, todo en una sola plataforma.
              </p>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto pb-10">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl border bg-card p-8 shadow-sm transition-colors hover:bg-muted/50 flex flex-col h-full"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {useCase.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {useCase.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="size-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t">
                    <a
                      href="/registrar"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:underline"
                    >
                      Empezar con este caso de uso
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <CTA />
        </div>
      </div>
      <Footer />
      <UpArrowButton />
    </>
  );
}
