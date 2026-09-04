import { AddPurchasePage } from "@/components/app/purchases/add/AddPurchasePage";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <AddPurchasePage slug={slug} />; }
