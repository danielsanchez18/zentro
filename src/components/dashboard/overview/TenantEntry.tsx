"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_ORGANIZATIONS } from "@/lib/mock/organizations";
import { useTenantStore } from "@/stores/tenant-store";
import type { Organization } from "@/components/dashboard/organizaciones/types";

const REDIRECT_FLAG = "zentro-hub-redirected";

export const TenantEntry = () => {
  const router = useRouter();
  const { setActiveTenant } = useTenantStore();
  const orgs = MOCK_ORGANIZATIONS;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Si el usuario tiene EXACTAMENTE 1 tenant → pasar por el hub y redirigir
  // a su tenant automáticamente (una vez por sesión; luego puede usar el hub).
  useEffect(() => {
    if (orgs.length !== 1) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(REDIRECT_FLAG)) {
      return;
    }
    sessionStorage.setItem(REDIRECT_FLAG, "1");
    const org = orgs[0];
    setActiveTenant({ orgId: org.id, slug: org.slug, name: org.name });
    router.replace(`/app/${org.slug}`);
  }, [orgs, router, setActiveTenant]);

  // El estado de bienvenida con 0 tenants lo maneja OrganizationsGrid.
  if (orgs.length === 0) return null;

  const single = orgs.length === 1 ? orgs[0] : null;
  const selected =
    orgs.find((org) => org.id === selectedId) ?? orgs[0];

  const openWorkspace = (org: Organization) => {
    setActiveTenant({ orgId: org.id, slug: org.slug, name: org.name });
    router.push(`/app/${org.slug}`);
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      {single ? (
        /* 1 tenant: entrada directa */
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tu organización</p>
              <p className="font-medium">{single.name}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => openWorkspace(single)}
            className="rounded-full"
          >
            Ir a {single.name} <ArrowUpRight className="size-4" />
          </Button>
        </div>
      ) : (
        /* 2+ tenants: selector de tarjetas */
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Tu organización</p>
              <p className="font-medium">Elige a dónde quieres ir</p>
            </div>
            <Button
              type="button"
              onClick={() => openWorkspace(selected)}
              className="rounded-full"
            >
              Ir a {selected.name} <ArrowUpRight className="size-4" />
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => {
              const isSelected = org.id === selected.id;
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setSelectedId(org.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-accent"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.plan} · {org.role}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && (
                      <Check className="size-3 stroke-3 text-primary-foreground" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
