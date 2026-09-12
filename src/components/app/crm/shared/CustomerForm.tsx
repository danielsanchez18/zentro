"use client";

import { useState, type FormEvent } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  MapPinned,
  Building,
  Compass,
  Tag,
  MessageSquare,
  Store,
  Globe,
  ShoppingBag,
  UserCheck,
  Check,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  CrmCustomer,
  CustomerChannel,
  CustomerKind,
  CustomerStatus,
} from "@/lib/mock/crm";
import { Field, FormSection, crmInputClass } from "./FormSection";

export interface CustomerFormValues {
  kind: CustomerKind;
  name: string;
  email: string;
  phone: string;
  documentType: "DNI" | "CE" | "RUC";
  documentNumber: string;
  status: CustomerStatus;
  preferredChannel: CustomerChannel;
  tags: string;
  notes: string;
  address: string;
  district: string;
  city: string;
  reference: string;
}

const EMPTY: CustomerFormValues = {
  kind: "persona",
  name: "",
  email: "",
  phone: "",
  documentType: "DNI",
  documentNumber: "",
  status: "activo",
  preferredChannel: "manual",
  tags: "",
  notes: "",
  address: "",
  district: "",
  city: "",
  reference: "",
};

const CHANNEL_OPTIONS: {
  id: CustomerChannel;
  label: string;
  icon: typeof MessageSquare;
}[] = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "pos", label: "Punto de venta", icon: Store },
  { id: "web", label: "Sitio web", icon: Globe },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "manual", label: "Manual", icon: UserCheck },
];

const SUGGESTED_TAGS = [
  "VIP",
  "Frecuente",
  "Mayorista",
  "Corporativo",
  "Delivery",
];

export function customerToForm(customer: CrmCustomer): CustomerFormValues {
  const address =
    customer.addresses.find((item) => item.isDefault) ?? customer.addresses[0];
  return {
    kind: customer.kind,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    documentType: customer.documentType ?? "DNI",
    documentNumber: customer.documentNumber ?? "",
    status: customer.status,
    preferredChannel: customer.preferredChannel,
    tags: customer.tags.join(", "),
    notes: customer.notes ?? "",
    address: address?.address ?? "",
    district: address?.district ?? "",
    city: address?.city ?? "",
    reference: address?.reference ?? "",
  };
}

