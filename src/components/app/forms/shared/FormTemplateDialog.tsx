"use client";

import React from "react";
import {
  CalendarDays,
  FileQuestion,
  MessageSquareText,
  Plus,
  ReceiptText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { FormType } from "@/lib/mock/forms";

interface FormTemplateConfig {
  type: FormType;
  title: string;
  badge: string;
  description: string;
  fieldsPreview: string[];
  icon: typeof MessageSquareText;
  iconBg: string;
  iconColor: string;
}

const TEMPLATES: FormTemplateConfig[] = [
  {
    type: "contacto",
    title: "Formulario de contacto",
    badge: "CRM & Leads",
    description:
      "Diseñado para captar consultas directas de clientes desde tu web o link.",
    fieldsPreview: ["Nombre", "Correo", "Teléfono", "Mensaje"],
    icon: MessageSquareText,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    type: "cotizacion",
    title: "Solicitud de cotización",
    badge: "Comercial",
    description:
      "Recopila especificaciones, requerimientos del cliente y presupuestos.",
    fieldsPreview: ["Empresa", "Requerimiento", "Presupuesto", "Contacto"],
    icon: ReceiptText,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    type: "reserva",
    title: "Reserva de citas",
    badge: "Agenda",
    description:
      "Permite a tus clientes solicitar citas con fecha y servicio preferido.",
    fieldsPreview: ["Servicio", "Fecha preferida", "Teléfono", "Datos cliente"],
    icon: CalendarDays,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    type: "encuesta",
    title: "Encuesta de satisfacción",
    badge: "Feedback",
    description:
      "Mide la experiencia y satisfacción con valoraciones y comentarios libres.",
    fieldsPreview: ["Puntuación", "Opinión", "Sugerencias"],
    icon: FileQuestion,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export function FormTemplateDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: FormType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle>¿Cómo deseas empezar?</DialogTitle>
          <DialogDescription>
            Elige una plantilla base prediseñada para acelerar el trabajo o crea
            un formulario totalmente a medida. Podrás editar todos los campos
            después.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {/* Tarjetas de plantillas estructuradas */}
          {TEMPLATES.map(({ type, title, badge, description, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className="group relative flex flex-col justify-between gap-3.5 rounded-2xl border border-border bg-card hover:bg-accent/30 dark:hover:bg-accent/30 hover:border-primary p-4 text-left transition-all duration-200 cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between gap-2">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent transition-all duration-200",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="text-xs font-medium px-2 py-2 leading-none h-fit rounded-md bg-muted/80 text-foreground border border-border/60">
                    {badge}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </button>
          ))}

          {/* Opción destacada: Crear desde cero */}
          <button
            type="button"
            onClick={() => onSelect("personalizado")}
            className="group sm:col-span-2 relative gap-4 rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-accent/30 hover:border-primary p-4 text-left transition-all duration-200 cursor-pointer"
          >
            <div className="flex gap-3.5 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent transition-all duration-200">
                <Plus className="size-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Crear formulario en blanco
                  </span>
                  <p className="text-xs font-medium px-2 py-2 leading-none h-fit rounded-md bg-muted/80 text-foreground border border-border/60">
                    Lienzo libre
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Empieza sin campos predeterminados y añade exactamente los
                  elementos que necesitas desde el constructor visual.
                </p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
