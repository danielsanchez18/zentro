"use client";

import { Building2, CalendarDays, ReceiptText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoiceStatusChip } from "@/components/dashboard/suscripciones/InvoiceStatusChip";
import { DownloadInvoiceButton } from "@/components/dashboard/suscripciones/DownloadInvoiceButton";
import type { Invoice } from "@/components/dashboard/suscripciones/types";

interface InvoiceDetailDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceDetailDialog = ({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailDialogProps) => {
  const detail = invoice.detail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="inset-0 h-dvh w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none p-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl"
      >
        <div className="flex h-full flex-col overflow-hidden sm:h-auto">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border p-5">
            <div className="flex gap-3">
              <div className="flex size-9 min-w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <ReceiptText className="size-4" />
              </div>
              <div className="flex flex-col gap-y-1">
                <DialogTitle className="font-sans">
                  Factura {detail?.seriesNumber ?? invoice.number}
                </DialogTitle>
                <DialogDescription>
                  Comprobante electrónico · Moneda: {detail?.currency ?? "PEN"}
                </DialogDescription>
              </div>
            </div>
            <div className="mr-5">
              <InvoiceStatusChip status={invoice.status} />
            </div>
          </div>

          {/* Document */}
          <div className="flex-1 overflow-y-auto p-5">
            {!detail ? (
              <p className="text-sm text-muted-foreground">
                Detalle no disponible para esta factura.
              </p>
            ) : (
              <div className="space-y-6">
                {/* Emisor / Cliente */}
                <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Building2 className="size-3.5" />
                      Emisor
                    </p>
                    <p className="mt-1 text-sm font-medium">{detail.issuer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {detail.issuer.taxId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detail.issuer.address}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Facturado a
                    </p>
                    <p className="mt-1 text-sm font-medium">{detail.client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {detail.client.taxId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detail.client.address}
                    </p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="flex items-start gap-4 rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <dl className="grid flex-1 grid-cols-2 sm:grid-cols-3 gap-2 gap-y-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">Emisión</dt>
                      <dd>{detail.issuedDate}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Vencimiento</dt>
                      <dd>{detail.dueDateFull}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Período</dt>
                      <dd>{detail.periodFull}</dd>
                    </div>
                  </dl>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium">Detalle</h3>
                  <div className="mt-2 overflow-x-auto rounded-md border border-border">
                    <table className="w-full min-w-100 text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase font-medium">
                          <th scope="col" className="px-5 py-3 font-medium text-nowrap">
                            Descripción
                          </th>
                          <th scope="col" className="px-5 py-3 text-right font-medium text-nowrap">
                            Cant.
                          </th>
                          <th scope="col" className="px-5 py-3 text-right font-medium text-nowrap">
                            P. unitario
                          </th>
                          <th scope="col" className="px-5 py-3 text-right font-medium text-nowrap">
                            Importe
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.items.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-border last:border-b-0"
                          >
                            <td className="px-5 py-3 text-nowrap">{item.description}</td>
                            <td className="px-5 py-3 text-right tabular-nums text-nowrap">
                              {item.quantity}
                            </td>
                            <td className="px-5 py-3 text-right tabular-nums text-nowrap">
                              {item.unitPrice}
                            </td>
                            <td className="px-5 py-3 text-right tabular-nums font-medium text-nowrap">
                              {item.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totales */}
                <div className="flex justify-end">
                  <dl className="w-full space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd className="tabular-nums">{detail.subtotal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">{detail.taxLabel}</dt>
                      <dd className="tabular-nums">{detail.taxAmount}</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
                      <dt>Total</dt>
                      <dd className="tabular-nums">{detail.total}</dd>
                    </div>
                  </dl>
                </div>

                {/* Pago */}
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Método de pago
                  </p>
                  <p className="mt-1 text-sm">{detail.paymentMethod}</p>
                </div>

                {detail.notes && (
                  <p className="text-sm text-muted-foreground">{detail.notes}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/40 p-4 sm:p-5">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-fit rounded-full px-3 py-1.5">
              Cerrar
            </Button>
            <DownloadInvoiceButton
              invoiceNumber={invoice.number}
              invoiceId={invoice.id}
              pdfUrl={invoice.pdfUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
