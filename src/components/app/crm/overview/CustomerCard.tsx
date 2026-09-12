import {
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  crmMoney,
  customerPrimaryAddress,
  type CrmCustomer,
} from "@/lib/mock/crm";
import { CustomerActionsMenu } from "./CustomerActionsMenu";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function CustomerCard({
  customer,
  onOpen,
  onEdit,
  onToggleStatus,
  onRemove,
}: {
  customer: CrmCustomer;
  onOpen: (customer: CrmCustomer) => void;
  onEdit: (customer: CrmCustomer) => void;
  onToggleStatus: (customer: CrmCustomer) => void;
  onRemove: (customer: CrmCustomer) => void;
}) {
  const address = customerPrimaryAddress(customer);
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(customer)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onOpen(customer);
        }}
        className="w-full cursor-pointer p-4 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 bg-cover bg-center text-sm font-semibold text-primary"
              style={
                customer.avatar
                  ? { backgroundImage: `url(${customer.avatar})` }
                  : undefined
              }
            >
              {customer.avatar ? (
                <span className="sr-only">{initials(customer.name)}</span>
              ) : (
                initials(customer.name)
              )}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-medium">{customer.name}</h3>
              <p className="truncate text-sm text-muted-foreground">
                {customer.email}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <StatusBadge status={customer.status} />
            <CustomerActionsMenu customer={customer} onOpen={onOpen} onEdit={onEdit} onToggleStatus={onToggleStatus} onRemove={onRemove} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {customer.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2.5 py-2 leading-none text-[13px] font-heading"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t pt-3 text-sm">
          <div className="flex items-center gap-x-2 font-heading">
            <ShoppingBag className="size-4 text-muted-foreground" />
            <span className="block text-sm text-muted-foreground">
              Pedidos realizados:
            </span>
            <span className="text-sm">{customer.totalOrders}</span>
          </div>
          <div className="flex items-center gap-x-2 font-heading">
            <Wallet className="size-4 text-muted-foreground" />
            <span className="block text-sm text-muted-foreground">
              Valor del cliente:
            </span>
            <span className="text-sm tabular-nums">
              {crmMoney(customer.totalSpent)}
            </span>
          </div>
        </div>
        {address && (
          <p className="mt-3 flex items-center gap-2 truncate text-sm text-muted-foreground font-heading">
            <MapPin className="size-4 shrink-0" />
            {address.address}, {address.district}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-0 p-3">
        <a
          href={`mailto:${customer.email}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium font-heading hover:bg-primary hover:text-background transition"
        >
          <Mail className="size-3.5" />
          Correo
        </a>
        <a
          href={`tel:${customer.phone.replace(/\s/g, "")}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium font-heading hover:bg-primary hover:text-background transition"
        >
          <Phone className="size-3.5" />
          Llamar
        </a>
      </div>
    </article>
  );
}
