import type { ReactNode } from "react";

export function FormSection({
  title,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="h-fit overflow-hidden rounded-xl border border-border bg-card">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {/* {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )} */}
      </header>
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
    <label className="flex flex-col gap-y-2 font-heading text-sm font-medium text-foreground">
      <span>{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-normal text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const promotionInputClass =
  "h-fit w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
