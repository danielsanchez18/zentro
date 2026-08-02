"use client";

import { useState } from "react";
import { BadgeCheck, Loader2, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastMsg } from "@/components/ui/toast-message";
import { MOCK_ORGANIZATIONS } from "@/lib/mock/organizations";
import { saveTicket } from "@/components/dashboard/ayuda/tickets";
import type { SupportTicket } from "@/components/dashboard/ayuda/types";

const CATEGORIES = ["Duda", "Consulta", "Reclamo", "Soporte técnico"] as const;

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

const TENANT_OPTIONS = [
  { label: "Ninguna (consulta general)", value: "none" },
  ...MOCK_ORGANIZATIONS.map((org) => ({ label: org.name, value: org.id })),
];

/**
 * Formulario de contacto con soporte.
 * TODO(0.2): POST /support-tickets (v1: ticket interno).
 */
export const SupportForm = () => {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [tenantId, setTenantId] = useState("none");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = () => {
    setSending(true);
    const nextReference = `ZNT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      const orgOption = TENANT_OPTIONS.find((option) => option.value === tenantId);
      const ticket: SupportTicket = {
        id: `ticket_${Date.now()}`,
        reference: nextReference,
        category,
        tenantName:
          tenantId === "none" ? "Ninguna (consulta general)" : orgOption?.label ?? "",
        subject,
        message,
        status: "OPEN",
        createdAt: new Date().toISOString(),
      };
      saveTicket(ticket);

      setSending(false);
      setReference(nextReference);
      setSubmitted(true);
      toastMsg.success("Ticket creado", `Referencia: ${nextReference}`);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setReference("");
    setSubject("");
    setMessage("");
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="size-7" />
        </div>
        <h3 className="mt-5 text-lg font-medium">Ticket creado</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Recibimos tu mensaje. Te responderemos por correo con esta
          referencia de seguimiento.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2">
          <span className="text-sm text-muted-foreground">Referencia:</span>
          <span className="font-mono text-sm font-medium text-foreground">
            {reference}
          </span>
        </div>
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-4 text-sm"
            onClick={handleReset}
          >
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden md:rounded-xl md:border border-border md:bg-card">
      <div className="flex items-start gap-3 pb-7 md:p-5 md:pb-0">
        <div>
          <h3 className="text-base font-sans font-medium">¿No encontraste lo que buscas?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Escríbenos y te respondemos por correo con una referencia de
            seguimiento.
          </p>
        </div>
      </div>

      <form
        className="space-y-4 md:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="support-category" className="text-sm font-medium">
              Categoría
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(String(value))}
              items={CATEGORY_OPTIONS}
            >
              <SelectTrigger
                id="support-category"
                className="w-full h-fit rounded-lg px-3 py-2"
              >
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="support-tenant" className="text-sm font-medium">
              Organización relacionada
            </label>
            <Select
              value={tenantId}
              onValueChange={(value) => setTenantId(String(value))}
              items={TENANT_OPTIONS}
            >
              <SelectTrigger
                id="support-tenant"
                className="w-full h-fit rounded-lg px-3 py-2"
              >
                <SelectValue placeholder="Selecciona una organización" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TENANT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="support-subject" className="text-sm font-medium">
            Asunto
          </label>
          <Input
            id="support-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Ej: No puedo cambiar de plan"
            className="h-fit px-3 py-2 w-full rounded-lg text-sm"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="support-message" className="text-sm font-medium">
              Mensaje
            </label>
            <span className="text-xs text-muted-foreground">
              {message.length}/1000
            </span>
          </div>
          <textarea
            id="support-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="Cuéntanos qué te sucede…"
            className="resize-none h-fit px-3 py-2 w-full rounded-lg border border-input bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={sending || !subject.trim() || !message.trim()}
            className="px-4 py-2 text-sm h-fit rounded-full font-semibold"
          >
            {sending && <Loader2 className="size-4 animate-spin" />}
            {sending ? "Enviando…" : "Enviar mensaje"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const SearchInput = () => {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar en la ayuda…"
        className="pl-10 text-base! rounded-lg w-full py-2 h-fit"
        aria-label="Buscar en la ayuda"
      />
    </div>
  );
};
