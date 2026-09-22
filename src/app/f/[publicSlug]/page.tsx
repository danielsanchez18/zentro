import { PublicFormPage } from "@/components/app/forms/public/PublicFormPage";
export default async function Page({ params }: { params: Promise<{ publicSlug: string }> }) { const { publicSlug } = await params; return <PublicFormPage publicSlug={publicSlug} />; }
