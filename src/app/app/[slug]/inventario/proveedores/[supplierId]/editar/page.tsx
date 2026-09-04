import { EditSupplierPage } from "@/components/app/inventory/suppliers/edit/EditSupplierPage";

export default async function Page({ params }: { params: Promise<{ slug: string; supplierId: string }> }) {
  const { slug, supplierId } = await params;
  return <EditSupplierPage slug={slug} supplierId={supplierId} />;
}
