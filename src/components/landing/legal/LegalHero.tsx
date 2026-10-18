import { CalendarDays } from "lucide-react";

type LegalHeroProps = {
  title: string;
  highlight: string;
  description: string;
  updatedAt: string;
};

export function LegalHero({
  title,
  highlight,
  description,
  updatedAt,
}: LegalHeroProps) {
  return (
    <section className="w-full relative overflow-hidden bg-linear-to-b from-background via-gray-100 dark:via-neutral-950 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-gray-300)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-800)_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto px-5 sm:px-7 xl:px-10 pt-20 pb-14 lg:pt-24 lg:pb-16 flex flex-col items-center text-center gap-y-6">
        <h1 className="text-5xl sm:text-6xl font-semibold font-oswald uppercase">
          {title} <span className="text-primary">{highlight}</span>
        </h1>

        <p className="text-gray-900 dark:text-neutral-200 text-lg text-balance">
          {description}
        </p>

        <p className="glass-card text-sm text-foreground px-3 py-1.5 rounded-full flex items-center gap-x-1.5">
          <CalendarDays className="size-4 text-primary" />
          Última actualización: {updatedAt}
        </p>
      </div>
    </section>
  );
}
