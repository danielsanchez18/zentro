import { BillingDetailPage } from "@/components/app/billing/details/BillingDetailPage";
export default async function Page({ params }: { params: Promise<{ slug: string; invoiceId: string }> }) { const { slug, invoiceId } = await params; return <BillingDetailPage slug={slug} invoiceId={invoiceId} />; }
