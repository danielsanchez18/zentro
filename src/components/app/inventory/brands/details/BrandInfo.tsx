import { Boxes, CalendarClock, CircleDollarSign, Globe2, Package } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventoryBrand } from "@/lib/mock/inventory-brands";

export function BrandInfo({ brand }: { brand: InventoryBrand }) {
  const formattedDate = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(brand.updatedAt));
  const formattedValue = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(brand.inventoryValue);

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex w-full items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-lg font-semibold text-primary ring-1 ring-primary/20">{brand.name.trim().charAt(0).toUpperCase()}</span>
          <div className="min-w-0"><h2 className="truncate font-medium">{brand.name}</h2><p className="line-clamp-2 text-sm text-muted-foreground">{brand.description}</p></div>
        </div>
        <div className="flex w-full items-center justify-between"><p className="mt-0.5 font-sans text-sm text-muted-foreground">ID: {brand.id}</p><StatusBadge status={brand.status} /></div>
      </div>

      <dl className="space-y-5 py-5">
        <p className="font-heading text-sm font-medium">Información de la marca</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"><Globe2 className="size-4 shrink-0" /><p className="text-sm font-heading">País de origen: <span className="text-primary">{brand.origin}</span></p></div>
          <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"><CalendarClock className="size-4 shrink-0" /><p className="text-sm font-heading">Actualización: <span className="text-primary">{formattedDate}</span></p></div>
        </div>
      </dl>

      <dl className="space-y-5 border-t border-border py-5 pb-3">
        <p className="font-heading text-sm font-medium">Resumen de inventario</p>
        <div className="space-y-3 font-heading text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-x-3 text-nowrap"><Package className="size-4 min-w-4" /><p className="text-sm">Productos vinculados:</p><p className="text-sm text-primary">{brand.productCount.toLocaleString("es-PE")}</p></div>
          <div className="flex items-center gap-x-3 text-nowrap"><Boxes className="size-4 min-w-4" /><p className="text-sm">Unidades en stock:</p><p className="text-sm text-primary">{brand.unitsInStock.toLocaleString("es-PE")}</p></div>
          <div className="flex items-center gap-x-3 text-nowrap"><CircleDollarSign className="size-4 min-w-4" /><p className="text-sm">Valorización:</p><p className="text-sm text-primary">{formattedValue}</p></div>
        </div>
      </dl>
    </section>
  );
}
