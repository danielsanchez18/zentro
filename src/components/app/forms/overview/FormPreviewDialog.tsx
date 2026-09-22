"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Copy,
  Globe,
  Inbox,
  Link2,
  Pencil,
  Route,
  Rows3,
} from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toastMsg } from "@/components/ui/toast-message";
import {
  formChannelLabel,
  formDestinationLabel,
  formTypeLabel,
  type ZentroForm,
} from "@/lib/mock/forms";
import { cn } from "@/lib/utils";

export function FormPreviewDialog({
  form,
  open,
  onOpenChange,
}: {
  form: ZentroForm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "demo";

  if (!form) return null;

  const publicUrl = `https://zentro.app${form.publicPath}`;

  const copy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toastMsg.info("Enlace copiado", publicUrl);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleGoToResponses = () => {
    onOpenChange(false);
    router.push(`/app/${slug}/formularios/${form.id}/respuestas`);
  };

  const handleGoToEdit = () => {
    onOpenChange(false);
    router.push(`/app/${slug}/formularios/${form.id}/editar`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col font-heading sm:max-w-lg">
        {/* Header con icono, tipo y estado */}
        <DialogHeader className="shrink-0 space-y-0">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList className="size-4.5" />
              </span>
              <div className="min-w-0 space-y-1">
                <span className="inline-flex items-center rounded-md bg-accent px-2 py-1.5 text-[13px] leading-none font-medium text-foreground/80">
                  {formTypeLabel(form.type)}
                </span>
                <DialogTitle className="text-foreground">
                  {form.name}
                </DialogTitle>
              </div>
            </div>
            <StatusBadge
              status={form.status}
              label={
                form.status === "activo"
                  ? "Publicado"
                  : form.status === "finalizada"
                    ? "Archivado"
                    : undefined
              }
            />
          </div>
        </DialogHeader>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-0.5">
          {form.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {form.description}
            </p>
          )}

          {/* KPI Bar con métricas destacadas */}
          <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-muted/30 p-3 text-center">
            <div className="px-2">
              <p className="text-xl font-semibold tabular-nums text-foreground">
                {form.submissions}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Respuestas</p>
            </div>
            <div className="px-2">
              <p
                className={cn(
                  "text-xl font-semibold tabular-nums",
                  form.unreadSubmissions > 0
                    ? "text-primary font-bold"
                    : "text-foreground",
                )}
              >
                {form.unreadSubmissions}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Por revisar
              </p>
            </div>
            <div className="px-2">
              <p className="text-xl font-semibold tabular-nums text-foreground">
                {form.completionRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Finalización
              </p>
            </div>
          </div>

          {/* Grid de configuración */}
          <div className="py-2 grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Rows3 className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Estructura</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {form.fieldCount} campos configurados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Route className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Destino automático
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {formDestinationLabel(form.destination)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Globe className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Canal de origen</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {formChannelLabel(form.channel)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Inbox className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Estado de bandeja
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {form.unreadSubmissions > 0
                    ? `${form.unreadSubmissions} sin leer`
                    : "Todo al día"}
                </p>
              </div>
            </div>
          </div>

          {/* Enlace público */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Link2 className="size-3.5 text-primary" />
                Enlace público
              </span>
              {form.status === "activo" && (
                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Activo en línea
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center min-w-0 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-mono text-muted-foreground select-all">
                <span className="truncate">{publicUrl}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={copy}
                className="h-8 gap-1.5 rounded-lg px-2.5 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  window.open(form.publicPath, "_blank", "noopener,noreferrer")
                }
                className="size-8 rounded-lg shrink-0 cursor-pointer"
                title="Abrir enlace en nueva pestaña"
              >
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <DialogFooter className="shrink-0 pt-2">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between w-full gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full font-sans py-2 leading-none h-fit cursor-pointer"
            >
              Cerrar
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoToEdit}
                className="rounded-full font-sans py-2 leading-none h-fit gap-1.5 cursor-pointer"
              >
                <span>Editar</span>
              </Button>
              <Button
                type="button"
                onClick={handleGoToResponses}
                className="rounded-full font-sans py-2 leading-none h-fit gap-1.5 cursor-pointer"
              >
                <span>Ver respuestas</span>
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
