export type ApiMode = 'api' | 'mock' | 'error';

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
}

export function isMockForced(): boolean {
  return process.env.NEXT_PUBLIC_MOCK === 'true';
}

export function getApiTimeout(): number {
  return Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 5000;
}
