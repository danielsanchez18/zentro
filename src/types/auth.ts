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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  status: "ACTIVE" | "DISABLED" | "PENDING_VERIFICATION";
  emailVerifiedAt: string | null;
  phone: string | null;
  avatarUrl: string | null;
  locale: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}
