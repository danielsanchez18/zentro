import { cn } from "@/lib/utils";
import type { InvitationStatus } from "@/components/dashboard/invitaciones/types";

const STYLES: Record<InvitationStatus, string> = {
  PENDING: "bg-primary/10 text-primary",
  ACCEPTED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  DECLINED: "bg-muted text-muted-foreground",
  EXPIRED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  REVOKED: "bg-muted text-muted-foreground",
};

const LABELS: Record<InvitationStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  DECLINED: "Rechazada",
  EXPIRED: "Expirada",
  REVOKED: "Revocada",
};

export const InvitationStatusChip = ({
  status,
}: {
  status: InvitationStatus;
}) => {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
};
