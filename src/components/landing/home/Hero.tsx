import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <section className="max-md:pb-16 max-md:pt-5 md:h-100 grid grid-cols-[auto_1fr] gap-x-10 xl:gap-x-20 items-center">
      <div className="grid gap-y-5 max-w-xl xl:max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-medium uppercase">
          Tu negocio, <br />
          <span className="text-primary">en un solo lugar</span>
        </h1>

        <p className="text-foreground sm:text-lg">
          Centraliza inventario, ventas, clientes y operaciones. Gestiona una o
          varias sucursales y haz crecer tu negocio desde una sola plataforma.
        </p>

        <div className="flex items-center gap-x-2">
          <Link href="/registrar">
            <Button size="lg" className="rounded-full px-3 py-1.5 text-base">
              Empezar gratis
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              size="lg"
              variant="glass"
              className="text-base rounded-full px-3 py-1.5"
            >
              Ver demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-lg:hidden w-full max-w-sm ml-auto">
        <p className="mb-5">Descarga la app en</p>

        <button className="flex items-center justify-between px-5 py-3.5 border border-b-transparent border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:border-b-transparent dark:hover:border-neutral-500 transition rounded-t-xl w-full">
          <div className="flex items-center gap-x-2">
            <Image
              src="/logos/Logo_AppStore.png"
              alt="Logo App Store"
              width={20}
              height={20}
              className="object-contain"
              priority
            />
            <p className="text-sm font-semibold text-nowrap">App Store</p>
          </div>

          <div className="flex items-center gap-x-0.5">
            <Star className="stroke-0 fill-foreground size-3.5" />
            <p className="text-[13px] font-semibold text-nowrap">4.9</p>
            <p className="text-[13px] text-muted-foreground text-nowrap ml-1.5">
              1.2M reseñas
            </p>
          </div>
        </button>

        <button className="flex items-center justify-between px-5 py-3.5 border border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:hover:border-neutral-500 transition rounded-b-xl w-full">
          <div className="flex items-center gap-x-2">
            <Image
              src="/logos/Logo_GooglePlay.png"
              alt="Logo Google Play"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-sm font-semibold text-nowrap">Google Play</p>
          </div>

          <div className="flex items-center gap-x-0.5">
            <Star className="stroke-0 fill-foreground size-3.5" />
            <p className="text-[13px] font-semibold text-nowrap">4.9</p>
            <p className="text-[13px] text-muted-foreground text-nowrap ml-1.5">
              367k reseñas
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
