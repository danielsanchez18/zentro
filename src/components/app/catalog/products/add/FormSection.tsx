import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function FormSection({ title, description, action, children }: FormSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card h-fit">
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

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium font-heading text-foreground">
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-normal font-heading text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const productInputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-2.25 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
