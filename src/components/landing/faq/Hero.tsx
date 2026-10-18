export function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-linear-to-b from-background via-gray-100 dark:via-neutral-950 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-7 xl:px-10 pt-20 pb-16 lg:pt-28 lg:pb-20 flex flex-col items-center text-center gap-y-6">
        <h1 className="text-5xl md:text-7xl font-semibold font-oswald uppercase">
          Preguntas <span className="text-primary">frecuentes</span>
        </h1>

        <p className="text-gray-900 dark:text-neutral-200 md:text-lg text-balance">
          Resolvemos las dudas más comunes para que empieces a usar Zentro con
          total confianza.
        </p>
      </div>
    </section>
  );
}
