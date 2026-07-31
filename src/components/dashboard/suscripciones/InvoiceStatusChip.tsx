import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/components/dashboard/suscripciones/types";

const STYLES: Record<InvoiceStatus, string> = {
  PAID: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  OPEN: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  VOID: "bg-muted text-muted-foreground",
};

const LABELS: Record<InvoiceStatus, string> = {
  PAID: "Pagada",
  OPEN: "Pendiente",
  VOID: "Anulada",
};

export const InvoiceStatusChip = ({ status }: { status: InvoiceStatus }) => {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
};
