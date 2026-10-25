"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCategories } from "@/components/landing/faq/data";

const featuredQuestions = [
  "¿Puedo probar Zentro gratis?",
  "¿Puedo cambiar de plan cuando quiera?",
  "¿Puedo cancelar mi suscripción?",
  "¿Necesito instalar algo para usarlo?",
  "¿Funciona para varios locales o sucursales?",
  "¿Mis datos están seguros?",
];

const allQuestions = faqCategories.flatMap((category) => category.questions);

// Subconjunto curado tomado de la FAQ para que las respuestas sean idénticas a /faq
const questionsList = featuredQuestions.flatMap((text, index) => {
  const found = allQuestions.find((q) => q.question === text);
  return found ? [{ id: `item-${index + 1}`, ...found }] : [];
});

export function Questions() {
  const [openItems, setOpenItems] = useState<string[]>(["item-1"]);

  return (
    <section className="py-20 space-y-15 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">
          Tus preguntas, las respondemos
        </h2>
        <p className="text-gray-800 dark:text-neutral-400">
          Respuestas a las preguntas más frecuentes.
        </p>
      </div>

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
        {questionsList.map((item) => {
          const isOpen = openItems.includes(item.id);

          return (
            <AccordionItem
              key={item.id}
              value={item.id}
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
              <AccordionContent className="text-base text-gray-700 dark:text-neutral-300 text-start px-6 pb-5 pt-1 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="text-center font-heading text-gray-700 dark:text-neutral-400">
        ¿No encuentras tu respuesta?{" "}
        <Link href="/faq" className="font-medium text-primary hover:underline">
          Ver todas las preguntas
        </Link>
      </div>
    </section>
  );
}
