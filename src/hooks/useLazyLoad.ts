import { useState, useCallback, useRef } from 'react';

interface UseLazyLoadOptions {
  initialPage?: number;
  pageSize?: number;
  cacheEnabled?: boolean;
}

interface UseLazyLoadState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
}

/**
 * Hook for lazy loading paginated data with caching
 */
export const useLazyLoad = <T,>(
  fetchFn: (page: number, size: number) => Promise<{
    items: T[];
    total_page: number;
    total: number;
    page: number;
  }>,
  options: UseLazyLoadOptions = {}
) => {
  const { initialPage = 0, pageSize = 10, cacheEnabled = true } = options;

  const [state, setState] = useState<UseLazyLoadState<T>>({
    data: [],
    loading: false,
    error: null,
    hasMore: true,
    page: initialPage,
    totalPages: 0,
    totalElements: 0,
  });

  const cacheRef = useRef<Map<number, T[]>>(new Map());
  const isFetchingRef = useRef(false);

  const fetch = useCallback(
    async (pageNum: number = initialPage, append: boolean = false) => {
      // Prevent duplicate requests
      if (isFetchingRef.current) return;

      // Check cache
      if (cacheEnabled && cacheRef.current.has(pageNum)) {
        const cachedData = cacheRef.current.get(pageNum)!;
        setState((prev) => ({
          ...prev,
          data: append ? [...prev.data, ...cachedData] : cachedData,
          page: pageNum,
        }));
        return;
      }

      isFetchingRef.current = true;
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const result = await fetchFn(pageNum, pageSize);

        // Cache the result
        if (cacheEnabled) {
          cacheRef.current.set(pageNum, result.items);
        }

        setState((prev) => ({
          ...prev,
          data: append ? [...prev.data, ...result.items] : result.items,
          page: result.page,
          totalPages: result.total_page,
          totalElements: result.total,
          hasMore: result.page < result.total_page - 1,
          loading: false,
          error: null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error('Unknown error'),
        }));
      } finally {
        isFetchingRef.current = false;
      }
    },
    [fetchFn, pageSize, initialPage, cacheEnabled]
  );

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loading) {
      fetch(state.page + 1, true);
    }
  }, [state.hasMore, state.loading, state.page, fetch]);

  const refresh = useCallback(() => {
    cacheRef.current.clear();
    fetch(initialPage, false);
  }, [fetch, initialPage]);

  const reset = useCallback(() => {
    cacheRef.current.clear();
    setState({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
      page: initialPage,
      totalPages: 0,
      totalElements: 0,
    });
  }, [initialPage]);

  return {
    ...state,
    fetch,
    loadMore,
    refresh,
    reset,
  };
};