'use client';

import { useState, useEffect, useCallback } from 'react';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface QueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: string | null;
  isMock: boolean;
  refetch: () => void;
}

export function useApiQuery<T>(
  fetcher: () => Promise<{ data: T; isMock: boolean }>,
  deps: unknown[] = [],
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<QueryStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fetcher();
      if (result.data === null || (Array.isArray(result.data) && result.data.length === 0)) {
        setStatus('empty');
        setData(result.data);
      } else {
        setStatus('success');
        setData(result.data);
      }
      setIsMock(result.isMock);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, status, error, isMock, refetch: fetchData };
}
