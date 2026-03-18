/**
 * Group Tab Prefetching Utility
 * 
 * Provides prefetching functions for each tab
 * Use with onMouseEnter/onMouseOver to prefetch data when user hovers over a tab
 */

import { useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services';
import { groupQueryKeys } from '@/hooks/queryKeys/groupQueryKeys';

/**
 * Hook to prefetch all group tab queries
 * 
 * @example
 * const { prefetchAnnouncements, prefetchQuizzes, prefetchMembers } = useTabPrefetch();
 * 
 * // In JSX
 * <button onMouseEnter={() => prefetchQuizzes(groupId)}>
 *   Quizzes
 * </button>
 */
export function useTabPrefetch() {
  const queryClient = useQueryClient();

  const prefetchAnnouncements = (groupId: number) => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.announcements.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getAnnouncements(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const prefetchQuizzes = (groupId: number) => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.quizzes.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getGroupQuizzes(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchMembers = (groupId: number) => {
    queryClient.prefetchQuery({
      queryKey: groupQueryKeys.members.byGroup(groupId),
      queryFn: async () => {
        const response = await groupService.getGroupMembers(groupId, 0, 50);
        return (Array.isArray(response) ? response : response?.items) || [];
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchAll = (groupId: number) => {
    prefetchAnnouncements(groupId);
    prefetchQuizzes(groupId);
    prefetchMembers(groupId);
  };

  return {
    prefetchAnnouncements,
    prefetchQuizzes,
    prefetchMembers,
    prefetchAll,
  };
}

/**
 * Alternative approach using individual prefetch hooks
 * Import and use in GroupTabs component:
 * 
 * import { useAnnouncementsPrefetch, useQuizzesPrefetch, useMembersPrefetch } from '@/hooks/group';
 * 
 * const { prefetch: prefetchAnnouncements } = useAnnouncementsPrefetch(groupId);
 * const { prefetch: prefetchQuizzes } = useQuizzesPrefetch(groupId);
 * const { prefetch: prefetchMembers } = useMembersPrefetch(groupId);
 * 
 * // In JSX
 * <button onMouseEnter={prefetchAnnouncements}>Announcements</button>
 * <button onMouseEnter={prefetchQuizzes}>Quizzes</button>
 * <button onMouseEnter={prefetchMembers}>Members</button>
 */
