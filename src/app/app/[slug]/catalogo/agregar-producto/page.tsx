import { AddProductPage } from "@/components/app/catalog/products/add/AddProductPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AddProductPage slug={slug} />;
}
