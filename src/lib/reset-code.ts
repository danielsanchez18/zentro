// Guarda el código de recuperación entre la página OTP y la de nueva contraseña.
// Se usa sessionStorage (no la URL) porque el código es un secreto de un solo uso.

const RESET_CODE_KEY = 'zentro-reset-code';

export function saveResetCode(code: string) {
  sessionStorage.setItem(RESET_CODE_KEY, code);
}

export function getResetCode(): string {
  return sessionStorage.getItem(RESET_CODE_KEY) ?? '';
}

export function clearResetCode() {
  sessionStorage.removeItem(RESET_CODE_KEY);
}
