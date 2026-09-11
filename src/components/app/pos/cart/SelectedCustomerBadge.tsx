import { X } from "lucide-react";
import type { PosCustomer } from "@/lib/mock/pos";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function SelectedCustomerBadge({
  customer,
  onRemove,
}: {
  customer: PosCustomer;
  onRemove: () => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/35 pl-4 px-2 py-1.5">
      <span
        role="img"
        aria-label={`Foto de ${customer.name}`}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-[10px] font-medium"
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
      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {customer.name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar a ${customer.name}`}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
