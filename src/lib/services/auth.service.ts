import { MOCK_CREDENTIALS, MOCK_RESET_CODE, MOCK_USER } from '@/lib/mock/data';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@/types/auth';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginService(input: LoginInput): Promise<{ data: AuthResponse }> {
  await delay(600);

  if (
    input.email.toLowerCase() !== MOCK_CREDENTIALS.email ||
    input.password !== MOCK_CREDENTIALS.password
  ) {
    throw { statusCode: 401, message: 'Credenciales inválidas', error: 'Unauthorized' };
  }

  return {
    data: { user: MOCK_USER, token: 'local-token-las-rocas-001' },
  };
}

export async function checkEmailService(email: string): Promise<{ exists: boolean }> {
  await delay(300);
  return { exists: email.toLowerCase() === MOCK_CREDENTIALS.email };
}

export async function registerService(input: RegisterInput): Promise<{ data: AuthResponse }> {
  await delay(800);

  const newUser: User = {
    id: `usr_${Date.now()}`,
    email: input.email,
    name: input.name,
    status: 'ACTIVE',
    emailVerifiedAt: null,
    phone: null,
    avatarUrl: null,
    locale: 'es-PE',
    timezone: 'America/Lima',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    data: { user: newUser, token: `local-token-${Date.now()}` },
  };
}

export async function forgotPasswordService(email: string): Promise<{ devCode?: string }> {
  await delay(400);

  return {
    devCode: email.toLowerCase() === MOCK_CREDENTIALS.email ? MOCK_RESET_CODE : undefined,
  };
}

export async function verifyCodeService(
  email: string,
  code: string,
): Promise<{ valid: boolean }> {
  await delay(400);

  if (email.toLowerCase() !== MOCK_CREDENTIALS.email || code !== MOCK_RESET_CODE) {
    throw { statusCode: 400, message: 'El código es incorrecto.', error: 'Bad Request' };
  }

  return { valid: true };
}

export async function resetPasswordService(
  email: string,
  code: string,
  newPassword: string,
): Promise<void> {
  void newPassword;
  await delay(600);

  if (email.toLowerCase() !== MOCK_CREDENTIALS.email || code !== MOCK_RESET_CODE) {
    throw { statusCode: 400, message: 'El código es incorrecto.', error: 'Bad Request' };
  }
}

export async function validateSessionService(token: string): Promise<{ user: User }> {
  void token;
  await delay(100);
  return { user: MOCK_USER };
}
