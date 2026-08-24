import { CategoryDetailPage } from "@/components/app/catalog/categories/CategoryDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; categoryId: string }>;
}) {
  const { slug, categoryId } = await params;
  return <CategoryDetailPage slug={slug} categoryId={categoryId} />;
}
