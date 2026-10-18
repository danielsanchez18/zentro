import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { industries } from "./data";
import type { ShowcaseBusiness } from "./showcase";
import { Button } from "@/components/ui/button";

type BusinessCardProps = {
  business: ShowcaseBusiness;
  tabIndex?: number;
  // Las primeras cards se ven al cargar: no conviene diferir su carga
  eager?: boolean;
};

export function BusinessCard({ business, tabIndex, eager }: BusinessCardProps) {
  const industry = industries.find((item) => item.id === business.industryId);
  const Icon = industry?.icon;

  return (
    <Link
      href={`#${business.industryId}`}
      tabIndex={tabIndex}
      className="group relative block h-96 w-72 sm:w-80 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted text-left"
    >
      {/* Imagen o placeholder */}
      {business.image ? (
        <Image
          src={business.image}
          alt={business.photo.replace(/^Foto:\s*/, "")}
          fill
          sizes="(min-width: 640px) 320px, 288px"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 transition-transform duration-500 group-hover:scale-105">
          <div className="absolute inset-0 bg-[radial-gradient(var(--color-gray-400)_1px,transparent_1px)] dark:bg-[radial-gradient(var(--color-neutral-700)_1px,transparent_1px)] bg-size-[18px_18px] opacity-60" />
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute inset-x-0 top-24 flex flex-col items-center gap-y-2 px-8 text-center">
            <ImageIcon className="size-7 text-gray-500 dark:text-neutral-500" />
            <p className="text-xs text-gray-600 dark:text-neutral-400">
              {business.photo}
            </p>
          </div>
        </div>
      )}

      {/* Sombreado para legibilidad */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

      <span className="absolute top-4 right-4 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <ArrowUpRight className="size-5" />
      </span>

      {/* Contenido */}
      <div className="absolute inset-x-0 bottom-0 p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-white">{business.name}</h3>
          <p className="text-sm text-white/75">{business.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {business.modules.map((module) => (
            <Button
              key={module}
              variant="glass"
              className="rounded-full pointer-events-none"
            >
              {module}
            </Button>
          ))}
        </div>
      </div>
    </Link>
  );
}
