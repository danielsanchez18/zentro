import type { Invoice } from "@/lib/mock/billing";

interface InvoiceTemplatePreviewProps {
  type: "boleta" | "factura";
  config: {
    businessName: string;
    ruc: string;
    address: string;
    logo?: string;
  };
  invoice?: Invoice;
}

export function InvoiceTemplatePreview({
  type,
  config,
  invoice,
}: InvoiceTemplatePreviewProps) {
  const fallbackData = {
    number: type === "boleta" ? "B001-0015" : "F001-0008",
    date: "22/09/2026",
    customer: {
      name: type === "factura" ? "Empresa S.A.C." : "Juan Pérez",
      document: type === "factura" ? "RUC: 20598765432" : "DNI: 70123456",
    },
    items: [
      { name: "Ají de gallina", qty: 2, price: 32, total: 64 },
      { name: "Inca Kola 500ml", qty: 2, price: 5, total: 10 },
    ],
    subtotal: 74,
    igv: 13.32,
    total: 87.32,
  };

  const data = invoice
    ? {
        number: invoice.number,
        date: new Intl.DateTimeFormat("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(invoice.issuedAt)),
        customer: {
          name: invoice.customer.name,
          document: `${invoice.customer.documentType.toUpperCase()}: ${invoice.customer.documentNumber}`,
        },
        items: invoice.items.map((item) => ({
          name: item.productName,
          qty: item.quantity,
          price: item.unitPrice,
          total: item.subtotal,
        })),
        subtotal: invoice.subtotal,
        igv: invoice.igv,
        total: invoice.total,
      }
    : fallbackData;

  return (
    <div className="rounded-lg border border-border bg-white p-4 text-black text-xs font-heading">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-3 mb-3">
        {config.logo ? (
          <img
            src={config.logo}
            alt="Logo"
            className="h-8 mx-auto mb-2 object-contain"
          />
        ) : (
          <div className="h-8 w-8 mx-auto mb-2 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
            LOGO
          </div>
        )}
        <p className="font-bold font-heading text-sm">
          {config.businessName || "Tu Empresa"}
        </p>
        <p className="text-gray-600">RUC: {config.ruc || "00000000000"}</p>
        <p className="text-gray-600">{config.address || "Dirección fiscal"}</p>
      </div>

      {/* Comprobante info */}
      <div className="flex justify-between mb-3">
        <div>
          <p className="font-bold">
            {type === "boleta" ? "BOLETA DE VENTA" : "FACTURA"}
          </p>
          <p className="text-gray-600 tabular-nums">{data.number}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 tabular-nums">Fecha: {data.date}</p>
        </div>
      </div>

      {/* Cliente */}
      <div className="mb-3 tabular-nums">
        <p className="text-gray-600">
          {type === "factura" ? "Razón Social:" : "Cliente:"}{" "}
          {data.customer.name}
        </p>
        <p className="text-gray-600">{data.customer.document}</p>
      </div>

      {/* Items */}
      <table className="w-full mb-3">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-1.5">Descripción</th>
            <th className="text-center py-1 w-8">Cant.</th>
            <th className="text-right py-1 w-fit">P.Unit.</th>
            <th className="text-right py-1 w-fit">Total</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {data.items.map((item, i) => (
            <tr key={i} className="">
              <td className="py-1 truncate max-w-30">{item.name}</td>
              <td className="text-center py-1">{item.qty}</td>
              <td className="text-right py-1">S/ {item.price.toFixed(2)}</td>
              <td className="text-right py-1">S/ {item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div className="border-t border-gray-200 pt-2 tabular-nums space-y-1.5">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>S/. {data.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>IGV (18%):</span>
          <span>S/. {data.igv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm mt-1">
          <span>TOTAL:</span>
          <span>S/. {data.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-[10px] mt-4 border-t border-gray-200 pt-2">
        <p>
          Representación impresa de la{" "}
          {type === "boleta" ? "Boleta de Venta" : "Factura"}
        </p>
        <p>Documento electrónico emitido en SUNAT</p>
      </div>
    </div>
  );
}
