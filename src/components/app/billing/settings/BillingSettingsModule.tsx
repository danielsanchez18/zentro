"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/app/shared/Toast";
import { toastMsg } from "@/components/ui/toast-message";
import { useBillingStore } from "@/stores/billing-store";
import { InvoiceTemplatePreview } from "./InvoiceTemplatePreview";

export function BillingSettingsModule({ slug }: { slug: string }) {
  const router = useRouter();
  const config = useBillingStore((state) => state.config);
  const updateConfig = useBillingStore((state) => state.updateConfig);

  const [businessName, setBusinessName] = useState(config.businessName);
  const [ruc, setRuc] = useState(config.ruc);
  const [address, setAddress] = useState(config.address);
  const [logo, setLogo] = useState(config.logo ?? "");
  const [igvRate, setIgvRate] = useState(String(Math.round(config.igvRate * 100)));
  const [activeTemplate, setActiveTemplate] = useState<"boleta" | "factura">(
    "boleta",
  );

  const back = `/app/${slug}/facturacion`;

  const hasChanges = useMemo(() => {
    const currentIgv = String(Math.round(config.igvRate * 100));
    return (
      businessName !== config.businessName ||
      ruc !== config.ruc ||
      address !== config.address ||
      logo !== (config.logo ?? "") ||
      igvRate !== currentIgv
    );
  }, [businessName, ruc, address, logo, igvRate, config]);

  const handleReset = () => {
    setBusinessName(config.businessName);
    setRuc(config.ruc);
    setAddress(config.address);
    setLogo(config.logo ?? "");
    setIgvRate(String(Math.round(config.igvRate * 100)));
  };

  const handleSave = () => {
    if (!hasChanges) return;
    updateConfig({
      businessName,
      ruc,
      address,
      logo: logo || undefined,
      igvRate: Number(igvRate) / 100,
    });
    toastMsg.success(
      "Configuración guardada",
      "Los datos fiscales se actualizaron correctamente.",
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      {/* Header */}
      <header className="space-y-1">
        <Button
          type="button"
          variant="link"
          className="h-fit p-0 cursor-pointer"
          onClick={() => router.push(back)}
        >
          Regresar a facturación
        </Button>
        <div className="pt-1">
          <h1 className="text-lg font-medium">
            Configuración de facturación
          </h1>
          <p className="text-sm text-muted-foreground">
            Datos fiscales, plantillas de comprobantes y numeración.
          </p>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_auto]">
        {/* Configuración */}
        <div className="space-y-5">
          {/* Datos fiscales */}
          <section className="rounded-xl border border-border bg-card">
            <h2 className="text-sm font-medium px-5 py-3 border-b border-border">
              Datos fiscales
            </h2>
            <div className="p-5 grid gap-5 sm:grid-cols-2 font-heading">
              <div className="sm:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium">Razón social</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Nombre de tu empresa"
                  className="px-4 h-fit py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">RUC</label>
                <Input
                  value={ruc}
                  onChange={(e) => setRuc(e.target.value)}
                  placeholder="20123456789"
                  maxLength={11}
                  className="px-4 h-fit py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Tasa de IGV (%)</label>
                <Input
                  type="number"
                  value={igvRate}
                  onChange={(e) => setIgvRate(e.target.value)}
                  min="0"
                  max="100"
                  className="px-4 h-fit py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium">Dirección fiscal</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Principal 123, Ciudad"
                  className="px-4 h-fit py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium">Logo (opcional)</label>
                <div className="flex items-center gap-3">
                  <Input
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="URL del logo"
                    className="px-4 h-fit py-2 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    className="cursor-pointer"
                  >
                    <Upload />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Numeración */}
          <section className="rounded-xl border border-border bg-card">
            <h2 className="text-sm font-medium px-5 py-3 border-b border-border">
              Numeración
            </h2>
            <p className="text-sm text-muted-foreground p-5 font-heading">
              Los correlativos se generan automáticamente. El siguiente número
              se asigna al emitir cada comprobante.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 p-5 pt-0 font-heading">
              <div className="rounded-xl border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Boletas</p>
                <p className="mt-1 text-lg font-medium">
                  B001-{String(config.sequences.boleta).padStart(4, "0")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Siguiente: B001-
                  {String(config.sequences.boleta + 1).padStart(4, "0")}
                </p>
              </div>
              <div className="rounded-xl border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Facturas</p>
                <p className="mt-1 text-lg font-medium">
                  F001-{String(config.sequences.factura).padStart(4, "0")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Siguiente: F001-
                  {String(config.sequences.factura + 1).padStart(4, "0")}
                </p>
              </div>
              <div className="rounded-xl border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Notas de crédito
                </p>
                <p className="mt-1 text-lg font-medium">
                  NC001-{String(config.sequences.notaCredito).padStart(4, "0")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Siguiente: NC001-
                  {String(config.sequences.notaCredito + 1).padStart(4, "0")}
                </p>
              </div>
              <div className="rounded-xl border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Notas de débito</p>
                <p className="mt-1 text-lg font-medium">
                  ND001-{String(config.sequences.notaDebito).padStart(4, "0")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Siguiente: ND001-
                  {String(config.sequences.notaDebito + 1).padStart(4, "0")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Preview */}
        <div className="xl:w-sm">
          <section className="rounded-xl border border-border bg-card">
            <h2 className="text-sm font-medium px-5 py-3 border-b border-border">
              Plantilla de comprobante
            </h2>
            <div className="flex gap-2 p-5">
              <Button
                type="button"
                variant={activeTemplate === "boleta" ? "default" : "outline"}
                onClick={() => setActiveTemplate("boleta")}
                className="cursor-pointer"
              >
                Boleta
              </Button>
              <Button
                type="button"
                variant={activeTemplate === "factura" ? "default" : "outline"}
                onClick={() => setActiveTemplate("factura")}
                className="cursor-pointer"
              >
                Factura
              </Button>
            </div>
            <div className="p-5 pt-0">
              <InvoiceTemplatePreview
                type={activeTemplate}
                config={{
                  businessName,
                  ruc,
                  address,
                  logo: logo || undefined,
                }}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Barra de acción flotante Toast */}
      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast ariaLabel="Acciones de configuración">
          <Button
            type="button"
            variant="link"
            onClick={handleReset}
            disabled={!hasChanges}
            className="cursor-pointer px-3 text-white hover:text-white/80 text-sm font-medium shrink-0 whitespace-nowrap"
          >
            Descartar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={!hasChanges}
            className="cursor-pointer px-3.5 rounded-full text-sm font-medium shrink-0 whitespace-nowrap"
          >
            Guardar cambios
          </Button>
        </Toast>
      </div>
    </div>
  );
}
