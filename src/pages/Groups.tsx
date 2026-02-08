import { useState } from 'react';
import { Users, PlusCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import GroupSidebar from '@/components/group/GroupContent/GroupSidebar';
import GroupContent from '@/components/group/GroupContent/GroupContent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isOwned: boolean;
}

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col container px-4 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <Users className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">Nhóm học</h1>
        </div>
        <p className="text-muted-foreground -mt-2 mb-4">
          Tạo và tham gia nhóm học để cùng ôn tập với mọi người.
        </p>

        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          <GroupSidebar
            onGroupSelect={handleGroupSelect}
            onCreateGroup={handleCreateGroup}
            selectedGroup={selectedGroup}
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
