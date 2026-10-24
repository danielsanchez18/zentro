"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCategories } from "@/components/landing/faq/data";

/**
 * Preguntas frecuentes del Hub.
 * Usa la misma fuente que /faq de la landing para que las respuestas no diverjan.
 */
export const FaqAccordion = ({ query }: { query: string }) => {
  const [categoryId, setCategoryId] = useState<string>("ALL");
  const normalized = query.trim().toLowerCase();

  const groups = faqCategories
    .filter((category) => categoryId === "ALL" || category.id === categoryId)
    .map((category) => ({
      ...category,
      questions: category.questions.filter((item) => {
        if (!normalized) return true;
        const answer = typeof item.answer === "string" ? item.answer : "";
        return `${item.question} ${answer}`.toLowerCase().includes(normalized);
      }),
    }))
    .filter((category) => category.questions.length > 0);

  const chips = [{ id: "ALL", label: "Todas" }, ...faqCategories.map(({ id, label }) => ({ id, label }))];

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Categorías de preguntas" className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={categoryId === chip.id}
            onClick={() => setCategoryId(chip.id)}
            className={cn(
              "rounded-sm px-2.5 py-1.5 text-sm font-medium transition-colors",
              categoryId === chip.id
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border">
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description="Prueba con otras palabras o escríbenos desde la pestaña Escribir a soporte."
          />
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <section
              key={group.id}
              aria-labelledby={`faq-${group.id}`}
              className="rounded-sm border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2.5 py-1.5">
                <span className="flex size-8 items-center justify-center rounded-sm bg-muted text-foreground">
                  <group.icon className="size-4" />
                </span>
                <div>
                  <h3 id={`faq-${group.id}`} className="text-sm font-medium">
                    {group.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <Accordion>
                {group.questions.map((item) => (
                  <AccordionItem key={item.question} value={item.question} className="border-border">
                    <AccordionTrigger className="py-3 font-sans text-sm">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
