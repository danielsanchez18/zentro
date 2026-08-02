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
  Subscription,
} from "@/components/dashboard/suscripciones/types";

// TODO(0.2): leer desde GET /users/me/subscriptions y /users/me/invoices
const SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_001",
    orgName: "Las Rocas Restaurante",
    slug: "las-rocas",
    plan: "Esencial",
    status: "TRIAL",
    period: "Trial 14 días",
    price: "S/ 0.00",
    nextCharge: "31 de agosto",
    usage: { users: { used: 1, limit: 3 }, branches: { used: 1, limit: 1 } },
  },
  {
    id: "sub_002",
    orgName: "Café del Valle",
    slug: "cafe-del-valle",
    plan: "Crecimiento",
    status: "ACTIVE",
    period: "01 jul – 31 jul",
    price: "S/ 99.00",
    nextCharge: "15 de agosto",
    usage: { users: { used: 4, limit: 10 }, branches: { used: 2, limit: 3 } },
  },
  {
    id: "sub_003",
    orgName: "Fonda La Abuela",
    slug: "fonda-la-abuela",
    plan: "Esencial",
    status: "ACTIVE",
    period: "01 jul – 31 jul",
    price: "S/ 49.00",
    nextCharge: "1 de septiembre",
    usage: { users: { used: 2, limit: 3 }, branches: { used: 1, limit: 1 } },
  },
];

const ZENTRO_ISSUER = {
  name: "Zentro S.A.C.",
  taxId: "RUC 20601849235",
  address: "Av. Javier Prado Este 550, San Isidro, Lima",
};

const ORGANIZATIONS: Record<string, { name: string; taxId: string; address: string }> = {
  "cafe-del-valle": {
    name: "Café del Valle S.A.C.",
    taxId: "RUC 20451826374",
    address: "Av. Larco 1234, Miraflores, Lima",
  },
  "fonda-la-abuela": {
    name: "Fonda La Abuela S.A.C.",
    taxId: "RUC 20603719248",
    address: "Jr. San Martín 45, Barranco, Lima",
  },
  "las-rocas": {
    name: "Las Rocas Restaurante S.A.C.",
    taxId: "RUC 20518463527",
    address: "Calle Los Tulipanes 120, Miraflores, Lima",
  },
};

