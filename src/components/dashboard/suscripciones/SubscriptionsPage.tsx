"use client";

import { useState } from "react";
import { CreditCard, Eye, ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SubscriptionCard } from "@/components/dashboard/suscripciones/SubscriptionCard";
import { InvoiceStatusChip } from "@/components/dashboard/suscripciones/InvoiceStatusChip";
import { DownloadInvoiceButton } from "@/components/dashboard/suscripciones/DownloadInvoiceButton";
import { InvoiceDetailDialog } from "@/components/dashboard/suscripciones/InvoiceDetailDialog";
import type {
  Invoice,
  InvoiceStatus,
} from "@/components/dashboard/suscripciones/types";
import { cn } from "@/lib/utils";
import { useSubscriptionsData } from "@/components/dashboard/suscripciones/data";
import { formatLongDate } from "@/components/dashboard/suscripciones/format";
import { hubTabs } from "@/components/dashboard/shared/styles";

type InvoiceFilter = "ALL" | InvoiceStatus;

const INVOICE_FILTERS: { key: InvoiceFilter; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "OPEN", label: "Pendientes" },
  { key: "PAID", label: "Pagadas" },
];

export const SubscriptionsPage = () => {
  const { subscriptions: SUBSCRIPTIONS, invoices: INVOICES } = useSubscriptionsData();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<InvoiceFilter>("ALL");
  const invoices = filter === "ALL" ? INVOICES : INVOICES.filter((invoice) => invoice.status === filter);
  const countFor = (key: InvoiceFilter) =>
    key === "ALL" ? INVOICES.length : INVOICES.filter((invoice) => invoice.status === key).length;

  return (
    <div className="space-y-2">
      <div className="rounded-sm bg-card px-4 py-3">
        <h1 className="font-sans text-lg font-medium">Suscripciones</h1>
        <p className="text-sm text-muted-foreground">
          Planes y facturas de tus organizaciones. La gestión se hace en cada organización.
        </p>
      </div>

      <section aria-labelledby="planes-title" className="space-y-5 rounded-sm bg-card px-4 py-3">
        <div>
          <h2 id="planes-title" className="font-sans text-base font-medium">
            Planes
          </h2>
          <p className="text-sm text-muted-foreground">
            {SUBSCRIPTIONS.length} suscripcion{SUBSCRIPTIONS.length === 1 ? "" : "es"} con su uso actual.
          </p>
        </div>

        {SUBSCRIPTIONS.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border">
            <EmptyState
              icon={CreditCard}
              title="Sin suscripciones"
              description="Las suscripciones de tus organizaciones aparecerán aquí."
            />
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {SUBSCRIPTIONS.map((subscription) => (
              <li key={subscription.id}>
                <SubscriptionCard subscription={subscription} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="facturas-title" className="space-y-5 rounded-sm bg-card px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="facturas-title" className="font-sans text-base font-medium">
              Facturas
            </h2>
            <p className="text-sm text-muted-foreground">Comprobantes emitidos por Zentro a tus organizaciones.</p>
          </div>
          <div role="tablist" aria-label="Filtrar facturas" className={hubTabs.list}>
            {INVOICE_FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={filter === item.key}
                onClick={() => setFilter(item.key)}
                className={cn(
                  hubTabs.tab,
                  filter === item.key
                    ? hubTabs.active
                    : hubTabs.idle,
                )}
              >
                {item.label}
                <span className="text-xs text-muted-foreground">{countFor(item.key)}</span>
              </button>
            ))}
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border">
            <EmptyState icon={ReceiptText} title="Sin facturas" description="No hay facturas para este filtro." />
          </div>
        ) : (
          <>
            {/* Desktop: tabla */}
            <div className="hidden overflow-x-auto rounded-sm border border-border md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                    <th scope="col" className="px-3 py-2.5 font-medium">Número</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Organización</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Período</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Monto</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Estado</th>
                    <th scope="col" className="px-3 py-2.5 font-medium">Vencimiento</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      <span className="sr-only">Descargar</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border last:border-b-0">
                      <td className="text-nowrap px-3 py-2 tabular-nums">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          {invoice.number}
                          <Eye className="size-3.5 text-muted-foreground" />
                        </button>
                      </td>
                      <td className="text-nowrap px-3 py-2">{invoice.orgName}</td>
                      <td className="text-nowrap px-3 py-2 text-muted-foreground">{invoice.period}</td>
                      <td className="text-nowrap px-3 py-2 font-medium tabular-nums">{invoice.amount}</td>
                      <td className="text-nowrap px-3 py-2">
                        <InvoiceStatusChip status={invoice.status} />
                      </td>
                      <td className="text-nowrap px-3 py-2 text-muted-foreground">{formatLongDate(invoice.detail?.dueDateFull ?? invoice.dueDate)}</td>
                      <td className="text-nowrap px-3 py-2 text-right">
                        <DownloadInvoiceButton
                          invoiceNumber={invoice.number}
                          invoiceId={invoice.id}
                          pdfUrl={invoice.pdfUrl}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: filas tocables que abren el detalle */}
            <ul className="space-y-2 md:hidden">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(invoice)}
                    className="flex w-full items-center justify-between gap-3 rounded-sm border border-border p-2 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium tabular-nums">
                        {invoice.number} · {invoice.amount}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {invoice.orgName} · {invoice.period}
                      </p>
                    </div>
                    <InvoiceStatusChip status={invoice.status} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {selectedInvoice && (
        <InvoiceDetailDialog
          invoice={selectedInvoice}
          open
          onOpenChange={(open) => {
            if (!open) setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};
