"use client";

import { toastMsg } from "@/components/ui/toast-message";
import { usePromotionsStore } from "@/stores/promotions-store";
import { PromotionsHeader } from "./PromotionsHeader";
import { PromotionsKpis } from "./PromotionsKpis";
import { PromotionsList } from "./PromotionsList";

export function PromotionsModule() {
  const promotions = usePromotionsStore((state) => state.promotions);
  return <div className="w-full min-w-0 max-w-full space-y-7 px-5 py-7 md:px-7 xl:px-10"><PromotionsHeader onCreate={() => toastMsg.info("Nueva promoción", "El formulario es la siguiente fase del prototipo.")} /><PromotionsKpis promotions={promotions} /><PromotionsList promotions={promotions} /></div>;
}
