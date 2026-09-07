"use client";

import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import type { OrderStatus } from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";
import { CourierTracking } from "./CourierTracking";
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
  const order = useOrdersStore((state) =>
    state.orders.find((item) => item.id === orderId),
  );
  const transitionOrder = useOrdersStore((state) => state.transitionOrder);

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
          <OrderMainCard order={order} />
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
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancelar pedido"
        description={`${order.number} saldrá del flujo operativo. El pago deberá revisarse por separado.`}
        confirmLabel="Cancelar pedido"
        onConfirm={() => {
          transitionOrder(order.id, "cancelado");
          toastMsg.info("Pedido cancelado", order.number);
          setCancelOpen(false);
        }}
      />
    </div>
  );
}
