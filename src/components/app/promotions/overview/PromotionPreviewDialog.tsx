"use client";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Promotion, PromotionType } from "@/lib/mock/promotions";
import {
  promotionBenefit,
  promotionTypeLabel,
  promotionUsageLabel,
  promotionUsageProgress,
} from "@/lib/mock/promotions";
import { cn } from "@/lib/utils";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

function PromotionIcon({ type, className }: { type: PromotionType; className?: string }) {
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

export function PromotionPreviewDialog({
  promotion,
  open,
  onOpenChange,
}: {
  promotion: Promotion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!promotion) return null;

  const usageProgress = promotionUsageProgress(promotion);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-heading sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="space-y-0">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <PromotionIcon type={promotion.type} className="size-4.5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold tracking-tight text-foreground truncate">
                  {promotion.name}
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                  {promotion.code}
                </p>
              </div>
            </div>
            <StatusBadge status={promotion.status} />
          </div>
        </DialogHeader>

        {/* Benefit & Description (matching card style) */}
        <div className="border-y border-border py-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Beneficio</p>
              <p className="mt-0.5 font-heading text-lg font-medium tracking-tight text-primary">
                {promotionBenefit(promotion)}
              </p>
            </div>
            <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-foreground/85">
              {promotionTypeLabel(promotion.type)}
            </span>
          </div>
          {promotion.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {promotion.description}
            </p>
          )}
        </div>

        {/* Meta Info: Alcance & Vigencia */}
        <div className="grid grid-cols-2 gap-4 border-b border-border pb-3.5 text-sm">
          <div>
            <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <Package className="size-4 shrink-0" />
              Alcance
            </p>
            <p className="mt-1 font-medium capitalize text-foreground">
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
            <p className="mt-1 font-medium text-foreground">
              {formatDate(promotion.startsAt)} — {formatDate(promotion.endsAt)}
            </p>
          </div>
        </div>

        {/* Límite y barra de progreso */}
        <div className="space-y-2 border-b border-border pb-3.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Límite de uso</span>
            <span className="font-medium text-primary">
              {usageProgress !== null ? `${Math.round(usageProgress)}%` : "Ilimitado"}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                usageProgress !== null ? "bg-primary" : "bg-primary/25",
              )}
              style={{ width: `${usageProgress ?? 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {promotion.usageLimit !== null
                ? `${promotion.usageCount} de ${promotion.usageLimit} usos canjeados`
                : `${promotion.usageCount} usos canjeados hasta el momento`}
            </span>
            <span>
              {promotion.usageLimit !== null
                ? `${Math.max((promotion.usageLimit ?? 0) - promotion.usageCount, 0)} disponibles`
                : "Sin límite máximo"}
            </span>
          </div>
        </div>

        {/* Targets */}
        {promotion.targetNames && promotion.targetNames.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Tag className="size-4 shrink-0" />
              {promotion.scope === "categorias"
                ? "Categorías incluidas"
                : "Productos incluidos"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {promotion.targetNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full bg-accent px-2.5 py-2 leading-none text-xs font-medium text-foreground/85"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prioridad y nota */}
        <div className="flex items-center gap-2 rounded-lg bg-accent/40 px-3 py-2.5 text-xs text-muted-foreground">
          <BadgeAlert className="size-4 shrink-0 text-primary" />
          <span>
            <strong className="font-medium text-foreground">
              Prioridad {promotion.priority}:
            </strong>{" "}
            En caso de conflicto de descuentos se aplica la de mayor prioridad.
          </span>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full font-sans px-4 py-2 leading-none h-fit sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
