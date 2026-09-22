import { AddFormPage } from "@/components/app/forms/add/AddFormPage";
import type { FormType } from "@/lib/mock/forms";

const templates: FormType[] = ["contacto", "cotizacion", "reserva", "encuesta", "personalizado"];
export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ plantilla?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const template = templates.includes(query.plantilla as FormType) ? query.plantilla as FormType : "personalizado";
  return <AddFormPage slug={slug} template={template} />;
}
