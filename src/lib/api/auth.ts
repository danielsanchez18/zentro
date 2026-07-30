// API calls para el módulo Auth
// Pendiente de implementar cuando el backend Auth esté listo

import { api } from './client';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/auth';

export const authApi = {
  login: (data: LoginInput) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterInput) =>
    api.post<AuthResponse>('/auth/register', data),

  me: (token: string) =>
    api.get<{ user: AuthResponse['user'] }>('/auth/me', token),
};
