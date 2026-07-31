"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ContactSection } from "@/components/dashboard/ayuda/ContactSection";
import { FaqAccordion } from "@/components/dashboard/ayuda/FaqAccordion";
import {
  SearchInput,
  SupportForm,
} from "@/components/dashboard/ayuda/SupportForm";

const TABS = [
  { id: "faq", label: "Preguntas frecuentes" },
  { id: "contacto", label: "Contacto" },
  { id: "mensaje", label: "Mensaje" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const AyudaPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("faq");

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Ayuda y soporte</h1>
        <p className="text-sm text-muted-foreground">
          Todo lo que necesitas para resolver tus dudas.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Secciones de ayuda"
        className="flex w-full flex-wrap gap-1 rounded-xl border border-border bg-muted/50 p-1 sm:inline-flex sm:w-auto"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors sm:flex-none",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "faq" && (
        <div className="space-y-8">
          <div className="max-w-full">
            <SearchInput />
          </div>
          <FaqAccordion />
        </div>
      )}

      {activeTab === "contacto" && <ContactSection />}

      {activeTab === "mensaje" && <SupportForm />}
    </div>
  );
};
