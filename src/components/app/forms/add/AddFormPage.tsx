"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import {
  formTemplateFields,
  formTypeLabel,
  type FormType,
} from "@/lib/mock/forms";
import { useFormsStore } from "@/stores/forms-store";
import { FormBuilder, type FormBuilderValues } from "../shared/FormBuilder";

export function AddFormPage({
  slug,
  template,
}: {
  slug: string;
  template: FormType;
}) {
  const router = useRouter();
  const createForm = useFormsStore((state) => state.createForm);
  const back = `/app/${slug}/formularios`;
  const formId = "add-zentro-form";
  const initial: FormBuilderValues = {
    name:
      template === "personalizado"
        ? ""
        : `Formulario de ${formTypeLabel(template).toLowerCase()}`,
    description: "",
    type: template,
    channel: "enlace",
    destination:
      template === "reserva"
        ? "agenda"
        : template === "encuesta"
          ? "ninguno"
          : "crm",
    fields: formTemplateFields[template].map((field) => ({
      ...field,
      id: `field_${crypto.randomUUID()}`,
    })),
    successMessage:
      "Gracias, recibimos tu información. Nos pondremos en contacto contigo pronto.",
  };
  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7">
        <Button
          type="button"
          variant="link"
          className="h-auto px-0"
          onClick={() => router.push(back)}
        >
          Regresar
        </Button>
        <h1 className="text-lg font-medium">Nuevo formulario</h1>
        <p className="text-sm text-muted-foreground">
          Plantilla: {formTypeLabel(template)}. Todo puede editarse.
        </p>
      </header>
      <FormBuilder
        id={formId}
        initial={initial}
        submitLabel="Guardar borrador"
        onCancel={() => router.push(back)}
        onSubmit={(values) => {
          const now = new Date().toISOString();
          createForm({
            id: `form_${crypto.randomUUID()}`,
            ...values,
            status: "borrador",
            fieldCount: values.fields.length,
            submissions: 0,
            unreadSubmissions: 0,
            completionRate: 0,
            publicPath: `/f/${
              values.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-") || "nuevo-formulario"
            }`,
            createdAt: now,
            updatedAt: now,
          });
          toastMsg.success("Formulario creado", "Se guardó como borrador.");
          router.push(back);
        }}
      />
    </div>
  );
}
