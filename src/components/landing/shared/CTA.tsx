import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="flex items-center flex-col gap-3 my-10">
      <p className="text-center text-muted-foreground text-lg">Empieza ahora</p>

      <h2 className="text-2xl md:text-3xl font-semibold text-center">
        Pon tu negocio en un solo lugar.
      </h2>

      <p className="text-center text-muted-foreground max-w-md">
        Crea tu cuenta y prueba Zentro 30 días gratis, sin tarjeta de crédito.
      </p>

      <div className="flex items-center justify-center gap-x-2 mt-5">
        <Link href="/registrar">
          <Button className="text-base h-fit px-4 py-1.5 rounded-full">
            Empezar gratis
          </Button>
        </Link>

        <Link href="/planes">
          <Button
            variant="glass"
            className="text-base h-fit px-4 py-1.5 rounded-full"
          >
            Ver planes
          </Button>
        </Link>
      </div>
    </section>
  );
}
