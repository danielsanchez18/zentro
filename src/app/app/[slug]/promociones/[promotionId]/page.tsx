import { PromotionDetailPage } from "@/components/app/promotions/details/PromotionDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string; promotionId: string }> }) {
  const { slug, promotionId } = await params;
  return <PromotionDetailPage slug={slug} promotionId={promotionId} />;
}
