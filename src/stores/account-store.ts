import { create } from "zustand";
import { useAuthStore } from "@/stores/auth-store";
import * as account from "@/lib/services/account.service";
import type {
  AccessMethod,
  AccountProfile,
  AccountSession,
  NotificationKey,
  NotificationPreference,
} from "@/lib/services/account.service";

/**
 * Estado de "Mi cuenta" cargado desde la API. Sin persistencia: se pide al
 * entrar a la página. Al cambiar el perfil se sincroniza el usuario de la
 * sesión (auth-store) para que el saludo, el header y el sidebar se actualicen.
 */
interface AccountState {
  profile: AccountProfile | null;
  methods: AccessMethod[] | null;
  sessions: AccountSession[] | null;
  preferences: NotificationPreference[] | null;

  loadProfile: () => Promise<void>;
  saveProfile: (input: { name?: string; phone?: string }) => Promise<void>;
  saveAvatar: (avatarUrl: string | null) => Promise<void>;
  confirmEmail: (code: string) => Promise<void>;
  loadMethods: () => Promise<void>;
  unlinkMethod: (provider: AccessMethod["provider"]) => Promise<void>;
  loadSessions: () => Promise<void>;
  revokeSession: (id: string) => Promise<void>;
  revokeOtherSessions: () => Promise<void>;
  loadPreferences: () => Promise<void>;
  togglePreference: (key: NotificationKey, emailEnabled: boolean) => Promise<void>;
}

const syncSessionUser = (profile: AccountProfile) => {
  const auth = useAuthStore.getState();
  if (auth.user) {
    auth.setUser({
      ...auth.user,
      name: profile.name,
      email: profile.email,
      emailVerifiedAt: profile.emailVerifiedAt,
      avatarUrl: profile.avatarUrl,
      updatedAt: profile.updatedAt,
    });
  }
};

export const useAccountStore = create<AccountState>()((set) => ({
  profile: null,
  methods: null,
  sessions: null,
  preferences: null,

  loadProfile: async () => {
    const { user } = await account.getProfile();
    set({ profile: user });
    syncSessionUser(user);
  },

  saveProfile: async (input) => {
    const { user } = await account.updateProfile(input);
    set({ profile: user });
    syncSessionUser(user);
  },

  saveAvatar: async (avatarUrl) => {
    const { user } = await account.updateAvatar(avatarUrl);
    set({ profile: user });
    syncSessionUser(user);
  },

  confirmEmail: async (code) => {
    const { user } = await account.confirmEmailVerification(code);
    set({ profile: user });
    syncSessionUser(user);
  },

  loadMethods: async () => {
    const { methods } = await account.getAccessMethods();
    set({ methods });
  },

  unlinkMethod: async (provider) => {
    const { methods } = await account.unlinkAccessMethod(provider);
    set({ methods });
  },

  loadSessions: async () => {
    const { sessions } = await account.getSessions();
    set({ sessions });
  },

  revokeSession: async (id) => {
    await account.revokeSession(id);
    set((state) => ({ sessions: state.sessions?.filter((session) => session.id !== id) ?? null }));
  },

  revokeOtherSessions: async () => {
    await account.revokeOtherSessions();
    set((state) => ({ sessions: state.sessions?.filter((session) => session.current) ?? null }));
  },

  loadPreferences: async () => {
    const { preferences } = await account.getNotificationPreferences();
    set({ preferences });
  },

  togglePreference: async (key, emailEnabled) => {
    // Optimista: se revierte si la API falla.
    set((state) => ({
      preferences: state.preferences?.map((item) => (item.key === key ? { ...item, emailEnabled } : item)) ?? null,
    }));
    try {
      const { preferences } = await account.updateNotificationPreference(key, emailEnabled);
      set({ preferences });
    } catch (error) {
      set((state) => ({
        preferences:
          state.preferences?.map((item) => (item.key === key ? { ...item, emailEnabled: !emailEnabled } : item)) ?? null,
      }));
      throw error;
    }
  },
}));

// Al cerrar sesión se descarta lo cargado para no mostrar datos de otra cuenta.
useAuthStore.subscribe((state, previous) => {
  if (previous.user && !state.user) {
    useAccountStore.setState({ profile: null, methods: null, sessions: null, preferences: null });
  }
});
