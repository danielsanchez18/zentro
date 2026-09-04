"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { EmptyState } from "@/components/ui/empty-state";
import { toastMsg } from "@/components/ui/toast-message";
import type { InventoryBrand, InventoryBrandStatus } from "@/lib/mock/inventory-brands";
import { cn } from "@/lib/utils";
import { useInventoryStore } from "@/stores/inventory-store";
import { EditBrandDialog } from "../edit/EditBrandDialog";
import { BrandCard } from "./BrandCard";
import { BrandsTable } from "./BrandsTable";

const PAGE_SIZE = 6;
const VIEWS = [{ id: "tabla", label: "Ver como tabla", icon: List }, { id: "cards", label: "Ver como tarjetas", icon: LayoutGrid }] as const;

export function BrandsList({ slug, brands }: { slug: string; brands: InventoryBrand[] }) {
  const router = useRouter();
  const updateBrand = useInventoryStore((state) => state.updateBrand);
  const removeBrand = useInventoryStore((state) => state.removeBrand);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InventoryBrandStatus | "all">("all");
  const [origin, setOrigin] = useState("all");
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("tabla");
  const [page, setPage] = useState(1);
  const [editingBrand, setEditingBrand] = useState<InventoryBrand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<InventoryBrand | null>(null);
  const origins = [...new Set(brands.map((brand) => brand.origin))];
  const filtered = useMemo(() => brands.filter((brand) => `${brand.name} ${brand.description} ${brand.origin}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === "all" || brand.status === status) && (origin === "all" || brand.origin === origin)), [brands, origin, query, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilterCount = Number(status !== "all") + Number(origin !== "all");
  const clearFilters = () => { setStatus("all"); setOrigin("all"); setPage(1); };
  const openBrand = (brand: InventoryBrand) => router.push(`/app/${slug}/inventario/marcas/${brand.id}`);
  const toggleBrand = (brand: InventoryBrand) => { const nextStatus = brand.status === "activo" ? "inactivo" : "activo"; updateBrand(brand.id, { status: nextStatus, updatedAt: new Date().toISOString() }); toastMsg.success(nextStatus === "activo" ? "Marca habilitada" : "Marca deshabilitada", `${brand.name} ahora está ${nextStatus}.`); };
  const actionProps = { onOpen: openBrand, onEdit: setEditingBrand, onToggleStatus: toggleBrand, onDelete: setDeletingBrand };

  return <section className="space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="min-w-60 w-full flex-1 md:max-w-md"><Search value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar marca, descripción u origen" /></div><div className="flex items-center gap-x-2"><FilterPopover activeCount={activeFilterCount} onClear={clearFilters} groups={[
      { label: "Estado", options: [{ label: "Todas", value: "all" }, { label: "Activa", value: "activo" }, { label: "Inactiva", value: "inactivo" }], selected: status, onSelect: (value) => { setStatus(value as InventoryBrandStatus | "all"); setPage(1); } },
      { label: "Origen", options: [{ label: "Todos", value: "all" }, ...origins.map((value) => ({ label: value, value }))], selected: origin, onSelect: (value) => { setOrigin(value); setPage(1); } },
    ]} /><div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">{VIEWS.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-label={label} aria-pressed={view === id} className={cn("cursor-pointer rounded-md p-1.5 transition-colors", view === id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}><Icon className="size-4" /></button>)}</div></div></div>
    {activeFilterCount > 0 && <div className="flex flex-wrap gap-2">{status !== "all" && <button type="button" onClick={() => setStatus("all")} className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{status === "activo" ? "Activa" : "Inactiva"} ×</button>}{origin !== "all" && <button type="button" onClick={() => setOrigin("all")} className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10">{origin} ×</button>}</div>}
    {pageItems.length === 0 ? <div className="rounded-xl border border-dashed border-border"><EmptyState icon={SearchX} title="Sin marcas coincidentes" description="Prueba con otra búsqueda o limpia los filtros." /></div> : <>{view === "tabla" ? <><BrandsTable brands={pageItems} {...actionProps} /><div className="grid gap-3 md:hidden">{pageItems.map((brand) => <BrandCard key={brand.id} brand={brand} {...actionProps} />)}</div></> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pageItems.map((brand) => <BrandCard key={brand.id} brand={brand} {...actionProps} />)}</div>}<Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} /></>}
    {editingBrand && <EditBrandDialog brand={editingBrand} open={Boolean(editingBrand)} onOpenChange={(open) => !open && setEditingBrand(null)} />}
    <ConfirmDialog open={Boolean(deletingBrand)} onOpenChange={(open) => !open && setDeletingBrand(null)} title="Eliminar marca" description={deletingBrand?.productCount ? `${deletingBrand.name} tiene ${deletingBrand.productCount} productos asociados. ¿Deseas eliminarla?` : `¿Deseas eliminar ${deletingBrand?.name ?? "esta marca"}?`} confirmLabel="Eliminar" onConfirm={() => { if (!deletingBrand) return; removeBrand(deletingBrand.id); toastMsg.info("Marca eliminada", `${deletingBrand.name} se eliminó del prototipo.`); setDeletingBrand(null); }} />
  </section>;
}
