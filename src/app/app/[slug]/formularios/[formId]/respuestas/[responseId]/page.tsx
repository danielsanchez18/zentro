import { FormResponseDetailPage } from "@/components/app/forms/responses/FormResponseDetailPage";
export default async function Page({ params }: { params: Promise<{ slug: string; formId: string; responseId: string }> }) { const { slug, formId, responseId } = await params; return <FormResponseDetailPage slug={slug} formId={formId} responseId={responseId} />; }
