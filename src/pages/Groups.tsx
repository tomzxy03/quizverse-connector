import { useState, useEffect } from 'react';
import { Users, PlusCircle, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import GroupSidebar from '@/components/group/GroupContent/GroupSidebar';
import GroupContent from '@/components/group/GroupContent/GroupContent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { groupService } from '@/services/group.service';
import { useAuth } from '@/contexts/AuthContext';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const [ownedRes, joinedRes] = await Promise.all([
        groupService.getOwnedGroups(0, 50),
        groupService.getJoinedGroups(0, 50)
      ]);

      const owned = (ownedRes.items || []).map((g: any) => ({
        id: g.id.toString(),
        name: g.lobbyName,
        memberCount: g.totalMembers || 0,
        isOwned: true,
      }));

      const ownedIds = new Set(ownedRes.items?.map((g: any) => g.id.toString()) || []);

      const joined = (joinedRes.items || [])
        .filter((g: any) => !ownedIds.has(g.id.toString()))
        .map((g: any) => ({
          id: g.id.toString(),
          name: g.lobbyName,
          memberCount: g.totalMembers || 0,
          isOwned: false,
        }));

      setGroups([...owned, ...joined]);
    } catch (error) {
      console.error('Failed to fetch groups', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = () => {
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateModal(true);
  };

  const handleGroupCreated = async (name: string, description?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const res = await groupService.createGroup({
        lobbyName: trimmedName,
      });

      const newGroup: Group = {
        id: res.id.toString(),
        name: res.lobbyName,
        memberCount: 1,
        isOwned: true,
      };
      console.log('Created group:', newGroup);

      setGroups((prev) => [...prev, newGroup]);
      setSelectedGroup(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please check your inputs.');
    }
    // description is currently unused but kept for future extension
    void description;
  };

  const handleGroupUpdated = async (updatedGroup: Group) => {
    try {
      const res = await groupService.updateGroup(parseInt(updatedGroup.id, 10), {
        lobbyName: updatedGroup.name,
      });

      setGroups((prev) =>
        prev.map((g) => (g.id === updatedGroup.id ? { ...g, name: res.lobbyName } : g)),
      );

      if (selectedGroup?.id === updatedGroup.id) {
        setSelectedGroup({ ...selectedGroup, name: res.lobbyName });
      }
    } catch (error) {
      console.error('Error updating group:', error);
      alert('Failed to update group.');
    }
  };

  const handleGroupDeleted = async (groupId: string) => {
    try {
      await groupService.deleteGroup(parseInt(groupId, 10));
      setGroups((prev) => prev.filter((g) => g.id !== groupId));

      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col w-full px-4 py-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <Users className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">Nhóm học</h1>
        </div>
        <p className="text-muted-foreground -mt-2 mb-4">
          Tạo và tham gia nhóm học để cùng ôn tập với mọi người.
        </p>

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <GroupSidebar
                groups={groups}
                onGroupSelect={handleGroupSelect}
                onCreateGroup={handleCreateGroup}
                selectedGroup={selectedGroup}
                onUpdateGroup={handleGroupUpdated}
                onDeleteGroup={handleGroupDeleted}
              />

              {selectedGroup ? (
                <div className="flex-1 min-w-0 rounded-lg border bg-card overflow-hidden flex flex-col">
                  <GroupContent
                    group={{
                      ...selectedGroup,
                      role: selectedGroup.isOwned ? 'OWNER' : 'MEMBER',
                    }}
                  />
                </div>
              ) : (
                <Card className="flex-1 flex items-center justify-center min-h-[320px]">
                  <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-border flex items-center justify-center mb-4">
                      <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Chọn hoặc tạo nhóm
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Chọn một nhóm ở thanh bên hoặc tạo nhóm mới để bắt đầu.
                    </p>
                    <Button onClick={handleCreateGroup}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Tạo nhóm mới
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Tạo nhóm mới</h2>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGroupCreated(newGroupName, newGroupDescription);
                  setShowCreateModal(false);
                }}
              >
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-foreground mb-1">
                    Tên nhóm
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Nhập tên nhóm"
                    value={newGroupName}
                    onChange={(event) => setNewGroupName(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-foreground mb-1">
                    Mô tả
                  </label>
                  <textarea
                    id="groupDescription"
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    placeholder="Nhập mô tả nhóm"
                    value={newGroupDescription}
                    onChange={(event) => setNewGroupDescription(event.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="flex-1">
                    Tạo nhóm
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Groups;
