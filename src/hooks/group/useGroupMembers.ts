/**
 * Group Members Hook
 * 
 * Fetches members for a specific group using React Query
 * Handles caching, error states, and loading states automatically
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services';
import { groupQueryKeys } from '@/hooks/queryKeys/groupQueryKeys';
import { UserResDTO } from '@/domains';

interface UseGroupMembersOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Custom hook for fetching group members
 * 
 * @param groupId - The group identifier
 * @param options - Query options (staleTime, gcTime, enabled)
 * @returns Query object with data, isLoading, error, and refetch
 * 
 * @example
 * const { data: members, isLoading, error } = useGroupMembers(123);
 */
export function useGroupMembers(
  groupId: number,
  options?: UseGroupMembersOptions
) {
  const staleTime = options?.staleTime ?? 5 * 60 * 1000; // 5 minutes
  const gcTime = options?.gcTime ?? 10 * 60 * 1000; // 10 minutes
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: groupQueryKeys.members.byGroup(groupId),
    queryFn: async () => {
      const response = await groupService.getGroupMembers(groupId, 0, 50);
      // Normalize response - always return array
      const members = (Array.isArray(response) ? response : response?.items) || [];
      return members as UserResDTO[];
    },
    staleTime,
    gcTime,
    enabled,
  });
}

/**
 * Prefetch members for a group
 * Useful for eager loading when hovering tabs
 */
export function useMembersPrefetch(groupId: number) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.members.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getGroupMembers(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetch };
}
