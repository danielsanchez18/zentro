import { InvitationsPage } from "@/components/dashboard/invitaciones/InvitationsPage";
import { hubMetadata } from "@/app/dashboard/metadata";

export const metadata = hubMetadata(
  "Invitaciones",
  "Acepta o rechaza las invitaciones para unirte a otras organizaciones.",
);

export default function InvitacionesPage() {
  return (
    <div className="w-full max-w-350 mx-auto px-2">
      <InvitationsPage />
    </div>
  );
}
