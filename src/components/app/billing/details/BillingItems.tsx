"use client";

import { Package } from "lucide-react";
import type { Invoice, InvoiceNote } from "@/lib/mock/billing";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

interface BillingItemsProps {
  invoice: Invoice;
  notes?: InvoiceNote[];
}

export function BillingItems({ invoice, notes = [] }: BillingItemsProps) {
  const itemsCount = invoice.items.reduce(
    (acc, curr) => acc + curr.quantity,
    0,
  );

  // Regla 26: las notas de crédito reducen el saldo del comprobante original;
  // las notas de débito lo incrementan (reglas 27-30).
  const creditTotal = notes
    .filter((note) => note.type === "credito")
    .reduce((sum, note) => sum + note.amount, 0);
  const debitTotal = notes
    .filter((note) => note.type === "debito")
    .reduce((sum, note) => sum + note.amount, 0);
  const hasNotes = creditTotal + debitTotal > 0;
  const balance = Math.max(0, invoice.total - creditTotal + debitTotal);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      {/* Header de la sección */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Ítems del comprobante
          </h2>
        </div>
        <span className="rounded-md bg-muted px-2.5 py-1.5 leading-none text-xs font-medium text-foreground">
          {itemsCount} {itemsCount === 1 ? "unidad" : "unidades"}
        </span>
      </header>

      {/* Tabla para pantallas md y xl */}
      <div className="hidden md:block lg:hidden xl:block overflow-x-auto p-5">
        <table className="w-full text-left text-sm text-nowrap">
          <thead>
            <tr className="border-b border-border bg-accent text-xs font-medium uppercase text-foreground">
              <th className="py-3 px-5">Producto</th>
              <th className="py-3 px-3 text-center">Cant.</th>
              <th className="py-3 px-3 text-right">P. Unit.</th>
              <th className="py-3 px-3 text-right">Dscto.</th>
              <th className="py-3 px-5 text-right">IGV (18%)</th>
              <th className="py-3 px-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoice.items.map((item) => (
              <tr key={item.id} className="transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Package className="size-4" />
                    </span>
                    <div className="min-w-0 max-w-50 md:max-w-55 xl:max-w-70">
                      <p
                        className="font-medium text-foreground truncate"
                        title={item.productName}
                      >
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {item.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center font-medium">
                  {item.quantity}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums text-muted-foreground">
                  {money.format(item.unitPrice)}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {item.discount > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      -{money.format(item.discount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="py-3.5 px-5 text-right tabular-nums text-muted-foreground">
                  {money.format(item.igv)}
                </td>
                <td className="py-3.5 px-3 text-right font-medium tabular-nums text-foreground">
                  {money.format(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista en tarjetas para pantallas mobile (< md) y lg */}
      <div className="divide-y divide-border px-5 md:hidden lg:block xl:hidden">
        {invoice.items.map((item) => (
          <article key={item.id} className="py-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Package className="size-4" />
                </span>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.sku}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-sm tabular-nums text-foreground">
                {money.format(item.subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>
                {item.quantity} × {money.format(item.unitPrice)}
              </span>
              {item.discount > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Dscto: -{money.format(item.discount)}
                </span>
              )}
              <span>IGV: {money.format(item.igv)}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Desglose de totales */}
      <div className="p-5 bg-muted/50 border-t border-border">
        <div className="ml-auto space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Op. Gravadas (Subtotal)</span>
            <span className="font-medium tabular-nums text-foreground">
              {money.format(invoice.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>IGV (18%)</span>
            <span className="font-medium tabular-nums text-foreground">
              {money.format(invoice.igv)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-medium text-foreground">
            <span>Importe Total</span>
            <span className="tabular-nums">{money.format(invoice.total)}</span>
          </div>

          {hasNotes && (
            <>
              {creditTotal > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>Notas de crédito</span>
                  <span className="font-medium tabular-nums">
                    −{money.format(creditTotal)}
                  </span>
                </div>
              )}
              {debitTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Notas de débito</span>
                  <span className="font-medium tabular-nums">
                    +{money.format(debitTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-medium text-foreground">
                <span>Saldo vigente</span>
                <span className="tabular-nums">{money.format(balance)}</span>
              </div>
            </>
          )}
        </div>

        {invoice.notes && (
          <div className="mt-4 rounded-lg bg-card border border-border p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Observaciones:</span>{" "}
            {invoice.notes}
          </div>
        )}
      </div>
    </section>
  );
}
