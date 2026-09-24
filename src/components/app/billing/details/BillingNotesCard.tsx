"use client";

import { FileMinus, FilePlus } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { invoiceNoteReasonLabel, type InvoiceNote } from "@/lib/mock/billing";
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

interface BillingNotesCardProps {
  notes: InvoiceNote[];
}

export function BillingNotesCard({ notes }: BillingNotesCardProps) {
  if (notes.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Notas de crédito / débito
          </h2>
        </div>
        <span className="rounded-md bg-muted px-2.5 py-1.5 leading-none text-xs font-medium text-foreground">
          {notes.length} {notes.length === 1 ? "nota" : "notas"}
        </span>
      </header>

      <div className="px-5 py-2 divide-y divide-border">
        {notes.map((note) => {
          const isCredit = note.type === "credito";
          const Icon = isCredit ? FileMinus : FilePlus;

          return (
            <div key={note.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      isCredit
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {note.number}
                      </span>
                      <StatusBadge
                        status={isCredit ? "info" : "warning"}
                        label={isCredit ? "Nota de crédito" : "Nota de débito"}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      Motivo:{" "}
                      <span className="font-medium text-foreground">
                        {invoiceNoteReasonLabel(note.reason)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      isCredit
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {isCredit ? "−" : "+"}
                    {money.format(note.amount)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {date(note.issuedAt)}
                  </p>
                </div>
              </div>

              {note.notes && (
                <div className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Observación:
                  </span>{" "}
                  {note.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
