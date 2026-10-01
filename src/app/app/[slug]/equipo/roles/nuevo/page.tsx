import { AddRolePage } from "@/components/app/team/roles/AddRolePage";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ duplicate?: string }>;
}) {
  const { slug } = await params;
  const { duplicate } = await searchParams;

  return <AddRolePage slug={slug} duplicateId={duplicate} />;
}
