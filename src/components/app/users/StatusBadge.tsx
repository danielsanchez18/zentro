import type { MemberStatus } from "@/lib/mock/users";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: MemberStatus;
}

/** Badge de estado del miembro (Activo / Suspendido). */
export function StatusBadge({ status }: StatusBadgeProps) {
  const active = status === "ACTIVE";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 uppercase text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {/* <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-destructive",
        )}
      /> */}
      {active ? "Activo" : "Suspendido"}
    </span>
  );
}