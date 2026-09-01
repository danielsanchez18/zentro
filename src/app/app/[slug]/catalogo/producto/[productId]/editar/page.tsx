import { EditProductPage } from "@/components/app/catalog/products/edit/EditProductPage";

export default async function Page({ params }: { params: Promise<{ slug: string; productId: string }> }) {
  const { slug, productId } = await params;
  return <EditProductPage slug={slug} productId={productId} />;
}
