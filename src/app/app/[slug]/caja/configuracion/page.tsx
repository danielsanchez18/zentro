import { CashSettingsModule } from "@/components/app/cash/settings/CashSettingsModule";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <CashSettingsModule slug={slug} />; }
