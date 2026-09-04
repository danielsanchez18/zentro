"use client";

import { useRouter } from "next/navigation";
import { usePurchasesStore } from "@/stores/purchases-store";
import { toastMsg } from "@/components/ui/toast-message";
import { PurchasesHeader } from "./PurchasesHeader";
import { PurchasesKpis } from "./PurchasesKpis";
import { PurchasesList } from "./PurchasesList";

export function PurchasesModule({ slug }: { slug: string }) {
  const router = useRouter();
  const orders = usePurchasesStore((state) => state.orders);
  const exportOrders = () => {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [["Orden", "Proveedor", "Emisión", "Entrega", "Estado", "Unidades", "Recibidas", "Total"], ...orders.map((order) => [order.number, order.supplierName, order.issuedAt.slice(0, 10), order.expectedAt.slice(0, 10), order.status, order.orderedUnits, order.receivedUnits, order.total])];
    const blob = new Blob([rows.map((row) => row.map(escape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(blob); anchor.download = `compras-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(anchor.href);
    toastMsg.success("Compras exportadas", `${orders.length} órdenes incluidas.`);
  };
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <PurchasesHeader onCreate={() => router.push(`/app/${slug}/compras/agregar`)} onExport={exportOrders} />
      <PurchasesKpis orders={orders} />
      <PurchasesList slug={slug} orders={orders} />
    </div>
  );
}
