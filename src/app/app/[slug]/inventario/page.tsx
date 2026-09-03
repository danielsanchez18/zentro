import { InventoryModule } from "@/components/app/inventory/overview/InventoryModule";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <InventoryModule slug={slug} />;
}
