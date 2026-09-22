"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Check, LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { FormChannel, FormStatus, FormType, ZentroForm } from "@/lib/mock/forms";
import { cn } from "@/lib/utils";
import { FormCard } from "./FormCard";
import { FormPreviewDialog } from "./FormPreviewDialog";
import { FormsTable } from "./FormsTable";

const PAGE_SIZE = 6;
type Sort = "updated" | "responses" | "completion" | "name";
const SORTS: { id: Sort; label: string }[] = [
  { id: "updated", label: "Actualizados recientemente" },
  { id: "responses", label: "Más respuestas" },
  { id: "completion", label: "Mayor finalización" },
  { id: "name", label: "Nombre A–Z" },
];

export function FormsList({ forms }: { forms: ZentroForm[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FormStatus | "all">("all");
  const [type, setType] = useState<FormType | "all">("all");
  const [channel, setChannel] = useState<FormChannel | "all">("all");
  const [sort, setSort] = useState<Sort>("updated");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<"tabla" | "cards">("tabla");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = forms.find((form) => form.id === selectedId) ?? null;
  const filtered = useMemo(
    () =>
      forms
        .filter(
          (form) =>
            `${form.name} ${form.description} ${form.publicPath}`.toLowerCase().includes(query.trim().toLowerCase()) &&
            (status === "all" || form.status === status) &&
            (type === "all" || form.type === type) &&
            (channel === "all" || form.channel === channel),
        )
        .sort((a, b) =>
          sort === "responses"
            ? b.submissions - a.submissions
            : sort === "completion"
              ? b.completionRate - a.completionRate
              : sort === "name"
                ? a.name.localeCompare(b.name, "es")
                : Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
        ),
    [forms, query, status, type, channel, sort],
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = Number(status !== "all") + Number(type !== "all") + Number(channel !== "all");
  const reset = () => setPage(1);
  return (
    <section className="w-full min-w-0 space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Search value={query} onChange={(event) => { setQuery(event.target.value); reset(); }} placeholder="Buscar formulario o enlace..." className="w-full min-w-60 flex-1 md:max-w-md" />
        <div className="flex flex-wrap items-center gap-2">
          <FilterPopover activeCount={activeCount} onClear={() => { setStatus("all"); setType("all"); setChannel("all"); reset(); }} groups={[
            { label: "Estado", selected: status, onSelect: (value) => { setStatus(value as FormStatus | "all"); reset(); }, options: [{ label: "Todos", value: "all" }, { label: "Borrador", value: "borrador" }, { label: "Publicado", value: "activo" }, { label: "Pausado", value: "pausada" }, { label: "Archivado", value: "finalizada" }] },
            { label: "Tipo", selected: type, onSelect: (value) => { setType(value as FormType | "all"); reset(); }, options: [{ label: "Todos", value: "all" }, { label: "Contacto", value: "contacto" }, { label: "Cotización", value: "cotizacion" }, { label: "Reserva", value: "reserva" }, { label: "Encuesta", value: "encuesta" }, { label: "Personalizado", value: "personalizado" }] },
            { label: "Canal", selected: channel, onSelect: (value) => { setChannel(value as FormChannel | "all"); reset(); }, options: [{ label: "Todos", value: "all" }, { label: "Sitio web", value: "web" }, { label: "Marketplace", value: "marketplace" }, { label: "Enlace público", value: "enlace" }, { label: "Interno", value: "interno" }] },
          ]} />
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger render={<Button type="button" variant="outline" className="h-fit px-3 py-2" />}><ArrowUpDown className="size-3.5" /><span className="hidden sm:inline">{SORTS.find((item) => item.id === sort)?.label}</span></PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-1">{SORTS.map((item) => <button key={item.id} type="button" onClick={() => { setSort(item.id); setSortOpen(false); reset(); }} className="flex w-full items-center rounded-lg px-2.5 py-2 text-sm hover:bg-accent"><span className="flex-1 text-left">{item.label}</span>{sort === item.id && <Check className="size-4 text-primary" />}</button>)}</PopoverContent>
          </Popover>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">{[{ id: "tabla" as const, icon: List }, { id: "cards" as const, icon: LayoutGrid }].map(({ id, icon: Icon }) => <button key={id} type="button" onClick={() => setView(id)} aria-label={`Vista ${id}`} className={cn("rounded-md p-1.5", view === id ? "bg-accent" : "text-muted-foreground")}><Icon className="size-4" /></button>)}</div>
        </div>
      </div>
      {pageItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border"><EmptyState icon={SearchX} title="Sin formularios coincidentes" description="Prueba otra búsqueda o limpia los filtros seleccionados." /></div>
      ) : (
        <>
          {view === "tabla" ? <FormsTable forms={pageItems} onOpen={(form) => setSelectedId(form.id)} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pageItems.map((form) => <FormCard key={form.id} form={form} onOpen={(item) => setSelectedId(item.id)} />)}</div>}
          <Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} />
        </>
      )}
      <FormPreviewDialog form={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)} />
    </section>
  );
}
