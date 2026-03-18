import { useOutletContext } from 'react-router-dom';
import { Loader2, AlertCircle, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGroupAnnouncements } from '@/hooks/group';

interface OutletContext {
  groupId: string;
}

/**
 * Group Announcements Tab Component (React Query Version)
 * 
 * Uses React Query for data fetching with automatic caching
 * - No manual loading/error state management
 * - Data is cached and not re-fetched when switching tabs
 * - Supports prefetching on tab hover
 * 
 * Architecture: Component → Hook → Service → Repository → API
 */
const GroupAnnouncementsTab = () => {
  const { groupId } = useOutletContext<OutletContext>();
  
  // React Query automatically handles: loading, error, caching, refetching
  const { data: announcements = [], isLoading, error } = useGroupAnnouncements(Number(groupId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load announcements'}
        </AlertDescription>
      </Alert>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No announcements yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader>
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Posted by {announcement.createdBy} on {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{announcement.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GroupAnnouncementsTab;
