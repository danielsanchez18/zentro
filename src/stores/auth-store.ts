// Store de autenticación con Zustand
// Pendiente de implementar cuando el backend Auth esté listo

import { create } from 'zustand';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones (se implementarán después)
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_email, _password) => {
    // TODO: Implementar cuando backend Auth esté listo
    throw new Error('Auth no implementado');
  },

  register: async (_email, _password, _name) => {
    // TODO: Implementar cuando backend Auth esté listo
    throw new Error('Auth no implementado');
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },
}));
