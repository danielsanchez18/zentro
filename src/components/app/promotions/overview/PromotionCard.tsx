import {
  BadgeAlert,
  CalendarDays,
  Package,
  Percent,
  Sparkles,
  Tag,
  TicketPercent,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { Promotion, PromotionType } from "@/lib/mock/promotions";
import {
  promotionBenefit,
  promotionTypeLabel,
  promotionUsageProgress,
} from "@/lib/mock/promotions";
import { PromotionActionsMenu } from "./PromotionActionsMenu";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" }).format(
    new Date(value),
  );

function getPromotionIcon(type: PromotionType) {
  switch (type) {
    case "porcentaje":
      return Percent;
    case "monto_fijo":
      return TicketPercent;
    case "precio_fijo":
      return Tag;
    default:
      return Sparkles;
  }
}

export function PromotionCard({
  promotion,
  onOpen,
}: {
  promotion: Promotion;
  onOpen: (promotion: Promotion) => void;
}) {
  const Icon = getPromotionIcon(promotion.type);
  const usageProgress = promotionUsageProgress(promotion);

  return (
    <article
      onClick={() => onOpen(promotion)}
      className="group relative flex flex-col justify-between cursor-pointer rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary"
    >
      <div>
        {/* Header: Icon, Name, Code, Actions */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors">
              <Icon className="size-4.5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-heading text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                {promotion.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                {promotion.code}
              </p>
            </div>
          </div>
          <PromotionActionsMenu promotion={promotion} onOpen={onOpen} />
        </div>

        {/* Benefit Highlight & Description */}
        <div className="my-3.5 border-y border-border py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-base font-medium tracking-tight text-primary">
              {promotionBenefit(promotion)}
            </span>
            <p className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground/85">
              {promotionTypeLabel(promotion.type)}
            </p>
          </div>
          {promotion.description && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {promotion.description}
            </p>
          )}
        </div>

        {/* Target tags */}
        {promotion.targetNames && promotion.targetNames.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {promotion.targetNames.slice(0, 2).map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full bg-accent px-2.5 py-2 leading-none text-xs font-medium text-foreground/85"
              >
                {name}
              </span>
            ))}
            {promotion.targetNames.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-2 leading-none text-xs font-medium text-foreground/85">
                +{promotion.targetNames.length - 2} más
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        {/* Meta Info: Alcance & Vigencia */}
        <div className="grid grid-cols-2 gap-3 border-y border-border py-2.5 text-sm">
          <div>
            <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <Package className="size-4 shrink-0" />
              Alcance
            </p>
            <p className="mt-1 truncate font-medium capitalize text-foreground">
              {promotion.scope === "categorias" ? "Categoría" : "Productos"} ·{" "}
              <span className="text-muted-foreground">
                {promotion.affectedProducts}{" "}
                {promotion.affectedProducts === 1 ? "prod." : "prods."}
              </span>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <CalendarDays className="size-4 shrink-0" />
              Vigencia
            </p>
            <p className="mt-1 truncate font-medium text-foreground">
              {formatDate(promotion.startsAt)} — {formatDate(promotion.endsAt)}
            </p>
          </div>
        </div>

        {/* Límite y barra de progreso */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {promotion.usageLimit !== null
                ? `${promotion.usageCount} de ${promotion.usageLimit} usos`
                : `${promotion.usageCount} usos`}
            </span>
            <span className="font-medium text-primary">
              {usageProgress !== null ? `${Math.round(usageProgress)}%` : "Ilimitado"}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                usageProgress !== null ? "bg-primary" : "bg-primary/25",
              )}
              style={{ width: `${usageProgress ?? 100}%` }}
            />
          </div>
        </div>

        {/* Footer: Priority & StatusBadge */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="inline-flex items-center gap-1.5 text-muted-foreground">
            <BadgeAlert className="size-4 shrink-0" />
            Prioridad {promotion.priority}
          </div>
          <StatusBadge status={promotion.status} />
        </div>
      </div>
    </article>
  );
}

