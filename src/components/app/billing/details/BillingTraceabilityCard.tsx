"use client";

import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import type { Invoice } from "@/lib/mock/billing";
import { cn } from "@/lib/utils";

interface BillingTraceabilityCardProps {
  invoice: Invoice;
  slug: string;
}

const formatDateTime = (value?: string) => {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export function BillingTraceabilityCard({
  invoice,
  slug,
}: BillingTraceabilityCardProps) {
  const events = [
    {
      id: "issued",
      title: "Comprobante emitido",
      date: invoice.issuedAt,
      current: invoice.status === "emitido",
    },
    ...(invoice.sentAt
      ? [
          {
            id: "sent",
            title: "Enviado a SUNAT y cliente",
            date: invoice.sentAt,
            current: invoice.status === "enviado",
          },
        ]
      : []),
    ...(invoice.paidAt
      ? [
          {
            id: "paid",
            title: "Pago acreditado",
            date: invoice.paidAt,
            current: invoice.status === "pagado",
          },
        ]
      : []),
    ...(invoice.status === "anulado"
      ? [
          {
            id: "annulled",
            title: "Comprobante anulado",
            date: invoice.annulledAt ?? invoice.createdAt,
            current: true,
            isAnulado: true,
            reason: invoice.annulledReason,
          },
        ]
      : []),
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-medium text-foreground">
          Trazabilidad y auditoría
        </h2>
      </header>

      <div className="p-4 space-y-4 text-sm">
        {/* Enlace al pedido */}
        <Link
          href={`/app/${slug}/pedidos`}
          className="flex items-center justify-between group hover:bg-accent/50"
        >
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-2.5 bg-accent">
              <Package className="size-4.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Pedido de origen
              </p>
              <p className="font-mono text-sm font-medium text-foreground">
                {invoice.orderNumber}
              </p>
            </div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary" />
        </Link>

        {/* Sesión de caja */}
        {invoice.sessionId && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <span>Sesión de caja:</span>
            <span className="font-mono font-medium text-foreground">
              #{invoice.sessionId}
            </span>
          </div>
        )}

        <div className="h-px bg-border w-full" />

        {/* Registro cronológico vertical estilo OrderTimeline */}
        <div className="space-y-0 pl-1 pt-1">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            return (
              <div
                key={event.id}
                className="relative flex gap-3 pl-5 pb-5 last:pb-1"
              >
                {!isLast && (
                  <span className="absolute left-1 top-3.5 h-[calc(100%-0.35rem)] w-px bg-border" />
                )}
                <span
                  className={cn(
                    "absolute left-0 top-1.5 size-2 rounded-full ring-4 ring-card",
                    event.isAnulado
                      ? "bg-rose-500"
                      : event.current
                        ? "bg-primary"
                        : "bg-muted-foreground/65",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {event.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(event.date)}
                  </p>
                  {event.reason && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Motivo:</span>{" "}
                      {event.reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