export function CustomerForm({
  id,
  initial,
  existingEmails,
  onSubmit,
}: {
  id: string;
  initial?: Partial<CustomerFormValues>;
  existingEmails: string[];
  onSubmit: (values: CustomerFormValues) => void;
}) {
  const [values, setValues] = useState<CustomerFormValues>({
    ...EMPTY,
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof CustomerFormValues>(
    key: K,
    value: CustomerFormValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) {
      next.name =
        values.kind === "empresa"
          ? "Ingresa la razón social."
          : "Ingresa el nombre del cliente.";
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = "Ingresa un correo válido.";
    }
    if (
      values.email &&
      existingEmails.some(
        (email) => email.toLowerCase() === values.email.trim().toLowerCase(),
      )
    ) {
      next.email = "Ya existe un cliente con este correo.";
    }
    if (!values.phone.trim()) {
      next.phone = "Ingresa un teléfono de contacto.";
    }
    if (values.documentNumber && !/^\d{8,11}$/.test(values.documentNumber)) {
      next.documentNumber = "Usa entre 8 y 11 dígitos numéricos.";
    }

    setErrors(next);
    if (!Object.keys(next).length) {
      onSubmit(values);
    }
  };

  const handleToggleTag = (tag: string) => {
    const current = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const exists = current.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (exists) {
      const filtered = current.filter(
        (t) => t.toLowerCase() !== tag.toLowerCase(),
      );
      update("tags", filtered.join(", "));
    } else {
      const appended = [...current, tag];
      update("tags", appended.join(", "));
    }
  };

  return (
    <form
      id={id}
      onSubmit={submit}
      className="grid gap-5 xl:grid-cols-[1.5fr_1fr] relative"
    >
      {/* Columna Izquierda: Identidad y Dirección */}
      <div className="flex flex-col gap-5">
        {/* Sección: Información del cliente */}
        <FormSection
          title="Información del cliente"
          description="Identidad y datos principales de contacto."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Tipo de cliente */}
            <div className="sm:col-span-2">
              <Field
                label="Tipo de cliente"
                hint="Elige si se trata de una persona natural o una empresa / persona jurídica."
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={values.kind === "persona" ? "default" : "outline"}
                    onClick={() => {
                      update("kind", "persona");
                      if (values.documentType === "RUC") {
                        update("documentType", "DNI");
                      }
                    }}
                  >
                    <User className="size-3.5" />
                    Persona natural
                  </Button>
                  <Button
                    type="button"
                    variant={values.kind === "empresa" ? "default" : "outline"}
                    onClick={() => {
                      update("kind", "empresa");
                      if (values.documentType === "DNI") {
                        update("documentType", "RUC");
                      }
                    }}
                  >
                    <Building2 className="size-3.5" />
                    Empresa / Jurídico
                  </Button>
                </div>
              </Field>
            </div>

            {/* Nombre o Razón social */}
            <div className="sm:col-span-2">
              <Field
                label={
                  values.kind === "empresa" ? "Razón social" : "Nombre completo"
                }
                error={errors.name}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    {values.kind === "empresa" ? (
                      <Building2 className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <input
                    value={values.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder={
                      values.kind === "empresa"
                        ? "Ej. Inversiones Gastronómicas S.A.C."
                        : "Ej. Juan Carlos Pérez"
                    }
                    className={cn(
                      crmInputClass,
                      "pl-9",
                      errors.name &&
                        "border-destructive focus:border-destructive focus:ring-destructive/15",
                    )}
                  />
                </div>
              </Field>
            </div>

            {/* Correo electrónico */}
            <Field label="Correo electrónico" error={errors.email}>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  type="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className={cn(
                    crmInputClass,
                    "pl-9",
                    errors.email &&
                      "border-destructive focus:border-destructive focus:ring-destructive/15",
                  )}
                />
              </div>
            </Field>

            {/* Teléfono */}
            <Field label="Teléfono / Celular" error={errors.phone}>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="987 654 321"
                  className={cn(
                    crmInputClass,
                    "pl-9",
                    errors.phone &&
                      "border-destructive focus:border-destructive focus:ring-destructive/15",
                  )}
                />
              </div>
            </Field>

            {/* Documento de Identidad (Input con Select al costado unificados) */}
            <div className="sm:col-span-2">
              <Field
                label="Documento de identidad"
                error={errors.documentNumber}
                hint={
                  values.documentType === "DNI"
                    ? "DNI de 8 dígitos numéricos."
                    : values.documentType === "RUC"
                      ? "RUC de 11 dígitos numéricos."
                      : "Carné de extranjería (CE)."
                }
              >
                <div
                  className={cn(
                    "relative flex h-9 w-full items-center rounded-lg border border-border bg-background overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-colors",
                    errors.documentNumber &&
                      "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                  )}
                >
                  <div className="relative flex-1 h-full flex items-center">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <CreditCard className="size-4" />
                    </div>
                    <input
                      inputMode="numeric"
                      value={values.documentNumber}
                      onChange={(event) =>
                        update(
                          "documentNumber",
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                      placeholder={
                        values.documentType === "DNI"
                          ? "12345678"
                          : values.documentType === "RUC"
                            ? "20123456789"
                            : "Número de carné"
                      }
                      maxLength={
                        values.documentType === "RUC"
                          ? 11
                          : values.documentType === "DNI"
                            ? 8
                            : 12
                      }
                      className="h-full w-full border-0 bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <Select
                    value={values.documentType}
                    onValueChange={(value) =>
                      update("documentType", value as "DNI" | "CE" | "RUC")
                    }
                  >
                    <SelectTrigger className="w-auto min-w-18 gap-1.5 rounded-none border-0 border-l border-border text-sm font-medium text-foreground shadow-none hover:bg-muted focus:ring-0 focus-visible:ring-0 [&>svg]:size-3.5 [&>svg]:opacity-60 cursor-pointer h-full px-3">
                      <span
                        data-slot="select-value"
                        className="text-sm font-medium"
                      >
                        {values.documentType}
                      </span>
                    </SelectTrigger>
                    <SelectContent align="end" className="min-w-36">
                      <SelectItem
                        value="DNI"
                        className="text-sm font-medium cursor-pointer"
                      >
                        DNI (8 dígitos)
                      </SelectItem>
                      <SelectItem
                        value="RUC"
                        className="text-sm font-medium cursor-pointer"
                      >
                        RUC (11 dígitos)
                      </SelectItem>
                      <SelectItem
                        value="CE"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Carné de extranjería
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </div>
          </div>
        </FormSection>

        {/* Sección: Dirección principal */}
        <FormSection
          title="Dirección principal"
          description="Se autocompletará en pedidos de delivery y facturación."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Dirección de entrega">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <MapPin className="size-4" />
                  </div>
                  <input
                    value={values.address}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="Av. Principal 123, Dpto. 402"
                    className={cn(crmInputClass, "pl-9")}
                  />
                </div>
              </Field>
            </div>

            <Field label="Distrito">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <MapPinned className="size-4" />
                </div>
                <input
                  value={values.district}
                  onChange={(event) => update("district", event.target.value)}
                  placeholder="Ej. Miraflores"
                  className={cn(crmInputClass, "pl-9")}
                />
              </div>
            </Field>

            <Field label="Ciudad / Región">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Building className="size-4" />
                </div>
                <input
                  value={values.city}
                  onChange={(event) => update("city", event.target.value)}
                  placeholder="Ej. Lima"
                  className={cn(crmInputClass, "pl-9")}
                />
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Referencia"
                hint="Indicaciones para facilitar la ubicación del delivery."
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Compass className="size-4" />
                  </div>
                  <input
                    value={values.reference}
                    onChange={(event) =>
                      update("reference", event.target.value)
                    }
                    placeholder="Ej. Altura cdra 5, portón negro frente al parque"
                    className={cn(crmInputClass, "pl-9")}
                  />
                </div>
              </Field>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Columna Derecha: Relación comercial (Sticky) */}
      <div className="flex flex-col gap-5 xl:sticky xl:top-5 h-fit">
        <FormSection
          title="Relación comercial"
          description="Estado, preferencias operativas y anotaciones."
        >
          <div className="flex flex-col gap-5">
            {/* Estado (Toggle switch) */}
            <Field label="Estado en el sistema">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 transition-colors">
                <div className="flex flex-col pr-2">
                  <span className="text-sm font-medium text-foreground">
                    {values.status === "activo"
                      ? "Cliente activo"
                      : "Cliente inactivo"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {values.status === "activo"
                      ? "Habilitado para compras y pedidos"
                      : "Pausado para nuevas operaciones"}
                  </span>
                </div>
                <Switch
                  checked={values.status === "activo"}
                  onCheckedChange={(checked) =>
                    update("status", checked ? "activo" : "inactivo")
                  }
                />
              </div>
            </Field>

            {/* Canal preferido (Chips) */}
            <Field
              label="Canal preferido"
              hint="Canal usual de contacto o compra del cliente."
            >
              <div className="flex flex-wrap items-center gap-2">
                {CHANNEL_OPTIONS.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = values.preferredChannel === channel.id;
                  return (
                    <Button
                      key={channel.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => update("preferredChannel", channel.id)}
                    >
                      <Icon />
                      {channel.label}
                    </Button>
                  );
                })}
              </div>
            </Field>

            {/* Etiquetas (Chips interactivos + input) */}
            <Field
              label="Etiquetas"
              hint="Clasifica y segmenta clientes en la cartera."
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Tag className="size-4" />
                </div>
                <input
                  value={values.tags}
                  onChange={(event) => update("tags", event.target.value)}
                  placeholder="Frecuente, VIP, Corporativo"
                  className={cn(crmInputClass, "pl-9")}
                />
              </div>

              {/* Sugerencias de chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {SUGGESTED_TAGS.map((tag) => {
                  const currentTags = values.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  const isIncluded = currentTags.some(
                    (t) => t.toLowerCase() === tag.toLowerCase(),
                  );
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 leading-none text-sm transition-colors",
                        isIncluded
                          ? "border-primary/40 bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {isIncluded ? (
                        <Check className="size-3" />
                      ) : (
                        <Plus className="size-3" />
                      )}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Notas internas */}
            <Field
              label="Notas internas"
              hint="Comentarios visibles únicamente para el equipo."
            >
              <textarea
                value={values.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Preferencias de entrega, observaciones de cobro, horarios especiales..."
                rows={4}
                className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </Field>
          </div>
        </FormSection>
      </div>
    </form>
  );
}
