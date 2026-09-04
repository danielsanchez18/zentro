import { PurchaseDetailPage } from "@/components/app/purchases/details/PurchaseDetailPage";
export default async function Page({ params }: { params: Promise<{ slug: string; purchaseId: string }> }) { const { slug, purchaseId } = await params; return <PurchaseDetailPage slug={slug} purchaseId={purchaseId} />; }
