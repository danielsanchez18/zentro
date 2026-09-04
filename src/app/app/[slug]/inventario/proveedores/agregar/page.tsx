import { AddSupplierPage } from "@/components/app/inventory/suppliers/add/AddSupplierPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AddSupplierPage slug={slug} />;
}
