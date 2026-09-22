"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formTemplateFields, type FormField } from "@/lib/mock/forms";
import { useFormsStore } from "@/stores/forms-store";

function PublicField({ field, value, onChange }: { field: FormField; value: string | boolean; onChange: (value: string | boolean) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium">
      <span>{field.label}{field.required && <span className="ml-1 text-destructive">*</span>}</span>
      {field.type === "textarea" ? (
        <Textarea required={field.required} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} />
      ) : field.type === "select" ? (
        <select required={field.required} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="">Selecciona una opción</option>
          {field.options?.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : field.type === "checkbox" ? (
        <span className="flex items-center gap-2 font-normal"><input type="checkbox" checked={Boolean(value)} required={field.required} onChange={(event) => onChange(event.target.checked)} className="size-4" />Confirmo esta opción</span>
      ) : (
        <Input required={field.required} type={field.type === "phone" ? "tel" : field.type} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} />
      )}
      {field.helpText && <span className="text-xs font-normal text-muted-foreground">{field.helpText}</span>}
    </label>
  );
}

export function PublicFormPage({ publicSlug }: { publicSlug: string }) {
  const form = useFormsStore((state) => state.forms.find((item) => item.publicPath === `/f/${publicSlug}`));
  const addResponse = useFormsStore((state) => state.addResponse);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [sent, setSent] = useState(false);
  const fields = useMemo(() => form ? (form.fields ?? formTemplateFields[form.type]) : [], [form]);

  if (!form || form.status !== "activo") return <main className="grid min-h-dvh place-items-center bg-muted/30 p-5"><div className="max-w-md rounded-xl border border-border bg-card p-8 text-center"><h1 className="text-lg font-medium">Formulario no disponible</h1><p className="mt-2 text-sm text-muted-foreground">El enlace no existe o dejó de recibir respuestas.</p></div></main>;
  if (sent) return <main className="grid min-h-dvh place-items-center bg-muted/30 p-5"><div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center"><CheckCircle2 className="mx-auto size-10 text-primary" /><h1 className="mt-5 text-lg font-medium">Información enviada</h1><p className="mt-2 text-sm text-muted-foreground">{form.successMessage ?? "Gracias, recibimos tu información."}</p></div></main>;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nameField = fields.find((field) => /nombre/i.test(field.label));
    const emailField = fields.find((field) => field.type === "email");
    addResponse({ id: `response_${crypto.randomUUID()}`, formId: form.id, status: "nueva", channel: form.channel, submittedAt: new Date().toISOString(), respondent: String(values[nameField?.id ?? ""] || "Respuesta anónima"), email: emailField ? String(values[emailField.id] || "") : undefined, values });
    setSent(true);
  };

  return <main className="min-h-dvh bg-muted/30 px-5 py-10 sm:py-16"><form onSubmit={submit} className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card"><header className="border-b border-border p-6 sm:p-8"><p className="text-xs font-medium uppercase tracking-wider text-primary">Formulario</p><h1 className="mt-2 text-xl font-medium">{form.name}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{form.description}</p></header><div className="flex flex-col gap-5 p-6 sm:p-8">{fields.map((field) => <PublicField key={field.id} field={field} value={values[field.id] ?? ""} onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))} />)}<Button type="submit" className="mt-2 w-full">Enviar información</Button><p className="text-center text-xs text-muted-foreground">Tus datos se enviarán al negocio.</p></div></form></main>;
}
