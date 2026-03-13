import { useEffect, useState } from 'react';

interface UseLazyLoadOnDemandOptions {
  enabled?: boolean;
  cacheKey?: string;
}

/**
 * Hook for lazy loading data only when needed (on tab switch)
 * Data is cached in localStorage by default
 */
export const useLazyLoadOnDemand = <T,>(
  fetchFn: () => Promise<T>,
  options: UseLazyLoadOnDemandOptions = {}
) => {
  const { enabled = true, cacheKey } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check cache on mount
  useEffect(() => {
    if (cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          setIsLoaded(true);
        } catch {
          // Invalid cache, proceed with fetch
        }
      }
    }
  }, [cacheKey]);

  const load = async () => {
    if (!enabled || isLoaded) return;

    setLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      setIsLoaded(true);
      setError(null);

      // Cache result
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setIsLoaded(false);
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
    }
    await load();
  };

  return {
    data,
    loading,
    error,
    isLoaded,
    load,
    refresh,
  };
};