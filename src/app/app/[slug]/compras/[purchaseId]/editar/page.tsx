import { EditPurchasePage } from "@/components/app/purchases/edit/EditPurchasePage";
export default async function Page({ params }: { params: Promise<{ slug: string; purchaseId: string }> }) { const { slug, purchaseId } = await params; return <EditPurchasePage slug={slug} purchaseId={purchaseId} />; }
