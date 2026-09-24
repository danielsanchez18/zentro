import {
  CircleDollarSign,
  FileCheck,
  FileX,
  FileText,
  TrendingDown,
} from "lucide-react";
import type { Invoice, InvoiceNote } from "@/lib/mock/billing";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function BillingKpis({
  invoices,
  notes,
}: {
  invoices: Invoice[];
  notes: InvoiceNote[];
}) {
  const today = new Date().toDateString();
  const todayInvoices = invoices.filter(
    (inv) => new Date(inv.issuedAt).toDateString() === today,
  );

  const validInvoices = invoices.filter((inv) => inv.status !== "anulado");
  const totalEmitted = validInvoices.reduce((sum, inv) => sum + inv.total, 0);

  // Las notas de crédito reducen lo emitido (regla 23-26); las de débito lo aumentan.
  const creditTotal = notes
    .filter((note) => note.type === "credito")
    .reduce((sum, note) => sum + note.amount, 0);
  const debitTotal = notes
    .filter((note) => note.type === "debito")
    .reduce((sum, note) => sum + note.amount, 0);
  const netEmitted = Math.max(0, totalEmitted - creditTotal + debitTotal);

  const totalToday = todayInvoices
    .filter((inv) => inv.status !== "anulado")
    .reduce((sum, inv) => sum + inv.total, 0);

  const stats = [
    {
      title: "Total emitido",
      value: money.format(netEmitted),
      subtitle:
        netEmitted !== totalEmitted
          ? `Bruto ${money.format(totalEmitted)}`
          : "Comprobantes válidos",
      icon: CircleDollarSign,
    },
    {
      title: "Emitidos hoy",
      value: String(
        todayInvoices.filter((inv) => inv.status !== "anulado").length,
      ),
      subtitle: money.format(totalToday),
      icon: FileText,
    },
    {
      title: "Pendientes envío",
      value: String(invoices.filter((inv) => inv.status === "emitido").length),
      subtitle: "Sin enviar por correo",
      icon: FileCheck,
    },
    {
      title: "Anulados",
      value: String(invoices.filter((inv) => inv.status === "anulado").length),
      subtitle: "Comprobantes anulados",
      icon: FileX,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ title, value, subtitle, icon: Icon }) => (
        <article
          key={title}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
        >
          <div className="flex items-center justify-between text-primary/70">
            <p className="text-sm">{title}</p>
            <Icon className="size-4.5" />
          </div>
          <p className="mt-2 text-xl font-medium tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-primary/70">{subtitle}</p>
        </article>
      ))}
    </section>
  );
}