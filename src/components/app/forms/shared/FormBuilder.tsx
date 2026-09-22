"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckSquare,
  Copy,
  Hash,
  List,
  Mail,
  MessageSquareText,
  Phone,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  formTemplateFields,
  type FormChannel,
  type FormDestination,
  type FormField,
  type FormFieldType,
  type FormType,
  type ZentroForm,
} from "@/lib/mock/forms";

export interface FormBuilderValues {
  name: string;
  description: string;
  type: FormType;
  channel: FormChannel;
  destination: FormDestination;
  fields: FormField[];
  successMessage: string;
}

const fieldTypes: Array<{
  type: FormFieldType;
  label: string;
  icon: typeof Type;
}> = [
  { type: "text", label: "Texto", icon: Type },
  { type: "email", label: "Correo", icon: Mail },
  { type: "phone", label: "Teléfono", icon: Phone },
  { type: "number", label: "Número", icon: Hash },
  { type: "textarea", label: "Texto largo", icon: MessageSquareText },
  { type: "select", label: "Selección", icon: List },
  { type: "date", label: "Fecha", icon: CalendarDays },
  { type: "checkbox", label: "Casilla", icon: CheckSquare },
];

const makeField = (type: FormFieldType): FormField => ({
  id: `field_${crypto.randomUUID()}`,
  type,
  label: fieldTypes.find((field) => field.type === type)?.label ?? "Campo",
  placeholder: type === "select" ? "Selecciona una opción" : undefined,
  required: false,
  options: ["select", "checkbox"].includes(type)
    ? ["Opción 1", "Opción 2"]
    : undefined,
});

