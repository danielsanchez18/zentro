import { CustomerDetailPage } from "@/components/app/crm/details/CustomerDetailPage";
export default async function Page({ params }: { params: Promise<{ slug: string; customerId: string }> }) { const { slug, customerId } = await params; return <CustomerDetailPage slug={slug} customerId={customerId} />; }
