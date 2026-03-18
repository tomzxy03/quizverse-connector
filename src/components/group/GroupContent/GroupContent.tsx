// GroupContent/GroupContent.tsx
import { useState, useEffect } from 'react';
import { Group, ContentTab } from './types';
import GroupHeader from './GroupHeader';
import GroupTabs from './GroupTab';

import AnnouncementsTab from './tabs/AnnouncementsTab';
import QuizzesTab from './tabs/QuizzesTab';
import MembersTab from './tabs/MembersTab';
import SharedTab from './tabs/SharedTab';

interface Props {
  group: Group;
}

import { useParams } from 'react-router-dom';

const GroupContent = ({ group }: Props) => {
  const { tab } = useParams<{ tab: string }>();
  const validTabs: ContentTab[] = ['announcements', 'quizzes', 'members', 'shared'];
  const initialTab = validTabs.includes(tab as ContentTab) ? (tab as ContentTab) : 'announcements';

  const [activeTab, setActiveTab] = useState<ContentTab>(initialTab);

  // Sync state if URL changes (e.g., from browser back/forward buttons)
  useEffect(() => {
    if (tab && validTabs.includes(tab as ContentTab) && tab !== activeTab) {
      setActiveTab(tab as ContentTab);
    }
  }, [tab]);

  const canManage = group.role === 'OWNER' || group.role === 'ADMIN';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
      <GroupHeader group={group} />
      <GroupTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        canManage={canManage}
        groupId={group.id}
      />

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        {activeTab === 'announcements' && (
          <AnnouncementsTab canManage={canManage} groupId={group.id} />
        )}
        {activeTab === 'quizzes' && (
          <QuizzesTab canManage={canManage} groupId={group.id} />
        )}
        {activeTab === 'members' && (
          <MembersTab canManage={canManage} groupId={group.id} />
        )}
        {activeTab === 'shared' && (
          <SharedTab group={group} />
        )}
      </div>
    </div>
  );
};

export default GroupContent;
