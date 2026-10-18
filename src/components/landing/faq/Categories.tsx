"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqCategories } from "./data";

const firstItem = (categoryId: string) => `${categoryId}-0`;

export function Categories() {
  const [activeId, setActiveId] = useState(faqCategories[0].id);
  const [openItems, setOpenItems] = useState<string[]>([
    firstItem(faqCategories[0].id),
  ]);

  const current =
    faqCategories.find((category) => category.id === activeId) ||
    faqCategories[0];

  const selectCategory = (categoryId: string) => {
    setActiveId(categoryId);
    setOpenItems([firstItem(categoryId)]);
  };

  return (
    <section className="py-10 space-y-10">
      {/* Tabs: ghost por defecto y glass al estar activo */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Categorías de preguntas"
          className="flex items-center gap-x-1.5 overflow-x-auto scrollbar-hide p-1 border border-border rounded-full bg-accent max-w-full"
        >
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const isActive = category.id === activeId;

            return (
              <Button
                key={category.id}
                role="tab"
                id={`faq-tab-${category.id}`}
                aria-selected={isActive}
                aria-controls={`faq-panel-${category.id}`}
                variant={isActive ? "glass" : "ghost"}
                onClick={() => selectCategory(category.id)}
                className="cursor-pointer px-3.5 rounded-full py-2 h-fit text-sm transition-all select-none"
              >
                {/* <Icon className="size-4" /> */}
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Preguntas de la categoría activa (mismo estilo que Questions del home) */}
      <div
        role="tabpanel"
        id={`faq-panel-${current.id}`}
        aria-labelledby={`faq-tab-${current.id}`}
        className="max-w-2xl mx-auto"
      >
        <Accordion
          value={openItems}
          onValueChange={(val: unknown) => {
            if (Array.isArray(val)) {
              setOpenItems(val);
            } else if (typeof val === "string") {
              setOpenItems([val]);
            } else {
              setOpenItems([]);
            }
          }}
          className="w-full"
        >
          {current.questions.map((item, index) => {
            const value = `${current.id}-${index}`;
            const isOpen = openItems.includes(value);

            return (
              <AccordionItem
                key={value}
                value={value}
                className={`border-transparent mb-2 rounded-xl transition-all duration-300 ${
                  isOpen ? "glass overflow-hidden shadow-sm" : ""
                }`}
              >
                <AccordionTrigger
                  className={`cursor-pointer text-base text-gray-900 dark:text-neutral-200 font-medium text-start hover:no-underline rounded-xl px-6 py-4 transition-all **:data-[slot=accordion-trigger-icon]:size-5.5 ${
                    isOpen
                      ? "rounded-b-none"
                      : "hover:bg-muted dark:hover:bg-neutral-800/50"
                  }`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700 dark:text-neutral-300 text-start px-6 pb-5 pt-1 leading-relaxed [&_a]:text-primary [&_a]:hover:text-primary">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
