"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toastMsg } from "@/components/ui/toast-message";
import { hubButton } from "@/components/dashboard/shared/styles";

interface DownloadInvoiceButtonProps {
  invoiceNumber: string;
  invoiceId: string;
  pdfUrl?: string;
  /** "primary" en el detalle de factura; "secondary" en la tabla. */
  tone?: "primary" | "secondary";
}

export const DownloadInvoiceButton = ({
  invoiceNumber,
  invoiceId,
  pdfUrl,
  tone = "secondary",
}: DownloadInvoiceButtonProps) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (pdfUrl) {
      // TODO(0.2): cuando el backend entregue el PDF real, abrir/download de la URL.
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastMsg.success("Factura descargada", `${invoiceNumber} se descargó.`);
      return;
    }

    // Prototipo local: simula la generación y descarga del PDF.
    setDownloading(true);
    window.setTimeout(() => {
      setDownloading(false);
      toastMsg.success(
        "Factura descargada",
        `${invoiceNumber} se descargó (simulado).`,
      );
    }, 600);
  };

  return (
    <button
      type="button"
      className={hubButton[tone]}
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <>
          <Loader2 className="animate-spin" />
          Descargando
        </>
      ) : (
        <>
          <Download />
          Descargar
        </>
      )}
    </button>
  );
};
