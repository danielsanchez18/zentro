import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  action,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-border bg-card h-fit ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium font-heading text-foreground">
      <div className="flex items-center justify-between">
        <span>{label}</span>
      </div>
      {children}
      {hint && !error && (
        <span className="text-xs font-normal font-heading text-muted-foreground">
          {hint}
        </span>
      )}
      {error && (
        <span className="text-xs font-normal text-destructive">{error}</span>
      )}
    </div>
  );
}

export const crmInputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50";
