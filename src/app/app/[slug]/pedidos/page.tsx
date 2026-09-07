import { OrdersModule } from "@/components/app/orders/overview/OrdersModule";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OrdersModule slug={slug} />;
}
