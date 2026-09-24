"use client";

import { Building2, FileText, Mail, MapPin } from "lucide-react";
import type { InvoiceCustomer } from "@/lib/mock/billing";

interface BillingCustomerInfoProps {
  customer: InvoiceCustomer;
}

export function BillingCustomerInfo({ customer }: BillingCustomerInfoProps) {
  const initials =
    customer.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "CL";

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">Cliente</h2>
        <span className="text-xs font-mono uppercase rounded-md bg-muted px-2.5 py-1.5 leading-none text-foreground">
          {customer.documentType}
        </span>
      </header>

      <div className="p-4 space-y-4">
        {/* Customer Profile Row */}
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-foreground truncate">
              {customer.name}
            </p>
            {customer.tradeName && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <span className="truncate">{customer.tradeName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-border w-full" />

        {/* Documento y datos fiscales */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-sm uppercase text-muted-foreground">
              {customer.documentType}:
            </span>
            <span className="font-mono font-medium text-foreground">
              {customer.documentNumber}
            </span>
          </div>

          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail className="size-4 shrink-0" />
              <span className="truncate text-sm underline underline-offset-2">
                {customer.email}
              </span>
            </a>
          )}

          {customer.address && (
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <MapPin className="size-4 shrink-0 mt-0.5" />
              <span className="text-sm text-foreground leading-snug">
                {customer.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
