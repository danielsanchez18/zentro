import { apiRequest } from "@/lib/api/client";

/** Servicios de "Mi cuenta" (`/api/v1/users/me/*`). Requieren sesión. */

export interface AccountProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  /** false si la cuenta se creó con Google y aún no definió contraseña. */
  hasPassword: boolean;
  /** Última vez que se creó o cambió la contraseña. */
  passwordSetAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AccessProvider = "PASSWORD" | "GOOGLE";

export interface AccessMethod {
  provider: AccessProvider;
  connected: boolean;
  email: string | null;
  connectedAt: string | null;
}

export interface AccountSession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
}

export type NotificationKey =
  | "SECURITY"
  | "RECOVERY"
  | "INVITATIONS"
  | "BILLING"
  | "BILLING_REMINDERS"
  | "ACTIVITY_DIGEST"
  | "PRODUCT_UPDATES";

export interface NotificationPreference {
  key: NotificationKey;
  /** Transaccional: siempre activo. */
  required: boolean;
  /** Opcional pero importante: se confirma antes de apagarlo. */
  sensitive: boolean;
  emailEnabled: boolean;
}

export const getProfile = () => apiRequest<{ user: AccountProfile }>("/users/me", { auth: true });

export const updateProfile = (input: { name?: string; phone?: string }) =>
  apiRequest<{ user: AccountProfile }>("/users/me", { method: "PATCH", body: input, auth: true });

/** `avatarUrl`: data URL ya redimensionada; null quita la foto. */
export const updateAvatar = (avatarUrl: string | null) =>
  apiRequest<{ user: AccountProfile }>("/users/me/avatar", { method: "PUT", body: { avatarUrl }, auth: true });

export const sendEmailVerification = () =>
  apiRequest<{ message: string }>("/users/me/email-verification", { method: "POST", auth: true });

export const confirmEmailVerification = (code: string) =>
  apiRequest<{ user: AccountProfile }>("/users/me/email-verification/confirm", {
    method: "POST",
    body: { code },
    auth: true,
  });

/** Paso 1 del cambio: 400 si la contraseña actual es incorrecta. */
export const verifyCurrentPassword = (password: string) =>
  apiRequest<{ valid: true }>("/users/me/password/verify", { method: "POST", body: { password }, auth: true });

export const changePassword = (input: { currentPassword?: string; newPassword: string }) =>
  apiRequest<{ message: string }>("/users/me/password", { method: "POST", body: input, auth: true });

export const getAccessMethods = () => apiRequest<{ methods: AccessMethod[] }>("/users/me/identities", { auth: true });

/** Devuelve la URL de Google para vincular la cuenta; el navegador debe ir a ella. */
export const startGoogleLink = () =>
  apiRequest<{ url: string }>("/users/me/identities/google/link", { method: "POST", auth: true });

export const unlinkAccessMethod = (provider: AccessProvider) =>
  apiRequest<{ methods: AccessMethod[] }>(`/users/me/identities/${provider.toLowerCase()}`, {
    method: "DELETE",
    auth: true,
  });

export const getSessions = () => apiRequest<{ sessions: AccountSession[] }>("/users/me/sessions", { auth: true });

export const revokeSession = (id: string) =>
  apiRequest<void>(`/users/me/sessions/${id}`, { method: "DELETE", auth: true });

export const revokeOtherSessions = () => apiRequest<void>("/users/me/sessions", { method: "DELETE", auth: true });

export const getNotificationPreferences = () =>
  apiRequest<{ preferences: NotificationPreference[] }>("/users/me/notification-preferences", { auth: true });

export const updateNotificationPreference = (key: NotificationKey, emailEnabled: boolean) =>
  apiRequest<{ preferences: NotificationPreference[] }>(`/users/me/notification-preferences/${key.toLowerCase()}`, {
    method: "PATCH",
    body: { emailEnabled },
    auth: true,
  });

/* ------------------- Verificación en dos pasos (TOTP) ------------------- */

export interface TwoFactorStatus {
  enabled: boolean;
  enabledAt: string | null;
  recoveryCodesLeft: number;
}

export interface TwoFactorSetup {
  /** Clave en base32 para ingresarla a mano si no se puede escanear. */
  secret: string;
  otpauthUrl: string;
  /** QR como data URL PNG. */
  qrCode: string;
}

export const getTwoFactorStatus = () => apiRequest<TwoFactorStatus>("/users/me/2fa", { auth: true });

export const setupTwoFactor = () => apiRequest<TwoFactorSetup>("/users/me/2fa/setup", { method: "POST", auth: true });

export const enableTwoFactor = (code: string) =>
  apiRequest<{ recoveryCodes: string[] }>("/users/me/2fa/enable", { method: "POST", body: { code }, auth: true });

export const disableTwoFactor = (input: { code: string; password?: string }) =>
  apiRequest<void>("/users/me/2fa/disable", { method: "POST", body: input, auth: true });

export const regenerateRecoveryCodes = (code: string) =>
  apiRequest<{ recoveryCodes: string[] }>("/users/me/2fa/recovery-codes", { method: "POST", body: { code }, auth: true });
