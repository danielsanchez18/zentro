import { EditPromotionPage } from "@/components/app/promotions/edit/EditPromotionPage";

export default async function Page({ params }: { params: Promise<{ slug: string; promotionId: string }> }) {
  const { slug, promotionId } = await params;
  return <EditPromotionPage slug={slug} promotionId={promotionId} />;
}
