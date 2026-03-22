import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, PlusCircle, Users, UserPlus, Search, ChevronDown, ChevronUp, Loader2, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LobbyResDTO } from '@/domains';

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
  onLeaveGroup?: (group: Group) => void;
  onSearchGroups?: (codeInvite: string) => Promise<LobbyResDTO>;
  onJoinLobby?: (lobbyId: number) => Promise<void>;
}

const GroupSidebar = ({
  groups,
  onGroupSelect,
  onCreateGroup,
  selectedGroup,
  onUpdateGroup,
  onDeleteGroup,
  onLeaveGroup,
  onSearchGroups,
  onJoinLobby,
}: GroupSidebarProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'owned' | 'joined'>('owned');
  const [openMenuGroupId, setOpenMenuGroupId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchResult, setSearchResult] = useState<LobbyResDTO | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!selectedGroup) return;
    setActiveTab(selectedGroup.isOwned ? 'owned' : 'joined');
  }, [selectedGroup]);

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

  const handleSearchGroups = async () => {
    if (!onSearchGroups) return;
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchError('Vui lòng nhập mã mời');
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await onSearchGroups(trimmedQuery);
      setSearchResult(res);
    } catch (error) {
      setSearchResult(null);
      setSearchError('Không tìm thấy nhóm với mã này');
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinLobby = async () => {
    if (!onJoinLobby || !searchResult) return;
    setIsJoining(true);
    try {
      await onJoinLobby(searchResult.id);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="w-full md:w-72 shrink-0 flex flex-col overflow-hidden h-fit md:min-h-[420px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium text-foreground">Nhóm của tôi</CardTitle>
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsCollapsed((current) => !current)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Mở rộng danh sách nhóm' : 'Thu gọn danh sách nhóm'}
          >
            {isCollapsed ? (
              <>
                Mở rộng
                <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                Thu gọn
                <ChevronUp className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className={`flex flex-col p-0 ${isCollapsed ? 'hidden md:flex' : ''}`}>
        <div className="flex border-b border-border px-4">
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'owned'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('owned')}
          >
            Nhóm của tôi
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'joined'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            onClick={() => setActiveTab('joined')}
          >
            Đã tham gia
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[200px] max-h-[320px] md:max-h-[360px]">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full">
              <p className="text-sm text-muted-foreground">Chưa có nhóm nào</p>
            </div>
          ) : (
            list.map((group) => {
              const isSelected = selectedGroup?.id === group.id;
              const canManage = group.isOwned && activeTab === 'owned';
              const isMenuOpen = openMenuGroupId === group.id;

              return (
                <div
                  key={group.id}
                  className={`relative w-full p-2 rounded-lg border ${isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/30 hover:bg-muted/50 border-transparent'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      className="flex-1 text-left flex items-start gap-2 min-w-0"
                      onClick={() => {
                        onGroupSelect(group);
                        navigate(`/groups/${group.id}`);
                      }}
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

                    {activeTab === 'joined' && onLeaveGroup && (
                      <div className="shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${isSelected ? 'text-primary-foreground hover:text-primary-foreground' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onLeaveGroup(group);
                          }}
                          aria-label="Rời nhóm"
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {canManage && (
                      <div className="shrink-0">
                        <button
                          type="button"
                          className={`p-1 rounded-md hover:bg-muted/80 transition-colors ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
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
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors "
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
            })
          )}
        </div>

        <div className="p-3 border-t border-border">
          {activeTab === 'owned' ? (
            <Button className="w-full" size="sm" onClick={onCreateGroup}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tạo nhóm mới
            </Button>
          ) : (
            <div className="space-y-2">
              {isSearchOpen && (
                <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-3 shadow-sm">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tìm nhóm bằng mã mời
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Nhập mã mời để tìm đúng nhóm bạn muốn tham gia.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={searchQuery}
                      placeholder="Nhập mã mời (ví dụ: QV-2026-ABC)"
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSearchGroups();
                        }
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={handleSearchGroups} disabled={isSearching}>
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        Tìm bằng mã
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          setSearchResult(null);
                          setSearchError(null);
                        }}
                      >
                        Đóng
                      </Button>
                    </div>
                    {searchError && (
                      <p className="text-xs text-destructive">{searchError}</p>
                    )}
                    {searchResult && (
                      <div className="rounded-md border border-border bg-background p-3 space-y-2">
                        <div className="text-sm font-semibold text-foreground">
                          {searchResult.lobbyName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Chủ nhóm: {searchResult.hostName || 'Không rõ'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {searchResult.totalMembers ?? 0} thành viên
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={handleJoinLobby}
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          Tham gia nhóm
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                size="sm"
                onClick={() => setIsSearchOpen((current) => !current)}
                variant={isSearchOpen ? 'secondary' : 'outline'}
              >
                <Search className="h-4 w-4 mr-2" />
                {isSearchOpen ? 'Ẩn tìm kiếm' : 'Tìm nhóm'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSidebar;
