"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { catalogCategories, catalogProducts } from "@/lib/mock/catalog";
import { usePromotionsStore } from "@/stores/promotions-store";
import { PromotionForm } from "../shared/PromotionForm";
import type { PromotionFormValues } from "../shared/types";

export function AddPromotionPage({ slug }: { slug: string }) {
  const router = useRouter(); const addPromotion = usePromotionsStore((state) => state.addPromotion); const formId = "add-promotion-form"; const promotionsHref = `/app/${slug}/promociones`;
  const handleSubmit = (values: PromotionFormValues) => { const targets = values.scope === "productos" ? catalogProducts.filter((item) => values.targetIds.includes(item.id)) : catalogCategories.filter((item) => values.targetIds.includes(item.id)); const affectedProducts = values.scope === "productos" ? targets.length : catalogProducts.filter((product) => values.targetIds.includes(product.categoryId)).length; addPromotion({ id: `promo_${Date.now()}`, code: `PR-2026-${String(Date.now()).slice(-3)}`, name: values.name, description: values.description, type: values.type, value: Number(values.value), scope: values.scope, targetNames: targets.map((item) => item.name), affectedProducts, startsAt: new Date(values.startsAt).toISOString(), endsAt: new Date(values.endsAt).toISOString(), priority: Number(values.priority), usageCount: 0, usageLimit: values.unlimitedUsage ? null : Number(values.usageLimit), status: "borrador", createdAt: new Date().toISOString() }); toastMsg.success("Promoción creada", `${values.name} se guardó como borrador.`); router.push(promotionsHref); };
  return <div className="w-full px-5 py-7 md:px-7 xl:px-10"><header className="mb-7"><Button type="button" variant="link" onClick={() => router.push(promotionsHref)} className="h-auto px-0">Regresar</Button><h1 className="mt-1 text-lg font-medium">Nueva promoción</h1><p className="mt-1 text-sm text-muted-foreground">Configura el beneficio, su alcance y las condiciones de uso.</p></header><PromotionForm id={formId} onSubmit={handleSubmit} /><div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit"><Toast formId={formId} submitLabel="Guardar promoción" onCancel={() => router.push(promotionsHref)} /></div></div>;
}
