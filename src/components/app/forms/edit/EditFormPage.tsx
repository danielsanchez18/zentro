"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useFormsStore } from "@/stores/forms-store";
import { FormBuilder, formToBuilderValues } from "../shared/FormBuilder";

export function EditFormPage({ slug, formId: itemId }: { slug: string; formId: string }) {
  const router = useRouter();
  const form = useFormsStore((state) => state.forms.find((item) => item.id === itemId));
  const updateForm = useFormsStore((state) => state.updateForm);
  const back = `/app/${slug}/formularios`;
  const editorId = "edit-zentro-form";

  if (!form) {
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <Button variant="link" className="px-0" onClick={() => router.push(back)}>
          Regresar
        </Button>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos este formulario.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7">
        <Button type="button" variant="link" className="h-auto px-0" onClick={() => router.push(back)}>
          Regresar
        </Button>
        <h1 className="text-lg font-medium">Editar formulario</h1>
        <p className="text-sm text-muted-foreground">
          {form.status === "activo"
            ? "Los cambios se guardarán en el prototipo publicado."
            : "Actualiza la estructura y configuración del borrador."}
        </p>
      </header>
      <FormBuilder
        id={editorId}
        initial={formToBuilderValues(form)}
        submitLabel="Guardar cambios"
        onCancel={() => router.push(back)}
        onSubmit={(values) => {
          updateForm(itemId, { ...values, fieldCount: values.fields.length });
          toastMsg.success("Formulario actualizado", form.name);
          router.push(back);
        }}
      />
    </div>
  );
}
