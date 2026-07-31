export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "REVOKED";

export interface Invitation {
  id: string;
  orgName: string;
  invitedBy: string;
  role: string;
  status: InvitationStatus;
  expiresIn?: string; // solo pendientes
  receivedAt: string; // para historial
}
