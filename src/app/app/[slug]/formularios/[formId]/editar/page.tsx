import { EditFormPage } from "@/components/app/forms/edit/EditFormPage";
export default async function Page({ params }: { params: Promise<{ slug: string; formId: string }> }) { const { slug, formId } = await params; return <EditFormPage slug={slug} formId={formId} />; }
