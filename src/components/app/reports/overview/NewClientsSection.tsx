"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Calendar1, UserPlus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { crmCustomers } from "@/lib/mock/crm";
import { cn } from "@/lib/utils";
import { ReportSection, shortDate } from "./shared";

export interface NewClientItem {
  id: string;
  name: string;
  createdAt: string;
  email?: string;
  avatar?: string;
  kind?: string;
}

interface NewClientsSectionProps {
  newClients: NewClientItem[];
  className?: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function NewClientsSection({
  newClients,
  className,
}: NewClientsSectionProps) {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : null;

  return (
    <ReportSection
      title="Clientes nuevos"
      className={cn("h-fit", className)}
      contentClassName="py-0 sm:py-1"
      subtitle="Alta en el período"
    >
      {newClients.length === 0 ? (
        <div className="flex flex-1 items-center justify-center my-auto w-full min-h-40">
          <EmptyState
            icon={UserPlus}
            title="Sin clientes nuevos"
            description="No se registraron nuevos clientes en este período."
            className="py-6 my-auto"
          />
        </div>
      ) : (
        <div className="divide-y divide-border min-w-0 w-full max-w-full">
          {newClients.map((customer) => {
            const crmCustomer = crmCustomers.find((c) => c.id === customer.id);
            const avatarUrl = customer.avatar ?? crmCustomer?.avatar;
            const email =
              customer.email ??
              crmCustomer?.email ??
              (customer.kind === "empresa" || crmCustomer?.kind === "empresa"
                ? "Empresa"
                : "Persona");

            const handleOpen = () => {
              if (slug) router.push(`/app/${slug}/clientes/${customer.id}`);
            };

            return (
              <article key={customer.id} className="overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleOpen}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      handleOpen();
                  }}
                  className={cn(
                    "group w-full py-4 text-left",
                    slug && "cursor-pointer",
                  )}
                >
                  <div className="flex flex-col gap-3">
                    {/* Avatar + Nombre y Correo */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary overflow-hidden">
                        <div className="relative flex size-full items-center justify-center">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
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
                        <h3 className="truncate text-sm font-medium text-foreground group-hover:underline underline-offset-2">
                          {customer.name}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* Fecha de creación */}
                    <div className="ml-13 flex items-center gap-2">
                      <Calendar1 className="size-3.5 text-muted-foreground" />
                      <p className="shrink-0 text-sm font-medium text-muted-foreground">
                        Se unió:
                        <span className="ml-1 text-foreground">
                          {shortDate(customer.createdAt)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </ReportSection>
  );
}
