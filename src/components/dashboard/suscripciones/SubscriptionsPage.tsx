"use client";

import { CreditCard, ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SubscriptionCard } from "@/components/dashboard/suscripciones/SubscriptionCard";
import { InvoiceStatusChip } from "@/components/dashboard/suscripciones/InvoiceStatusChip";
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

const INVOICES: Invoice[] = [
  {
    id: "inv_004",
    number: "INV-0004",
    orgName: "Café del Valle",
    period: "Julio 2026",
    amount: "S/ 99.00",
    status: "PAID",
    dueDate: "15 jul",
  },
  {
    id: "inv_003",
    number: "INV-0003",
    orgName: "Fonda La Abuela",
    period: "Julio 2026",
    amount: "S/ 49.00",
    status: "PAID",
    dueDate: "1 jul",
  },
  {
    id: "inv_002",
    number: "INV-0002",
    orgName: "Café del Valle",
    period: "Junio 2026",
    amount: "S/ 99.00",
    status: "PAID",
    dueDate: "15 jun",
  },
  {
    id: "inv_001",
    number: "INV-0001",
    orgName: "Fonda La Abuela",
    period: "Junio 2026",
    amount: "S/ 49.00",
    status: "OPEN",
    dueDate: "1 jul",
  },
];

export const SubscriptionsPage = () => {
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
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="text-nowrap px-4 py-3 tabular-nums">
                      {invoice.number}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
