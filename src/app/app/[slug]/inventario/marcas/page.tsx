import { BrandsModule } from "@/components/app/inventory/brands/overview/BrandsModule";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BrandsModule slug={slug} />;
}
