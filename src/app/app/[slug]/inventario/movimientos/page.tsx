import { MovementsModule } from "@/components/app/inventory/movements/overview/MovementsModule";

export default async function InventoryMovementsPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ producto?: string }> }) {
  const [{ slug }, { producto }] = await Promise.all([params, searchParams]);
  return <MovementsModule slug={slug} initialItemId={producto} />;
}
