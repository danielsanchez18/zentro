import { AddCustomerPage } from "@/components/app/crm/add/AddCustomerPage";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <AddCustomerPage slug={slug} />; }
