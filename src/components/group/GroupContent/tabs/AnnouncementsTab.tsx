import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { groupService } from '@/services';
import { useLazyLoad } from '@/hooks'

const AnnouncementsTab = ({ canManage }: { canManage: boolean }) => {
  const { id } = useParams<{ id: string }>();

  const fetchFn = useCallback(
    async (page: number, size: number) => {
      return await groupService.getAnnouncements(Number(id), page, size);
    },
    [id]
  );

  const { data: announcements, loading, hasMore, loadMore, fetch, error } = useLazyLoad<any>(fetchFn, {
    initialPage: 0,
    pageSize: 10,
    cacheEnabled: true,
  });

  useEffect(() => {
    if (id) {
      fetch(0, false);
    }
  }, [id, fetch]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-foreground">Thông báo</h2>
        {canManage && (
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo thông báo
          </Button>
        )}
      </div>

      {loading && announcements.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang tải...
        </div>
      ) : error ? (
        <div className="text-center py-4 text-sm text-red-500">Đã xảy ra lỗi khi tải dữ liệu</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">Chưa có thông báo nào</div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {announcements.map((a: any) => (
              <li
                key={a.id}
                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{a.title}</h3>
                  <span className="text-xs text-muted-foreground shrink-0">{a.date || a.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-2 text-right">{a.author || a.authorName}</p>
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

export default AnnouncementsTab;