// Calcula ítems de una suscripción: subtotal = total / 1.18, IGV 18%.
const buildSubscriptionItem = (plan: string, period: string, total: number) => {
  const subtotal = Math.round((total / 1.18) * 100) / 100;
  const igv = Math.round((total - subtotal) * 100) / 100;
  const money = (value: number) =>
    `S/ ${value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return {
    item: {
      description: `Suscripción plan ${plan} · ${period}`,
      quantity: 1,
      unitPrice: money(subtotal),
      amount: money(subtotal),
    },
    subtotal: money(subtotal),
    taxAmount: money(igv),
    total: money(total),
  };
};

const INVOICES: Invoice[] = [
  {
    id: "inv_004",
    number: "INV-0004",
    orgName: "Café del Valle",
    period: "Julio 2026",
    amount: "S/ 99.00",
    status: "PAID",
    dueDate: "15 jul",
    detail: {
      seriesNumber: "F001-0004",
      issuedDate: "1 de julio de 2026",
      dueDateFull: "15 de julio de 2026",
      periodFull: "Julio 2026",
      currency: "Soles (PEN)",
      issuer: ZENTRO_ISSUER,
      client: ORGANIZATIONS["cafe-del-valle"],
      items: [buildSubscriptionItem("Crecimiento", "Julio 2026", 99).item],
      subtotal: buildSubscriptionItem("Crecimiento", "Julio 2026", 99).subtotal,
      taxLabel: "IGV (18%)",
      taxAmount: buildSubscriptionItem("Crecimiento", "Julio 2026", 99).taxAmount,
      total: buildSubscriptionItem("Crecimiento", "Julio 2026", 99).total,
      paymentMethod: "Tarjeta de crédito ···· 4242 (VISA)",
      notes:
        "Gracias por tu suscripción. Este comprobante se emitió electrónicamente.",
    },
  },
  {
    id: "inv_003",
    number: "INV-0003",
    orgName: "Fonda La Abuela",
    period: "Julio 2026",
    amount: "S/ 49.00",
    status: "PAID",
    dueDate: "1 jul",
    detail: {
      seriesNumber: "F001-0003",
      issuedDate: "1 de julio de 2026",
      dueDateFull: "1 de julio de 2026",
      periodFull: "Julio 2026",
      currency: "Soles (PEN)",
      issuer: ZENTRO_ISSUER,
      client: ORGANIZATIONS["fonda-la-abuela"],
      items: [buildSubscriptionItem("Esencial", "Julio 2026", 49).item],
      subtotal: buildSubscriptionItem("Esencial", "Julio 2026", 49).subtotal,
      taxLabel: "IGV (18%)",
      taxAmount: buildSubscriptionItem("Esencial", "Julio 2026", 49).taxAmount,
      total: buildSubscriptionItem("Esencial", "Julio 2026", 49).total,
      paymentMethod: "Tarjeta de débito ···· 1122 (Mastercard)",
    },
  },
  {
    id: "inv_002",
    number: "INV-0002",
    orgName: "Café del Valle",
    period: "Junio 2026",
    amount: "S/ 99.00",
    status: "PAID",
    dueDate: "15 jun",
    detail: {
      seriesNumber: "F001-0002",
      issuedDate: "1 de junio de 2026",
      dueDateFull: "15 de junio de 2026",
      periodFull: "Junio 2026",
      currency: "Soles (PEN)",
      issuer: ZENTRO_ISSUER,
      client: ORGANIZATIONS["cafe-del-valle"],
      items: [buildSubscriptionItem("Crecimiento", "Junio 2026", 99).item],
      subtotal: buildSubscriptionItem("Crecimiento", "Junio 2026", 99).subtotal,
      taxLabel: "IGV (18%)",
      taxAmount: buildSubscriptionItem("Crecimiento", "Junio 2026", 99).taxAmount,
      total: buildSubscriptionItem("Crecimiento", "Junio 2026", 99).total,
      paymentMethod: "Tarjeta de crédito ···· 4242 (VISA)",
    },
  },
  {
    id: "inv_001",
    number: "INV-0001",
    orgName: "Fonda La Abuela",
    period: "Junio 2026",
    amount: "S/ 49.00",
    status: "OPEN",
    dueDate: "1 jul",
    detail: {
      seriesNumber: "F001-0001",
      issuedDate: "1 de junio de 2026",
      dueDateFull: "1 de julio de 2026",
      periodFull: "Junio 2026",
      currency: "Soles (PEN)",
      issuer: ZENTRO_ISSUER,
      client: ORGANIZATIONS["fonda-la-abuela"],
      items: [buildSubscriptionItem("Esencial", "Junio 2026", 49).item],
      subtotal: buildSubscriptionItem("Esencial", "Junio 2026", 49).subtotal,
      taxLabel: "IGV (18%)",
      taxAmount: buildSubscriptionItem("Esencial", "Junio 2026", 49).taxAmount,
      total: buildSubscriptionItem("Esencial", "Junio 2026", 49).total,
      paymentMethod: "Pago pendiente · Yape / PLIN / Tarjeta",
      notes:
        "Recuerda pagar antes del vencimiento para evitar la suspensión del servicio.",
    },
  },
];

export const SubscriptionsPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Suscripciones</h1>
        <p className="text-sm text-muted-foreground">
          Planes y facturas de tus organizaciones. La gestión se hace en cada
          organización.
        </p>
      </div>

      <section aria-labelledby="planes-title">
        <h2 id="planes-title" className="text-base font-medium">
          Planes
        </h2>

        {SUBSCRIPTIONS.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={CreditCard}
              title="Sin suscripciones"
              description="Las suscripciones de tus organizaciones aparecerán aquí."
            />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTIONS.map((subscription) => (
              <li key={subscription.id}>
                <SubscriptionCard subscription={subscription} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="facturas-title">
        <h2 id="facturas-title" className="text-base font-medium">
          Facturas
        </h2>

        {INVOICES.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border">
            <EmptyState
              icon={ReceiptText}
              title="Sin facturas"
              description="Las facturas de tus organizaciones aparecerán aquí."
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-md border border-border bg-card">
            <table className="w-full min-w-140 text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase font-medium">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Número
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Organización
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Período
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Monto
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Vencimiento
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Descargar
                  </th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="text-nowrap px-4 py-3 tabular-nums">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-md font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        {invoice.number}
                        <Eye className="size-3.5 text-muted-foreground" />
                      </button>
                    </td>
                    <td className="text-nowrap px-4 py-3">{invoice.orgName}</td>
                    <td className="text-nowrap px-4 py-3">{invoice.period}</td>
                    <td className="text-nowrap px-4 py-3 tabular-nums font-medium">
                      {invoice.amount}
                    </td>
                    <td className="text-nowrap px-4 py-3">
                      <InvoiceStatusChip status={invoice.status} />
                    </td>
                    <td className="text-nowrap px-4 py-3 text-muted-foreground">
                      {invoice.dueDate}
                    </td>
                    <td className="text-nowrap px-4 py-3 text-right">
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
