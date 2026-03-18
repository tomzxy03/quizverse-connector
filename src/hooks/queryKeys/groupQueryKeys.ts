/**
 * React Query Key Factory
 * Centralized query key definitions for group-related data
 * 
 * Pattern:
 * - queryKeys.groups.all - All group queries
 * - queryKeys.groups.announcements(groupId) - Announcements for a specific group
 * - etc.
 */

export const groupQueryKeys = {
  all: ['groups'] as const,
  
  announcements: {
    all: ['groups', 'announcements'] as const,
    byGroup: (groupId: number) => [...groupQueryKeys.announcements.all, groupId] as const,
  },
  
  quizzes: {
    all: ['groups', 'quizzes'] as const,
    byGroup: (groupId: number) => [...groupQueryKeys.quizzes.all, groupId] as const,
  },
  
  members: {
    all: ['groups', 'members'] as const,
    byGroup: (groupId: number) => [...groupQueryKeys.members.all, groupId] as const,
  },
  
  shared: {
    all: ['groups', 'shared'] as const,
    byGroup: (groupId: number) => [...groupQueryKeys.shared.all, groupId] as const,
  },
} as const;

/**
 * Example usage:
 * 
 * const queryKey = groupQueryKeys.announcements.byGroup(123);
 * // Result: ['groups', 'announcements', 123]
 * 
 * This ensures consistent cache keys across the application
 */
