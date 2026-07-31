"use client";

import { ArrowUpRight, Building2 } from "lucide-react";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import type { Subscription } from "@/components/dashboard/suscripciones/types";

const METRICS = [
  { key: "users", label: "Usuarios" },
  { key: "branches", label: "Sucursales" },
] as const;

export const SubscriptionCard = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Building2 className="size-5" />
        </div>
        <StatusChip status={subscription.status} />
      </div>

      <h3 className="mt-4 text-base font-medium">{subscription.orgName}</h3>
      <p className="text-sm text-muted-foreground">
        Plan {subscription.plan} · {subscription.period}
      </p>

      <p className="mt-4 text-lg font-medium">
        {subscription.price}
        <span className="text-sm text-muted-foreground"> / mes</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Próximo cobro: {subscription.nextCharge}
      </p>

      <ul className="mt-4 space-y-2.5">
        {METRICS.map((metric) => {
          const usage = subscription.usage[metric.key];
          const percentage = Math.min(
            100,
            Math.round((usage.used / usage.limit) * 100),
          );
          return (
            <li key={metric.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="tabular-nums">
                  {usage.used}/{usage.limit}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <a
        href={`/app/${subscription.slug}/configuracion/facturacion`}
        className="mt-auto inline-flex items-center gap-1 pt-4 text-sm w-fit font-medium hover:underline"
      >
        Gestionar <ArrowUpRight className="size-3.5" />
      </a>
    </article>
  );
};
