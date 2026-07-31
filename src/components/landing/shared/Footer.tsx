import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-10">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-7 xl:px-10">

        {/* Links and social media */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-5 md:gap-x-10">

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Empresa</h3>
            <Link href="/" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Sobre Zentro</Link>
            <Link href="/servicios" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Servicios</Link>
            <Link href="/precios" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Precios</Link>
            <Link href="/clientes" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Clientes</Link>
            <Link href="/afiliados" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Afiliados: Obten beneficios</Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Servicio al cliente</h3>
            <Link href="/contactanos" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Contáctanos</Link>
            <Link href="/politicas" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Política de devoluciones y reembolsos</Link>
            <Link href="/politicas" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Política de afiliados</Link>
            <Link href="/reportar-actividad" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Reportar actividad sospechosa</Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Ayuda</h3>
            <Link href="#preguntas-frecuentes" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Preguntas frecuentes</Link>
            <Link href="/politicas" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Centro de seguridad</Link>
            <Link href="/reportar-actividad" className="text-muted-foreground hover:text-foreground hover:underline w-fit">Protección de compras</Link>
          </article>

          <article className="text-sm flex flex-col gap-y-3">
            <h3 className="font-semibold mb-3">Descarga la app</h3>

            <Link href="" className="flex gap-x-2 lg:gap-x-3 rounded-xl py-3 px-3 lg:px-5 pr-8 w-fit bg-card border border-border hover:border-border hover:shadow-xs">
              <Image src="/logos/Logo_AppStore.png" alt="Logo App Store" width={30} height={30} className="size-5 lg:size-6 object-contain" loading="lazy" />
              <div className="flex flex-col">
                <p className="leading-none text-muted-foreground text-[10px] truncate">Disponible en la</p>
                <p className="leading-none font-semibold text-xs lg:text-sm">App Store</p>
              </div>
            </Link>

            <Link href="" className="flex gap-x-2 lg:gap-x-3 rounded-xl py-3 px-3 lg:px-5 pr-8 w-fit bg-card border border-border hover:border-border hover:shadow-xs">
              <Image src="/logos/Logo_GooglePlay.png" alt="Logo Google Play" width={30} height={30} className="size-5 lg:size-6 object-contain" loading="lazy" />
              <div className="flex flex-col">
                <p className="leading-none text-muted-foreground text-[10px] truncate">Disponible en la</p>
                <p className="leading-none font-semibold text-xs lg:text-sm">Google Play</p>
              </div>
            </Link>
          </article>
        </div>

        {/* Privacy and terms */}
        <div className="flex flex-wrap max-sm:justify-center items-center gap-x-3 gap-y-2 mt-10">
          <Link href="https://www.foxcodepe.com/" target="_blank" className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap">© 2026 FoxCode.</Link>
          <div className="rounded-full size-1 bg-gray-700 dark:bg-neutral-400"></div>
          <Link href="/terminos" className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap">Términos y Condiciones.</Link>
          <div className="rounded-full size-1 bg-gray-700 dark:bg-neutral-400"></div>
          <Link href="/politica" className="text-sm text-muted-foreground hover:underline hover:text-foreground text-nowrap">Política de privacidad.</Link>
        </div>

      </div>
    </footer>

  )
}
