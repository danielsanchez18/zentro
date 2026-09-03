"use client";

import { useInventoryStore } from "@/stores/inventory-store";
import { InventoryNav } from "../../shared/InventoryNav";
import { MovementsHeader } from "./MovementsHeader";
import { MovementsKpis } from "./MovementsKpis";
import { MovementsList } from "./MovementsList";
import { toastMsg } from "@/components/ui/toast-message";

export function MovementsModule({
  slug,
  initialItemId,
}: {
  slug: string;
  initialItemId?: string;
}) {
  const movements = useInventoryStore((state) => state.movements);
  const exportMovements = () => {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = movements.map((movement) => [movement.id, movement.createdAt, movement.type, movement.productName, movement.sku, movement.quantity, movement.previousStock, movement.resultingStock, movement.reason, movement.documentRef ?? "", movement.responsible].map(escape).join(","));
    const csv = ["ID,Fecha,Tipo,Producto,SKU,Cantidad,Stock anterior,Stock resultante,Motivo,Documento,Responsable", ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `movimientos-inventario-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toastMsg.success("Archivo exportado", `${movements.length} movimientos incluidos.`);
  };
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <InventoryNav slug={slug} />
      <MovementsHeader onExport={exportMovements} />
      <MovementsKpis movements={movements} />
      <MovementsList
        movements={movements}
        initialItemId={initialItemId}
      />
    </div>
  );
}
