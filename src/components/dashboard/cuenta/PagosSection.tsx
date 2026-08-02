"use client";

import { CreditCard, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Datos de pago — aviso informativo.
 * La facturación no se administra desde la cuenta del usuario sino dentro de
 * cada organización (plan, método de pago y facturas por tenant).
 * TODO(0.2): cuando exista un medio de pago global (empresa), leerlo desde el backend.
 */
export const PagosSection = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="max-lg:pt-3 lg:pl-5">
        <h2 className="text-base font-medium font-sans">Datos de pago</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La facturación de Zentro se administra dentro de cada organización.
        </p>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              La facturación es por organización
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada organización tiene su propio plan, método de pago y facturas.
              Para actualizar los datos de pago, cambiar de plan o descargar un
              comprobante, entra a Suscripciones.
            </p>
          </div>
        </div>

        <Link href="/dashboard/suscripciones" className="mt-4 inline-flex">
          <Button
            type="button"
            className="rounded-full text-sm px-3"
          >
            <CreditCard className="size-4" />
            Ver suscripciones y facturas
          </Button>
        </Link>
      </div>
    </div>
  );
};
