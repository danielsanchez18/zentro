// Guarda el contexto de recuperación entre la página OTP y la de nueva contraseña.
// Se usa sessionStorage (no la URL) porque el código es un secreto de un solo uso.
// Guardamos email + código juntos para validar que el flujo no se manipule
// cambiando el ?email= en la URL: la página de nueva contraseña exige que el
// email de la URL coincida con el que emitió el código.

const RESET_CONTEXT_KEY = 'zentro-reset-context';

export interface ResetContext {
  email: string;
  code: string;
}

export function saveResetContext(email: string, code: string) {
  sessionStorage.setItem(RESET_CONTEXT_KEY, JSON.stringify({ email, code }));
}

export function getResetContext(): ResetContext | null {
  const raw = sessionStorage.getItem(RESET_CONTEXT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.email === 'string' &&
      typeof parsed.code === 'string'
    ) {
      return { email: parsed.email, code: parsed.code };
    }
    return null;
  } catch {
    return null;
  }
}

export function clearResetContext() {
  sessionStorage.removeItem(RESET_CONTEXT_KEY);
}
