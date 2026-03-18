import { useOutletContext } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useGroupMembers } from '@/hooks/group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OutletContext {
  groupId: string;
}

export default function GroupMembersTab() {
  const { groupId } = useOutletContext<OutletContext>();
  
  // React Query automatically handles: loading, error, caching, refetching
  const { data: members = [], isLoading, error } = useGroupMembers(Number(groupId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load members'}
        </AlertDescription>
      </Alert>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Chưa có thành viên nào trong nhóm</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.profilePictureUrl} alt={member.userName} />
              <AvatarFallback>{member.userName?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.userName}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Thành viên</span>
        </div>
      ))}
    </div>
  );
}
