"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/components/ui/toast-message";
import {
  submitContactMessage,
  type ContactTopic,
} from "@/lib/services/contact.service";

const topics: Array<{ id: ContactTopic; label: string }> = [
  { id: "demo", label: "Ventas y demo" },
  { id: "soporte", label: "Soporte" },
  { id: "alianzas", label: "Alianzas" },
  { id: "otro", label: "Otro" },
];

export function ContactForm() {
  const [topic, setTopic] = useState<ContactTopic>(topics[0].id);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const organization = String(data.get("empresa") ?? "").trim();
    const phone = String(data.get("telefono") ?? "").trim();
    const message = String(data.get("mensaje") ?? "").trim();

    if (message.length < 10) {
      showError("Mensaje muy corto", "Cuéntanos un poco más (mínimo 10 caracteres).");
      return;
    }

    setIsSending(true);
    try {
      await submitContactMessage({
        topic,
        name,
        email,
        organization: organization || undefined,
        phone: phone || undefined,
        message,
      });

      form.reset();
      setTopic(topics[0].id);
      showSuccess(
        "Mensaje enviado",
        "Gracias por escribirnos. Te responderemos lo antes posible.",
      );
    } catch (error) {
      showError(
        "No se pudo enviar",
        error instanceof Error ? error.message : "Inténtalo de nuevo en unos minutos.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Envíanos un mensaje</h2>
        <p className="text-muted-foreground">
          Completa el formulario y te contactamos.
        </p>
      </div>

      {/* Motivo */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium leading-none mb-3">
          ¿En qué te ayudamos?
        </legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <label key={item.id} className="cursor-pointer">
              <input
                type="radio"
                name="motivo"
                value={item.id}
                checked={topic === item.id}
                onChange={() => setTopic(item.id)}
                className="peer sr-only"
              />
              <span className="inline-flex rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:bg-muted peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Tu nombre"
            className="rounded-full px-4 py-2 h-fit"
            required
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@empresa.com"
            className="rounded-full px-4 py-2 h-fit"
            required
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="empresa">
            Empresa <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="empresa"
            name="empresa"
            placeholder="Nombre de tu negocio"
            className="rounded-full px-4 py-2 h-fit"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="telefono">
            Teléfono <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="+51 999 999 999"
            className="rounded-full px-4 py-2 h-fit"
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          placeholder="Cuéntanos sobre tu negocio y en qué podemos ayudarte..."
          className="rounded-2xl px-4 py-2 h-fit resize-none"
          required
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-4 sm:justify-between">
        <p className="text-muted-foreground">
          Al enviar aceptas nuestra{" "}
          <Link
            href="/politica-de-privacidad"
            className="text-primary hover:underline"
          >
            Política de privacidad
          </Link>
          .
        </p>
        <Button
          type="submit"
          disabled={isSending}
          size={"lg"}
          className="rounded-full cursor-pointer text-base"
        >
          {isSending && <Loader2 className="size-4 animate-spin" />}
          {isSending ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}
