import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { crmChannelLabel, crmMoney, type CrmCustomer } from "@/lib/mock/crm";
import { CustomerActionsMenu } from "./CustomerActionsMenu";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function CustomersTable({
  customers,
  onOpen,
  onEdit,
  onToggleStatus,
  onRemove,
}: {
  customers: CrmCustomer[];
  onOpen: (customer: CrmCustomer) => void;
  onEdit: (customer: CrmCustomer) => void;
  onToggleStatus: (customer: CrmCustomer) => void;
  onRemove: (customer: CrmCustomer) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-200 w-full">
        <thead>
          <tr className="bg-accent">
            {[
              "Cliente",
              "Contacto",
              "Etiquetas",
              "Canal preferido",
              "Pedidos",
              "Valor",
              "Estado",
              "Acciones",
            ].map((label) => (
              <th
                key={label}
                className="px-5 py-3 text-left text-xs font-heading font-semibold uppercase text-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => onOpen(customer)}
              className="cursor-pointer hover:bg-muted/30"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-x-2">
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
                  <div>
                    <p className="text-sm font-medium text-nowrap">
                      {customer.name}
                    </p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {customer.kind}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-sm font-heading">
                <p className="text-nowrap">{customer.email || "Sin correo"}</p>
                <p className="text-sm text-muted-foreground text-nowrap">
                  {customer.phone}
                </p>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  {customer.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-2.5 py-2 leading-none text-[13px] font-heading"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3 text-sm text-nowrap font-heading">
                {crmChannelLabel(customer.preferredChannel)}
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums">
                {customer.totalOrders}
              </td>
              <td className="px-5 py-3 text-sm font-medium tabular-nums text-nowrap">
                {crmMoney(customer.totalSpent)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={customer.status} />
              </td>
              <td className="px-5 py-3 text-right">
                <CustomerActionsMenu customer={customer} onOpen={onOpen} onEdit={onEdit} onToggleStatus={onToggleStatus} onRemove={onRemove} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
