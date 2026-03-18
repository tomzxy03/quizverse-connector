import { Outlet, useParams } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import GroupTabs from './GroupTabs';
import { Card } from '@/components/ui/card';

interface GroupLayoutProps {
  groupId?: string;
}

const GroupLayoutContent = ({ groupId: propGroupId }: GroupLayoutProps) => {
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const groupId = propGroupId || paramGroupId;

  if (!groupId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-muted-foreground">Group not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Group Tabs Navigation */}
      <GroupTabs groupId={groupId} />

      {/* Tab Content */}
      <main className="flex-1 container mx-auto py-6 px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          }
        >
          <Outlet context={{ groupId }} />
        </Suspense>
      </main>
    </div>
  );
};

export default GroupLayoutContent;
