import { AddCategoryPage } from "@/components/app/catalog/categories/add/AddCategoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AddCategoryPage slug={slug} />;
}
