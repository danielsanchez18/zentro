"use client";

import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Package,
  Percent,
  Sparkles,
  Tag,
  TicketPercent,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { Promotion, PromotionType } from "@/lib/mock/promotions";
import {
  promotionTypeLabel,
  promotionUsageLabel,
  promotionUsageProgress,
} from "@/lib/mock/promotions";

interface PromotionInfoProps {
  promotion: Promotion;
  slug?: string;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

function PromotionTypeIcon({
  type,
  className,
}: {
  type: PromotionType;
  className?: string;
}) {
  switch (type) {
    case "porcentaje":
      return <Percent className={className} />;
    case "monto_fijo":
      return <TicketPercent className={className} />;
    case "precio_fijo":
      return <Tag className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function PromotionInfo({ promotion }: PromotionInfoProps) {
  const progress = promotionUsageProgress(promotion);
  const image = (promotion as Promotion & { image?: string }).image;

  return (
    <section className="overflow-hidden rounded-xl grid lg:grid-cols-[1fr_2.5fr] gap-5 border border-border bg-card p-5 px-4">
      {/* 1. Bloque visual lateral (Placeholder de imagen con tag de oferta e icono según tipo) */}
      <div className="relative flex h-48 min-w-70 w-full lg:h-auto rounded-lg items-center justify-center overflow-hidden bg-accent">
        <span className="absolute left-3 top-3 z-10 w-fit rounded-lg border border-muted/20 bg-background/90 px-3 py-1 text-xs font-medium text-primary shadow-xs backdrop-blur-xs">
          Oferta especial
        </span>

        {image ? (
          <Image
            src={image}
            alt={promotion.name}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="size-full object-cover"
          />
        ) : (
          <div className="relative flex size-14 items-center justify-center rounded-xl bg-background text-primary shadow-2xs">
            <PromotionTypeIcon
              type={promotion.type}
              className="size-6 stroke-[1.75]"
            />
          </div>
        )}
      </div>

      {/* 2. Bloque de Información y Detalles */}
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 w-full">
            <div className="flex items-center justify-between gap-x-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-medium text-foreground">
                  {promotion.name}
                </h2>
                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {promotion.code}
                </span>
              </div>
              <StatusBadge status={promotion.status} />
            </div>
            <p className="font-heading mt-1 text-sm text-muted-foreground">
              {promotion.description ||
                "Sin descripción adicional configurada para esta promoción."}
            </p>
          </div>
        </div>

        {/* Chips de configuración */}
        <div className="space-y-2">
          <p className="text-sm font-medium font-heading text-foreground">
            Configuración
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="font-heading rounded-md leading-none bg-muted px-3 py-2 text-[13px] text-foreground transition-colors">
              Tipo: {promotionTypeLabel(promotion.type)}
            </span>
            <span className="font-heading rounded-md leading-none bg-muted px-3 py-2 text-[13px] text-foreground transition-colors">
              Alcance:{" "}
              {promotion.scope === "productos"
                ? "Productos específicos"
                : "Categorías completas"}
            </span>
            <span className="font-heading rounded-md leading-none bg-muted px-3 py-2 text-[13px] text-foreground transition-colors">
              Prioridad {promotion.priority}
            </span>
          </div>
        </div>

        {/* Control de uso con barra de progreso */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Users className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Control de uso:</p>
              <p className="text-sm font-medium text-foreground">
                {promotionUsageLabel(promotion)}
              </p>
            </div>
            {progress !== null && (
              <span className="text-sm font-semibold text-primary">
                {Math.round(progress)}%
              </span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${progress ?? 100}%`,
                opacity: progress === null ? 0.25 : 1,
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {promotion.usageLimit === null
              ? "Sin límite máximo configurado"
              : `${Math.max(
                  promotion.usageLimit - promotion.usageCount,
                  0,
                )} usos disponibles`}
          </p>
        </div>

        {/* Metadatos en formato definición (dl) igual a Info.tsx de categorías */}
        <dl className="grid gap-2 border-t border-border pt-5 text-sm font-heading">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <dt>Vigencia:</dt>
            <dd className="text-foreground">
              {formatDate(promotion.startsAt)} hasta{" "}
              {formatDate(promotion.endsAt)}
            </dd>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4 shrink-0" />
            <dt>Impacto estimado:</dt>
            <dd className="text-foreground">
              {promotion.targetNames.length}{" "}
              {promotion.scope === "productos" ? "productos" : "categorías"} (
              {promotion.affectedProducts} productos afectados)
            </dd>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="size-4 shrink-0" />
            <dt>Fecha de creación:</dt>
            <dd className="text-foreground">
              {formatDate(promotion.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
