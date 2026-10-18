import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const otherIndustries = [
  "Farmacias",
  "Moda y calzado",
  "Salones de belleza",
  "Veterinarias",
  "Ópticas",
  "Tecnología",
  "Gimnasios",
  "Florerías",
  "Jugueterías",
  "Mascotas",
  "Licorerías",
  "Distribuidoras",
];

export function OtherIndustries() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-950 dark:border dark:border-white/10 my-20">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-size-[20px_20px] mask-[linear-gradient(to_right,transparent,black)]" />
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-[#91E62F]/20 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-12 items-center p-8 sm:p-12 lg:p-16">
        <div className="space-y-5">
          <p className="text-neutral-400 text-base">¿No ves tu industria?</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white text-balance">
            Zentro se adapta a tu negocio,{" "}
            <span className="text-[#91E62F]">no al revés.</span>
          </h2>
          <p className="text-neutral-400 max-w-md">
            Cuéntanos cómo trabajas y te mostramos cómo configurar Zentro para
            tu operación, sin importar el rubro.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Link
              href="/contacto"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "text-base rounded-full",
              )}
            >
              Hablemos de tu caso
            </Link>
            <Link
              href="/casos-de-uso#servicios"
              className={cn(
                buttonVariants({ variant: "glass", size: "lg" }),
                "text-base rounded-full",
              )}
            >
              Ver servicios
            </Link>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2.5 lg:justify-end">
          {otherIndustries.map((name) => (
            <Button
              key={name}
              variant="glass"
              className="rounded-full pointer-events-none"
            >
              {name}
            </Button>
          ))}
          <Button
            variant="default"
            className="rounded-full pointer-events-none"
          >
            Tu negocio
          </Button>
          {/* <li className="glass rounded-full font-medium border border-dashed border-[#91E62F]/60 px-3 py-1.5 flex items-center text-sm text-[#91E62F]">
            Tu negocio
          </li> */}
        </ul>
      </div>
    </section>
  );
}
