"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Ban, Eye, FileText, MoreHorizontal, Pause, Pencil, Play, Send, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toastMsg } from "@/components/ui/toast-message";
import type { Promotion } from "@/lib/mock/promotions";
import { usePromotionsStore } from "@/stores/promotions-store";

export function PromotionActionsMenu({ promotion, onOpen }: { promotion: Promotion; onOpen: (promotion: Promotion) => void }) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [confirming, setConfirming] = useState<"cancel" | "delete" | null>(null);
  const setStatus = usePromotionsStore((state) => state.setStatus);
  const removePromotion = usePromotionsStore((state) => state.removePromotion);
  const canEdit = ["borrador", "programada", "pausada"].includes(promotion.status);
  const publish = () => { const status = Date.parse(promotion.startsAt) > Date.now() ? "programada" : "activa"; setStatus(promotion.id, status); toastMsg.success("Promoción publicada", `${promotion.name} quedó ${status}.`); };
  const togglePause = () => { const status = promotion.status === "pausada" ? (Date.parse(promotion.startsAt) > Date.now() ? "programada" : "activa") : "pausada"; setStatus(promotion.id, status); toastMsg.success(status === "pausada" ? "Promoción pausada" : "Promoción reanudada", promotion.name); };
  const execute = () => { if (confirming === "cancel") { setStatus(promotion.id, "cancelada"); toastMsg.info("Promoción cancelada", promotion.name); } if (confirming === "delete") { removePromotion(promotion.id); toastMsg.info("Borrador eliminado", promotion.name); } setConfirming(null); };

  return <><DropdownMenu><DropdownMenuTrigger onClick={(event) => event.stopPropagation()} className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Acciones de ${promotion.name}`}><MoreHorizontal className="size-4" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 font-heading" onClick={(event) => event.stopPropagation()}><DropdownMenuItem onClick={() => router.push(`/app/${slug}/promociones/${promotion.id}`)} className="cursor-pointer gap-2"><FileText className="size-4" />Ver detalle</DropdownMenuItem><DropdownMenuItem onClick={() => onOpen(promotion)} className="cursor-pointer gap-2"><Eye className="size-4" />Vista previa</DropdownMenuItem>{canEdit && <DropdownMenuItem onClick={() => router.push(`/app/${slug}/promociones/${promotion.id}/editar`)} className="cursor-pointer gap-2"><Pencil className="size-4" />Editar</DropdownMenuItem>}{promotion.status === "borrador" && <DropdownMenuItem onClick={publish} className="cursor-pointer gap-2"><Send className="size-4" />Publicar</DropdownMenuItem>}{["activa", "programada", "pausada"].includes(promotion.status) && <DropdownMenuItem onClick={togglePause} className="cursor-pointer gap-2">{promotion.status === "pausada" ? <Play className="size-4" /> : <Pause className="size-4" />}{promotion.status === "pausada" ? "Reanudar" : "Pausar"}</DropdownMenuItem>}{["borrador", "activa", "programada", "pausada"].includes(promotion.status) && <><DropdownMenuSeparator />{promotion.status === "borrador" ? <DropdownMenuItem variant="destructive" onClick={() => setConfirming("delete")} className="cursor-pointer gap-2"><Trash2 className="size-4" />Eliminar borrador</DropdownMenuItem> : <DropdownMenuItem variant="destructive" onClick={() => setConfirming("cancel")} className="cursor-pointer gap-2"><Ban className="size-4" />Cancelar promoción</DropdownMenuItem>}</>}</DropdownMenuContent></DropdownMenu><ConfirmDialog open={Boolean(confirming)} onOpenChange={(open) => !open && setConfirming(null)} title={confirming === "delete" ? "Eliminar borrador" : "Cancelar promoción"} description={`¿Deseas continuar con ${promotion.name}?`} confirmLabel={confirming === "delete" ? "Eliminar" : "Cancelar promoción"} onConfirm={execute} /></>;
}
