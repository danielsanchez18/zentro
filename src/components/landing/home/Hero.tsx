import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { APPS_AVAILABLE, APP_STORE_URLS } from "@/components/landing/shared/apps";

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

      {APPS_AVAILABLE ? (
        <div className="max-lg:hidden w-full max-w-sm ml-auto">
          <p className="mb-5">Descarga la app en</p>

          <a
            href={APP_STORE_URLS.appStore}
            className="flex items-center gap-x-2 px-5 py-3.5 border border-b-transparent border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:border-b-transparent dark:hover:border-neutral-500 transition rounded-t-xl w-full"
          >
            <Image
              src="/logos/Logo_AppStore.png"
              alt="Logo App Store"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-sm font-semibold text-nowrap">App Store</p>
          </a>

          <a
            href={APP_STORE_URLS.googlePlay}
            className="flex items-center gap-x-2 px-5 py-3.5 border border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:hover:border-neutral-500 transition rounded-b-xl w-full"
          >
            <Image
              src="/logos/Logo_GooglePlay.png"
              alt="Logo Google Play"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-sm font-semibold text-nowrap">Google Play</p>
          </a>
        </div>
      ) : (
        <div className="max-lg:hidden w-full max-w-sm ml-auto">
          <div className="flex items-center gap-x-3 px-5 py-3.5 border border-gray-200 dark:border-neutral-600 rounded-xl w-full">
            <Globe className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">
                Disponible desde cualquier navegador
              </p>
              <p className="text-[13px] text-muted-foreground">
                En computadora, tablet o celular. Sin instalar nada.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
