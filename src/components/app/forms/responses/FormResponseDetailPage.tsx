"use client";

import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Globe,
  Mail,
  Route,
  ShoppingBag,
  User,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import {
  formChannelLabel,
  formDestinationLabel,
  formTemplateFields,
  formTypeLabel,
  type FormResponseStatus,
} from "@/lib/mock/forms";
import { cn } from "@/lib/utils";
import { useFormsStore } from "@/stores/forms-store";

const conversionCopy = {
  crm: {
    action: "Crear cliente",
    done: "Cliente CRM creado",
    icon: UserPlus,
  },
  agenda: {
    action: "Crear solicitud de cita",
    done: "Solicitud de cita creada",
    icon: CalendarPlus,
  },
  pedidos: {
    action: "Crear solicitud de pedido",
    done: "Solicitud de pedido creada",
    icon: ShoppingBag,
  },
} as const;

const statusLabels: Record<FormResponseStatus, string> = {
  nueva: "Nueva",
  revisada: "Revisada",
  convertida: "Convertida",
  descartada: "Descartada",
};

function getFieldLabel(
  key: string,
  formFields?: { id: string; label: string }[],
  templateFields?: { id: string; label: string }[],
) {
  const fromForm = formFields?.find((f) => f.id === key);
  if (fromForm) return fromForm.label;
  const fromTemplate = templateFields?.find((f) => f.id === key);
  if (fromTemplate) return fromTemplate.label;
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function FormResponseDetailPage({
  slug,
  formId,
  responseId,
}: {
  slug: string;
  formId: string;
  responseId: string;
}) {
  const router = useRouter();
  const form = useFormsStore((state) =>
    state.forms.find((item) => item.id === formId),
  );
  const response = useFormsStore((state) =>
    state.responses.find((item) => item.id === responseId),
  );
  const setStatus = useFormsStore((state) => state.setResponseStatus);
  const convertResponse = useFormsStore((state) => state.convertResponse);
  const back = `/app/${slug}/formularios/${formId}/respuestas`;

  if (!form || !response) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10 font-heading">
        <Button
          type="button"
          variant="link"
          className="px-0 h-fit"
          onClick={() => router.push(back)}
        >
          Regresar a respuestas
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          No encontramos esta respuesta.
        </p>
      </div>
    );
  }

  const destination = form.destination === "ninguno" ? null : form.destination;
  const conversion = destination ? conversionCopy[destination] : null;
  const ConversionIcon = conversion?.icon;

  const handleStatusChange = (newStatus: FormResponseStatus) => {
    setStatus(response.id, newStatus);
    toastMsg.success(
      "Estado actualizado",
      `La respuesta ahora está ${statusLabels[newStatus]?.toLowerCase() || newStatus}.`,
    );
  };

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10 font-heading">
      {/* Header estructurado */}
      <header className="space-y-2">
        <Button
          type="button"
          variant="link"
          className="px-0 h-fit"
          onClick={() => router.push(back)}
        >
          Regresar a respuestas
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-medium tracking-tight text-foreground truncate">
                  {response.respondent}
                </h1>
                <StatusBadge status={response.status} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Respuesta a{" "}
                <span className="font-medium text-foreground">{form.name}</span>{" "}
                · Recibida el{" "}
                {new Intl.DateTimeFormat("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(response.submittedAt))}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Resumen superior de la respuesta */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 font-heading">

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Canal de origen</p>
            <Globe className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-0.5 text-sm font-medium text-foreground truncate">
            {formChannelLabel(response.channel)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Correo electrónico</p>
            <Mail className="size-4 text-muted-foreground" />
          </div>
          <p
            className="mt-0.5 text-sm font-medium text-foreground truncate"
            title={response.email || undefined}
          >
            {response.email || "No registrado"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Fecha de recepción</p>
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-0.5 text-sm font-medium text-foreground truncate">
            {new Intl.DateTimeFormat("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(response.submittedAt))}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Destino automático</p>
            <Route className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-0.5 text-sm font-medium text-foreground truncate">
            {formDestinationLabel(form.destination)}
          </p>
        </div>
      </div>

      {/* Grid principal de contenido */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <div className="flex flex-col gap-6">
          {/* Card: Información enviada */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-foreground">
                Información enviada
              </h2>
              <span className="text-sm text-muted-foreground">
                {Object.keys(response.values).length} campos completados
              </span>
            </div>
            <dl className="divide-y divide-border px-5">
              {Object.entries(response.values).map(([key, value]) => {
                const label = getFieldLabel(
                  key,
                  form.fields,
                  formTemplateFields[form.type],
                );
                return (
                  <div key={key} className="grid py-4">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm text-foreground wrap-break-word">
                      {typeof value === "boolean" ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                            value
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {value ? "Sí" : "No"}
                        </span>
                      ) : !value ? (
                        <span className="text-sm text-muted-foreground italic">
                          Sin respuesta
                        </span>
                      ) : (
                        String(value)
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          {/* Card: Historial */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">
                Historial de actividad
              </h2>
            </div>
            <div className="p-5">
              {(response.history ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Todavía no hay movimientos adicionales registrados.
                </p>
              ) : (
                <ol className="space-y-0">
                  {[...(response.history ?? [])]
                    .reverse()
                    .map((event, index, events) => (
                      <li
                        key={event.id}
                        className="relative flex gap-3 pb-5 last:pb-0"
                      >
                        <span className="relative z-10 mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                        {index < events.length - 1 && (
                          <span className="absolute left-0.75 top-3 h-full w-px bg-border" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {event.label}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("es-PE", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(event.createdAt))}
                          </p>
                        </div>
                      </li>
                    ))}
                </ol>
              )}
            </div>
          </section>
        </div>

        {/* Columna lateral: Conversión y Formulario de origen */}
        <aside className="flex h-fit flex-col gap-6">
          {/* Card: Conversión */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">
                Conversión y automatización
              </h2>
            </div>
            <div className="p-5">
              {response.conversion ? (
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {conversion?.done ?? "Respuesta convertida"}
                    </p>
                    <p className="mt-0.5 text-sm font-mono text-muted-foreground">
                      Ref. {response.conversion.referenceId}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(response.conversion.createdAt))}
                    </p>
                  </div>
                </div>
              ) : conversion && ConversionIcon ? (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Crea el registro mock en{" "}
                    <strong className="font-medium text-foreground">
                      {formDestinationLabel(destination!)}
                    </strong>{" "}
                    sin eliminar la respuesta original.
                  </p>
                  <Button
                    type="button"
                    className="w-full gap-2 rounded-full font-sans cursor-pointer"
                    onClick={() => {
                      convertResponse(response.id, destination!);
                      toastMsg.success(
                        conversion.done,
                        "La relación quedó registrada en el historial.",
                      );
                    }}
                  >
                    <ConversionIcon className="size-4" />
                    <span>{conversion.action}</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Este formulario no tiene un destino automático configurado
                    (CRM, Agenda o Pedidos).
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/app/${slug}/formularios/${formId}/editar`)
                    }
                    className="rounded-full font-sans cursor-pointer text-sm"
                  >
                    <span>Configurar destino</span>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Card: Formulario de origen */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">
                Formulario de origen
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-2 leading-none text-[13px] font-medium text-foreground/80">
                    {formTypeLabel(form.type)}
                  </span>
                  <StatusBadge status={form.status} />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {form.name}
                </p>
                {form.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                    {form.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Campos</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {form.fieldCount}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Finalización</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {form.completionRate}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(`/app/${slug}/formularios/${formId}/editar`)
                  }
                  className="rounded-full cursor-pointer w-full"
                >
                  <span>Editar formulario</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      form.publicPath,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="rounded-full cursor-pointer w-full"
                >
                  <span>Ver en línea</span>
                </Button>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Barra flotante inferior de acciones (máximo 2 opciones) */}
      <div className="sticky bottom-5 z-40 mx-auto w-fit max-w-[calc(100vw-2rem)]">
        <Toast ariaLabel="Acciones de la respuesta">
          {response.status === "descartada" ? (
            <Button
              type="button"
              variant="link"
              onClick={() => handleStatusChange("nueva")}
              className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-green-500"
            >
              Restaurar respuesta
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="link"
                onClick={() => handleStatusChange("descartada")}
                className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-rose-400"
              >
                Descartar
              </Button>

              {response.status === "nueva" && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleStatusChange("revisada")}
                  className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-green-500"
                >
                  Marcar como revisada
                </Button>
              )}

              {response.status === "revisada" && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleStatusChange("nueva")}
                  className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-white"
                >
                  Marcar como nueva
                </Button>
              )}

              {response.status === "convertida" && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handleStatusChange("revisada")}
                  className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-white"
                >
                  Marcar como revisada
                </Button>
              )}
            </>
          )}
        </Toast>
      </div>
    </div>
  );
}
