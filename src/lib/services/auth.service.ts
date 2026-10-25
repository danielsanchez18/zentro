import { apiRequest } from '@/lib/api/client';
import type { AuthResponse, LoginInput, RegisterInput, TwoFactorRequired, User } from '@/types/auth';

/**
 * Servicios de autenticación contra la API real (`/api/v1/auth/*`).
 * El refresh token lo maneja el navegador en una cookie httpOnly.
 */

export async function loginService(input: LoginInput): Promise<{ data: AuthResponse | TwoFactorRequired }> {
  const data = await apiRequest<AuthResponse | TwoFactorRequired>('/auth/login', { method: 'POST', body: input });
  return { data };
}

/** Segundo paso con 2FA: código de la app (6 dígitos) o de respaldo. */
export function twoFactorLoginService(challenge: string, code: string): Promise<AuthResponse> {
  return apiRequest('/auth/2fa', { method: 'POST', body: { challenge, code } });
}

export function checkEmailService(email: string): Promise<{ exists: boolean }> {
  return apiRequest('/auth/check-email', { method: 'POST', body: { email } });
}

export async function registerService(input: RegisterInput): Promise<{ data: AuthResponse }> {
  const data = await apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: input });
  return { data };
}

/** Renueva la sesión con la cookie de refresh. Lanza ApiError(401) si expiró. */
export function refreshSessionService(): Promise<AuthResponse> {
  return apiRequest('/auth/refresh', { method: 'POST' });
}

export function logoutService(): Promise<void> {
  return apiRequest('/auth/logout', { method: 'POST' });
}

export function meService(): Promise<{ user: User }> {
  return apiRequest('/auth/me', { auth: true });
}

/** Solicita el código de recuperación; llega por correo. */
export function forgotPasswordService(email: string): Promise<{ message: string }> {
  return apiRequest('/auth/forgot-password', { method: 'POST', body: { email } });
}

export function verifyCodeService(email: string, code: string): Promise<{ valid: boolean }> {
  return apiRequest('/auth/verify-code', { method: 'POST', body: { email, code } });
}

export async function resetPasswordService(email: string, code: string, newPassword: string): Promise<void> {
  await apiRequest('/auth/reset-password', { method: 'POST', body: { email, code, newPassword } });
}

/* ---------- Vínculo pendiente (Google con correo de una cuenta existente) ---------- */

export interface PendingLinkInfo {
  email: string;
  name: string;
  provider: 'GOOGLE' | 'APPLE';
  hasPassword: boolean;
}

export function getPendingLinkService(token: string): Promise<PendingLinkInfo> {
  return apiRequest(`/auth/oauth/pending?token=${encodeURIComponent(token)}`);
}

export function sendPendingLinkCodeService(token: string): Promise<{ message: string }> {
  return apiRequest('/auth/oauth/pending/code', { method: 'POST', body: { token } });
}

/** Prueba con contraseña o código; la API vincula Google y deja la cookie de sesión. */
export function confirmPendingLinkService(
  token: string,
  proof: { password?: string; code?: string },
): Promise<TwoFactorRequired | undefined> {
  return apiRequest('/auth/oauth/pending/confirm', { method: 'POST', body: { token, ...proof } });
}

/* ---------- Registro con Google (correo no registrado) ---------- */

export interface OAuthSignupInfo {
  email: string;
  name: string;
  provider: 'GOOGLE' | 'APPLE';
}

export function getOAuthSignupService(token: string): Promise<OAuthSignupInfo> {
  return apiRequest(`/auth/oauth/signup?token=${encodeURIComponent(token)}`);
}

/** Crea la cuenta; la API deja la cookie de sesión. */
export function confirmOAuthSignupService(token: string, name: string): Promise<void> {
  return apiRequest('/auth/oauth/signup/confirm', { method: 'POST', body: { token, name } });
}
