"use client";

import { Building2, CalendarDays, CreditCard, ReceiptText, StickyNote } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { InvoiceStatusChip } from "@/components/dashboard/suscripciones/InvoiceStatusChip";
import { DownloadInvoiceButton } from "@/components/dashboard/suscripciones/DownloadInvoiceButton";
import { hubButton, hubChip } from "@/components/dashboard/shared/styles";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/components/dashboard/suscripciones/format";
import type { Invoice, InvoiceParty } from "@/components/dashboard/suscripciones/types";

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Party = ({ label, party }: { label: string; party: InvoiceParty }) => (
  <div className="rounded-sm border border-border p-3">
    <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Building2 className="size-3.5" />
      {label}
    </p>
    <p className="mt-2 text-sm font-medium">{party.name}</p>
    <p className="text-sm text-muted-foreground">{party.taxId}</p>
    <p className="text-sm text-muted-foreground">{party.address}</p>
  </div>
);

/**
 * Detalle de una factura de suscripción.
 * Modal en escritorio y drawer inferior en móvil (ResponsiveDialog).
 */
export const InvoiceDetailDialog = ({ invoice, open, onOpenChange }: InvoiceDetailDialogProps) => {
  const detail = invoice.detail;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="gap-0 p-0 md:max-w-2xl md:max-h-[85dvh] md:overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col md:max-h-[85dvh]">
          {/* Encabezado */}
          <div className="flex items-center gap-3 px-4 pt-1 pb-4 md:pt-4 md:pr-12">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-(--hub-radius-control) bg-muted text-foreground">
              <ReceiptText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <ResponsiveDialogTitle className="font-sans text-base font-medium">
                Factura {detail?.seriesNumber ?? invoice.number}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="truncate text-sm">
                {invoice.orgName} · {invoice.period}
              </ResponsiveDialogDescription>
            </div>
            <InvoiceStatusChip status={invoice.status} />
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
            {!detail ? (
              <p className="rounded-sm border border-dashed border-border p-4 text-sm text-muted-foreground">
                El detalle de esta factura todavía no está disponible.
              </p>
            ) : (
              <>
                {/* Resumen del cobro */}
                <div className="rounded-sm bg-muted/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold tabular-nums">{detail.total}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className={cn(hubChip, "bg-card text-muted-foreground")}>
                      <CalendarDays />
                      Emitida {formatLongDate(detail.issuedDate)}
                    </span>
                    <span className={cn(hubChip, "bg-card text-muted-foreground")}>
                      <CalendarDays />
                      Vence {formatLongDate(detail.dueDateFull)}
                    </span>
                    <span className={cn(hubChip, "bg-card text-muted-foreground")}>
                      <CreditCard />
                      {detail.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Emisor y cliente */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <Party label="Emisor" party={detail.issuer} />
                  <Party label="Facturado a" party={detail.client} />
                </div>

                {/* Conceptos */}
                <div className="overflow-hidden rounded-sm border border-border">
                  {/* Móvil: conceptos apilados */}
                  <ul className="divide-y divide-border sm:hidden">
                    {detail.items.map((item) => (
                      <li key={item.description} className="flex items-start justify-between gap-3 px-3 py-2.5 text-sm">
                        <div className="min-w-0">
                          <p>{item.description}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {item.quantity} × {item.unitPrice}
                          </p>
                        </div>
                        <p className="shrink-0 font-medium tabular-nums">{item.amount}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-100 text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                          <th scope="col" className="px-3 py-2.5 font-medium">Concepto</th>
                          <th scope="col" className="px-3 py-2.5 text-right font-medium">Cant.</th>
                          <th scope="col" className="px-3 py-2.5 text-right font-medium">P. unit.</th>
                          <th scope="col" className="px-3 py-2.5 text-right font-medium">Importe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.items.map((item) => (
                          <tr key={item.description} className="border-b border-border last:border-b-0">
                            <td className="px-3 py-2.5">{item.description}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{item.quantity}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{item.unitPrice}</td>
                            <td className="px-3 py-2.5 text-right font-medium tabular-nums">{item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <dl className="space-y-1.5 border-t border-border bg-muted/30 px-3 py-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd className="tabular-nums">{detail.subtotal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{detail.taxLabel}</dt>
                      <dd className="tabular-nums">{detail.taxAmount}</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1.5 font-medium">
                      <dt>Total ({detail.currency})</dt>
                      <dd className="tabular-nums">{detail.total}</dd>
                    </div>
                  </dl>
                </div>

                {detail.notes && (
                  <p className="flex gap-2 rounded-sm border border-border p-3 text-sm text-muted-foreground">
                    <StickyNote className="mt-0.5 size-4 shrink-0" />
                    {detail.notes}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Acciones */}
          <div
            data-hub-footer
            className="flex items-center justify-end gap-1.5 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <button type="button" className={hubButton.secondary} onClick={() => onOpenChange(false)}>
              Cerrar
            </button>
            <DownloadInvoiceButton invoiceNumber={invoice.number} invoiceId={invoice.id} pdfUrl={invoice.pdfUrl} tone="primary" />
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
