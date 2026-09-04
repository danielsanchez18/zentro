import { SupplierDetailPage } from "@/components/app/inventory/suppliers/details/SupplierDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string; supplierId: string }> }) {
  const { slug, supplierId } = await params;
  return <SupplierDetailPage slug={slug} supplierId={supplierId} />;
}
