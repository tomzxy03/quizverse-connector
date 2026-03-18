import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { groupService } from '@/services';
import { useLazyLoad } from '@/hooks';

const MembersTab = ({ canManage, groupId: propGroupId }: { canManage: boolean; groupId?: string }) => {
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const groupId = propGroupId || paramGroupId;

  const fetchFn = useCallback(
    async (page: number, size: number) => {
      if (!groupId) {
        return {
          items: [],
          total_page: 0,
          total: 0,
          page,
        };
      }

      const res = await groupService.getGroupMembers(Number(groupId), page, size);

      return {
        items: res.items,
        total_page: res.total_page,
        total: res.total,
        page: res.page,
      };
    },
    [groupId]
  );

  const { data: members, loading, hasMore, loadMore, fetch, error } = useLazyLoad<any>(fetchFn, {
    initialPage: 0,
    pageSize: 20,
    cacheEnabled: false,
  });

  useEffect(() => {
    if (groupId) {
      fetch(0, false);
    }
  }, [groupId, fetch]);

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

      {loading && members.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang tải...
        </div>
      ) : error ? (
        <div className="text-center py-4 text-sm text-red-500">Đã xảy ra lỗi khi tải dữ liệu</div>
      ) : members.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">Chưa có thành viên nào</div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2">
            {members.map((m: any) => (
              <li
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={m.avatar || m.profilePictureUrl} alt={m.name || m.userName} />
                  <AvatarFallback>{(m.name || m.userName || 'U').slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{m.name || m.userName}</p>
                  <p className="text-xs text-muted-foreground">{m.roleName ? 'Chủ nhóm' : 'Thành viên'}</p>
                </div>
              </li>
            ))}
          </ul>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={loadMore} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MembersTab;
