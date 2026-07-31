"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["Duda", "Consulta", "Reclamo", "Soporte técnico"];

/**
 * Formulario de contacto con soporte.
 * TODO(0.2): POST /support-tickets + mostrar referencia de seguimiento.
 */
export const SupportForm = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubject("");
      setMessage("");
    }, 700);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-base font-medium font-sans">¿No encontraste lo que buscas?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Escríbenos y te respondemos por correo con una referencia de
        seguimiento.
      </p>

      <form
        className="mt-5 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-y-2">
          <label htmlFor="support-category" className="text-sm font-medium">
            Categoría
          </label>
          <select
            id="support-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-input bg-transparent text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
            className="h-fit px-4 py-2 w-full rounded-lg border border-input bg-transparent text-base! outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <label htmlFor="support-message" className="text-sm font-medium">
            Mensaje
          </label>
          <textarea
            id="support-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="Cuéntanos qué te sucede…"
            className="resize-none h-fit px-4 py-2 w-full rounded-lg border border-input bg-transparent text-base! outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={sending || !subject.trim() || !message.trim()}
            className="px-4 py-2 text-sm h-fit rounded-full font-semibold"
          >
            {sending && <Loader2 className="size-4 animate-spin" />}
            {sending ? "Enviando…" : "Enviar"}
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
