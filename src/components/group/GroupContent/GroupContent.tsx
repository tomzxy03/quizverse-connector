// GroupContent/GroupContent.tsx
import { useState } from 'react';
import { Group, ContentTab } from './types';
import GroupHeader from './GroupHeader';
import GroupTabs from './GroupTab';

import AnnouncementsTab from './tabs/AnnouncementsTab';
import QuizzesTab from './tabs/QuizzesTab';
import MembersTab from './tabs/MembersTab';
import SharedTab from './tabs/SharedTab';
import QuestionBankTab from './tabs/QuestionBankTab';

interface Props {
  group: Group;
}

const GroupContent = ({ group }: Props) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('announcements');

  const canManage = group.role === 'OWNER' || group.role === 'ADMIN';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden">
      <GroupHeader group={group} />
      <GroupTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        canManage={canManage}
      />

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        {activeTab === 'announcements' && (
          <AnnouncementsTab canManage={canManage} />
        )}
        {activeTab === 'quizzes' && (
          <QuizzesTab canManage={canManage} />
        )}
        {activeTab === 'members' && (
          <MembersTab canManage={canManage} />
        )}
        {activeTab === 'shared' && (
          <SharedTab group={group} />
        )}
        {activeTab === 'questionBank' && canManage && (
          <QuestionBankTab />
        )}
      </div>
    </div>
  );
};

export default GroupContent;
