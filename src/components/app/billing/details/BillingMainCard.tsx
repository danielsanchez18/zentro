"use client";

import type { ReactNode } from "react";
import {
  Ban,
  Check,
  CircleArrowRight,
  Coins,
  Package,
  Receipt,
  Vault,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import {
  invoiceTypeLabel,
  invoiceStatusLabel,
  type Invoice,
  type InvoiceStatus,
} from "@/lib/mock/billing";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const dateTime = (value?: string) => {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

interface InvoiceStep {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
  isAnulado?: boolean;
  time?: string;
}

interface BillingMainCardProps {
  invoice: Invoice;
}

export function BillingMainCard({ invoice }: BillingMainCardProps) {
  const statusVariant = (status: InvoiceStatus) => {
    switch (status) {
      case "pagado":
        return "success";
      case "emitido":
        return "warning";
      case "enviado":
        return "info";
      case "anulado":
        return "error";
      default:
        return "default";
    }
  };

  const isAnulado = invoice.status === "anulado";

  const standardSteps: InvoiceStep[] = [
    {
      key: "emitido",
      label: "Comprobante emitido",
      completed: true,
      current: invoice.status === "emitido",
      time: invoice.issuedAt,
    },
    {
      key: "enviado",
      label: "Enviado a SUNAT",
      completed: invoice.status === "enviado" || invoice.status === "pagado",
      current: invoice.status === "enviado",
      time: invoice.sentAt,
    },
    {
      key: "pagado",
      label: "Comprobante pagado",
      completed: invoice.status === "pagado",
      current: invoice.status === "pagado",
      time: invoice.paidAt,
    },
  ];

  const anuladoSteps: InvoiceStep[] = [
    {
      key: "emitido",
      label: "Comprobante emitido",
      completed: true,
      current: false,
      time: invoice.issuedAt,
    },
    {
      key: "anulado",
      label: "Comprobante anulado",
      completed: true,
      current: true,
      isAnulado: true,
      time: invoice.annulledAt,
    },
  ];

  const steps = isAnulado ? anuladoSteps : standardSteps;
  const currentIndex = steps.findIndex((s) => s.current);
  const currentStep =
    currentIndex >= 0 ? steps[currentIndex] : steps[steps.length - 1];
  const nextStep =
    currentIndex >= 0 && currentIndex < steps.length - 1
      ? steps[currentIndex + 1]
      : null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      {/* Resumen superior */}
      <div className="grid gap-4 bg-muted/45 px-5 py-4 grid-cols-2 xl:grid-cols-4">
        <SummaryItem label="Estado">
          <div className="mt-1">
            <StatusBadge
              status={statusVariant(invoice.status)}
              label={invoiceStatusLabel(invoice.status)}
            />
          </div>
        </SummaryItem>
        <SummaryItem label="Comprobante">
          <p className="mt-2 font-mono text-sm font-medium">{invoice.number}</p>
        </SummaryItem>
        <SummaryItem label="Fecha de emisión">
          <p className="mt-2 text-sm font-medium">{date(invoice.issuedAt)}</p>
        </SummaryItem>
        <SummaryItem label="Total">
          <p className="mt-2 text-sm font-medium tabular-nums">
            {money.format(invoice.total)}
          </p>
        </SummaryItem>
      </div>

      <div className="px-5">
        {/* Fila de metadatos rápidos */}
        <div className="grid gap-3 border-b border-border py-4 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 text-sm">
            <Receipt className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium text-foreground">
              {invoiceTypeLabel(invoice.type)} electrónica
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <Package className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Pedido de origen:</span>
            <span className="font-medium font-mono text-foreground">
              {invoice.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <Coins className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Moneda:</span>
            <span className="font-medium text-foreground">
              {invoice.currency === "PEN" ? "Soles (S/)" : invoice.currency}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <Vault className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Sesión de caja:</span>
            <span className="font-medium text-foreground">
              {invoice.sessionId
                ? `#${invoice.sessionId}`
                : "Mostrador general"}
            </span>
          </div>
        </div>

        {/* Línea de tiempo - Pantallas medianas y grandes */}
        <div className="hidden py-5 md:block">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step) => {
              const isPastCompleted = step.completed && !step.current;
              const isCurrent = step.current;
              const isFilled = step.completed || step.current;

              return (
                <div key={step.key} className="flex flex-col gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium truncate",
                      step.isAnulado
                        ? "text-rose-500 font-medium"
                        : isCurrent
                          ? "font-medium text-foreground"
                          : isPastCompleted
                            ? "text-foreground"
                            : "text-muted-foreground/60",
                    )}
                  >
                    {step.isAnulado ? (
                      <Ban className="size-3.5 shrink-0 stroke-[2.5] text-rose-500" />
                    ) : isPastCompleted ? (
                      <Check className="size-3.5 shrink-0 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
                    ) : null}
                    <span className="truncate">{step.label}</span>
                  </div>

                  <div
                    className={cn(
                      "h-1 w-full rounded-full transition-colors",
                      step.isAnulado
                        ? "bg-rose-500"
                        : isFilled
                          ? "bg-foreground"
                          : "bg-muted",
                    )}
                  />

                  {step.time && (
                    <span className="text-sm text-muted-foreground">
                      {dateTime(step.time)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Línea de tiempo compacta - Mobile */}
        <div className="py-4 md:hidden">
          <p className="text-sm font-medium text-foreground">
            Estado del comprobante
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
              <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              <span className="truncate">{currentStep.label}</span>
            </div>
            {nextStep && (
              <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                <CircleArrowRight className="size-3.5 shrink-0" />
                <span className="truncate">{nextStep.label}</span>
              </div>
            )}
          </div>
          <div className="mt-2.5 flex gap-2">
            {steps.map((step) => (
              <div
                key={step.key}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step.isAnulado
                    ? "bg-rose-500"
                    : step.completed || step.current
                      ? "bg-foreground"
                      : "bg-muted",
                )}
              />
            ))}
          </div>
          {isAnulado && invoice.annulledReason && (
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
              Motivo: {invoice.annulledReason}
            </p>
          )}
        </div>

        {/* Mensaje de anulación si aplica */}
        {isAnulado && (
          <div className="border-t border-border py-4">
            <div className="rounded-lg bg-accent px-3 py-2.5 text-sm">
              <span className="font-semibold">Comprobante dado de baja:</span>{" "}
              {invoice.annulledReason ?? "Anulado sin motivo especificado"}.
              {invoice.annulledAt && (
                <span className="ml-1">({dateTime(invoice.annulledAt)})</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
