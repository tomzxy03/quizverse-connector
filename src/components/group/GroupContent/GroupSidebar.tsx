import { useState } from 'react';
import { PlusCircle, Users, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  { id: '1', name: 'Lớp Toán Cao Cấp', memberCount: 15, isOwned: true },
  { id: '2', name: 'TOEIC Study Group', memberCount: 8, isOwned: true },
  { id: '3', name: 'Java Programming', memberCount: 12, isOwned: false },
  { id: '4', name: 'Biology Team', memberCount: 7, isOwned: false },
  { id: '5', name: 'History Club', memberCount: 20, isOwned: false },
];

const GroupSidebar = ({ onGroupSelect, onCreateGroup, selectedGroup }: GroupSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'owned' | 'joined'>('owned');

  const ownedGroups = dummyGroups.filter((g) => g.isOwned);
  const joinedGroups = dummyGroups.filter((g) => !g.isOwned);
  const list = activeTab === 'owned' ? ownedGroups : joinedGroups;

  return (
    <Card className="w-full md:w-72 shrink-0 flex flex-col overflow-hidden h-fit md:min-h-[420px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-foreground">Nhóm của tôi</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        <div className="flex border-b border-border px-4">
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'owned'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('owned')}
          >
            Nhóm của tôi
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'joined'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('joined')}
          >
            Đã tham gia
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[200px] max-h-[320px] md:max-h-[360px]">
          {list.map((group) => (
            <button
              key={group.id}
              type="button"
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between gap-2 transition-colors border ${
                selectedGroup?.id === group.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/30 hover:bg-muted/50 border-transparent'
              }`}
              onClick={() => onGroupSelect(group)}
            >
              <div className="flex items-center min-w-0">
                {activeTab === 'owned' ? (
                  <Users className="h-4 w-4 mr-2 shrink-0" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2 shrink-0" />
                )}
                <span className="truncate text-sm font-medium">{group.name}</span>
              </div>
              <span className="text-xs shrink-0 opacity-80">{group.memberCount}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <Button className="w-full" size="sm" onClick={onCreateGroup}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo nhóm mới
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSidebar;
