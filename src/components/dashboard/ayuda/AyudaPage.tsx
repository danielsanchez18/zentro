"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactSection } from "@/components/dashboard/ayuda/ContactSection";
import { FaqAccordion } from "@/components/dashboard/ayuda/FaqAccordion";
import { TicketsList } from "@/components/dashboard/ayuda/TicketsList";
import { SupportForm } from "@/components/dashboard/ayuda/SupportForm";

const TABS = [
  { id: "faq", label: "Preguntas frecuentes" },
  { id: "contacto", label: "Contacto" },
  { id: "mensaje", label: "Escribir a soporte" },
  { id: "tickets", label: "Mis tickets" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const AyudaPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("faq");
  const [query, setQuery] = useState("");

  const handleReopenOnboarding = () => {
    sessionStorage.removeItem("zentro-onboarding-skipped");
    router.push("/dashboard");
  };

  const handleStartDemo = () => {
    sessionStorage.setItem("zentro-demo-request", "1");
    router.push("/dashboard");
  };

  return (
    <div className="space-y-2">
      <div className="space-y-4 rounded-sm bg-card px-4 py-3">
        <div>
          <h1 className="font-sans text-lg font-medium">Ayuda y soporte</h1>
          <p className="text-sm text-muted-foreground">
            Resuelve tus dudas o escríbenos si necesitas ayuda con tu cuenta u organizaciones.
          </p>
        </div>
        <label className="relative block">
          <span className="sr-only">Buscar en la ayuda</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveTab("faq");
            }}
            placeholder="Buscar en preguntas frecuentes…"
            className="h-10 w-full rounded-sm border border-border bg-card pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
            <Rocket className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">¿Empezando con Zentro?</p>
            <p className="text-sm text-muted-foreground">
              Reabre la guía de primeros pasos o recorre el panel con la demo.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReopenOnboarding}
            className="rounded-sm px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Reabrir guía
          </button>
          <button
            type="button"
            onClick={handleStartDemo}
            className="flex items-center gap-1.5 rounded-sm bg-muted px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted/70"
          >
            <Sparkles className="size-4" />
            Explorar demo
          </button>
        </div>
      </div>

      <section aria-label="Contenido de ayuda" className="space-y-5 rounded-sm bg-card px-4 py-3">
        <div
          role="tablist"
          aria-label="Secciones de ayuda"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 sm:mx-0 sm:w-fit sm:rounded-sm sm:bg-muted sm:p-1"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-sm px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-foreground text-background sm:bg-card sm:text-foreground sm:shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground sm:bg-transparent",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "faq" && <FaqAccordion query={query} />}
        {activeTab === "contacto" && <ContactSection />}
        {activeTab === "mensaje" && <SupportForm />}
        {activeTab === "tickets" && <TicketsList />}
      </section>
    </div>
  );
};
