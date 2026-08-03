import { authApi } from '@/lib/api/auth';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

/**
 * Capa de servicios del módulo Auth — solo API real.
 * (El modo mock se eliminó; ver docs/mock-mode-removed.md si se necesita historial.)
 */

export async function loginService(input: LoginInput): Promise<AuthResponse> {
  return authApi.login(input);
}

export async function checkEmailService(email: string): Promise<{ exists: boolean }> {
  return authApi.checkEmail(email);
}

export async function registerService(input: RegisterInput): Promise<AuthResponse> {
  return authApi.register(input);
}

/**
 * Solicita un código de recuperación de contraseña.
 * `devCode` solo aparece en desarrollo (el backend lo devuelve para probar sin abrir correo).
 */
export async function forgotPasswordService(email: string): Promise<{ devCode?: string }> {
  return authApi.forgotPassword(email);
}

/** Valida el código de recuperación (pantalla OTP antes de la nueva contraseña). */
export async function verifyCodeService(email: string, code: string): Promise<void> {
  await authApi.verifyCode(email, code);
}

/** Aplica la nueva contraseña usando el código de recuperación. */
export async function resetPasswordService(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  await authApi.resetPassword(email, code, newPassword);
}

/**
 * Valida la sesión actual contra el backend (GET /auth/me).
 * Lanza un error si el token no es válido/expirado (401) o el backend no responde.
 */
export async function validateSessionService(token: string): Promise<{ user: User | null }> {
  return authApi.me(token);
}
