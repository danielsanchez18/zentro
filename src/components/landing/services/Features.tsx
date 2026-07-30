import { BrainCircuit, ChartPie, HandCoins, Mails, MonitorCog, TrendingUpDown } from "lucide-react";

export function Features() {
  return (
    <section className="pt-32">

        <div className="space-y-3 text-center max-w-xl mx-auto px-5">
            <p className="text-muted-foreground">Desde principiantes hasta expertos</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-neutral-100">Aprende a desarrollar sitios web con componentes y sistemas de diseño.</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-16 md:gap-x-20 py-20">
            <article className="grid gap-y-4">
                <BrainCircuit className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Más creatividad</h4>
                <p className="text-muted-foreground text-sm">Aquí es donde realmente comenzamos a visualizar tus bocetos en servilletas y los convertimos en hermosos píxeles.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Creatividad</a>
            </article>

            <article className="grid gap-y-4">
                <HandCoins className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Escala los presupuestos de manera eficiente</h4>
                <p className="text-muted-foreground text-sm">Ahora que hemos alineado los detalles, es hora de planificar y organizar todo.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Eficiencia</a>
            </article>

            <article className="grid gap-y-4">
                <ChartPie className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Paneles inteligentes</h4>
                <p className="text-muted-foreground text-sm">Aquí es donde realmente comenzamos a visualizar tus bocetos en servilletas y los convertimos en hermosos píxeles.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Dashboard</a>
            </article>

            <article className="grid gap-y-4">
                <MonitorCog className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Centro de control</h4>
                <p className="text-muted-foreground text-sm">Ahora que hemos alineado los detalles, es hora de planificar y organizar todo.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Control</a>
            </article>

            <article className="grid gap-y-4">
                <Mails className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Informes por Email</h4>
                <p className="text-muted-foreground text-sm">Nos esforzamos por adoptar e impulsar el cambio en nuestro sector, lo que nos permite mantener la relevancia de nuestros clientes.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Reportes</a>
            </article>

            <article className="grid gap-y-4">
                <TrendingUpDown className="size-8 stroke-[1.5] text-primary"/>
                <h4 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">Previsión</h4>
                <p className="text-muted-foreground text-sm">Mantener la concentración nos permite convertir cada proyecto que emprendemos en algo que nos apasiona.</p>
                <a href="" className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark">Más información sobre Previsión</a>
            </article>
        </div>

    </section>

  )
}
