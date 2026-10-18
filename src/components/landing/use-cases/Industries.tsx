import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, CheckCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { industries } from "./data";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function Industries() {
  return (
    <section className="py-20 space-y-20 lg:space-y-32">
      <div className="space-y-3 text-center max-w-2xl mx-auto px-5">
        <p className="text-muted-foreground text-lg">Por industria</p>
        <h2 className="text-3xl lg:text-4xl font-semibold text-balance tracking-tight">
          Un mismo Zentro, <span className="text-primary">cuatro</span> formas
          de usarlo
        </h2>
      </div>

      {industries.map((industry, index) => {
        const Icon = industry.icon;
        const SnippetIcon = industry.snippet.icon;
        const reversed = index % 2 === 1;

        return (
          <article
            key={industry.id}
            id={industry.id}
            className="scroll-mt-10 grid lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Media */}
            <div className={cn("relative", reversed && "lg:order-last")}>
              {industry.image ? (
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image
                    src={industry.image}
                    alt={industry.label}
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <MediaPlaceholder
                  label={industry.media}
                  className="aspect-4/3"
                />
              )}
            </div>

            {/* Content */}
            <div className="space-y-7">
              <div className="flex items-center gap-x-3">
                <div className="space-y-2">
                  <p className="font-medium text-lg">{industry.label}</p>
                  <div className="p-0.5 w-14 bg-primary" />
                </div>
                <span className="ml-auto font-oswald text-4xl font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">
                  {industry.headline}
                </h3>
                <p className="text-muted-foreground">{industry.description}</p>
              </div>

              <ul className="grid sm:grid-cols-2 gap-3">
                {industry.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-2">
                    <BadgeCheck className="size-4 text-primary" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-2">
                  {industry.modules.map((module) => (
                    <Link
                      key={module}
                      href="/servicios"
                      className="rounded-full border border-border glass bg-card px-3 py-2 leading-none text-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      {module}
                    </Link>
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">
                  Ideal para:{" "}
                </span>
                {industry.examples.join(" · ")}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Link
                  href="/registrar"
                  className={cn(
                    buttonVariants(),
                    "landing-btn text-base h-fit px-3 py-1.5 font-medium rounded-full",
                  )}
                >
                  Empezar con este caso
                </Link>
                <Link
                  href="/#demo"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "glass glass-interactive text-base h-fit px-3 py-1.5 rounded-full",
                  )}
                >
                  Ver demo
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
