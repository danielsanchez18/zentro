import {
  ArrowUpRight,
  Clock3,
  Mail,
  PackageCheck,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventorySupplier } from "@/lib/mock/inventory-suppliers";

export function SupplierCard({
  supplier,
  onOpen,
}: {
  supplier: InventorySupplier;
  onOpen: (supplier: InventorySupplier) => void;
}) {
  const initial = supplier.tradeName.trim().charAt(0).toUpperCase();
  const actionClass =
    "flex min-w-0 flex-1 items-center text-nowrap line-clamp-1 justify-center gap-1 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary";

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/25">
      <button
        type="button"
        onClick={() => onOpen(supplier)}
        className="w-full cursor-pointer p-4 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="max-w-[55%] truncate rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {supplier.paymentTerms}
          </span>
          <StatusBadge status={supplier.status} />
        </div>

        <div className="mt-3 flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-lg font-semibold text-primary ring-1 ring-primary/20">
            {initial}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-medium">
              {supplier.tradeName}
            </h3>
            <p className="truncate font-sans text-sm text-muted-foreground">
              {supplier.businessName}
            </p>
          </div>
        </div>

        <p className="mt-3 truncate border-t border-border pt-3 font-sans text-xs text-muted-foreground">
          RUC {supplier.documentNumber} ·{" "}
          {supplier.address || "Sin dirección registrada"}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <UserRound className="size-3.5 shrink-0" />
            <span className="truncate">{supplier.contactName}</span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="size-3.5 shrink-0" />
            <span>
              {supplier.leadTimeDays}{" "}
              {supplier.leadTimeDays === 1 ? "día" : "días"}
            </span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <PackageCheck className="size-3.5 shrink-0" />
            <span>{supplier.productCount} productos</span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Truck className="size-3.5 shrink-0" />
            <span>{supplier.monthlyEntries} entradas</span>
          </span>
        </div>
      </button>

      <div className="flex gap-2 border-t border-border p-3">
        <a
          href={`mailto:${supplier.email}`}
          className={actionClass}
          aria-label={`Escribir a ${supplier.tradeName}`}
        >
          <Mail className="size-3.5 min-w-3.5" />
          <span className="max-sm:hidden">Correo</span>
        </a>
        {supplier.phone ? (
          <a
            href={`tel:${supplier.phone.replace(/\s/g, "")}`}
            className={actionClass}
            aria-label={`Llamar a ${supplier.tradeName}`}
          >
            <Phone className="size-3.5 min-w-3.5" />
            <span className="max-sm:hidden">Llamar</span>
          </a>
        ) : (
          <span className={`${actionClass} cursor-not-allowed opacity-50`}>
            <Phone className="size-3.5 min-w-3.5" />
            Llamar
          </span>
        )}
      </div>
    </article>
  );
}
