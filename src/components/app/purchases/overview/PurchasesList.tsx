"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { EmptyState } from "@/components/ui/empty-state";
import type { PurchaseOrder, PurchaseStatus } from "@/lib/mock/purchases";
import { cn } from "@/lib/utils";
import { PurchaseCard } from "./PurchaseCard";
import { PurchasePreviewDialog } from "./PurchasePreviewDialog";
import { PurchaseTable } from "./PurchaseTable";

const PAGE_SIZE = 6;
const VIEWS = [{ id: "tabla", label: "Ver como tabla", icon: List }, { id: "cards", label: "Ver como tarjetas", icon: LayoutGrid }] as const;

export function PurchasesList({ slug, orders }: { slug: string; orders: PurchaseOrder[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PurchaseStatus | "all">("all");
  const [supplier, setSupplier] = useState("all");
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("tabla");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const suppliers = [...new Map(orders.map((order) => [order.supplierId, order.supplierName])).entries()];
  const filtered = useMemo(() => orders.filter((order) => `${order.number} ${order.supplierName} ${order.reference ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === "all" || order.status === status) && (supplier === "all" || order.supplierId === supplier)), [orders, query, status, supplier]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = Number(status !== "all") + Number(supplier !== "all");
  const clearFilters = () => { setStatus("all"); setSupplier("all"); setPage(1); };
  return <section className="space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><Search value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar orden, proveedor o documento" className="min-w-60 w-full flex-1 md:max-w-md" /><div className="flex items-center gap-x-2"><FilterPopover activeCount={activeFilterCount} onClear={clearFilters} groups={[{ label: "Estado", options: [{ label: "Todos", value: "all" }, { label: "Borrador", value: "borrador" }, { label: "Enviada", value: "enviada" }, { label: "Recepción parcial", value: "parcial" }, { label: "Recibida", value: "recibida" }, { label: "Cancelada", value: "cancelada" }], selected: status, onSelect: (value) => { setStatus(value as PurchaseStatus | "all"); setPage(1); } }, { label: "Proveedor", options: [{ label: "Todos", value: "all" }, ...suppliers.map(([value, label]) => ({ value, label }))], selected: supplier, onSelect: (value) => { setSupplier(value); setPage(1); } }]} /><div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">{VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-label={label} aria-pressed={view === id} className={cn("cursor-pointer rounded-md p-1.5 transition-colors", view === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}><Icon className="size-4" /></button>)}</div></div></div>{activeFilterCount > 0 && <div className="flex flex-wrap gap-2">{status !== "all" && <button type="button" onClick={() => setStatus("all")} className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{status}<span className="ml-1.5 text-primary/60">×</span></button>}{supplier !== "all" && <button type="button" onClick={() => setSupplier("all")} className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{suppliers.find(([id]) => id === supplier)?.[1]}<span className="ml-1.5 text-primary/60">×</span></button>}</div>}{pageItems.length === 0 ? <div className="rounded-xl border border-dashed border-border"><EmptyState icon={SearchX} title="Sin compras coincidentes" description="Prueba con otra búsqueda o limpia los filtros." /></div> : <><div className={view === "tabla" ? "" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"}>{view === "tabla" ? <><PurchaseTable orders={pageItems} onOpen={setSelected} /><div className="grid gap-3 md:hidden">{pageItems.map((order) => <PurchaseCard key={order.id} order={order} onOpen={setSelected} />)}</div></> : pageItems.map((order) => <PurchaseCard key={order.id} order={order} onOpen={setSelected} />)}</div><Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} /></>}<PurchasePreviewDialog order={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} onView={() => selected && router.push(`/app/${slug}/compras/${selected.id}`)} /></section>;
}
