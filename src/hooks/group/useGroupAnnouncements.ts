/**
 * Group Announcements Hook
 * 
 * Fetches announcements for a specific group using React Query
 * Handles caching, error states, and loading states automatically
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services';
import { groupQueryKeys } from '@/hooks/queryKeys/groupQueryKeys';

interface UseGroupAnnouncementsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Custom hook for fetching group announcements
 * 
 * @param groupId - The group identifier
 * @param options - Query options (staleTime, gcTime, enabled)
 * @returns Query object with data, isLoading, error, and refetch
 * 
 * @example
 * const { data: announcements, isLoading, error } = useGroupAnnouncements(123);
 */
export function useGroupAnnouncements(
  groupId: number,
  options?: UseGroupAnnouncementsOptions
) {
  const staleTime = options?.staleTime ?? 5 * 60 * 1000; // 5 minutes
  const gcTime = options?.gcTime ?? 10 * 60 * 1000; // 10 minutes
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: groupQueryKeys.announcements.byGroup(groupId),
    queryFn: async () => {
      const response = await groupService.getAnnouncements(groupId, 0, 50);
      // Normalize response - always return array
      return (Array.isArray(response) ? response : response?.items) || [];
    },
    staleTime,
    gcTime,
    enabled,
  });
}

/**
 * Get query client for prefetching
 * Useful for eager loading when hovering tabs
 */
export function useAnnouncementsPrefetch(groupId: number) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.announcements.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getAnnouncements(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetch };
}
