import Image from "next/image";

export function Modules() {
  return (
    <section className="">

        <div className="space-y-3 text-center max-w-3xl mx-auto px-5 mt-20">
            <h3 className="text-2xl md:text-3xl font-semibold">Crea flujos de trabajo increíblemente rápido</h3>
            <p className="text-muted-foreground">Tanto si eres un profesional independiente como si formas parte de un gran equipo, Preline te permite automatizar tus flujos de trabajo sin esfuerzo y sin necesidad de programar.</p>
        </div>

        <div className="py-20 grid md:grid-cols-2 gap-10">

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-muted rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-white rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-white rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-white rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-white rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

            <article className="grid grid-cols-2 items-center gap-x-5">
                <div className="bg-muted h-60 max-w-60 relative rounded-xl contain-content">
                    <div className="absolute top-4 left-4 size-60 bg-white rounded-lg overflow-hidden">
                        <Image src="/images/module-services.png" alt="" width={100} height={100} className="w-full object-cover" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100">Calendarios</h4>
                    <p className="text-muted-foreground text-sm">Descubra interfaces de usuario de calendario fáciles de usar, diseñadas tanto para paneles de control como para interfaces de administración.</p>
                </div>
            </article>

        </div>

    </section>

  )
}