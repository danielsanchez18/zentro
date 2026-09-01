import { EditCategoryPage } from "@/components/app/catalog/categories/edit/EditCategoryPage";

export default async function Page({ params }: { params: Promise<{ slug: string; categoryId: string }> }) {
  const { slug, categoryId } = await params;
  return <EditCategoryPage slug={slug} categoryId={categoryId} />;
}
