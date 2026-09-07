"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { catalogCategories, catalogProducts } from "@/lib/mock/catalog";
import { usePromotionsStore } from "@/stores/promotions-store";
import { PromotionForm } from "../shared/PromotionForm";
import type { PromotionFormValues } from "../shared/types";

export function EditPromotionPage({ slug, promotionId }: { slug: string; promotionId: string }) {
  const router = useRouter();
  const promotion = usePromotionsStore((state) => state.promotions.find((item) => item.id === promotionId));
  const updatePromotion = usePromotionsStore((state) => state.updatePromotion);
  const promotionsHref = `/app/${slug}/promociones`;
  const formId = "edit-promotion-form";

  if (!promotion) {
    return <div className="w-full px-5 py-7 md:px-7 xl:px-10"><Button type="button" variant="link" onClick={() => router.push(promotionsHref)} className="h-auto px-0">Regresar</Button><div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No encontramos esta promoción.</div></div>;
  }

  const source = promotion.scope === "productos" ? catalogProducts : catalogCategories;
  const initial: Partial<PromotionFormValues> = {
    name: promotion.name,
    description: promotion.description,
    type: promotion.type,
    value: String(promotion.value),
    scope: promotion.scope,
    targetIds: source.filter((item) => promotion.targetNames.includes(item.name)).map((item) => item.id),
    startsAt: promotion.startsAt,
    endsAt: promotion.endsAt,
    priority: String(promotion.priority),
    unlimitedUsage: promotion.usageLimit === null,
    usageLimit: promotion.usageLimit === null ? "" : String(promotion.usageLimit),
  };

  const handleSubmit = (values: PromotionFormValues) => {
    const targets = values.scope === "productos" ? catalogProducts.filter((item) => values.targetIds.includes(item.id)) : catalogCategories.filter((item) => values.targetIds.includes(item.id));
    const affectedProducts = values.scope === "productos" ? targets.length : catalogProducts.filter((product) => values.targetIds.includes(product.categoryId)).length;
    const usageLimit = values.unlimitedUsage ? null : Number(values.usageLimit);
    if (usageLimit !== null && usageLimit < promotion.usageCount) {
      toastMsg.error("Límite no válido", `La promoción ya registra ${promotion.usageCount} usos.`);
      return;
    }
    updatePromotion(promotion.id, { name: values.name, description: values.description, type: values.type, value: Number(values.value), scope: values.scope, targetNames: targets.map((item) => item.name), affectedProducts, startsAt: new Date(values.startsAt).toISOString(), endsAt: new Date(values.endsAt).toISOString(), priority: Number(values.priority), usageLimit });
    toastMsg.success("Promoción actualizada", `Los cambios de ${values.name} se aplicaron al prototipo.`);
    router.push(promotionsHref);
  };

  return <div className="w-full px-5 py-7 md:px-7 xl:px-10"><header className="mb-7"><Button type="button" variant="link" onClick={() => router.push(promotionsHref)} className="h-auto px-0">Regresar</Button><h1 className="mt-1 text-lg font-medium tracking-tight">Editar promoción</h1><p className="mt-1 text-sm text-muted-foreground">{promotion.code} · {promotion.name}</p></header><PromotionForm id={formId} initial={initial} onSubmit={handleSubmit} /><div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit"><Toast formId={formId} submitLabel="Guardar cambios" onCancel={() => router.push(promotionsHref)} /></div></div>;
}
