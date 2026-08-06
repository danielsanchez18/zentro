"use client";

import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function TenantPlanPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-heading font-semibold">
          Plan y suscripción
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona el plan activo, el método de pago y los límites de tu
          empresa.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <CreditCard className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Gestión de plan</p>
          <p className="text-sm text-muted-foreground">
            Esta sección aún está en construcción.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          <ArrowLeft className="size-4" />
          Volver al hub
        </Link>
      </div>
    </div>
  );
}