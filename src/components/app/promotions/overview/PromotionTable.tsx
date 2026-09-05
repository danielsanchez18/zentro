import {
  CalendarDays,
  Percent,
  Sparkles,
  Tag,
  TicketPercent,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { Promotion, PromotionType } from "@/lib/mock/promotions";
import { promotionBenefit, promotionUsageLabel } from "@/lib/mock/promotions";
import { PromotionActionsMenu } from "./PromotionActionsMenu";

const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

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

export function PromotionTable({
  promotions,
  onOpen,
}: {
  promotions: Promotion[];
  onOpen: (promotion: Promotion) => void;
}) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className="w-full min-w-max text-left">
        <thead>
          <tr className="bg-accent">
            {[
              "Promoción",
              "Beneficio",
              "Alcance",
              "Vigencia",
              "Uso",
              "Prioridad",
              "Estado",
            ].map((label) => (
              <th
                key={label}
                className="px-5 py-3 text-left font-heading text-xs font-semibold uppercase text-nowrap"
              >
                {label}
              </th>
            ))}
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {promotions.map((promotion) => {
            const Icon = getPromotionIcon(promotion.type);
            return (
              <tr
                key={promotion.id}
                onClick={() => onOpen(promotion)}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-nowrap text-foreground">
                        {promotion.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                        {promotion.code}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-medium text-primary text-nowrap">
                  {promotionBenefit(promotion)}
                </td>
                <td className="px-5 py-3 text-nowrap">
                  <p className="text-sm capitalize">{promotion.scope}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {promotion.affectedProducts} productos
                  </p>
                </td>
                <td className="px-5 py-3 text-nowrap">
                  <p className="inline-flex items-center gap-1.5 text-sm">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                    {date(promotion.startsAt)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    hasta {date(promotion.endsAt)}
                  </p>
                </td>
                <td className="px-5 py-3 text-sm text-nowrap">
                  {promotionUsageLabel(promotion)}
                </td>
                <td className="px-5 py-3 text-sm font-medium tabular-nums">
                  {promotion.priority}
                </td>
                <td className="px-5 py-3 text-nowrap">
                  <StatusBadge status={promotion.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <PromotionActionsMenu promotion={promotion} onOpen={onOpen} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
