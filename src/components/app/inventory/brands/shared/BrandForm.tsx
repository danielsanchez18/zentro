"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { InventoryBrandStatus } from "@/lib/mock/inventory-brands";

const ORIGINS = [
  "Perú",
  "Argentina",
  "Brasil",
  "Chile",
  "China",
  "Colombia",
  "España",
  "Estados Unidos",
  "México",
];

export interface BrandFormValues {
  name: string;
  description: string;
  origin: string;
  status: InventoryBrandStatus;
}

export function BrandForm({
  id,
  initial,
  existingNames = [],
  actions,
  onSubmit,
}: {
  id: string;
  initial?: Partial<BrandFormValues>;
  existingNames?: string[];
  actions?: ReactNode;
  onSubmit: (values: BrandFormValues) => void;
}) {
  const [values, setValues] = useState<BrandFormValues>({
    name: "",
    description: "",
    origin: "",
    status: "activo",
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    const normalizedName = values.name.trim().toLocaleLowerCase("es-PE");
    if (!normalizedName) next.name = "Ingresa el nombre de la marca.";
    else if (
      existingNames.some(
        (name) => name.trim().toLocaleLowerCase("es-PE") === normalizedName,
      )
    )
      next.name = "Ya existe una marca con este nombre.";
    if (!values.description.trim())
      next.description = "Ingresa una descripción.";
    if (!values.origin) next.origin = "Selecciona el país de origen.";
    setErrors(next);
    if (Object.keys(next).length === 0)
      onSubmit({
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
      });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="grid gap-5 font-heading">
      <Field label="Nombre de la marca" required error={errors.name}>
        <Input
          className="h-fit rounded-lg px-4 py-2"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Ej. Zentro Kitchen"
          aria-invalid={Boolean(errors.name)}
        />
      </Field>
      <Field label="Descripción" required error={errors.description}>
        <div className="flex flex-col gap-y-1.5">
          <textarea
            rows={3}
            maxLength={180}
            className="h-fit w-full resize-none rounded-lg border border-input bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Describe brevemente los productos de la marca."
            aria-invalid={Boolean(errors.description)}
          />
        </div>
      </Field>
      <Field label="País de origen" required error={errors.origin}>
        <Select
          value={values.origin || null}
          onValueChange={(value) =>
            setValues((current) => ({
              ...current,
              origin: typeof value === "string" ? value : "",
            }))
          }
        >
          <SelectTrigger className="h-fit w-full rounded-lg px-4 py-2">
            <SelectValue placeholder="Seleccionar país" />
          </SelectTrigger>
          <SelectContent>
            {ORIGINS.map((origin) => (
              <SelectItem key={origin} value={origin}>
                {origin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Estado">
        <label className="flex h-fit cursor-pointer items-center justify-between rounded-lg border border-border px-4 py-2 transition-colors hover:bg-accent/20">
          <span className="text-sm font-normal text-muted-foreground">
            {values.status === "activo" ? "Activa" : "Inactiva"}
          </span>
          <Switch
            checked={values.status === "activo"}
            onCheckedChange={(checked) =>
              setValues((current) => ({
                ...current,
                status: checked ? "activo" : "inactivo",
              }))
            }
          />
        </label>
      </Field>
      {actions}
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
