import { SuppliersModule } from "@/components/app/inventory/suppliers/overview/SuppliersModule";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SuppliersModule slug={slug} />;
}
