import { NavLink } from 'react-router-dom';
import { GROUP_TABS } from './config/groupTabsConfig';
import { cn } from '@/lib/utils';
import { useTabPrefetch } from '@/hooks/group';

interface GroupTabsProps {
  groupId: string;
  currentTab?: string;
}

// Map tab keys to prefetch functions
const tabPrefetchMap: Record<string, (prefetch: ReturnType<typeof useTabPrefetch>, groupId: number) => void> = {
  announcements: (prefetch, groupId) => prefetch.prefetchAnnouncements(groupId),
  quizzes: (prefetch, groupId) => prefetch.prefetchQuizzes(groupId),
  members: (prefetch, groupId) => prefetch.prefetchMembers(groupId),
  shared: () => {}, // No prefetch for shared tab (no API yet)
};

const GroupTabs = ({ groupId, currentTab }: GroupTabsProps) => {
  const tabPrefetch = useTabPrefetch();
  const groupIdNumber = parseInt(groupId, 10);

  const handleTabMouseEnter = (tabKey: string) => {
    const prefetcher = tabPrefetchMap[tabKey];
    if (prefetcher) {
      prefetcher(tabPrefetch, groupIdNumber);
    }
  };

  return (
    <div className="border-b border-border bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <nav className="flex gap-0 overflow-x-auto">
          {GROUP_TABS.map((tab) => {
            const Icon = tab.icon;
            const tabPath = tab.path(groupId);
            
            return (
              <NavLink
                key={tab.key}
                to={tabPath}
                title={tab.description}
                onMouseEnter={() => handleTabMouseEnter(tab.key)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                    'border-b-2 border-transparent hover:text-primary hover:border-b-primary/50',
                    isActive
                      ? 'border-b-primary text-primary'
                      : 'text-muted-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default GroupTabs;
