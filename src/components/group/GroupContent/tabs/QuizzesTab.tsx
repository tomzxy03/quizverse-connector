import { useEffect, useCallback, useState } from 'react';
import { PlusCircle, Search, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import QuizCard from '@/components/quiz/QuizCard';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService, quizService } from '@/services';
import { toast } from '@/hooks/use-toast';
import type { QuizResDTO } from '@/domains';
import { useLazyLoad } from '@/hooks';

const QuizzesTab = ({ canManage, groupId: propGroupId }: { canManage: boolean; groupId?: string }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const id = propGroupId || paramId;

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id?: number; title?: string }>({ open: false });
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(deleteModal.id);
      toast({ title: 'Đã xóa bài tập' });
      setDeleteModal({ open: false });
      fetch(0, false);
    } catch (err) {
      toast({ title: 'Xóa thất bại', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

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
              <div key={q.id} className="relative group">
                <QuizCard
                  quiz={q}
                  onClick={() => {
                    if (propGroupId) {
                      navigate(`/groups/${propGroupId}/quizzes/${q.id}`);
                    } else {
                      navigate(`/quiz/${q.id}`);
                    }
                  }}
                />
                {canManage && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <Button variant="outline" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border-slate-200">
                          <MoreVertical className="h-4 w-4 text-slate-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/groups/${id}/add-quiz?edit=${q.id}`); }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteModal({ open: true, id: q.id, title: q.title }); }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
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

      {/* Delete Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => !open && setDeleteModal({ open: false })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xóa bài tập</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài "{deleteModal.title}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false })} disabled={deleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizzesTab;
