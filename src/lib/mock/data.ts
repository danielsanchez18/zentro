import type { User } from '@/types/auth';

/** Datos locales usados para desarrollar y recorrer el prototipo sin backend. */

export const MOCK_CREDENTIALS = {
  email: 'admin@lasrocas.com',
  password: '123456',
};

export const MOCK_USER: User = {
  id: 'usr_001',
  email: 'admin@lasrocas.com',
  name: 'Daniel Sánchez',
  status: 'ACTIVE',
  emailVerifiedAt: null,
  phone: '+51 936 245 721',
  avatarUrl: null,
  locale: 'es-PE',
  timezone: 'America/Lima',
  createdAt: '2026-07-30T14:00:00.000Z',
  updatedAt: '2026-09-08T20:00:00.000Z',
};

/**
 * Emails útiles para probar cada escenario local.
 * - existing: ya registrado → login correcto / registro BLOQUEADO
 * - notRegistered: no existe → login BLOQUEADO / registro OK
 * - newForRegister: sugerencia para crear una cuenta nueva
 */
export const MOCK_TEST_EMAILS = {
  existing: MOCK_CREDENTIALS.email,
  notRegistered: 'correo@inexistente.com',
  newForRegister: 'usuario.prueba@zentro.com',
};

/**
 * Código de recuperación de contraseña durante el prototipado.
 * El flujo de forgot-password acepta este código (con el email existing).
 */
export const MOCK_RESET_CODE = '123456';

/**
 * Código de verificación de correo durante el prototipado.
 * El modal "Verificar correo" de /cuenta acepta este código.
 */
export const MOCK_EMAIL_VERIFICATION_CODE = '123456';
