"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactSection } from "@/components/dashboard/ayuda/ContactSection";
import { FaqAccordion } from "@/components/dashboard/ayuda/FaqAccordion";
import { TicketsList } from "@/components/dashboard/ayuda/TicketsList";
import { SupportForm } from "@/components/dashboard/ayuda/SupportForm";
import { hubButton, hubTabs } from "@/components/dashboard/shared/styles";

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
            className="h-9 w-full rounded-(--hub-radius-control) border border-border bg-card pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40"
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
            className={hubButton.ghost}
          >
            Reabrir guía
          </button>
          <button
            type="button"
            onClick={handleStartDemo}
            className={hubButton.secondary}
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
          className={hubTabs.list}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                hubTabs.tab,
                activeTab === tab.id
                  ? hubTabs.active
                  : hubTabs.idle,
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
