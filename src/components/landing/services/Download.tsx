import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

import { APPS_AVAILABLE, APP_STORE_URLS } from "@/components/landing/shared/apps";

const stores = [
  {
    name: "iOS App",
    logo: "/logos/Logo_AppStore.png",
    alt: "Logo App Store",
    storeName: "App Store",
    url: APP_STORE_URLS.appStore,
    description:
      "Tu inventario, ventas y clientes desde tu iPhone o iPad. Próximamente en el App Store.",
  },
  {
    name: "Android App",
    logo: "/logos/Logo_GooglePlay.png",
    alt: "Logo Google Play",
    storeName: "Google Play",
    url: APP_STORE_URLS.googlePlay,
    description:
      "Todo tu negocio en el bolsillo, desde cualquier celular Android. Próximamente en Google Play.",
  },
];

export function Download() {
  return (
    <section className="w-full py-20">
      <div className="space-y-3 text-center max-w-2xl mx-auto px-5">
        <p className="text-muted-foreground">Aplicación Zentro</p>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
          Llévate Zentro a todas partes.
        </h2>
        <p className="text-muted-foreground text-sm text-balance">
          Por ahora, Zentro funciona desde el navegador en cualquier
          dispositivo. Las apps para iOS y Android están en camino.
        </p>
      </div>

      <div className="mt-20 grid md:flex justify-center gap-10 mx-auto px-5">
        {stores.map((store) => (
          <div
            key={store.name}
            className="grid rounded-xl bg-card px-10 py-10 w-full sm:max-w-sm gap-y-5 justify-items-center text-center"
          >
            <Image
              src={store.logo}
              alt={store.alt}
              className="size-16 object-contain"
              width={64}
              height={64}
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-foreground">
              {store.name}
            </h3>
            <p className="text-sm text-muted-foreground">{store.description}</p>

            {APPS_AVAILABLE ? (
              <a
                href={store.url}
                className="text-sm flex items-center gap-x-3 group text-foreground"
                aria-label={`Descargar en ${store.storeName}`}
              >
                <p>Descargar en {store.storeName}</p>
                <ChevronRight className="block group-hover:hidden size-4 duration-300" />
                <ArrowRight className="hidden group-hover:block size-4 duration-300" />
              </a>
            ) : (
              <span className="glass-card text-sm font-medium text-foreground px-3 py-1.5 rounded-full">
                Próximamente
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
