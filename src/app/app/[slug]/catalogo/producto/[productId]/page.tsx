import { ProductDetailPage } from "@/components/app/catalog/products/details/ProductDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;
  return <ProductDetailPage slug={slug} productId={productId} />;
}
