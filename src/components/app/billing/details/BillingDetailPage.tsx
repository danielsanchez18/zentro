"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useBillingStore } from "@/stores/billing-store";
import { AnnulInvoiceDialog } from "./AnnulInvoiceDialog";
import { BillingCustomerInfo } from "./BillingCustomerInfo";
import { BillingDetailActions } from "./BillingDetailActions";
import { BillingDetailHeader } from "./BillingDetailHeader";
import { BillingItems } from "./BillingItems";
import { BillingMainCard } from "./BillingMainCard";
import { BillingNotesCard } from "./BillingNotesCard";
import { BillingTraceabilityCard } from "./BillingTraceabilityCard";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";
import { InvoiceNoteDialog } from "@/components/app/billing/dialogs/InvoiceNoteDialog";

export function BillingDetailPage({
  slug,
  invoiceId,
}: {
  slug: string;
  invoiceId: string;
}) {
  const router = useRouter();
  const [annulOpen, setAnnulOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const invoices = useBillingStore((state) => state.invoices);
  const notes = useBillingStore((state) => state.notes);
  const updateInvoiceStatus = useBillingStore(
    (state) => state.updateInvoiceStatus,
  );

  const invoice = useMemo(
    () => invoices.find((inv) => inv.id === invoiceId),
    [invoices, invoiceId],
  );

  const invoiceNotes = useMemo(
    () => notes.filter((n) => n.invoiceId === invoiceId),
    [notes, invoiceId],
  );

  const back = `/app/${slug}/facturacion`;

  if (!invoice) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <Button
          type="button"
          variant="link"
          className="px-0 h-fit cursor-pointer"
          onClick={() => router.push(back)}
        >
          Regresar a facturación
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este comprobante de pago.
        </div>
      </div>
    );
  }

  const handleSend = () => {
    updateInvoiceStatus(invoice.id, "enviado");
    toastMsg.success(
      "Comprobante enviado",
      `Se envió ${invoice.number} a SUNAT y al cliente con éxito.`,
    );
  };

  const handleMarkPaid = () => {
    updateInvoiceStatus(invoice.id, "pagado");
    toastMsg.success(
      "Pago acreditado",
      `Se acreditó el pago del comprobante ${invoice.number}.`,
    );
  };

  const handleDownload = () => {
    toastMsg.success(
      "Descarga iniciada",
      `Descargando representación impresa en PDF de ${invoice.number}.`,
    );
  };

  const handleAnnul = (reason: string, note?: string) => {
    const fullReason = note ? `${reason}: ${note}` : reason;
    updateInvoiceStatus(invoice.id, "anulado", fullReason);
    toastMsg.info(
      "Comprobante anulado",
      `${invoice.number} ha sido dado de baja en el sistema.`,
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10 font-heading">
      {/* Cabecera de la página */}
      <BillingDetailHeader
        invoice={invoice}
        slug={slug}
        onSend={handleSend}
        onDownload={handleDownload}
        onPreview={() => setPreviewOpen(true)}
        onNote={() => setNoteOpen(true)}
        onAnnul={() => setAnnulOpen(true)}
      />

      {/* Cuadrícula principal y barra lateral estilo OrderDetailPage */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.75fr)] relative">
        <div className="space-y-5">
          <BillingMainCard invoice={invoice} />
          <BillingItems invoice={invoice} notes={invoiceNotes} />
          <BillingNotesCard notes={invoiceNotes} />
        </div>

        <aside className="h-fit space-y-5 xl:sticky xl:top-5">
          <BillingCustomerInfo customer={invoice.customer} />
          <BillingTraceabilityCard invoice={invoice} slug={slug} />
        </aside>
      </div>

      {/* Barra de acción flotante Toast inferior con solo 2 opciones principales */}
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <BillingDetailActions
          status={invoice.status}
          onSend={handleSend}
          onDownload={handleDownload}
          onAnnul={() => setAnnulOpen(true)}
          onMarkPaid={handleMarkPaid}
        />
      </div>

      {/* Diálogo para anular comprobante */}
      <AnnulInvoiceDialog
        open={annulOpen}
        onOpenChange={setAnnulOpen}
        invoiceNumber={invoice.number}
        onConfirm={handleAnnul}
      />

      {/* Diálogo para emitir nota de crédito/débito */}
      <InvoiceNoteDialog
        open={noteOpen}
        onOpenChange={setNoteOpen}
        invoice={invoice}
      />

      {/* Diálogo de vista previa con la plantilla del comprobante */}
      <InvoicePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        invoice={invoice}
        onDownload={handleDownload}
      />
    </div>
  );
}
