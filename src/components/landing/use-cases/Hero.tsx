import Link from "next/link";
import { BusinessCard } from "./BusinessCard";
import { industries } from "./data";
import { showcase } from "./showcase";

export function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-linear-to-b from-background via-gray-100 dark:via-neutral-950 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

      <div className="relative max-w-300 mx-auto px-5 sm:px-7 xl:px-10 pt-20 lg:pt-28 flex flex-col items-center text-center gap-y-7">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold font-oswald uppercase">
          Hecho para <br />
          <span className="text-primary">tu tipo</span> de negocio
        </h1>

        <p className="text-gray-900 dark:text-neutral-200 text-lg text-balance max-w-2xl">
          Comercios, restaurantes, servicios y empresas omnicanal: la misma
          plataforma, configurada para tu forma de trabajar.
        </p>

        {/* Accesos rápidos por industria */}
        <nav
          aria-label="Ir a un caso de uso"
          className="flex flex-wrap justify-center gap-2"
        >
          {industries.map((industry) => {
            const Icon = industry.icon;

            return (
              <Link
                key={industry.id}
                href={`#${industry.id}`}
                className="group glass glass-interactive rounded-full px-4 py-2 flex items-center gap-x-2 text-base font-medium"
              >
                <Icon className="size-4 text-primary" />
                {industry.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Marquesina de negocios */}
      <div className="relative pt-24 pb-24 space-y-5">
        <p className="text-center text-lg px-5">
          Pensado para negocios como estos
        </p>
        <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="landing-marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex gap-x-4 pr-4"
              >
                {showcase.map((business, index) => (
                  <li key={business.name}>
                    <BusinessCard
                      business={business}
                      tabIndex={copy === 1 ? -1 : undefined}
                      eager={copy === 0 && index < 5}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
