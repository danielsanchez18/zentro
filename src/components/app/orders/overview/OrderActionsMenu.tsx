"use client";

import { useState } from "react";
import {
  Ban,
  Boxes,
  CheckCheck,
  Eye,
  MoreHorizontal,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toastMsg } from "@/components/ui/toast-message";
import type { CustomerOrder, OrderStatus } from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";

const nextActions: Partial<
  Record<OrderStatus, { status: OrderStatus; label: string; icon: typeof ShieldCheck }>
> = {
  nuevo: { status: "confirmado", label: "Confirmar pedido", icon: ShieldCheck },
  confirmado: { status: "en_preparacion", label: "Iniciar preparación", icon: Boxes },
  en_preparacion: { status: "listo", label: "Marcar como listo", icon: PackageCheck },
  listo: { status: "entregado", label: "Completar entrega", icon: CheckCheck },
};

export function OrderActionsMenu({ order, onOpen }: { order: CustomerOrder; onOpen: (order: CustomerOrder) => void }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const transitionOrder = useOrdersStore((state) => state.transitionOrder);
  const next = nextActions[order.status];
  const transition = (status: OrderStatus, message: string) => { if (transitionOrder(order.id, status)) toastMsg.success(message, order.number); };
  return <><DropdownMenu><DropdownMenuTrigger onClick={(event) => event.stopPropagation()} className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Acciones de ${order.number}`}><MoreHorizontal className="size-4" /></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 font-heading" onClick={(event) => event.stopPropagation()}><DropdownMenuItem onClick={() => onOpen(order)} className="cursor-pointer gap-2"><Eye className="size-4" />Vista rápida</DropdownMenuItem>{next && <DropdownMenuItem onClick={() => transition(next.status, next.label)} className="cursor-pointer gap-2"><next.icon className="size-4" />{next.label}</DropdownMenuItem>}{["nuevo", "confirmado", "en_preparacion", "listo"].includes(order.status) && <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => setCancelOpen(true)} className="cursor-pointer gap-2"><Ban className="size-4" />Cancelar pedido</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu><ConfirmDialog open={cancelOpen} onOpenChange={setCancelOpen} title="Cancelar pedido" description={`${order.number} saldrá de la cola operativa. En producción se solicitará también un motivo.`} confirmLabel="Cancelar pedido" onConfirm={() => { transition("cancelado", "Pedido cancelado"); setCancelOpen(false); }} /></>;
}
