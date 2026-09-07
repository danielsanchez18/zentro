"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { usePromotionsStore } from "@/stores/promotions-store";
import { PromotionActions } from "./PromotionActions";
import { PromotionDetailHeader } from "./PromotionDetailHeader";
import { PromotionInfo } from "./PromotionInfo";
import { PromotionPerformance } from "./PromotionPerformance";
import { PromotionTargets } from "./PromotionTargets";

export function PromotionDetailPage({
  slug,
  promotionId,
}: {
  slug: string;
  promotionId: string;
}) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<"cancel" | "delete" | null>(
    null,
  );
  const promotion = usePromotionsStore((state) =>
    state.promotions.find((item) => item.id === promotionId),
  );
  const setStatus = usePromotionsStore((state) => state.setStatus);
  const removePromotion = usePromotionsStore((state) => state.removePromotion);
  const promotionsHref = `/app/${slug}/promociones`;

  if (!promotion)
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(promotionsHref)}
          className="h-auto px-0"
        >
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos esta promoción.
        </div>
      </div>
    );

  const publish = () => {
    const status =
      Date.parse(promotion.startsAt) > Date.now() ? "programada" : "activa";
    setStatus(promotion.id, status);
    toastMsg.success(
      "Promoción publicada",
      `${promotion.name} quedó ${status}.`,
    );
  };

  const togglePause = () => {
    const status =
      promotion.status === "pausada"
        ? Date.parse(promotion.startsAt) > Date.now()
          ? "programada"
          : "activa"
        : "pausada";
    setStatus(promotion.id, status);
    toastMsg.success(
      status === "pausada" ? "Promoción pausada" : "Promoción reanudada",
      promotion.name,
    );
  };

  const confirmAction = () => {
    if (confirmation === "cancel") {
      setStatus(promotion.id, "cancelada");
      toastMsg.info("Promoción cancelada", promotion.name);
    } else if (confirmation === "delete") {
      removePromotion(promotion.id);
      toastMsg.info("Borrador eliminado", promotion.name);
      router.push(promotionsHref);
    }
    setConfirmation(null);
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <PromotionDetailHeader name={promotion.name} slug={slug} />
      <div className="grid gap-5">
        <PromotionInfo promotion={promotion} slug={slug} />
        <PromotionTargets promotion={promotion} slug={slug} />
      </div>
      <PromotionPerformance promotion={promotion} />
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <PromotionActions
          status={promotion.status}
          onEdit={() =>
            router.push(`/app/${slug}/promociones/${promotion.id}/editar`)
          }
          onPublish={publish}
          onTogglePause={togglePause}
          onCancel={() => setConfirmation("cancel")}
          onDelete={() => setConfirmation("delete")}
        />
      </div>
      <ConfirmDialog
        open={Boolean(confirmation)}
        onOpenChange={(open) => !open && setConfirmation(null)}
        title={
          confirmation === "delete" ? "Eliminar borrador" : "Cancelar promoción"
        }
        description={
          confirmation === "delete"
            ? `¿Deseas eliminar ${promotion.name}? Esta acción no puede deshacerse.`
            : `¿Deseas cancelar ${promotion.name}? La promoción dejará de aplicarse.`
        }
        confirmLabel={
          confirmation === "delete" ? "Eliminar" : "Cancelar promoción"
        }
        onConfirm={confirmAction}
      />
    </div>
  );
}
