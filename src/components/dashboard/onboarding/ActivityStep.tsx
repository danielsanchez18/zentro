import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RUBROS, type IndustryCode } from "./constants";

interface ActivityStepProps {
  rubro: IndustryCode | null;
  onSelect: (code: IndustryCode) => void;
}

/**
 * Paso 1 — Actividad del negocio, con fotos reales del rubro.
 */
export const ActivityStep = ({ rubro, onSelect }: ActivityStepProps) => {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">¿A qué se dedica tu negocio?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige la opción que mejor lo describa. Solo la usamos para sugerirte capacidades.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {RUBROS.map((r) => {
          const isActive = rubro === r.code;
          const moduleCount = r.suggested.length;

          return (
            <button
              key={r.code}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(r.code)}
              className={cn(
                "group flex flex-col overflow-hidden rounded-sm border bg-card p-2 text-left transition-colors",
                isActive ? "border-hub-accent ring-2 ring-hub-accent/40" : "border-border hover:border-foreground/30",
              )}
            >
              <span className="relative block aspect-[16/9] overflow-hidden rounded-(--hub-radius-control) bg-muted">
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-500",
                    isActive ? "scale-105" : "group-hover:scale-105",
                  )}
                />
                {isActive && (
                  <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-hub-accent text-hub-accent-foreground shadow-sm">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </span>

              <span className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
                <span className="text-sm font-medium">{r.label}</span>
                <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.description}</span>
                <span className="mt-3 text-xs text-muted-foreground">
                  Sugerimos {moduleCount} capacidad{moduleCount === 1 ? "" : "es"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
