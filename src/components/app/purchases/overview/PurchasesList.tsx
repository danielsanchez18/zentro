"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Check, LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { DateRangeFilter } from "@/components/app/inventory/movements/overview/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PurchaseOrder, PurchaseStatus } from "@/lib/mock/purchases";
import { cn } from "@/lib/utils";
import { PurchaseCard } from "./PurchaseCard";
import { PurchasePreviewDialog } from "./PurchasePreviewDialog";
import { PurchaseTable } from "./PurchaseTable";

const PAGE_SIZE = 6;
type Sort = "newest" | "oldest" | "delivery" | "total" | null;
const VIEWS = [{ id: "tabla", label: "Ver como tabla", icon: List }, { id: "cards", label: "Ver como tarjetas", icon: LayoutGrid }] as const;
const SORT_OPTIONS: { id: Exclude<Sort, null>; label: string }[] = [{ id: "newest", label: "Más recientes" }, { id: "oldest", label: "Más antiguas" }, { id: "delivery", label: "Entrega más próxima" }, { id: "total", label: "Mayor importe" }];

export function PurchasesList({ slug, orders }: { slug: string; orders: PurchaseOrder[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PurchaseStatus | "all">("all");
  const [supplier, setSupplier] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<Sort>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("tabla");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const suppliers = useMemo(() => [...new Map(orders.map((order) => [order.supplierId, order.supplierName])).entries()], [orders]);
  const filtered = useMemo(() => orders.filter((order) => {
    const issued = new Date(order.issuedAt);
    return `${order.number} ${order.supplierName} ${order.reference ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === "all" || order.status === status) && (supplier === "all" || order.supplierId === supplier) && (!from || issued >= new Date(`${from}T00:00:00`)) && (!to || issued <= new Date(`${to}T23:59:59`));
  }).sort((a, b) => sort === "oldest" ? Date.parse(a.issuedAt) - Date.parse(b.issuedAt) : sort === "delivery" ? Date.parse(a.expectedAt) - Date.parse(b.expectedAt) : sort === "total" ? b.total - a.total : Date.parse(b.issuedAt) - Date.parse(a.issuedAt)), [orders, query, status, supplier, from, to, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = Number(status !== "all") + Number(supplier !== "all") + Number(Boolean(from || to));
  const resetPage = () => setPage(1);
  const clearFilters = () => { setStatus("all"); setSupplier("all"); setFrom(""); setTo(""); resetPage(); };
  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? "Ordenar por";

  return <section className="space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Search value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Buscar orden, proveedor o documento" className="min-w-60 w-full flex-1 md:max-w-md" />
      <div className="flex items-center gap-2">
        <FilterPopover activeCount={activeFilterCount} onClear={clearFilters} groups={[{ label: "Estado", options: [{ label: "Todos", value: "all" }, { label: "Borrador", value: "borrador" }, { label: "Enviada", value: "enviada" }, { label: "Recepción parcial", value: "parcial" }, { label: "Recibida", value: "recibida" }, { label: "Cancelada", value: "cancelada" }], selected: status, onSelect: (value) => { setStatus(value as PurchaseStatus | "all"); resetPage(); } }, { label: "Proveedor", options: [{ label: "Todos", value: "all" }, ...suppliers.map(([value, label]) => ({ value, label }))], selected: supplier, onSelect: (value) => { setSupplier(value); resetPage(); } }]} />
        <DateRangeFilter from={from} to={to} onFromChange={(value) => { setFrom(value); resetPage(); }} onToChange={(value) => { setTo(value); resetPage(); }} onClear={() => { setFrom(""); setTo(""); resetPage(); }} />
        <Popover open={sortOpen} onOpenChange={setSortOpen}><PopoverTrigger render={<Button type="button" variant="outline" className="h-fit rounded-lg px-3 py-2" />}><ArrowUpDown className="size-3.5" /><span className="hidden sm:inline">{sortLabel}</span></PopoverTrigger><PopoverContent align="end" className="w-48 p-1">{SORT_OPTIONS.map((option) => <button key={option.id} type="button" onClick={() => { setSort(sort === option.id ? null : option.id); resetPage(); setSortOpen(false); }} className="flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm hover:bg-accent"><span className="flex-1 text-left">{option.label}</span>{sort === option.id && <Check className="size-4 text-primary" />}</button>)}</PopoverContent></Popover>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">{VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-label={label} aria-pressed={view === id} className={cn("cursor-pointer rounded-md p-1.5 transition-colors", view === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}><Icon className="size-4" /></button>)}</div>
      </div>
    </div>
    {activeFilterCount > 0 && <div className="flex flex-wrap gap-2">{status !== "all" && <FilterChip label={status} onClear={() => setStatus("all")} />}{supplier !== "all" && <FilterChip label={suppliers.find(([id]) => id === supplier)?.[1] ?? "Proveedor"} onClear={() => setSupplier("all")} />}{(from || to) && <FilterChip label={`${from || "Inicio"} — ${to || "Hoy"}`} onClear={() => { setFrom(""); setTo(""); }} />}</div>}
    {pageItems.length === 0 ? <div className="rounded-xl border border-dashed border-border"><EmptyState icon={SearchX} title="Sin compras coincidentes" description="Prueba con otra búsqueda o limpia los filtros." /></div> : <>{view === "tabla" ? <><PurchaseTable slug={slug} orders={pageItems} onOpen={setSelected} /><div className="grid gap-3 md:hidden">{pageItems.map((order) => <PurchaseCard key={order.id} slug={slug} order={order} onOpen={setSelected} />)}</div></> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pageItems.map((order) => <PurchaseCard key={order.id} slug={slug} order={order} onOpen={setSelected} />)}</div>}<Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} /></>}
    <PurchasePreviewDialog order={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} onView={() => selected && router.push(`/app/${slug}/compras/${selected.id}`)} />
  </section>;
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) { return <button type="button" onClick={onClear} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium capitalize text-primary hover:bg-primary/10">{label}<span className="ml-0.5 text-primary/60">×</span></button>; }
