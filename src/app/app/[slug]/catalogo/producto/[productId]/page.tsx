import { ProductDetailPage } from "@/components/app/catalog/product-detail/ProductDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;
  return <ProductDetailPage slug={slug} productId={productId} />;
}
