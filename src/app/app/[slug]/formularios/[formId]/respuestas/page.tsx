import { FormResponsesPage } from "@/components/app/forms/responses/FormResponsesPage";
export default async function Page({ params }: { params: Promise<{ slug: string; formId: string }> }) { const { slug, formId } = await params; return <FormResponsesPage slug={slug} formId={formId} />; }
