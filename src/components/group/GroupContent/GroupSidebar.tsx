import { useState } from 'react';
import { MoreVertical, PlusCircle, Users, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

interface GroupSidebarProps {
  groups: Group[];
  onGroupSelect: (group: Group) => void;
  onCreateGroup: () => void;
  selectedGroup: Group | null;
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
}

const GroupSidebar = ({
  groups,
  onGroupSelect,
  onCreateGroup,
  selectedGroup,
  onUpdateGroup,
  onDeleteGroup,
}: GroupSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'owned' | 'joined'>('owned');
  const [openMenuGroupId, setOpenMenuGroupId] = useState<string | null>(null);

  const ownedGroups = groups.filter((g) => g.isOwned);
  const joinedGroups = groups.filter((g) => !g.isOwned);
  const list = activeTab === 'owned' ? ownedGroups : joinedGroups;

  const handleEditGroup = (group: Group) => {
    const newName = window.prompt('Tên nhóm mới', group.name);

    if (!newName) return;

    const trimmedName = newName.trim();
    if (!trimmedName) return;

    onUpdateGroup({
      ...group,
      name: trimmedName,
    });
    setOpenMenuGroupId(null);
  };

  const handleDeleteGroup = (group: Group) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
      return;
    }

    onDeleteGroup(group.id);
    setOpenMenuGroupId(null);
  };

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
          {list.map((group) => {
            const isSelected = selectedGroup?.id === group.id;
            const canManage = group.isOwned && activeTab === 'owned';
            const isMenuOpen = openMenuGroupId === group.id;

            return (
              <div
                key={group.id}
                className={`relative w-full p-2 rounded-lg border ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/30 hover:bg-muted/50 border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="flex-1 text-left flex items-start gap-2 min-w-0"
                    onClick={() => onGroupSelect(group)}
                  >
                    {activeTab === 'owned' ? (
                      <Users className="h-4 w-4 mt-0.5 shrink-0" />
                    ) : (
                      <UserPlus className="h-4 w-4 mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{group.name}</div>
                      <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                        {group.memberCount} thành viên
                      </div>
                    </div>
                  </button>

                  {canManage && (
                    <div className="shrink-0">
                      <button
                        type="button"
                        className={`p-1 rounded-md hover:bg-muted/80 transition-colors ${
                          isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuGroupId((current) =>
                            current === group.id ? null : group.id,
                          );
                        }}
                        aria-label="Tùy chọn nhóm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {canManage && isMenuOpen && (
                  <div className="absolute right-2 top-9 z-10 w-36 rounded-md border border-border bg-popover shadow-md py-1 text-xs">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-muted transition-colors"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditGroup(group);
                      }}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-destructive hover:bg-muted transition-colors"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteGroup(group);
                      }}
                    >
                      Xóa nhóm
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
