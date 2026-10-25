// Tipos del módulo Auth

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

/** Respuesta de login/registro/refresh. El refresh token va en una cookie httpOnly. */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

/** Login con 2FA activa: no hay sesión todavía, falta el código de la app. */
export interface TwoFactorRequired {
  twoFactorRequired: true;
  challenge: string;
}

/** Usuario tal como lo devuelve la API (`/auth/me`, login, registro). */
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
