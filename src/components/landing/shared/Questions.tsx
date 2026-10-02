"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questionsList = [
  {
    id: "item-1",
    question: "¿Puedo probar Zentro gratis?",
    answer:
      "Sí. Crea tu cuenta y empieza gratis, sin tarjeta de crédito ni compromisos. Tienes 30 días de prueba para explorar los módulos que necesites: catálogo, inventario, POS, CRM y reportes. Solo activas un plan cuando quieras seguir trabajando con Zentro.",
  },
  {
    id: "item-2",
    question: "¿Puedo cancelar en cualquier momento?",
    answer:
      "Sí. Puedes cancelar desde tu panel de suscripciones cuando quieras, sin permanencia forzosa ni penalizaciones. Solo dejas de pagar cuando decidas no continuar, y mantienes el acceso hasta el final del periodo que ya pagaste.",
  },
  {
    id: "item-3",
    question: "¿Funciona para varios locales o sucursales?",
    answer:
      "Sí. Puedes tener una o varias sucursales. Cada una gestiona su propio inventario, ventas de POS y caja, sin mezclar stock entre sedes. Además, tu organización obtiene una vista consolidada de todas las sucursales para comparar rendimiento y decidir con datos.",
  },
  {
    id: "item-4",
    question: "¿Cómo funciona el sistema de precios?",
    answer:
      "Zentro trabaja con planes por niveles: empiezas con lo esencial y activas capacidades adicionales según las necesidades de tu negocio. Puedes subir o bajar de plan en cualquier momento, y los cambios se aplican según tu ciclo de facturación.",
  },
  {
    id: "item-5",
    question: "¿Qué seguridad tiene Zentro?",
    answer:
      "La seguridad es una prioridad: autenticación con JWT, contraseñas cifradas con bcrypt, aislamiento de datos por organización (multi-tenant por fila) y auditoría de las acciones sensibles. Además, el acceso se controla con roles y permisos, para que cada miembro de tu equipo vea solo lo que le corresponde.",
  },
  {
    id: "item-6",
    question: "¿Necesito instalar algo?",
    answer:
      "No. Zentro funciona 100% en la web: no necesitas instalar ni actualizar nada. Funciona desde cualquier navegador moderno en computadora, tablet o móvil, ideal para usarlo en caja, en almacén o desde casa.",
  },
];

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
        onValueChange={(val: any) => {
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
