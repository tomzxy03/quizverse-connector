import { Bell, FileText, Users, Share2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { API_ENDPOINTS } from '@/core/api';

/**
 * Tab Configuration Interface
 * Defines the structure and metadata for each group tab
 */
export interface GroupTab {
  key: string;
  label: string;
  icon: LucideIcon;
  path: (groupId: string) => string;
  description?: string;
  /** API endpoint for data fetching */
  endpoint?: (groupId: number) => string;
  /** Service method name for data fetching */
  serviceMethod?: string;
}

/**
 * Group Tab Configurations
 * Each tab represents a section of the group with specific functionality and API integration
 * 
 * Data Flow Architecture:
 * Tab Component → Service Method → Repository Method → API Endpoint
 * 
 * Example for Announcements:
 * GroupAnnouncementsTab → groupService.getAnnouncements() → groupRepository.getAnnouncements() → API_ENDPOINTS.GROUPS.ANNOUNCEMENTS()
 */
export const GROUP_TABS: GroupTab[] = [
  {
    key: 'announcements',
    label: 'Thông báo',
    icon: Bell,
    path: (groupId) => `/groups/${groupId}/announcements`,
    description: 'Xem thông báo nhóm',
    endpoint: (groupId) => API_ENDPOINTS.GROUPS.ANNOUNCEMENTS(groupId),
    serviceMethod: 'getAnnouncements',
  },
  {
    key: 'quizzes',
    label: 'Bài tập',
    icon: FileText,
    path: (groupId) => `/groups/${groupId}/quizzes`,
    description: 'Danh sách bài tập',
    endpoint: (groupId) => API_ENDPOINTS.GROUPS.QUIZZES(groupId),
    serviceMethod: 'getGroupQuizzes',
  },
  {
    key: 'members',
    label: 'Thành viên',
    icon: Users,
    path: (groupId) => `/groups/${groupId}/members`,
    description: 'Quản lý thành viên',
    endpoint: (groupId) => API_ENDPOINTS.GROUPS.MEMBERS(groupId),
    serviceMethod: 'getGroupMembers',
  },
  {
    key: 'shared',
    label: 'Chia sẻ',
    icon: Share2,
    path: (groupId) => `/groups/${groupId}/shared`,
    description: 'Tài liệu chia sẻ',
    endpoint: undefined, // Coming soon - not yet implemented in API
    serviceMethod: undefined,
  },
];

/**
 * Get tab configuration by key
 * @param key - The tab key (e.g., 'announcements', 'quizzes')
 * @returns GroupTab configuration or undefined if not found
 */
export const getTabByKey = (key: string): GroupTab | undefined => {
  return GROUP_TABS.find((tab) => tab.key === key);
};

/**
 * Get the route path for a specific tab
 * @param groupId - The group ID
 * @param tabKey - The tab key
 * @returns The full route path (e.g., '/groups/1/announcements')
 */
export const getTabPath = (groupId: string, tabKey: string): string => {
  const tab = getTabByKey(tabKey);
  return tab ? tab.path(groupId) : `/groups/${groupId}/announcements`;
};

/**
 * Get the API endpoint for a specific tab
 * Useful for direct API calls or validation
 * @param groupId - The group ID
 * @param tabKey - The tab key
 * @returns The API endpoint path or undefined if not available
 */
export const getTabEndpoint = (groupId: number, tabKey: string): string | undefined => {
  const tab = getTabByKey(tabKey);
  return tab?.endpoint?.(groupId);
};

/**
 * Get the service method name for a specific tab
 * @param tabKey - The tab key
 * @returns The service method name or undefined if not available
 */
export const getTabServiceMethod = (tabKey: string): string | undefined => {
  const tab = getTabByKey(tabKey);
  return tab?.serviceMethod;
};
