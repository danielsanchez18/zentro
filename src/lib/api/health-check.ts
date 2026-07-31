import { getApiUrl, isMockForced } from './api-config';
import type { ApiMode } from './api-config';

export async function checkHealth(): Promise<ApiMode> {
  if (isMockForced()) return 'mock';

  try {
    const url = `${getApiUrl()}/health`;
    const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (res.ok) return 'api';
    return 'error';
  } catch {
    return 'mock';
  }
}
