"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { InventorySupplier, SupplierStatus } from "@/lib/mock/inventory-suppliers";
import { SupplierCard } from "./SupplierCard";
import { SuppliersTable } from "./SuppliersTable";

const PAGE_SIZE = 6;
const VIEWS = [
  { id: "tabla", label: "Ver como tabla", icon: List },
  { id: "cards", label: "Ver como tarjetas", icon: LayoutGrid },
] as const;

export function SuppliersList({ slug, suppliers }: { slug: string; suppliers: InventorySupplier[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SupplierStatus | "all">("all");
  const [leadTime, setLeadTime] = useState<"all" | "fast" | "standard">("all");
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("tabla");
  const [page, setPage] = useState(1);
  const openSupplier = (supplier: InventorySupplier) => router.push(`/app/${slug}/inventario/proveedores/${supplier.id}`);

  const filtered = useMemo(() => suppliers.filter((supplier) => {
    const text = `${supplier.businessName} ${supplier.tradeName} ${supplier.documentNumber} ${supplier.contactName} ${supplier.email}`.toLowerCase();
    const matchesLeadTime = leadTime === "all" || (leadTime === "fast" ? supplier.leadTimeDays <= 2 : supplier.leadTimeDays > 2);
    return text.includes(query.trim().toLowerCase()) && (status === "all" || supplier.status === status) && matchesLeadTime;
  }), [leadTime, query, status, suppliers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = Number(status !== "all") + Number(leadTime !== "all");
  const clearFilters = () => { setStatus("all"); setLeadTime("all"); setPage(1); };

  return (
    <section className="space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-60 w-full flex-1 md:max-w-md">
          <Search value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar proveedor, RUC o contacto" />
        </div>
        <div className="flex items-center gap-x-2">
          <FilterPopover activeCount={activeFilterCount} onClear={clearFilters} groups={[
            { label: "Estado", options: [{ label: "Todos", value: "all" }, { label: "Activo", value: "activo" }, { label: "Inactivo", value: "inactivo" }], selected: status, onSelect: (value) => { setStatus(value as SupplierStatus | "all"); setPage(1); } },
            { label: "Tiempo de entrega", options: [{ label: "Todos", value: "all" }, { label: "Hasta 2 días", value: "fast" }, { label: "Más de 2 días", value: "standard" }], selected: leadTime, onSelect: (value) => { setLeadTime(value as typeof leadTime); setPage(1); } },
          ]} />
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            {VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-label={label} aria-pressed={view === id} className={cn("cursor-pointer rounded-md p-1.5 transition-colors", view === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}><Icon className="size-4" /></button>)}
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && <div className="flex flex-wrap items-center gap-2">
        {status !== "all" && <button type="button" onClick={() => setStatus("all")} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{status === "activo" ? "Activo" : "Inactivo"}<span className="ml-0.5 text-primary/60">×</span></button>}
        {leadTime !== "all" && <button type="button" onClick={() => setLeadTime("all")} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{leadTime === "fast" ? "Hasta 2 días" : "Más de 2 días"}<span className="ml-0.5 text-primary/60">×</span></button>}
      </div>}

      {pageItems.length === 0 ? <div className="rounded-xl border border-dashed border-border"><EmptyState icon={SearchX} title="Sin proveedores coincidentes" description="Prueba con otra búsqueda o limpia los filtros." /></div> : <>
        {view === "tabla" ? <><SuppliersTable suppliers={pageItems} onOpen={openSupplier} /><div className="grid gap-3 md:hidden">{pageItems.map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} onOpen={openSupplier} />)}</div></> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pageItems.map((supplier) => <SupplierCard key={supplier.id} supplier={supplier} onOpen={openSupplier} />)}</div>}
        <Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} />
      </>}
    </section>
  );
}
