import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const dummyMembers = [
  { id: '1', name: 'John Doe', role: 'OWNER', avatar: 'https://i.pravatar.cc/40' },
  { id: '2', name: 'Jane Smith', role: 'ADMIN', avatar: 'https://i.pravatar.cc/41' },
  { id: '3', name: 'Bob Johnson', role: 'MEMBER', avatar: 'https://i.pravatar.cc/42' },
];

const MembersTab = ({ canManage }: { canManage: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-base font-medium text-foreground">Thành viên</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Tìm thành viên..."
              className="pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-md w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {canManage && (
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Mời
            </Button>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {dummyMembers.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={m.avatar} alt={m.name} />
              <AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersTab;
