/**
 * Group Quizzes Hook
 * 
 * Fetches quizzes for a specific group using React Query
 * Handles caching, error states, and loading states automatically
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services';
import { groupQueryKeys } from '@/hooks/queryKeys/groupQueryKeys';
import { Quiz } from '@/domains';

interface UseGroupQuizzesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Custom hook for fetching group quizzes
 * 
 * @param groupId - The group identifier
 * @param options - Query options (staleTime, gcTime, enabled)
 * @returns Query object with data, isLoading, error, and refetch
 * 
 * @example
 * const { data: quizzes, isLoading, error } = useGroupQuizzes(123);
 */
export function useGroupQuizzes(
  groupId: number,
  options?: UseGroupQuizzesOptions
) {
  const staleTime = options?.staleTime ?? 5 * 60 * 1000; // 5 minutes
  const gcTime = options?.gcTime ?? 10 * 60 * 1000; // 10 minutes
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: groupQueryKeys.quizzes.byGroup(groupId),
    queryFn: async () => {
      const response = await groupService.getGroupQuizzes(groupId, 0, 50);
      // Normalize response - always return array
      const quizzes = (Array.isArray(response) ? response : response?.items) || [];
      return quizzes as Quiz[];
    },
    staleTime,
    gcTime,
    enabled,
  });
}

/**
 * Prefetch quizzes for a group
 * Useful for eager loading when hovering tabs
 */
export function useQuizzesPrefetch(groupId: number) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.quizzes.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getGroupQuizzes(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetch };
}
