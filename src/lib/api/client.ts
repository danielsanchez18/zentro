/**
 * Cliente HTTP de la API de Zentro.
 *
 * Sesión:
 * - El access token (corto, 15 min) vive solo en memoria (auth-store).
 * - El refresh token viaja en una cookie httpOnly que el navegador envía
 *   sola a /api/v1/auth (por eso `credentials: "include"`).
 * - Si una petición autenticada responde 401, se intenta renovar la sesión
 *   una vez (`/auth/refresh`) y se repite la petición.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const API_BASE = `${API_URL}/api/v1`;

/** Error normalizado: mismo formato que devuelve Nest `{ statusCode, message, error }`. */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface SessionBridge {
  getAccessToken: () => string | null;
  /** Renueva la sesión; devuelve el nuevo access token o null si expiró. */
  refresh: () => Promise<string | null>;
}

// El auth-store se registra aquí para evitar una dependencia circular.
let session: SessionBridge | null = null;
export const registerSessionBridge = (bridge: SessionBridge) => {
  session = bridge;
};

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Adjunta el access token y reintenta tras un refresh si responde 401. */
  auth?: boolean;
}

const toApiError = async (response: Response) => {
  let message = "Ocurrió un error inesperado. Inténtalo de nuevo.";
  let error: string | undefined;
  try {
    const data = (await response.json()) as { message?: string | string[]; error?: string };
    message = (Array.isArray(data.message) ? data.message[0] : data.message) ?? message;
    error = data.error;
  } catch {
    // sin cuerpo JSON
  }
  if (response.status === 429) message = "Demasiados intentos. Espera un minuto e inténtalo de nuevo.";
  return new ApiError(response.status, message, error);
};

const send = (path: string, options: RequestOptions, token: string | null) =>
  fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await send(path, options, options.auth ? (session?.getAccessToken() ?? null) : null);
    if (options.auth && response.status === 401 && session) {
      const renewed = await session.refresh();
      if (renewed) response = await send(path, options, renewed);
    }
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
