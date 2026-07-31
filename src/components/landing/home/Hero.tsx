import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function Hero() {
  return (
    <section className="max-md:pb-16 max-md:pt-5 md:h-100 grid grid-cols-[auto_1fr] gap-x-10 xl:gap-x-20 items-center">
      <div className="grid gap-y-5 max-w-xl xl:max-w-2xl">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold ">
          Gestiona tu negocio <br />
          <span className="text-primary">y multiplica tus ventas</span>     
        </h1>

        <p className="text-foreground max-sm:text-sm">
          Centraliza tu inventario, gestiona múltiples tiendas y aumenta tus ingresos en una única plataforma. 
        </p>

        <div className="flex items-center gap-x-1">
          <Link href="/registrar">
            <Button size="lg" className="rounded-full h-fit px-4 py-1.5 text-base">Probar ahora</Button>
          </Link>
          <Link href="/probar">
            <Button size="lg" variant="secondary" className="text-base rounded-full h-fit px-4 py-1.5">Ver demo</Button>
          </Link>
        </div>
      </div>

      <div className="max-lg:hidden w-full max-w-sm ml-auto">
        <p className="text-sm text-muted-foreground mb-5">Descarga la app en</p>

        <button className="flex items-center justify-between px-5 py-3.5 border border-b-transparent border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:hover:border-neutral-500 transition rounded-t-xl w-full">

          <div className="flex items-center gap-x-2">
            <Image src="/logos/Logo_AppStore.png" alt="Logo App Store" width={20} height={20} className="object-contain" priority />
            <p className="text-sm font-semibold text-nowrap">App Store</p>
          </div>

          <div className="flex items-center gap-x-0.5">
            <Star className="stroke-0 fill-foreground size-3.5" />
            <p className="text-[13px] font-semibold text-nowrap">4.9</p>
            <p className="text-[13px] text-muted-foreground text-nowrap ml-1.5">1.2M reseñas</p>
          </div>
        </button>

        <button className="flex items-center justify-between px-5 py-3.5 border border-gray-200 hover:border-gray-300 dark:border-neutral-600 dark:hover:border-neutral-500 transition rounded-b-xl w-full">

          <div className="flex items-center gap-x-2">
            <Image src="/logos/Logo_GooglePlay.png" alt="Logo Google Play" width={20} height={20} className="object-contain"/>
            <p className="text-sm font-semibold text-nowrap">Google Play</p>
          </div>

          <div className="flex items-center gap-x-0.5">
            <Star className="stroke-0 fill-foreground size-3.5" />
            <p className="text-[13px] font-semibold text-nowrap">4.9</p>
            <p className="text-[13px] text-muted-foreground text-nowrap ml-1.5">367k reseñas</p>
          </div>
        </button>

      </div>
    </section>
  )
}
