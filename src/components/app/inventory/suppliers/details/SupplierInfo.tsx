import {
  CalendarClock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { InventorySupplier } from "@/lib/mock/inventory-suppliers";

export function SupplierInfo({ supplier }: { supplier: InventorySupplier }) {
  const rows = [
    { icon: UserRound, label: "Contacto", value: supplier.contactName },
    { icon: Mail, label: "Correo", value: supplier.email },
    {
      icon: Phone,
      label: "Teléfono",
      value: supplier.phone || "Sin registrar",
    },
    {
      icon: MapPin,
      label: "Dirección",
      value: supplier.address || "Sin registrar",
    },
  ];

  const formattedLastEntry = (() => {
    if (!supplier.lastEntryAt) return "Sin entradas";
    const date = new Date(supplier.lastEntryAt);
    if (isNaN(date.getTime())) return supplier.lastEntryAt;
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  })();

  const formattedLeadTime = `${supplier.leadTimeDays} ${
    supplier.leadTimeDays === 1 ? "día" : "días"
  }`;

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-start gap-3 w-full">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-lg font-semibold text-primary ring-1 ring-primary/20">
            {supplier.tradeName.trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-medium">{supplier.tradeName}</h2>
            <p className="truncate text-sm text-muted-foreground">
              {supplier.businessName}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="mt-0.5 font-sans text-sm text-muted-foreground">
            RUC: {supplier.documentNumber}
          </p>
          <StatusBadge status={supplier.status} />
        </div>
      </div>

      <dl className="py-5 space-y-5">
        <p className="font-heading text-sm font-medium">
          Información de contacto
        </p>
        <div className="space-y-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400"
            >
              <Icon className="size-4 shrink-0" />
              <dd className="wrap-break-words text-sm font-heading">{value}</dd>
            </div>
          ))}
        </div>
      </dl>
      <dl className="border-t border-border py-5 pb-3 space-y-5">
        <p className="font-heading text-sm font-medium">
          Condiciones comerciales
        </p>
        <div className="space-y-3 font-heading text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-x-3 text-nowrap">
            <CreditCard className="size-4 min-w-4" />
            <p className="text-sm">Condiciones de pago:</p>
            <p className="text-sm text-primary">{supplier.paymentTerms}</p>
          </div>
          <div className="flex items-center gap-x-3 text-nowrap">
            <CalendarClock className="size-4 min-w-4" />
            <p className="text-sm">Tiempo de entrega:</p>
            <p className="text-sm text-primary">{formattedLeadTime}</p>
          </div>
          <div className="flex items-center gap-x-3 text-nowrap">
            <Package className="size-4 min-w-4" />
            <p className="text-sm">Productos vinculados:</p>
            <p className="text-sm text-primary">
              {supplier.productCount.toLocaleString("es-PE")}
            </p>
          </div>
          <div className="flex items-center gap-x-3 text-nowrap">
            <Truck className="size-4 min-w-4" />
            <p className="text-sm">Última entrada:</p>
            <p className="text-sm text-primary">{formattedLastEntry}</p>
          </div>
        </div>
      </dl>
    </section>
  );
}
