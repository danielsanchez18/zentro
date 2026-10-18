import { Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full h-140 lg:h-200 relative bg-linear-to-b from-background via-gray-100 dark:via-neutral-950 to-background">
      <div className="z-30 w-full before:absolute before:size-full before:bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:before:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] before:bg-size-[20px_20px]"></div>

      <div className="z-50 absolute inset-0 max-w-4xl mx-auto flex flex-col items-center justify-center gap-y-7 h-full text-center px-5 sm:px-10">
        <p className="glass-card text-foreground px-3 py-2 rounded-full flex items-center gap-x-1 font-medium">
          <Zap className="size-4" />
          Aprovecha Zentro
        </p>
        <h1 className="text-6xl sm:text-6xl md:text-7xl font-semibold font-oswald uppercase">
          Haz más con <br /> <span className="text-primary">Zentro</span> en tu
          negocio
        </h1>
        <p className="text-gray-900 dark:text-neutral-200 text-lg text-balance">
          POS, inventario, catálogo, CRM y reportes: todo lo que tu operación
          necesita, integrado en una sola plataforma web.
        </p>
      </div>

      {/* Imágenes pendientes: card-example.png / card-example2.png (aún no existen)
      <div className="absolute inset-0 h-full w-full max-w-300 mx-auto overflow-hidden px-4 sm:px-7 xl:px-10">
        <img
          src="/images/card-example.png"
          alt=""
          className="h-32 lg:h-40 z-40 absolute top-5 lg:top-10 left-5 lg:left-10"
        />
        <img
          src="/images/card-example2.png"
          alt=""
          className="h-32 lg:h-40 z-40 absolute bottom-5 lg:bottom-10 right-5 lg:right-10"
        />
      </div>
      */}
    </section>
  );
}
