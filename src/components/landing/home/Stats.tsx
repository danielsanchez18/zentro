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
        <div className="bg-background -mt-20 rounded-xl ml-20">
          <div className="glass backdrop-blur-3xl space-y-5 sm:px-7 p-6 rounded-xl">
            <blockquote className="text-gray-800 dark:text-neutral-400">
              "Antes manejábamos el inventario de cada sucursal en hojas de
              cálculo distintas. Con Zentro todo está en un solo lugar y ya no
              perdemos ventas por faltantes de stock."
            </blockquote>
            <div>
              <p className="font-semibold dark:text-neutral-100 font-heading!">
                Lucía Fernández
              </p>
              <p className="text-gray-800 dark:text-neutral-400 text-sm font-heading!">
                Propietaria - Casa Verde
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Stats */}
      <article className="w-full order-1 md:order-2 space-y-10 md:space-y-5">
        <div className="space-y-3 max-md:text-center">
          <h2 className="text-3xl font-semibold mb-4 tracking-tight">
            Resultados que se notan
          </h2>
          <p className="text-muted-foreground">
            Más control sobre tu inventario, más velocidad en caja y una vista
            clara de todo tu negocio, sin importar cuántas sucursales tengas.
          </p>
        </div>

        <div className="grid gap-y-1">
          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 max-sm:gap-x-5 items-center w-30 sm:w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">90%</div>
              <div className="rounded-full bg-primary text-primary-foreground p-1 w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-icon lucide-arrow-up size-4"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">
                de ahorro de tiempo
              </div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground">
                Menos tareas repetitivas: inventario, caja y reportes
                centralizados.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 max-sm:gap-x-5 items-center w-30 sm:w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">3x</div>
              <div className="rounded-full bg-primary text-primary-foreground p-1 w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-icon lucide-arrow-up size-4"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">
                más rápido en caja
              </div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground">
                Cobra y cierra la caja en segundos con el POS de Zentro.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center">
            <div className="grid grid-cols-2 max-sm:gap-x-5 items-center w-30 sm:w-48 border-r-2 border-border">
              <div className="text-3xl font-semibold">100%</div>
              <div className="rounded-full bg-primary text-primary-foreground p-1 w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-icon lucide-arrow-up size-4"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </div>
              <div className="text-muted-foreground col-span-2 text-sm">
                sincronizado
              </div>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground">
                POS, web y pedidos online comparten el mismo stock en tiempo
                real.
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
