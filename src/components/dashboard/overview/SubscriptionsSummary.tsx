"use client";

import Link from "next/link";
import { CalendarClock, CreditCard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import { getSubscriptionSummaries } from "@/lib/mock/dashboard";

/**
 * Resumen de suscripciones (solo lectura).
 * TODO(0.2): leer desde `GET /users/me/subscriptions`.
 */
export const SubscriptionsSummary = () => {
  const subscriptions = getSubscriptionSummaries();

  return (
    <section
      data-demo="subscriptions"
      aria-labelledby="suscripciones-title"
      className="rounded-sm bg-card px-4 py-3 space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="suscripciones-title" className="font-sans text-base font-medium">
            Suscripciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Planes y próximos cobros de tus organizaciones.
          </p>
        </div>
        <Link
          href="/dashboard/suscripciones"
          className="rounded-sm bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
        >
          Ver todas
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border">
          <EmptyState
            icon={CreditCard}
            title="Sin suscripciones"
            description="Las suscripciones de tus organizaciones aparecerán aquí."
          />
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {subscriptions.map((subscription) => (
            <li key={subscription.id} className="flex flex-col gap-3 rounded-sm border border-border p-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
                    <CompanyIcon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{subscription.orgName}</p>
                    <p className="text-sm text-muted-foreground">Plan {subscription.plan}</p>
                  </div>
                </div>
                <StatusChip status={subscription.status} />
              </div>
              <span className="inline-flex h-8 w-fit items-center gap-1.5 rounded-sm bg-muted px-2.5 text-[13px] font-medium text-muted-foreground">
                <CalendarClock className="size-3.5" />
                Próximo cobro: {subscription.nextCharge}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
