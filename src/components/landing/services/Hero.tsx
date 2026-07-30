
export function Hero() {
  return (
    <section className="w-full h-140 lg:h-200 relative bg-linear-to-b from-background via-gray-100 dark:via-neutral-950 to-background">
      <div
        className="z-30 w-full before:absolute before:size-full before:bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:before:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] before:bg-size-[20px_20px]">
      </div>

      <div className="z-50 absolute inset-0 max-w-4xl mx-auto flex flex-col items-center justify-center gap-y-7 h-full text-center px-5 sm:px-10">
        <p className="bg-muted text-foreground px-3 py-2 rounded-full flex items-center gap-x-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-zap-icon lucide-zap size-4 ">
            <path
              d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
          </svg>
          Aprovecha Escapify
        </p>
        <h3 className="text-5xl md:text-6xl font-bold">
          Haz más con <br /> <span className="text-primary">Escapify</span> en la App Web
        </h3>
        <p className="text-gray-900 dark:text-neutral-200 text-balance">
          Puedes usar Escapify para mucho más que solo la aplicación web.
        </p>
      </div>

      <div className="absolute inset-0 h-full w-full max-w-300 mx-auto overflow-hidden px-4 sm:px-7 xl:px-10">
        <img src="/images/card-example.png" alt="" className="h-32 lg:h-40 z-40 absolute top-5 lg:top-10 left-5 lg:left-10" />
        <img src="/images/card-example2.png" alt="" className="h-32 lg:h-40 z-40 absolute bottom-5 lg:bottom-10 right-5 lg:right-10" />
      </div>


    </section>
  );
}
