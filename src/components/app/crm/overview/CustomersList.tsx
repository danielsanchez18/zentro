"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, SearchX } from "lucide-react";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import { cn } from "@/lib/utils";
import { useCrmStore } from "@/stores/crm-store";
import type { CrmCustomer, CustomerKind, CustomerStatus } from "@/lib/mock/crm";
import { CustomerCard } from "./CustomerCard";
import { CustomersTable } from "./CustomersTable";

const PAGE_SIZE = 6;
export function CustomersList({ slug, customers }: { slug: string; customers: CrmCustomer[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [kind, setKind] = useState<CustomerKind | "all">("all");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [removeTarget, setRemoveTarget] = useState<CrmCustomer | null>(null);
  const updateCustomer = useCrmStore((state) => state.updateCustomer);
  const removeCustomer = useCrmStore((state) => state.removeCustomer);
  const filtered = useMemo(() => customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone} ${customer.documentNumber ?? ""} ${customer.tags.join(" ")}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")) && (status === "all" || customer.status === status) && (kind === "all" || customer.kind === kind)), [customers, kind, query, status]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const items = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const count = Number(status !== "all") + Number(kind !== "all");
  const open = (customer: CrmCustomer) => router.push(`/app/${slug}/clientes/${customer.id}`);
  const edit = (customer: CrmCustomer) => router.push(`/app/${slug}/clientes/${customer.id}/editar`);
  const toggleStatus = (customer: CrmCustomer) => {
    const status = customer.status === "activo" ? "inactivo" : "activo";
    updateCustomer(customer.id, { status });
    toastMsg.success(status === "activo" ? "Cliente habilitado" : "Cliente deshabilitado", customer.name);
  };
  return (
    <section className="space-y-5 sm:rounded-xl sm:border sm:bg-card sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full min-w-60 flex-1 md:max-w-md"><Search value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar nombre, correo, teléfono o documento" /></div>
        <div className="flex items-center gap-2">
          <FilterPopover activeCount={count} onClear={() => { setStatus("all"); setKind("all"); }} groups={[
            { label: "Estado", selected: status, onSelect: (value) => setStatus(value as CustomerStatus | "all"), options: [{ label: "Todos", value: "all" }, { label: "Activo", value: "activo" }, { label: "Inactivo", value: "inactivo" }] },
            { label: "Tipo", selected: kind, onSelect: (value) => setKind(value as CustomerKind | "all"), options: [{ label: "Todos", value: "all" }, { label: "Persona", value: "persona" }, { label: "Empresa", value: "empresa" }] },
          ]} />
          <div className="flex items-center gap-1 rounded-lg border bg-background p-1">{([{ id: "table", icon: List, label: "Tabla" }, { id: "cards", icon: LayoutGrid, label: "Tarjetas" }] as const).map(({ id, icon: Icon, label }) => <button key={id} onClick={() => setView(id)} aria-label={label} className={cn("cursor-pointer rounded-md p-1.5 text-muted-foreground", view === id && "bg-accent text-foreground")}><Icon className="size-4" /></button>)}</div>
        </div>
      </div>
      {items.length === 0 ? <div className="rounded-xl border border-dashed"><EmptyState icon={SearchX} title="Sin clientes coincidentes" description="Prueba otra búsqueda o limpia los filtros." /></div> : <>{view === "table" ? <CustomersTable customers={items} onOpen={open} onEdit={edit} onToggleStatus={toggleStatus} onRemove={setRemoveTarget} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((customer) => <CustomerCard key={customer.id} customer={customer} onOpen={open} onEdit={edit} onToggleStatus={toggleStatus} onRemove={setRemoveTarget} />)}</div>}<Paginator totalResults={filtered.length} pageSize={PAGE_SIZE} currentPage={currentPage} onPageChange={setPage} /></>}
      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title="Eliminar cliente"
        description={removeTarget ? `Se eliminará ${removeTarget.name} del prototipo. Sus pedidos conservarán la información histórica.` : ""}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (!removeTarget) return;
          removeCustomer(removeTarget.id);
          toastMsg.info("Cliente eliminado", removeTarget.name);
          setRemoveTarget(null);
        }}
      />
    </section>
  );
}
