import { cn } from "@/lib/utils";

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";

const STYLES: Record<SubscriptionStatus, string> = {
  TRIAL: "bg-primary/10 text-primary",
  ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PAST_DUE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  CANCELED: "bg-muted text-muted-foreground",
};

const LABELS: Record<SubscriptionStatus, string> = {
  TRIAL: "Trial",
  ACTIVE: "Activa",
  PAST_DUE: "Atrasada",
  CANCELED: "Cancelada",
};

export const StatusChip = ({ status }: { status: SubscriptionStatus }) => {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs uppercase tracking-wide",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
};
