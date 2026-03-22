import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { groupService } from '@/services';
import { useLazyLoad } from '@/hooks'
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type Announcement = {
  id: number;
  title?: string;
  content?: string;
  createdAt?: string;
  date?: string;
  hostName?: string;
  author?: string;
  authorName?: string;
};

const AnnouncementsTab = ({ canManage, groupId: propGroupId }: { canManage: boolean; groupId?: string }) => {
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const id = propGroupId || paramGroupId;
  const { user } = useAuth();
  const [formState, setFormState] = useState<{ open: boolean; mode: 'create' | 'edit'; current?: Announcement }>({
    open: false,
    mode: 'create',
  });
  const [deleteState, setDeleteState] = useState<{ open: boolean; current?: Announcement }>({ open: false });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
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
      return await groupService.getAnnouncements(Number(id), page, size);
    },
    [id]
  );

  const { data: announcements, loading, hasMore, loadMore, fetch, error } = useLazyLoad<Announcement>(fetchFn, {
    initialPage: 0,
    pageSize: 10,
    cacheEnabled: true,
  });

  useEffect(() => {
    if (id) {
      fetch(0, false);
    }
  }, [id, fetch]);

  const openCreate = () => {
    setTitle('');
    setContent('');
    setFormState({ open: true, mode: 'create' });
  };

  const openEdit = (announcement: Announcement) => {
    setTitle(announcement.title || '');
    setContent(announcement.content || '');
    setFormState({ open: true, mode: 'edit', current: announcement });
  };

  const handleSave = async () => {
    if (!id) return;
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast({ title: 'Vui lòng nhập nội dung thông báo', variant: 'destructive' });
      return;
    }
    if (!user?.id) {
      toast({ title: 'Không xác định được người tạo', variant: 'destructive' });
      return;
    }

    const payload = {
      title: title.trim() || undefined,
      content: trimmedContent,
      lobbyId: Number(id),
      type: 'group',
      hostId: user.id,
    };

    setSaving(true);
    try {
      if (formState.mode === 'edit' && formState.current?.id) {
        await groupService.updateAnnouncement(Number(id), formState.current.id, payload);
        toast({ title: 'Đã cập nhật thông báo' });
      } else {
        await groupService.addAnnouncement(Number(id), payload);
        toast({ title: 'Đã tạo thông báo' });
      }
      setFormState({ open: false, mode: 'create' });
      fetch(0, false);
    } catch (err) {
      toast({ title: 'Lưu thông báo thất bại', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !deleteState.current?.id) return;
    setDeleting(true);
    try {
      await groupService.deleteAnnouncement(Number(id), deleteState.current.id);
      toast({ title: 'Đã xóa thông báo' });
      setDeleteState({ open: false });
      fetch(0, false);
    } catch (err) {
      toast({ title: 'Xóa thông báo thất bại', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-foreground">Thông báo</h2>
        {canManage && (
          <Button size="sm" onClick={openCreate}>
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
            {announcements.map((a) => (
              <li
                key={a.id}
                className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">{a.title || 'Thông báo'}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{a.date || a.createdAt}</span>
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm border-slate-200"
                          >
                            <MoreVertical className="h-4 w-4 text-slate-700" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => openEdit(a)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteState({ open: true, current: a })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{a.content}</p>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {a.author || a.authorName || a.hostName || ''}
                </p>
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

      {/* Create / Edit Modal */}
      <Dialog open={formState.open} onOpenChange={(open) => !open && setFormState({ open: false, mode: 'create' })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{formState.mode === 'edit' ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</DialogTitle>
            <DialogDescription>Nhập nội dung thông báo cho nhóm.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="announcement-title">
                Tiêu đề
              </label>
              <Input
                id="announcement-title"
                value={title}
                placeholder="Nhập tiêu đề (không bắt buộc)"
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="announcement-content">
                Nội dung
              </label>
              <Textarea
                id="announcement-content"
                value={content}
                placeholder="Nhập nội dung thông báo..."
                onChange={(event) => setContent(event.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormState({ open: false, mode: 'create' })} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formState.mode === 'edit' ? 'Cập nhật' : 'Tạo thông báo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteState.open} onOpenChange={(open) => !open && setDeleteState({ open: false })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xóa thông báo</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thông báo "{deleteState.current?.title || 'Thông báo'}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteState({ open: false })} disabled={deleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsTab;
