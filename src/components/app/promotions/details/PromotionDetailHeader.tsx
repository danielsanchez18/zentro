import Link from "next/link";
import type { Promotion } from "@/lib/mock/promotions";

interface PromotionDetailHeaderProps {
  name?: string;
  promotion?: Promotion;
  slug: string;
}

export function PromotionDetailHeader({
  name,
  promotion,
  slug,
}: PromotionDetailHeaderProps) {
  const displayName = name ?? promotion?.name ?? "Detalle de la promoción";

  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <Link
          href={`/app/${slug}/promociones`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Regresar
        </Link>
        <h1 className="text-xl font-medium text-foreground">{displayName}</h1>
      </div>
    </header>
  );
}
