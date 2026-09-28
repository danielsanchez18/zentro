"use client";

import { useMemo } from "react";
import { PackageCheck } from "lucide-react";
import type {
  InventorySnapshot,
  SupplierBreak,
  BreakItem,
} from "@/lib/mock/reportes";
import { ReportSection, money } from "./shared";
import { BreakdownDonutChart } from "./ChannelSalesChart";
import { InventorySection } from "./InventorySection";

const SUPPLIER_PALETTE = [
  "#2563eb", // Azul
  "#0d9488", // Teal
  "#8b5cf6", // Violeta
  "#f59e0b", // Ámbar
  "#06b6d4", // Cyan
];

const OTHERS_COLOR = "#64748b"; // Pizarra neutral

export function OperationsSection({
  inventory,
  suppliers,
  purchasesTotal,
}: {
  inventory: InventorySnapshot;
  suppliers: SupplierBreak[];
  purchasesTotal: number;
}) {
  const { supplierItems, supplierColorMap } = useMemo(() => {
    if (!suppliers || suppliers.length === 0) {
      return { supplierItems: [] as BreakItem[], supplierColorMap: {} };
    }

    const sorted = [...suppliers].sort((a, b) => b.total - a.total);

    if (sorted.length <= 5) {
      const items: BreakItem[] = sorted.map((s) => ({
        label: s.supplierName,
        value: s.total,
        count: s.count,
      }));
      const colorMap: Record<string, string> = {};
      items.forEach((item, idx) => {
        colorMap[item.label] = SUPPLIER_PALETTE[idx % SUPPLIER_PALETTE.length];
      });
      return { supplierItems: items, supplierColorMap: colorMap };
    }

    const top4 = sorted.slice(0, 4);
    const others = sorted.slice(4);
    const othersTotal = others.reduce((sum, s) => sum + s.total, 0);
    const othersCount = others.reduce((sum, s) => sum + s.count, 0);
    const othersLabel = `Otros (${others.length} prov.)`;

    const items: BreakItem[] = [
      ...top4.map((s) => ({
        label: s.supplierName,
        value: s.total,
        count: s.count,
      })),
      {
        label: othersLabel,
        value: othersTotal,
        count: othersCount,
      },
    ];

    const colorMap: Record<string, string> = {};
    top4.forEach((s, idx) => {
      colorMap[s.supplierName] =
        SUPPLIER_PALETTE[idx % SUPPLIER_PALETTE.length];
    });
    colorMap[othersLabel] = OTHERS_COLOR;

    return { supplierItems: items, supplierColorMap: colorMap };
  }, [suppliers]);

  return (
    <div className="grid gap-4 xl:grid-cols-2 min-w-0 w-full max-w-full">
      {/* Inventario */}
      <InventorySection inventory={inventory} />

      {/* Compras por proveedor */}
      <ReportSection
        title="Compras por proveedor"
        subtitle={`${money(purchasesTotal)} emitidos en el período`}
      >
        <BreakdownDonutChart
          items={supplierItems}
          total={purchasesTotal}
          valueType="currency"
          totalLabel="Total compras"
          countUnit="ord."
          countLabel="Órdenes"
          colorMap={supplierColorMap}
          emptyIcon={PackageCheck}
          emptyTitle="Sin órdenes de compra"
          emptyDescription="No hay órdenes de compra emitidas en este período."
          showCountInLabel
        />
      </ReportSection>
    </div>
  );
}

// Re-export por compatibilidad
export { ClientsSection } from "./ClientsSection";
export { InventorySection } from "./InventorySection";
