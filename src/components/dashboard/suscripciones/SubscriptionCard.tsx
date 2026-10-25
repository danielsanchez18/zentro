"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusChip } from "@/components/dashboard/overview/StatusChip";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import type { Subscription } from "@/components/dashboard/suscripciones/types";
import { hubButton, hubChip } from "@/components/dashboard/shared/styles";

const METRICS = [
  { key: "users", label: "Usuarios" },
  { key: "branches", label: "Sucursales" },
] as const;

export const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => {
  return (
    <article className="flex h-full flex-col gap-4 rounded-sm border border-border p-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
            <CompanyIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{subscription.orgName}</h3>
            <p className="text-sm text-muted-foreground">Plan {subscription.plan}</p>
          </div>
        </div>
        <StatusChip status={subscription.status} />
      </div>

      <div className="rounded-sm bg-muted/60 px-3 py-2.5">
        <p className="text-lg font-medium tabular-nums">
          {subscription.price}
          <span className="text-sm font-normal text-muted-foreground"> / mes</span>
        </p>
        <p className="text-sm text-muted-foreground">{subscription.period}</p>
      </div>

      <ul className="space-y-3 px-1">
        {METRICS.map((metric) => {
          const usage = subscription.usage[metric.key];
          const percentage = Math.min(100, Math.round((usage.used / usage.limit) * 100));
          return (
            <li key={metric.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="tabular-nums">
                  {usage.used}/{usage.limit}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full", percentage >= 100 ? "bg-amber-500" : "bg-hub-accent")}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex items-center gap-1.5">
        <span className={cn(hubChip, "mr-auto bg-muted text-muted-foreground")}>
          <CalendarClock className="size-3.5" />
          {subscription.nextCharge}
        </span>
        <Link
          href={`/app/${subscription.slug}/configuracion/facturacion`}
          className={hubButton.primary}
        >
          Gestionar
        </Link>
      </div>
    </article>
  );
};
