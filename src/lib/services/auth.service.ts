import { authApi } from '@/lib/api/auth';
import { MOCK_CREDENTIALS, MOCK_RESET_CODE, MOCK_USER } from '@/lib/mock/data';
import { useAppStore } from '@/stores/app-store';
import { checkHealth } from '@/lib/api/health-check';
import { isMockForced } from '@/lib/api/api-config';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Resuelve si debemos usar mock o API real.
 * - Si el usuario forzó un modo (desde el badge) → lo respeta.
 * - Si NEXT_PUBLIC_MOCK=true está forzado por entorno → siempre mock.
 * - Si no, hace health-check al backend. Si responde → API, si no → mock.
 * Actualiza el app-store para que el MockBadge se muestre correctamente.
 */
async function resolveMockMode(): Promise<boolean> {
  const forced = useAppStore.getState().forcedMode;
  if (forced === 'mock') {
    useAppStore.getState().setMockMode(true);
    useAppStore.getState().setApiStatus('mock');
    return true;
  }
  if (forced === 'api') {
    useAppStore.getState().setMockMode(false);
    useAppStore.getState().setApiStatus('api');
    return false;
  }

  if (isMockForced()) return true;

  const status = await checkHealth();
  useAppStore.getState().setApiStatus(status);
  useAppStore.getState().setMockMode(status !== 'api');
  return status !== 'api';
}

export async function loginService(input: LoginInput): Promise<{ data: AuthResponse; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(600);
    if (
      input.email.toLowerCase() !== MOCK_CREDENTIALS.email ||
      input.password !== MOCK_CREDENTIALS.password
    ) {
      throw { statusCode: 401, message: 'Credenciales inválidas', error: 'Unauthorized' };
    }
    return {
      data: { user: MOCK_USER, token: 'mock-token-las-rocas-001' },
      isMock: true,
    };
  }

  const data = await authApi.login(input);
  return { data, isMock: false };
}

export async function checkEmailService(email: string): Promise<{ exists: boolean; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(300);
    return { exists: email.toLowerCase() === MOCK_CREDENTIALS.email, isMock: true };
  }

  const data = await authApi.checkEmail(email);
  return { exists: data.exists, isMock: false };
}

export async function registerService(input: RegisterInput): Promise<{ data: AuthResponse; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(800);
    const newUser: User = {
      id: 'usr_' + Date.now(),
      email: input.email,
      name: input.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      data: { user: newUser, token: 'mock-token-' + Date.now() },
      isMock: true,
    };
  }

  const data = await authApi.register(input);
  return { data, isMock: false };
}

/**
 * Solicita un código de recuperación de contraseña.
 * En modo mock devuelve el código fijo (MOCK_RESET_CODE) solo si el correo
 * existe; si no, devuelve la misma respuesta genérica (anti-enumeración).
 */
export async function forgotPasswordService(email: string): Promise<{ devCode?: string; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(400);
    if (email.toLowerCase() === MOCK_CREDENTIALS.email) {
      return { devCode: MOCK_RESET_CODE, isMock: true };
    }
    return { devCode: undefined, isMock: true };
  }

  const data = await authApi.forgotPassword(email);
  return { devCode: data.devCode, isMock: false };
}

/** Valida el código de recuperación (pantalla OTP antes de la nueva contraseña). */
export async function verifyCodeService(email: string, code: string): Promise<{ valid: boolean; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(400);
    if (email.toLowerCase() !== MOCK_CREDENTIALS.email || code !== MOCK_RESET_CODE) {
      throw { statusCode: 400, message: 'El código es incorrecto.', error: 'Bad Request' };
    }
    return { valid: true, isMock: true };
  }

  await authApi.verifyCode(email, code);
  return { valid: true, isMock: false };
}

/** Aplica la nueva contraseña usando el código de recuperación. */
export async function resetPasswordService(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(600);
    if (email.toLowerCase() !== MOCK_CREDENTIALS.email || code !== MOCK_RESET_CODE) {
      throw { statusCode: 400, message: 'El código es incorrecto.', error: 'Bad Request' };
    }
    return { isMock: true };
  }

  await authApi.resetPassword(email, code, newPassword);
  return { isMock: false };
}

/**
 * Valida la sesión actual contra el backend (GET /auth/me).
 * - En modo mock confía en el token local (no es un JWT real), devolviendo
 *   el usuario mock para mantener la demo sin backend.
 * - En modo API devuelve el usuario actualizado si el token es válido.
 *
 * Lanza un error si el token no es válido/expirado (401) o el backend no responde.
 */
export async function validateSessionService(token: string): Promise<{ user: User | null; isMock: boolean }> {
  const isMock = await resolveMockMode();

  if (isMock) {
    await delay(100);
    return { user: MOCK_USER, isMock: true };
  }

  const data = await authApi.me(token);
  return { user: data.user, isMock: false };
}
