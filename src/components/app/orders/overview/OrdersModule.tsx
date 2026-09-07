"use client";

import { useRouter } from "next/navigation";
import { toastMsg } from "@/components/ui/toast-message";
import { useOrdersStore } from "@/stores/orders-store";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersKpis } from "./OrdersKpis";
import { OrdersList } from "./OrdersList";

export function OrdersModule({ slug }: { slug: string }) {
  const router = useRouter();
  const orders = useOrdersStore((state) => state.orders);
  const exportOrders = () => {
    const escape = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      [
        "Pedido",
        "Cliente",
        "Atención",
        "Canal",
        "Estado",
        "Pago",
        "Total",
        "Creado",
      ],
      ...orders.map((order) => [
        order.number,
        order.customerName,
        order.serviceType,
        order.channel,
        order.status,
        order.paymentStatus,
        order.total,
        order.createdAt,
      ]),
    ];
    const blob = new Blob(
      [rows.map((row) => row.map(escape).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    toastMsg.success(
      "Pedidos exportados",
      `${orders.length} pedidos incluidos.`,
    );
  };
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <OrdersHeader
        onOpenPos={() => router.push(`/app/${slug}/pos`)}
        onExport={exportOrders}
      />
      <OrdersKpis orders={orders} />
      <OrdersList orders={orders} />
    </div>
  );
}
