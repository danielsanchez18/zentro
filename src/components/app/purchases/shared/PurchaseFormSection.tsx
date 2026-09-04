import type { ReactNode } from "react";

export function PurchaseFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-3">
        <h2 className="font-heading text-sm font-medium">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
