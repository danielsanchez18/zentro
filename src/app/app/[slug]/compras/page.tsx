import { PurchasesModule } from "@/components/app/purchases/overview/PurchasesModule";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PurchasesModule slug={slug} />;
}
