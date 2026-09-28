"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, Users, Wallet } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { crmCustomers } from "@/lib/mock/crm";
import { cn } from "@/lib/utils";
import { ReportSection, money, shortDate } from "./shared";

export interface ClientTopItem {
  id: string;
  name: string;
  kind: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderAt?: string;
}

interface TopClientsSectionProps {
  top: ClientTopItem[];
  newCount?: number;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function TopClientsSection({
  top,
  newCount = 0,
  className,
}: TopClientsSectionProps) {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : null;

  const maxSpent = Math.max(1, ...top.map((c) => c.totalSpent));

  return (
    <ReportSection
      title="Top clientes"
      className={cn("h-full", className)}
      subtitle={`${newCount} nuevo${newCount === 1 ? "" : "s"} en el período`}
    >
      {top.length === 0 ? (
        <div className="flex flex-1 items-center justify-center my-auto w-full min-h-55">
          <EmptyState
            icon={Users}
            title="Sin clientes registrados"
            description="No hay compras registradas por clientes en este período."
            className="py-6 my-auto"
          />
        </div>
      ) : (
        <div className="grid gap-4 min-w-0 w-full max-w-full">
          {top.map((customer, index) => {
            const crmCustomer = crmCustomers.find((c) => c.id === customer.id);

            const handleOpen = () => {
              if (slug) router.push(`/app/${slug}/clientes/${customer.id}`);
            };

            return (
              <article
                key={customer.id}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleOpen}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      handleOpen();
                  }}
                  className={cn(
                    "w-full p-4 text-left",
                    slug && "cursor-pointer",
                  )}
                >
                  {/* Header: Avatar + Nombre/Email + Ranking */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary overflow-hidden">
                        <div className="relative flex size-full items-center justify-center">
                          {crmCustomer?.avatar ? (
                            <Image
                              src={crmCustomer.avatar}
                              alt={customer.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <span>{initials(customer.name)}</span>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-medium text-sm text-foreground">
                          {customer.name}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {crmCustomer?.email ??
                            (customer.kind === "empresa"
                              ? "Empresa"
                              : "Persona")}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 leading-none rounded-lg text-[13px] font-semibold tabular-nums border",
                          index === 0
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
                            : index === 1
                              ? "bg-slate-500/10 text-slate-600 border-slate-500/30 dark:text-slate-300"
                              : index === 2
                                ? "bg-amber-700/10 text-amber-700 border-amber-700/30 dark:text-amber-500"
                                : "bg-muted text-foreground border-border",
                        )}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Tags al estilo CustomerCard */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-muted px-2.5 py-2 leading-none text-[13px] font-heading capitalize text-foreground/80">
                      {customer.kind}
                    </span>
                    {crmCustomer?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2.5 py-2 leading-none text-[13px] font-heading text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Atributos con iconos: Pedidos realizados + Total gastado */}
                  <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-sm">
                    <div className="flex items-center gap-x-2 font-heading">
                      <ShoppingBag className="size-4 text-muted-foreground" />
                      <span className="block text-sm text-muted-foreground">
                        Pedidos realizados:
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {customer.totalOrders}
                      </span>
                    </div>

                    <div className="flex items-center gap-x-2 font-heading">
                      <Wallet className="size-4 text-muted-foreground" />
                      <span className="block text-sm text-muted-foreground">
                        Total gastado:
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {money(customer.totalSpent)}
                      </span>
                    </div>
                  </div>

                  {customer.lastOrderAt && (
                    <p className="mt-3 text-sm text-muted-foreground font-heading">
                      Última compra: {shortDate(customer.lastOrderAt)}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </ReportSection>
  );
}
