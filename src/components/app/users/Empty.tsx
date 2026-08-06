import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

/** Estado vacío reutilizable (sin filas / sin invitaciones). */
export function Empty({ icon: Icon, title, description, className }: EmptyProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border px-5 py-10 text-center",
        className,
      )}
    >
      {Icon && <Icon className="mx-auto size-6 text-muted-foreground" />}
      <p className="mt-2 text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}