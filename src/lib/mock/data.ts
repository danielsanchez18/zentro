import type { User } from '@/types/auth';

/**
 * ────────────────────────────────────────────────────────────────
 * DATOS MOCK / DE PRUEBA — Zentro
 * ────────────────────────────────────────────────────────────────
 * Este archivo es la ÚNICA fuente de verdad de los datos de prueba.
 * El botón "?" flotante (MockHelpButton) y la documentación
 * (`docs/mock-mode.md`) los leen de aquí.
 *
 * Para QUITAR el modo mock más adelante, ver: docs/mock-mode.md
 * ────────────────────────────────────────────────────────────────
 */

export const MOCK_CREDENTIALS = {
  email: 'admin@lasrocas.com',
  password: '123456',
};

export const MOCK_USER: User = {
  id: 'usr_001',
  email: 'admin@lasrocas.com',
  name: 'Juan Pérez',
  organization: 'Las Rocas Restaurante',
  branch: 'Monsefú',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Emails útiles para probar cada escenario en modo mock.
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
 * Código de recuperación de contraseña en modo mock.
 * El flujo de forgot-password acepta este código (con el email existing).
 */
export const MOCK_RESET_CODE = '123456';

/**
 * Código de verificación de correo en modo mock.
 * El modal "Verificar correo" de /cuenta acepta este código.
 */
export const MOCK_EMAIL_VERIFICATION_CODE = '123456';

/**
 * Tips mostrados en el botón "?" flotante (MockHelpButton).
 */
export const MOCK_TIPS: string[] = [
  `Login: ${MOCK_CREDENTIALS.email} / ${MOCK_CREDENTIALS.password}`,
  `Registro: usa un correo nuevo (ej. ${MOCK_TEST_EMAILS.newForRegister})`,
  `El correo ${MOCK_CREDENTIALS.email} ya existe: sirve para probar el bloqueo del registro`,
  `Un correo que no existe (ej. ${MOCK_TEST_EMAILS.notRegistered}) queda bloqueado en el login`,
  `Recuperar contraseña: usa ${MOCK_CREDENTIALS.email} y código ${MOCK_RESET_CODE}`,
  `Verificar correo (en /cuenta): código ${MOCK_EMAIL_VERIFICATION_CODE}`,
];
