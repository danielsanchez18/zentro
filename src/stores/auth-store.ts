import { create } from 'zustand';
import type { User } from '@/types/auth';
import { registerSessionBridge } from '@/lib/api/client';
import {
  loginService,
  twoFactorLoginService,
  logoutService,
  refreshSessionService,
  registerService,
} from '@/lib/services/auth.service';

/**
 * Sesión del usuario.
 * - Nada se guarda en localStorage: el access token vive en memoria y la
 *   sesión se recupera al cargar la app con la cookie httpOnly (`restoreSession`).
 * - status: "unknown" mientras no se verificó; luego "authenticated" | "anonymous".
 */
type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: SessionStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /** Devuelve `{ challenge }` si la cuenta tiene 2FA (aún sin sesión). */
  login: (email: string, password: string) => Promise<{ challenge?: string }>;
  completeTwoFactor: (challenge: string, code: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  /** Intenta recuperar la sesión con la cookie de refresh. Devuelve si hay sesión. */
  restoreSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

const messageOf = (err: unknown, fallback: string) =>
  err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : fallback;

// Evita refrescos simultáneos: todas las llamadas comparten la misma promesa.
let refreshing: Promise<boolean> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  status: 'unknown',
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await loginService({ email, password });
      if ('twoFactorRequired' in data) {
        set({ isLoading: false });
        return { challenge: data.challenge };
      }
      set({ user: data.user, accessToken: data.accessToken, status: 'authenticated', isAuthenticated: true, isLoading: false });
      return {};
    } catch (err) {
      set({ isLoading: false, error: messageOf(err, 'Error al iniciar sesión') });
      throw err;
    }
  },

  completeTwoFactor: async (challenge, code) => {
    const data = await twoFactorLoginService(challenge, code);
    set({ user: data.user, accessToken: data.accessToken, status: 'authenticated', isAuthenticated: true });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await registerService({ email, password, name });
      set({ user: data.user, accessToken: data.accessToken, status: 'authenticated', isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: messageOf(err, 'Error al registrarse') });
      throw err;
    }
  },

  restoreSession: () => {
    if (refreshing) return refreshing;
    refreshing = refreshSessionService()
      .then((data) => {
        set({ user: data.user, accessToken: data.accessToken, status: 'authenticated', isAuthenticated: true });
        return true;
      })
      .catch(() => {
        set({ user: null, accessToken: null, status: 'anonymous', isAuthenticated: false });
        return false;
      })
      .finally(() => {
        refreshing = null;
      });
    return refreshing;
  },

  logout: async () => {
    try {
      await logoutService();
    } catch {
      // Aunque falle la red, la sesión local se cierra igual.
    }
    set({ user: null, accessToken: null, status: 'anonymous', isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),

  setUser: (user) => set({ user }),
}));

// La versión mock guardaba token y usuario en localStorage: se elimina.
if (typeof window !== 'undefined') {
  try {
    window.localStorage.removeItem('zentro-auth');
  } catch {
    // almacenamiento no disponible
  }
}

// El cliente HTTP usa el token en memoria y renueva la sesión ante un 401.
registerSessionBridge({
  getAccessToken: () => useAuthStore.getState().accessToken,
  refresh: async () => ((await useAuthStore.getState().restoreSession()) ? useAuthStore.getState().accessToken : null),
});
