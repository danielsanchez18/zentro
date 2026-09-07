import { OrderDetailPage } from "@/components/app/orders/details/OrderDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string; orderId: string }> }) { const { slug, orderId } = await params; return <OrderDetailPage slug={slug} orderId={orderId} />; }
