import { CalendarDays } from "lucide-react";
import type { Promotion } from "@/lib/mock/promotions";
import { promotionBenefit } from "@/lib/mock/promotions";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

export function PromotionCustomerPreview({
  promotion,
}: {
  promotion: Promotion;
}) {
  return (
    <section className="flex min-h-72 flex-col rounded-xl border border-border bg-primary/5 p-6">
      <span className="w-fit rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary">
        Oferta especial
      </span>
      <div className="my-auto py-7">
        <p className="font-heading text-4xl font-semibold tracking-tight text-primary">
          {promotionBenefit(promotion)}
        </p>
        <h2 className="mt-3 text-xl font-semibold text-foreground">
          {promotion.name}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          {promotion.description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4">
        <p className="inline-flex items-center gap-2 text-xs font-medium">
          <CalendarDays className="size-4 text-primary" />
          Válido hasta el {formatDate(promotion.endsAt)}
        </p>
        <span className="text-xs text-muted-foreground">
          Aplican términos y disponibilidad
        </span>
      </div>
    </section>
  );
}
