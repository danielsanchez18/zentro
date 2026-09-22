"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Check,
  SearchX,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FilterPopover } from "@/components/app/shared/FilterPopover";
import { Paginator } from "@/components/app/shared/Paginator";
import { Search } from "@/components/app/shared/Search";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toastMsg } from "@/components/ui/toast-message";
import {
  formChannelLabel,
  formTemplateFields,
  type FormChannel,
  type FormResponseStatus,
} from "@/lib/mock/forms";
import { useFormsStore } from "@/stores/forms-store";
import { ResponsesAnalytics } from "./ResponsesAnalytics";

const PAGE_SIZE = 10;

const statusLabels: Record<FormResponseStatus, string> = {
  nueva: "Nueva",
  revisada: "Revisada",
  convertida: "Convertida",
  descartada: "Descartada",
};

const SORTS = [
  { id: "recent", label: "Más recientes" },
  { id: "oldest", label: "Más antiguas" },
  { id: "name", label: "Nombre A-Z" },
];

export function FormResponsesPage({
  slug,
  formId,
}: {
  slug: string;
  formId: string;
}) {
  const router = useRouter();
  const form = useFormsStore((state) =>
    state.forms.find((item) => item.id === formId),
  );
  const responses = useFormsStore((state) => state.responses);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FormResponseStatus | "all">("all");
  const [channel, setChannel] = useState<FormChannel | "all">("all");
  const [sort, setSort] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);

  const ownResponses = useMemo(
    () => responses.filter((item) => item.formId === formId),
    [responses, formId],
  );

  const filtered = useMemo(() => {
    return ownResponses
      .filter((response) => {
        const matchesStatus = status === "all" || response.status === status;
        const matchesChannel =
          channel === "all" || response.channel === channel;
        const text =
          `${response.respondent} ${response.email ?? ""}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        return matchesStatus && matchesChannel && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return Date.parse(a.submittedAt) - Date.parse(b.submittedAt);
        }
        if (sort === "name") {
          return a.respondent.localeCompare(b.respondent, "es");
        }
        return Date.parse(b.submittedAt) - Date.parse(a.submittedAt);
      });
  }, [ownResponses, query, status, channel, sort]);

  const reset = () => setPage(1);
  const activeCount = Number(status !== "all") + Number(channel !== "all");

  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  );
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const back = `/app/${slug}/formularios`;

  const exportResponses = () => {
    if (ownResponses.length === 0) {
      toastMsg.error(
        "Sin respuestas",
        "No hay respuestas registradas para exportar en este formulario.",
      );
      return;
    }

    const templateFields = form ? formTemplateFields[form.type] || [] : [];
    const formFields = form?.fields || [];

    // Recopilar todas las claves de campos presentes en las respuestas
    const fieldKeys = Array.from(
      new Set(ownResponses.flatMap((res) => Object.keys(res.values || {}))),
    );

    const escape = (value: unknown) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;

    const getColumnTitle = (key: string) => {
      const fromForm = formFields.find((f) => f.id === key);
      if (fromForm?.label) return fromForm.label;
      const fromTemplate = templateFields.find((f) => f.id === key);
      if (fromTemplate?.label) return fromTemplate.label;
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
    };

    const headers = [
      "ID",
      "Remitente",
      "Correo",
      "Fecha de envío",
      "Canal",
      "Estado",
      ...fieldKeys.map(getColumnTitle),
    ];

    const rows = [
      headers,
      ...ownResponses.map((r) => [
        r.id,
        r.respondent,
        r.email || "",
        new Intl.DateTimeFormat("es-PE", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(r.submittedAt)),
        formChannelLabel(r.channel),
        statusLabels[r.status] || r.status,
        ...fieldKeys.map((k) =>
          r.values[k] !== undefined ? String(r.values[k]) : "",
        ),
      ]),
    ];

    const csvContent =
      "\uFEFF" + rows.map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `respuestas-${(form?.name || "formulario").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);

    toastMsg.success(
      "Respuestas exportadas",
      `Se descargaron ${ownResponses.length} respuestas en formato CSV.`,
    );
  };

  if (!form) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button
          type="button"
          variant="link"
          className="px-0 text-sm font-medium text-primary hover:underline"
          onClick={() => router.push(back)}
        >
          Regresar a formularios
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          No encontramos este formulario.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      {/* Header institucional */}
      <header className="flex flex-wrap items-center justify-between gap-4 font-heading">
        <div>
          <Button
            type="button"
            variant="link"
            className="h-fit cursor-pointer px-0 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1.5"
            onClick={() => router.push(back)}
          >
            Regresar a formularios
          </Button>
          <div className="mt-1 flex items-center gap-2.5">
            <h1 className="text-xl font-medium tracking-tight text-foreground">
              {form.name}
            </h1>
            <span className="rounded-md bg-accent px-2 py-1.5 leading-none text-[13px] font-medium text-foreground/80">
              Respuestas
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {ownResponses.length}{" "}
            {ownResponses.length === 1
              ? "respuesta registrada"
              : "respuestas registradas"}{" "}
            en este formulario
          </p>
        </div>
      </header>

      {/* KPIs analíticos */}
      <ResponsesAnalytics responses={ownResponses} />

      {/* Tabla con toolbar y paginador */}
      <section className="w-full min-w-0 max-w-full space-y-5 font-heading sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Search
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              reset();
            }}
            placeholder="Buscar por persona o correo..."
            className="w-full min-w-60 flex-1 md:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterPopover
              activeCount={activeCount}
              onClear={() => {
                setStatus("all");
                setChannel("all");
                reset();
              }}
              groups={[
                {
                  label: "Estado",
                  selected: status,
                  onSelect: (value) => {
                    setStatus(value as FormResponseStatus | "all");
                    reset();
                  },
                  options: [
                    { label: "Todos", value: "all" },
                    { label: "Nueva", value: "nueva" },
                    { label: "Revisada", value: "revisada" },
                    { label: "Convertida", value: "convertida" },
                    { label: "Descartada", value: "descartada" },
                  ],
                },
                {
                  label: "Canal",
                  selected: channel,
                  onSelect: (value) => {
                    setChannel(value as FormChannel | "all");
                    reset();
                  },
                  options: [
                    { label: "Todos", value: "all" },
                    { label: "Sitio web", value: "web" },
                    { label: "Marketplace", value: "marketplace" },
                    { label: "Enlace público", value: "enlace" },
                    { label: "Uso interno", value: "interno" },
                  ],
                },
              ]}
            />
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-fit px-3 py-2 cursor-pointer"
                  />
                }
              >
                <ArrowUpDown className="size-3.5" />
                <span className="hidden sm:inline">
                  {SORTS.find((item) => item.id === sort)?.label}
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-1">
                {SORTS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSort(item.id);
                      setSortOpen(false);
                      reset();
                    }}
                    className="flex w-full items-center rounded-lg px-2.5 py-2 text-sm hover:bg-accent cursor-pointer"
                  >
                    <span className="flex-1 text-left">{item.label}</span>
                    {sort === item.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border">
            <EmptyState
              icon={SearchX}
              title="Sin respuestas coincidentes"
              description="Prueba con otra búsqueda o limpia los filtros seleccionados."
            />
          </div>
        ) : (
          <>
            <div className="w-full min-w-0 overflow-x-auto">
              <table className="w-full min-w-max text-left">
                <thead>
                  <tr className="bg-accent">
                    {["Persona", "Fecha", "Canal", "Estado", ""].map(
                      (label) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-xs font-semibold uppercase text-nowrap"
                        >
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((response) => (
                    <tr
                      key={response.id}
                      onClick={() =>
                        router.push(
                          `/app/${slug}/formularios/${formId}/respuestas/${response.id}`,
                        )
                      }
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                            <User className="size-4" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {response.respondent}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {response.email || "Sin correo"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">
                        {new Intl.DateTimeFormat("es-PE", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(response.submittedAt))}
                      </td>
                      <td className="px-5 py-3 text-sm text-foreground">
                        {formChannelLabel(response.channel)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={response.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full font-sans cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/app/${slug}/formularios/${formId}/respuestas/${response.id}`,
                            );
                          }}
                        >
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginator
              totalResults={filtered.length}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      {/* Barra flotante inferior de acciones */}
      <div className="sticky bottom-5 z-40 mx-auto w-fit max-w-[calc(100vw-2rem)]">
        <Toast ariaLabel="Acciones de respuestas">
          <Button
            type="button"
            variant="link"
            onClick={() =>
              router.push(`/app/${slug}/formularios/${formId}/editar`)
            }
            className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-white"
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() =>
              window.open(form.publicPath, "_blank", "noopener,noreferrer")
            }
            className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-white"
          >
            Ver
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={exportResponses}
            className="cursor-pointer px-3 text-sm font-medium shrink-0 whitespace-nowrap text-green-500"
          >
            Exportar
          </Button>
        </Toast>
      </div>
    </div>
  );
}
