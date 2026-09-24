"use client";

import { useParams, useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBillingStore } from "@/stores/billing-store";
import { BillingKpis } from "./BillingKpis";
import { BillingList } from "./BillingList";

export function BillingModule() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const invoices = useBillingStore((state) => state.invoices);
  const notes = useBillingStore((state) => state.notes);

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Facturación
          </h1>
          <p className="text-sm text-muted-foreground">
            Comprobantes, notas y trazabilidad fiscal del negocio.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-full cursor-pointer"
          onClick={() =>
            router.push(`/app/${params.slug}/facturacion/configuracion`)
          }
        >
          Configuración
        </Button>
      </header>
      <BillingKpis invoices={invoices} notes={notes} />
      <BillingList invoices={invoices} />
    </div>
  );
}
