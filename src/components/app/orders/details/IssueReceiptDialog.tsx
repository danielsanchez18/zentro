"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Building2, FileText, Mail, MapPin, Receipt, User } from "lucide-react";
import type { CustomerOrder, OrderReceipt } from "@/lib/mock/orders";
import { crmCustomers, customerPrimaryAddress } from "@/lib/mock/crm";
import type { BillingConfig } from "@/lib/mock/billing";

type ReceiptDraft = Pick<
  OrderReceipt,
  "type" | "customerDocument" | "businessName"
> & {
  customerName?: string;
  customerAddress?: string;
  customerEmail?: string;
};

interface IssueReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (receipt: ReceiptDraft) => void;
  order: CustomerOrder;
  config: BillingConfig;
}

/** La config fiscal del negocio debe estar completa para emitir factura (regla 49). */
const isFiscalReady = (config: BillingConfig) =>
  Boolean(
    config.businessName.trim() && config.ruc.trim() && config.address.trim(),
  );

export function IssueReceiptDialog({
  open,
  onOpenChange,
  onConfirm,
  order,
  config,
}: IssueReceiptDialogProps) {
  const [type, setType] = useState<OrderReceipt["type"]>("boleta");
  const [document, setDocument] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [customerName, setCustomerName] = useState(order.customerName);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(order.customerEmail ?? "");

  // Busca el cliente del pedido en el CRM para heredar sus datos fiscales (regla 19).
  const crmCustomer = useMemo(() => {
    const byEmail = crmCustomers.find(
      (customer) =>
        order.customerEmail &&
        customer.email.toLowerCase() === order.customerEmail.toLowerCase(),
    );
    if (byEmail) return byEmail;
    return crmCustomers.find(
      (customer) =>
        customer.name.toLowerCase() === order.customerName.toLowerCase(),
    );
  }, [order.customerEmail, order.customerName]);

  useEffect(() => {
    if (!open) return;
    setType("boleta");
    setDocument("");
    setBusinessName("");
    setCustomerName(order.customerName);
    setEmail(order.customerEmail ?? "");
    setAddress("");

    if (crmCustomer?.documentNumber) {
      const docType = crmCustomer.documentType ?? "DNI";
      setType(docType === "RUC" ? "factura" : "boleta");
      setDocument(crmCustomer.documentNumber);
      if (docType === "RUC") setBusinessName(crmCustomer.name);
    }
    const primary = crmCustomer
      ? customerPrimaryAddress(crmCustomer)
      : undefined;
    setAddress(
      crmCustomer
        ? [primary?.address, primary?.district, primary?.city]
            .filter(Boolean)
            .join(", ") || ""
        : "",
    );
  }, [open, order, crmCustomer]);

  const fiscalReady = isFiscalReady(config);
  const isFactura = type === "factura";
  const validDocument = isFactura
    ? /^\d{11}$/.test(document.trim()) && document.startsWith("2")
    : /^\d{8}$/.test(document.trim()) || /^2\d{10}$/.test(document.trim());

  // Requisitos faltantes para poder emitir (se muestran al usuario, reglas 15-16 y 45-49)
  const missingRequirements: string[] = [];
  if (isFactura && !fiscalReady) {
    missingRequirements.push(
      "Completar la configuración fiscal del negocio (RUC, razón social y dirección en Facturación → Configuración)",
    );
  }
  if (!validDocument) {
    missingRequirements.push(
      isFactura
        ? "Registrar el RUC del cliente (11 dígitos que inician en 2)"
        : "Registrar el DNI (8 dígitos) o RUC (11 dígitos) del cliente",
    );
  }
  if (isFactura && businessName.trim().length <= 2) {
    missingRequirements.push("Registrar la razón social del cliente");
  }
  if (isFactura && address.trim().length <= 2) {
    missingRequirements.push("Registrar la dirección fiscal del cliente");
  }
  if (!isFactura && customerName.trim().length <= 1) {
    missingRequirements.push("Registrar el nombre completo del cliente");
  }

  const invoiceValid = missingRequirements.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] sm:max-w-lg flex flex-col">
        <DialogHeader>
          <DialogTitle>Emitir comprobante</DialogTitle>
          <DialogDescription>
            Registra los datos fiscales del comprobante del pedido{" "}
            {order.number}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 font-heading overflow-y-auto"
        >
          {isFactura && !fiscalReady && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              La configuración fiscal del negocio está incompleta. Completa RUC,
              razón social y dirección en{" "}
              <span className="font-medium">Facturación → Configuración</span>{" "}
              antes de emitir una factura.
            </div>
          )}

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={type === "boleta" ? "default" : "outline"}
                onClick={() => setType("boleta")}
                className="cursor-pointer"
              >
                Boleta de venta
              </Button>
              <Button
                type="button"
                variant={type === "factura" ? "default" : "outline"}
                onClick={() => setType("factura")}
                className="cursor-pointer"
              >
                Factura
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="receipt-document" className="text-sm font-medium">
              {isFactura ? "RUC del cliente" : "DNI o RUC"}
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="receipt-document"
                value={document}
                onChange={(event) =>
                  setDocument(event.target.value.replace(/\D/g, ""))
                }
                maxLength={11}
                placeholder={
                  isFactura ? "RUC de 11 dígitos" : "DNI (8) o RUC (11)"
                }
                inputMode="numeric"
                className="px-4 h-fit py-2 pl-10 text-sm"
              />
            </div>
          </div>

          {isFactura ? (
            <>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="business-name" className="text-sm font-medium">
                  Razón social
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="business-name"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Nombre fiscal"
                    className="px-4 h-fit py-2 pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="fiscal-address" className="text-sm font-medium">
                  Dirección fiscal
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fiscal-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Dirección registrada en SUNAT"
                    className="px-4 h-fit py-2 pl-10 text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-y-2">
              <label htmlFor="customer-name" className="text-sm font-medium">
                Nombre completo
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Nombre del cliente"
                  className="px-4 h-fit py-2 pl-10 text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-y-2">
            <label htmlFor="receipt-email" className="text-sm font-medium">
              Correo para envío{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="receipt-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="cliente@email.com"
                className="px-4 h-fit py-2 pl-10 text-sm"
              />
            </div>
          </div>

          {!invoiceValid && (
            <div className="rounded-lg border border-border bg-accent/40 px-3 py-2.5 text-sm">
              <p className="font-medium text-foreground">
                Faltan datos para emitir el comprobante
              </p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                {missingRequirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            disabled={!invoiceValid}
            onClick={() =>
              onConfirm({
                type,
                customerDocument: document.trim() || undefined,
                businessName: isFactura ? businessName.trim() : undefined,
                customerName: isFactura ? undefined : customerName.trim(),
                customerAddress: isFactura ? address.trim() : undefined,
                customerEmail: email.trim() || undefined,
              })
            }
            className="rounded-full"
          >
            Emitir comprobante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
