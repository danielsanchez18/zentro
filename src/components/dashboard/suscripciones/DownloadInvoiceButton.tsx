"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";

interface DownloadInvoiceButtonProps {
  invoiceNumber: string;
  invoiceId: string;
  pdfUrl?: string;
}

export const DownloadInvoiceButton = ({
  invoiceNumber,
  invoiceId,
  pdfUrl,
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

    // Modo mock: simula la generación/descarga del PDF.
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
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full h-fit py-1.5 px-3"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          Descargando
        </>
      ) : (
        <>
          <Download className="size-3.5" />
          Descargar
        </>
      )}
    </Button>
  );
};
