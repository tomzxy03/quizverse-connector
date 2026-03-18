import { useEffect, useCallback } from 'react';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizCard from '@/components/quiz/QuizCard';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '@/services';
import type { QuizResDTO } from '@/domains';
import { useLazyLoad } from '@/hooks';

const QuizzesTab = ({ canManage, groupId: propGroupId }: { canManage: boolean; groupId?: string }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const id = propGroupId || paramId;

  const fetchFn = useCallback(
    async (page: number, size: number) => {
      if (!id) {
        return {
          items: [],
          total_page: 0,
          total: 0,
          page,
        };
      }
      return await groupService.getGroupQuizzes(Number(id), page, size);
    },
    [id]
  );

  const { data: quizzes, loading, hasMore, loadMore, fetch, error } = useLazyLoad<QuizResDTO>(fetchFn, {
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
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-base font-medium text-foreground">Bài tập</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Tìm quiz..."
              className="pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-md w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {canManage && (
            <Button size="sm" onClick={() => navigate(`/groups/${id}/add-quiz`)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm quiz
            </Button>
          )}
        </div>
      </div>

      {loading && quizzes.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground flex justify-center items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang tải...
        </div>
      ) : error ? (
        <div className="text-center py-4 text-sm text-red-500">Đã xảy ra lỗi khi tải dữ liệu</div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">Chưa có quiz nào</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
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

export default QuizzesTab;
