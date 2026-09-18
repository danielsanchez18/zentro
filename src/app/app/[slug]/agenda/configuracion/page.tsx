import { AgendaSettingsModule } from "@/components/app/agenda/settings/AgendaSettingsModule";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AgendaSettingsModule slug={slug} />;
}
