import { AddPromotionPage } from "@/components/app/promotions/add/AddPromotionPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AddPromotionPage slug={slug} />;
}
