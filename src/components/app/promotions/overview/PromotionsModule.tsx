"use client";

import { useParams, useRouter } from "next/navigation";
import { usePromotionsStore } from "@/stores/promotions-store";
import { PromotionsHeader } from "./PromotionsHeader";
import { PromotionsKpis } from "./PromotionsKpis";
import { PromotionsList } from "./PromotionsList";

export function PromotionsModule() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const promotions = usePromotionsStore((state) => state.promotions);
  return <div className="w-full min-w-0 max-w-full space-y-7 px-5 py-7 md:px-7 xl:px-10"><PromotionsHeader onCreate={() => router.push(`/app/${slug}/promociones/agregar`)} /><PromotionsKpis promotions={promotions} /><PromotionsList promotions={promotions} /></div>;
}
