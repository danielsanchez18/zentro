import { BrandDetailPage } from "@/components/app/inventory/brands/details/BrandDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string; brandId: string }> }) {
  const { slug, brandId } = await params;
  return <BrandDetailPage slug={slug} brandId={brandId} />;
}
