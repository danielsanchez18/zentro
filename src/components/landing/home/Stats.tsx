import Image from "next/image";

export function Stats() {
  return (
    <section className="py-20 grid md:grid-cols-2 gap-10 items-center">

      {/* Testimonial */}
      <article className="flex flex-col w-full order-2 md:order-1">
        <div className="w-60 sm:w-80 h-80 sm:h-96 bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src="/images/review.png"
            alt=""
            width={720}
            height={960}
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="bg-muted sm:px-7 p-6 -mt-20 rounded-xl ml-20 space-y-5">
          <blockquote className="text-gray-800 dark:text-neutral-400 text-sm">"El equipo de Zentro es revolucionario. Nos proporcionan asesoramiento estratégico para optimizar nuestro sitio web y realmente se sienten parte de nuestro equipo."</blockquote>
          <div>
            <p className="font-semibold dark:text-neutral-100 text-sm">Aroa Gil Bo</p>
            <p className="text-gray-800 dark:text-neutral-400 text-sm">Directora de Éxito del Cliente de Framer</p>
          </div>
        </div>
      </article>

      {/* Stats */}
      <article className="w-full order-1 md:order-2 space-y-10 md:space-y-5">
        <div className="space-y-3 max-md:text-center">
          <h3 className="text-3xl font-semibold mb-4 tracking-tight">Zentro que convierte</h3>
          <p className="text-muted-foreground text-sm">Ya sea que desee hlt95 a su equipo, impulsar sus esfuerzos de marketing o gestionar el inventario para éxitos de ventas inesperados, Preline está listo para ayudarle.</p>
        </div>

        <div className="grid gap-y-1">
          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 items-center w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">90%</div>
              <div className="rounded-full bg-primary text-white p-1 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-icon lucide-arrow-up size-4 dark:text-black"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">ahorro de tiempo</div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-sm">Reducción del tiempo dedicado a la creación de contenido</p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 items-center w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">35%</div>
              <div className="rounded-full bg-primary text-white p-1 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-icon lucide-arrow-up size-4 dark:text-black"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">de ahorro</div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-sm">Contratación de talento flexible en comparación con los salarios</p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 items-center w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">70%</div>
              <div className="rounded-full bg-primary text-white p-1 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-icon lucide-arrow-up size-4 dark:text-black"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">conocimiento de marca</div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-sm">Los clientes dicen que tienen una mejor experiencia con la marca</p>
            </div>
          </div>
        </div>
      </article>

    </section>
  )
}
