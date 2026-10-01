import { EditRolePage } from "@/components/app/team/roles/EditRolePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>;
}) {
  const { slug, roleId } = await params;

  return <EditRolePage slug={slug} roleId={roleId} />;
}
