import { create } from "zustand";
import {
  CURRENT_USER_ID,
  getCurrentDashboardUser,
  notificationPreferences,
  userIdentities,
  userSessions,
} from "@/lib/mock/dashboard";
import type {
  DashboardUser,
  NotificationPreference,
  NotificationPreferenceKey,
  UserIdentity,
  UserSession,
} from "@/types/dashboard";

interface DashboardState {
  currentUser: DashboardUser;
  identities: UserIdentity[];
  sessions: UserSession[];
  notificationPreferences: NotificationPreference[];
  localPassword: string;
  updateProfile: (input: Pick<DashboardUser, "phone" | "avatarUrl">) => void;
  verifyEmail: () => void;
  disconnectIdentity: (identityId: string) => { ok: boolean; reason?: string };
  revokeSession: (sessionId: string) => void;
  toggleEmailPreference: (key: NotificationPreferenceKey) => void;
  changePassword: (currentPassword: string, newPassword: string) => { ok: boolean };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentUser: getCurrentDashboardUser(),
  identities: userIdentities.filter((identity) => identity.userId === CURRENT_USER_ID),
  sessions: userSessions.filter((session) => session.userId === CURRENT_USER_ID),
  notificationPreferences: notificationPreferences.filter(
    (preference) => preference.userId === CURRENT_USER_ID,
  ),
  localPassword: "123456",
  updateProfile: (input) =>
    set((state) => ({ currentUser: { ...state.currentUser, ...input, updatedAt: new Date().toISOString() } })),
  verifyEmail: () =>
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        emailVerifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })),
  disconnectIdentity: (identityId) => {
    const active = get().identities.filter((identity) => identity.status === "ACTIVE");
    if (active.length <= 1) {
      return { ok: false, reason: "Debes conservar al menos un método de acceso." };
    }
    set((state) => ({
      identities: state.identities.map((identity) =>
        identity.id === identityId ? { ...identity, status: "DISCONNECTED" } : identity,
      ),
    }));
    return { ok: true };
  },
  revokeSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId && !session.isCurrent
          ? { ...session, revokedAt: new Date().toISOString() }
          : session,
      ),
    })),
  toggleEmailPreference: (key) =>
    set((state) => ({
      notificationPreferences: state.notificationPreferences.map((preference) =>
        preference.key === key && !preference.required
          ? { ...preference, emailEnabled: !preference.emailEnabled }
          : preference,
      ),
    })),
  changePassword: (currentPassword, newPassword) => {
    if (get().localPassword !== currentPassword) return { ok: false };
    set({ localPassword: newPassword });
    return { ok: true };
  },
}));
