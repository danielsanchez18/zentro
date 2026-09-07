"use client";

import { useState } from "react";
import Link from "next/link";
import { toastMsg } from "@/components/ui/toast-message";
import type { OrderStatus } from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";
import { CourierTracking } from "./CourierTracking";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { EditOrderDialog } from "./EditOrderDialog";
import { OrderCustomerInfo } from "./OrderCustomerInfo";
import { OrderDetailActions } from "./OrderDetailActions";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderMainCard } from "./OrderMainCard";
import { OrderPaymentInfo } from "./OrderPaymentInfo";
import { OrderTimeline } from "./OrderTimeline";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  nuevo: "confirmado",
  confirmado: "en_preparacion",
  en_preparacion: "listo",
  listo: "entregado",
};

export function OrderDetailPage({
  slug,
  orderId,
}: {
  slug: string;
  orderId: string;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const order = useOrdersStore((state) =>
    state.orders.find((item) => item.id === orderId),
  );
  const transitionOrder = useOrdersStore((state) => state.transitionOrder);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);
  const updateOrderContent = useOrdersStore((state) => state.updateOrderContent);

  if (!order) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Link
          href={`/app/${slug}/pedidos`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Regresar
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este pedido.
        </div>
      </div>
    );
  }

  const advance = () => {
    const next = nextStatus[order.status];
    if (next && transitionOrder(order.id, next)) {
      toastMsg.success(
        "Estado actualizado",
        `${order.number} ahora está ${next.replaceAll("_", " ")}.`,
      );
    }
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <OrderDetailHeader order={order} slug={slug} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)] relative">
        <div className="space-y-5">
          <OrderMainCard order={order} onEdit={() => setEditOpen(true)} />
          <OrderTimeline order={order} />
          <OrderPaymentInfo order={order} />
          <CourierTracking order={order} />
        </div>
        <aside className="h-fit space-y-5 xl:sticky xl:top-5">
          <OrderCustomerInfo order={order} />
        </aside>
      </div>
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <OrderDetailActions
          status={order.status}
          onNext={advance}
          onCancel={() => setCancelOpen(true)}
        />
      </div>
      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        orderNumber={order.number}
        onConfirm={(reason, note) => {
          if (cancelOrder(order.id, reason, note)) {
            toastMsg.info("Pedido cancelado", reason);
            setCancelOpen(false);
          }
        }}
      />
      {editOpen && (
        <EditOrderDialog
          order={order}
          open={editOpen}
          onOpenChange={setEditOpen}
          onConfirm={(lines, discount, reason) => {
            if (updateOrderContent(order.id, lines, discount, reason)) {
              toastMsg.success("Pedido actualizado", "El ajuste fue agregado al historial.");
              setEditOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
