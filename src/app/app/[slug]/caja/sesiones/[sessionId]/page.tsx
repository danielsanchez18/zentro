import { CashSessionDetailPage } from "@/components/app/cash/details/CashSessionDetailPage";
export default async function Page({ params }: { params: Promise<{ slug: string; sessionId: string }> }) { const { slug, sessionId } = await params; return <CashSessionDetailPage slug={slug} sessionId={sessionId} />; }
