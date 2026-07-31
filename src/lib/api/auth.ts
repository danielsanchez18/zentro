// API calls para el módulo Auth
// Pendiente de implementar cuando el backend Auth esté listo

import { api } from './client';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';

export interface ForgotPasswordResponse {
  message: string;
  /** Solo presente en desarrollo (para probar el flujo sin abrir el correo). */
  devCode?: string;
}

export const authApi = {
  login: (data: LoginInput) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterInput) =>
    api.post<AuthResponse>('/auth/register', data),

  checkEmail: (email: string) =>
    api.post<{ exists: boolean }>('/auth/check-email', { email }),

  forgotPassword: (email: string) =>
    api.post<ForgotPasswordResponse>('/auth/forgot-password', { email }),

  verifyCode: (email: string, code: string) =>
    api.post<{ valid: boolean }>('/auth/verify-code', { email, code }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { email, code, newPassword }),

  me: (token: string) =>
    api.get<{ user: AuthResponse['user'] }>('/auth/me', token),
};