function PreviewField({ field }: { field: FormField }) {
  const [selectedVal, setSelectedVal] = useState<string>("");
  const label = (
    <span className="text-sm font-medium">
      {field.label || "Campo sin título"}
      {field.required && <span className="ml-1 text-destructive">*</span>}
    </span>
  );
  return (
    <div className="flex flex-col gap-2">
      {label}
      {field.type === "textarea" ? (
        <Textarea disabled placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <Select
          value={selectedVal}
          onValueChange={(value) => setSelectedVal(String(value ?? ""))}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={field.placeholder || "Selecciona una opción"}
            />
          </SelectTrigger>
          <SelectContent>
            {field.options && field.options.length > 0 ? (
              field.options.map((option, idx) => (
                <SelectItem
                  key={`${option}-${idx}`}
                  value={option || `opcion_${idx}`}
                >
                  {option || `Opción ${idx + 1}`}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="sin-opciones" disabled>
                Sin opciones configuradas
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      ) : field.type === "checkbox" ? (
        <div className="flex flex-col gap-2 pt-0.5">
          {field.options && field.options.length > 0 ? (
            field.options.map((option, idx) => (
              <label
                key={`${option}-${idx}`}
                className="flex items-center gap-2.5 text-sm font-normal cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary cursor-pointer"
                />
                <span>{option || `Opción ${idx + 1}`}</span>
              </label>
            ))
          ) : (
            <label className="flex items-center gap-2.5 text-sm font-normal cursor-pointer select-none">
              <input
                type="checkbox"
                className="size-4 rounded border-input accent-primary cursor-pointer"
              />
              <span>{field.placeholder || "Marcar opción"}</span>
            </label>
          )}
        </div>
      ) : (
        <Input
          disabled
          type={field.type === "phone" ? "tel" : field.type}
          placeholder={field.placeholder}
        />
      )}
      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
    </div>
  );
}

export function FormBuilder({
  id,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar cambios",
  showToast = true,
}: {
  id: string;
  initial: FormBuilderValues;
  onSubmit: (values: FormBuilderValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  showToast?: boolean;
}) {
  const [values, setValues] = useState(initial);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.fields[0]?.id ?? null,
  );
  const selected = useMemo(
    () => values.fields.find((field) => field.id === selectedId),
    [values.fields, selectedId],
  );
  const updateField = (changes: Partial<FormField>) =>
    setValues((current) => ({
      ...current,
      fields: current.fields.map((field) =>
        field.id === selectedId ? { ...field, ...changes } : field,
      ),
    }));
  const move = (direction: -1 | 1) =>
    setValues((current) => {
      const index = current.fields.findIndex(
        (field) => field.id === selectedId,
      );
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.fields.length)
        return current;
      const fields = [...current.fields];
      [fields[index], fields[target]] = [fields[target], fields[index]];
      return { ...current, fields };
    });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <>
      <form
        id={id}
        onSubmit={submit}
        className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,.75fr)]"
      >
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium">Información general</h2>
            </div>
            <div className="grid gap-5 p-5">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Nombre
                <Input
                  required
                  value={values.name}
                  onChange={(event) =>
                    setValues({ ...values, name: event.target.value })
                  }
                  placeholder="Ej. Solicitud de contacto"
                  className="h-9 px-3"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Descripción
                <Textarea
                  value={values.description}
                  onChange={(event) =>
                    setValues({ ...values, description: event.target.value })
                  }
                  placeholder="Explica para qué sirve este formulario."
                  className="px-3"
                />
              </label>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Canal</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["web", "Sitio web"],
                    ["marketplace", "Marketplace"],
                    ["enlace", "Enlace público"],
                    ["interno", "Uso interno"],
                  ].map(([value, label]) => {
                    const isSelected = values.channel === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValues({
                            ...values,
                            channel: value as FormChannel,
                          })
                        }
                        className={cn(
                          "cursor-pointer px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-all border",
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-medium"
                            : "bg-input/20 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Destino</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["crm", "CRM"],
                    ["agenda", "Agenda"],
                    ["pedidos", "Pedidos"],
                    ["ninguno", "Sin automatización"],
                  ].map(([value, label]) => {
                    const isSelected = values.destination === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValues({
                            ...values,
                            destination: value as FormDestination,
                          })
                        }
                        className={cn(
                          "cursor-pointer px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-all border",
                          isSelected
                            ? "bg-primary/10 border-primary text-primary font-medium"
                            : "bg-input/20 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/40",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium">Agregar campos</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 border-b border-border p-4 sm:grid-cols-4">
              {fieldTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  type="button"
                  variant="outline"
                  className="h-auto justify-start gap-2 px-3 py-2 text-sm"
                  onClick={() => {
                    const field = makeField(type);
                    setValues((current) => ({
                      ...current,
                      fields: [...current.fields, field],
                    }));
                    setSelectedId(field.id);
                  }}
                >
                  <Plus className="size-3.5" />
                  <Icon className="size-3.5" />
                  <span className="truncate">{label}</span>
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-3 p-4">
              {values.fields.length === 0 && (
                <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
                  <div className="rounded-lg p-2.5 w-fit mx-auto bg-muted flex items-center justify-center">
                    <Plus className="size-4" />
                  </div>
                  <p className="mt-3 text-sm font-medium">Aún no hay campos</p>
                  <p className="text-sm text-muted-foreground">
                    Elige un tipo de campo para comenzar.
                  </p>
                </div>
              )}
              {values.fields.map((field, index) => {
                const fieldType = fieldTypes.find(
                  (item) => item.type === field.type,
                );
                const FieldIcon = fieldType?.icon ?? Type;
                const isSelected = selectedId === field.id;

                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedId(field.id)}
                    className={cn(
                      "group flex items-start justify-between gap-3 rounded-xl border p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent/20",
                    )}
                  >
                    <div className="flex max-sm:flex-col items-start gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-foreground group-hover:text-primary",
                        )}
                      >
                        <FieldIcon className="size-3.5 stroke-[2.5]" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5 font-heading">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium font-heading wrap-break-word transition-colors",
                              isSelected
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary",
                            )}
                          >
                            {field.label || "Campo sin título"}
                          </span>
                          {field.required ? (
                            <span className="shrink-0 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1.5 rounded-md leading-none">
                              Obligatorio
                            </span>
                          ) : (
                            <span className="shrink-0 text-xs font-medium text-foreground bg-muted/60 px-2 py-1.5 rounded-md leading-none">
                              Opcional
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground wrap-break-word h-fit">
                          {fieldType?.label ?? field.type}
                          {field.type === "select"
                            ? ` · ${(field.options ?? []).length} ${(field.options ?? []).length === 1 ? "opción" : "opciones"}`
                            : field.placeholder
                              ? ` · "${field.placeholder}"`
                              : ""}
                        </p>
                      </div>
                    </div>

                    <p
                      className={cn(
                        "max-sm:hidden text-xs font-medium font-mono tabular-nums px-2 py-1 rounded-md border transition-colors shrink-0 h-fit self-start",
                        isSelected
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-muted/50 border-border/70 text-muted-foreground",
                      )}
                    >
                      #{index + 1}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium">Después del envío</h2>
            </div>
            <div className="p-5">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Mensaje de confirmación
                <Textarea
                  value={values.successMessage}
                  onChange={(event) =>
                    setValues({ ...values, successMessage: event.target.value })
                  }
                  placeholder="Gracias, recibimos tu información."
                  className="px-3"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="flex h-fit flex-col gap-5 xl:sticky xl:top-5">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium">Propiedades</h2>
              {selected && (
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(-1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      const copy = {
                        ...selected,
                        id: `field_${crypto.randomUUID()}`,
                        label: `${selected.label} copia`,
                      };
                      setValues((current) => ({
                        ...current,
                        fields: [...current.fields, copy],
                      }));
                      setSelectedId(copy.id);
                    }}
                  >
                    <Copy />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => {
                      setValues((current) => ({
                        ...current,
                        fields: current.fields.filter(
                          (field) => field.id !== selectedId,
                        ),
                      }));
                      setSelectedId(null);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 p-5">
              {selected ? (
                <>
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Etiqueta
                    <Input
                      value={selected.label}
                      onChange={(event) =>
                        updateField({ label: event.target.value })
                      }
                      className="px-3"
                    />
                  </label>
                  {selected.type !== "checkbox" && (
                    <label className="flex flex-col gap-2 text-sm font-medium">
                      Placeholder
                      <Input
                        value={selected.placeholder ?? ""}
                        onChange={(event) =>
                          updateField({ placeholder: event.target.value })
                        }
                        placeholder={
                          selected.type === "select"
                            ? "Ej: Selecciona una opción"
                            : "Ej: Escribe aquí..."
                        }
                        className="px-3"
                      />
                    </label>
                  )}
                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Texto de ayuda
                    <Input
                      value={selected.helpText ?? ""}
                      onChange={(event) =>
                        updateField({ helpText: event.target.value })
                      }
                      placeholder="Ej: Información visible debajo del campo"
                      className="px-3"
                    />
                  </label>
                  {["select", "checkbox"].includes(selected.type) && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          {selected.type === "checkbox"
                            ? "Casillas / Opciones"
                            : "Opciones de la lista"}
                        </Label>
                        <span className="text-xs text-muted-foreground font-mono">
                          {(selected.options ?? []).length}{" "}
                          {(selected.options ?? []).length === 1
                            ? "opción"
                            : "opciones"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {(selected.options && selected.options.length > 0
                          ? selected.options
                          : ["Opción 1", "Opción 2"]
                        ).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono size-5 flex items-center justify-center shrink-0">
                              {index + 1}.
                            </span>
                            <Input
                              value={option}
                              placeholder={`Opción ${index + 1}`}
                              onChange={(event) => {
                                const newOptions = [
                                  ...(selected.options ?? [
                                    "Opción 1",
                                    "Opción 2",
                                  ]),
                                ];
                                newOptions[index] = event.target.value;
                                updateField({ options: newOptions });
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  const currentOpts = selected.options ?? [
                                    "Opción 1",
                                    "Opción 2",
                                  ];
                                  const nextNum = currentOpts.length + 1;
                                  updateField({
                                    options: [
                                      ...currentOpts,
                                      `Opción ${nextNum}`,
                                    ],
                                  });
                                }
                              }}
                              className="h-9 text-sm px-3 flex-1"
                            />
                            {(selected.options ?? []).length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-destructive shrink-0 size-8 cursor-pointer"
                                onClick={() => {
                                  const newOptions = (
                                    selected.options ?? []
                                  ).filter((_, idx) => idx !== index);
                                  updateField({ options: newOptions });
                                }}
                                title="Eliminar opción"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentOpts =
                            selected.options && selected.options.length > 0
                              ? selected.options
                              : ["Opción 1", "Opción 2"];
                          const nextNum = currentOpts.length + 1;
                          updateField({
                            options: [...currentOpts, `Opción ${nextNum}`],
                          });
                        }}
                        className="w-full gap-1.5 text-xs h-8.5 mt-1 border-dashed cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        {selected.type === "checkbox"
                          ? "Agregar casilla"
                          : "Agregar opción"}
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2">
                    <Label>Campo obligatorio</Label>
                    <Switch
                      checked={selected.required}
                      onCheckedChange={(checked) =>
                        updateField({ required: checked })
                      }
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selecciona un campo para editarlo.
                </p>
              )}
            </div>
          </section>
        </aside>
      </form>

      {showToast && (
        <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
          <Toast
            formId={id}
            submitLabel={submitLabel}
            onCancel={onCancel}
            onPreview={() => setPreviewOpen(true)}
          />
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col sm:max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium font-heading">
                Vista previa
              </span>
              <span className="text-sm font-heading text-muted-foreground">
                {values.fields.length}{" "}
                {values.fields.length === 1 ? "campo" : "campos"}
              </span>
            </div>
            <DialogTitle>{values.name || "Formulario sin título"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {values.description ||
                "Así es como verán e interactuarán tus clientes con este formulario."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 overflow-y-auto">
            {values.fields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 py-12 text-center text-sm text-muted-foreground">
                <div className="bg-accent rounded-lg flex items-center justify-center w-fit mx-auto p-3">
                  <CheckSquare className="size-4.5 text-primary" />
                </div>
                <p className="font-heading max-w-xs text-balance mt-3 mx-auto">
                  No hay campos configurados todavía en este formulario.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {values.fields.map((field) => (
                  <PreviewField key={field.id} field={field} />
                ))}
                <Button type="button" disabled className="w-full mt-2">
                  Enviar
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setPreviewOpen(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function formToBuilderValues(form: ZentroForm): FormBuilderValues {
  return {
    name: form.name,
    description: form.description,
    type: form.type,
    channel: form.channel,
    destination: form.destination,
    fields:
      form.fields ??
      formTemplateFields[form.type].map((field) => ({
        ...field,
        id: `field_${crypto.randomUUID()}`,
      })),
    successMessage: form.successMessage ?? "Gracias, recibimos tu información.",
  };
}
