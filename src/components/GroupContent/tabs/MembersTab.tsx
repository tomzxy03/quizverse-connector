// GroupContent/tabs/MembersTab.tsx
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyMembers = [
  { id: '1', name: 'John Doe', role: 'OWNER', avatar: 'https://i.pravatar.cc/40' },
];

const MembersTab = ({ canManage }: { canManage: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Thành viên</h2>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Tìm thành viên..."
              className="pl-9 pr-3 py-2 border rounded-md w-64"
            />
          </div>

          {canManage && (
            <Button variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Mời
            </Button>
          )}
        </div>
      </div>

      {dummyMembers.map(m => (
        <div
          key={m.id}
          className="flex items-center gap-3 p-3 bg-white rounded-lg border"
        >
          <img src={m.avatar} className="w-9 h-9 rounded-full" />
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-slate-500">{m.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersTab;
