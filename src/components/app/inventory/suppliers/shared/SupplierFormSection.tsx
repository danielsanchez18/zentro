import type { ReactNode } from "react";

export function SupplierFormSection({
  title,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SupplierField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-y-2 font-heading">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
        {hint && (
          <span className="ml-3 font-normal text-muted-foreground">{hint}</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
