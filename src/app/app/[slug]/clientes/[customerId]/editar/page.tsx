import { EditCustomerPage } from "@/components/app/crm/edit/EditCustomerPage";
export default async function Page({ params }: { params: Promise<{ slug: string; customerId: string }> }) { const { slug, customerId } = await params; return <EditCustomerPage slug={slug} customerId={customerId} />; }
