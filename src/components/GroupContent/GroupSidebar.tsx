
import { useState } from 'react';
import { PlusCircle, Users, UserPlus } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

interface GroupSidebarProps {
  onGroupSelect: (group: Group) => void;
  onCreateGroup: () => void;
  selectedGroup: Group | null;
}

const dummyGroups: Group[] = [
  { id: '1', name: 'Math Study Group', memberCount: 15, isOwned: true },
  { id: '2', name: 'Physics Enthusiasts', memberCount: 8, isOwned: true },
  { id: '3', name: 'Chemistry Lab', memberCount: 12, isOwned: false },
  { id: '4', name: 'Biology Team', memberCount: 7, isOwned: false },
  { id: '5', name: 'History Club', memberCount: 20, isOwned: false },
];

const GroupSidebar = ({ onGroupSelect, onCreateGroup, selectedGroup }: GroupSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'owned' | 'joined'>('owned');

  const ownedGroups = dummyGroups.filter(group => group.isOwned);
  const joinedGroups = dummyGroups.filter(group => !group.isOwned);

  return (
    <div className="w-full md:w-64 bg-white border-r border-border h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">My Groups</h2>
      </div>
      
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'owned' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('owned')}
        >
          Your Groups
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'joined' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('joined')}
        >
          Joined Groups
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {activeTab === 'owned'
          ? ownedGroups.map(group => (
              <button
                key={group.id}
                className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-colors ${
                  selectedGroup?.id === group.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted'
                }`}
                onClick={() => onGroupSelect(group)}
              >
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="truncate">{group.name}</span>
                </div>
                <span className="text-xs opacity-80">{group.memberCount}</span>
              </button>
            ))
          : joinedGroups.map(group => (
              <button
                key={group.id}
                className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-colors ${
                  selectedGroup?.id === group.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted'
                }`}
                onClick={() => onGroupSelect(group)}
              >
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span className="truncate">{group.name}</span>
                </div>
                <span className="text-xs opacity-80">{group.memberCount}</span>
              </button>
            ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <button
          className="w-full flex items-center justify-center space-x-2 btn-primary"
          onClick={onCreateGroup}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Group</span>
        </button>
      </div>
    </div>
  );
};

export default GroupSidebar;
