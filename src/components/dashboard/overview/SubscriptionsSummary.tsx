"use client";

import { ArrowUpRight, CreditCard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import { Button } from "@/components/ui/button";

/**
 * Resumen de suscripciones (solo lectura).
 * TODO(0.2): leer desde `GET /users/me/subscriptions`.
 */
interface Subscription {
  id: string;
  orgName: string;
  plan: string;
  status: "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  nextCharge: string;
}

const SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_001",
    orgName: "Las Rocas Restaurante",
    plan: "Esencial",
    status: "TRIAL",
    nextCharge: "31 de agosto",
  },
];

export const SubscriptionsSummary = () => {
  return (
    <section aria-labelledby="suscripciones-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="suscripciones-title" className="text-base font-medium">
          Suscripciones
        </h2>
        <a
          href="/dashboard/suscripciones"
          className="rounded-full"
        >
          <Button variant="outline" className="text-sm px-3 py-2 rounded-full">
            Ver todas
          </Button>
        </a>
      </div>

      {SUBSCRIPTIONS.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={CreditCard}
            title="Sin suscripciones"
            description="Las suscripciones de tus organizaciones aparecerán aquí."
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {SUBSCRIPTIONS.map((subscription) => (
              <li
                key={subscription.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div className="flex gap-3">
                  <div className="flex mt-0.5 size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <p className="text-base font-medium">{subscription.orgName}</p>
                    <p className="text-sm text-muted-foreground">
                      Próximo cobro: {subscription.nextCharge}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Plan {subscription.plan}
                  </span>
                  <StatusChip status={subscription.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
