"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useOrdersStore } from "@/stores/orders-store";
import { useCashStore } from "@/stores/cash-store";
import { useInventoryStore } from "@/stores/inventory-store";
import { usePurchasesStore } from "@/stores/purchases-store";
import { useCrmStore } from "@/stores/crm-store";
import { useAgendaStore } from "@/stores/agenda-store";
import {
  periodRange,
  salesSummary,
  topProductMargins,
  inventorySnapshot,
  purchasesBySupplier,
  topCustomers,
  newCustomers,
  appointmentsByStatus,
  type ReportPeriod,
} from "@/lib/mock/reportes";
import { PeriodSelector } from "./PeriodSelector";
import { ReportsKpis } from "./ReportsKpis";
import { SalesSection } from "./SalesSection";
import { ProfitSection } from "./ProfitSection";
import { OperationsSection } from "./OperationsSection";
import { ClientsSection } from "./ClientsSection";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell).replace(/"/g, '""');
          return `"${text}"`;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ReportsModule() {
  const [period, setPeriod] = useState<ReportPeriod>("30d");
  const orders = useOrdersStore((state) => state.orders);
  const cashMovements = useCashStore((state) => state.movements);
  const inventoryItems = useInventoryStore((state) => state.items);
  const purchaseOrders = usePurchasesStore((state) => state.orders);
  const customers = useCrmStore((state) => state.customers);
  const appointments = useAgendaStore((state) => state.appointments);

  const range = useMemo(() => periodRange(period), [period]);

  const summary = useMemo(
    () => salesSummary(orders, cashMovements, range),
    [orders, cashMovements, range],
  );
  const margins = useMemo(
    () => topProductMargins(orders, inventoryItems, range),
    [orders, inventoryItems, range],
  );
  const inventory = useMemo(
    () => inventorySnapshot(inventoryItems),
    [inventoryItems],
  );
  const suppliers = useMemo(
    () => purchasesBySupplier(purchaseOrders, range),
    [purchaseOrders, range],
  );
  const purchasesTotal = useMemo(
    () => suppliers.reduce((sum, s) => sum + s.total, 0),
    [suppliers],
  );
  const top = useMemo(() => topCustomers(customers), [customers]);
  const freshCustomers = useMemo(
    () => newCustomers(customers, range),
    [customers, range],
  );
  const apptBreak = useMemo(
    () => appointmentsByStatus(appointments, range),
    [appointments, range],
  );

  const handleExport = () => {
    const rows: (string | number)[][] = [
      ["Día", "Ventas", "Pedidos"],
      ...summary.byDay.map((d) => [d.label, d.total.toFixed(2), d.orders]),
      [],
      ["Ventas totales", summary.total.toFixed(2), summary.count],
      ["Ticket promedio", summary.avgTicket.toFixed(2), ""],
    ];
    downloadCsv(`reporte-ventas-${period}.csv`, rows);
    toastMsg.success("Exportación lista", "El CSV del período se descargó.");
  };

  return (
    <div className="w-full min-w-0 max-w-full flex flex-col gap-y-7 px-4 py-6 sm:px-5 sm:py-7 md:px-7 xl:px-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium text-foreground">Reportes</h1>
          <p className="text-sm line-clamp-1 text-muted-foreground">
            Indicadores consolidados del negocio
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full cursor-pointer px-3"
            onClick={handleExport}
          >
            Exportar CSV
          </Button>
        </div>
      </header>

      <PeriodSelector value={period} onChange={setPeriod} />

      <ReportsKpis
        total={summary.total}
        count={summary.count}
        avgTicket={summary.avgTicket}
        clients={customers.filter((c) => c.status === "activo").length}
      />

      <SalesSection
        summary={summary}
        period={period}
        onPeriodChange={setPeriod}
      />

      <ProfitSection products={margins} />

      <OperationsSection
        inventory={inventory}
        suppliers={suppliers}
        purchasesTotal={purchasesTotal}
      />

      <ClientsSection
        top={top}
        newCount={freshCustomers.length}
        newClients={freshCustomers}
        appointments={apptBreak}
      />
    </div>
  );
}
