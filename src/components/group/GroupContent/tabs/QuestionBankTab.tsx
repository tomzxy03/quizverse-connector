import { useState, useCallback, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  FolderPlus,
  Folder,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Pencil,
  Trash2,
  FolderInput,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { folderService, questionService, questionBankService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { FolderResDTO } from '@/domains/folder.types';

// ─── Types ───────────────────────────────────────────────────────────────────

type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE' | 'ESSAY';

export type FolderNode = {
  id: string;
  name: string;
  questionCount: number;
  children?: FolderNode[];
  parentId?: string;
};

export type Question = {
  id: string;
  questionName: string;
  subject: string;
  folderId: string;
  type?: QuestionType;
  answers?: AnswerRow[];
};

type AnswerRow = {
  text: string;
  isCorrect: boolean;
};

// ─── Display helpers ──────────────────────────────────────────────────────────

// Removed difficultyLabel and difficultyColor

const questionTypeLabel: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: 'Trắc nghiệm',
  SHORT_ANSWER: 'Trả lời ngắn',
  TRUE_FALSE: 'Đúng / Sai',
  ESSAY: 'Tự luận',
};

// ─── Tree helpers ─────────────────────────────────────────────────────────────

function countQuestionsInFolder(folderId: string, questions: Question[], tree: FolderNode[]): number {
  if (folderId === 'root') return questions.length;
  const collectIds = (node: FolderNode): string[] => {
    const ids = [node.id];
    node.children?.forEach((c) => ids.push(...collectIds(c)));
    return ids;
  };
  const allIds = new Set<string>();
  tree.forEach((n) => collectIds(n).forEach((id) => allIds.add(id)));
  if (!allIds.has(folderId)) return 0;
  let target: string[] = [];
  const walk = (nodes: FolderNode[]) => {
    for (const n of nodes) {
      if (n.id === folderId) {
        target = [n.id, ...(n.children?.flatMap((c) => [c.id, ...(c.children?.map((x) => x.id) ?? [])]) ?? [])];
        return;
      }
      if (n.children) walk(n.children);
    }
  };
  walk(tree);
  if (target.length === 0) return questions.filter((q) => q.folderId === folderId).length;
  return questions.filter((q) => target.includes(q.folderId)).length;
}

function updateCounts(nodes: FolderNode[], questions: Question[]): FolderNode[] {
  return nodes.map((node) => ({
    ...node,
    questionCount: node.id === 'root' ? questions.length : countQuestionsInFolder(node.id, questions, nodes),
    children: node.children ? updateCounts(node.children, questions) : undefined,
  }));
}

function getAllFolderIds(nodes: FolderNode[]): { id: string; name: string }[] {
  const out: { id: string; name: string }[] = [];
  const walk = (list: FolderNode[], prefix = '') => {
    list.forEach((n) => {
      if (n.id !== 'root') out.push({ id: n.id, name: prefix + n.name });
      if (n.children?.length) walk(n.children, prefix + n.name + ' / ');
    });
  };
  walk(nodes);
  return out;
}

function mapBackendFolders(folders: FolderResDTO[]): FolderNode[] {
  return folders.map((f) => ({
    id: String(f.id),
    name: f.name || 'Thư mục không tên',
    questionCount: f.questionCount || 0,
    parentId: f.parentId ? String(f.parentId) : 'root',
    children: f.children ? mapBackendFolders(f.children) : undefined,
  }));
}

// ─── Inline label + field ─────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

// ─── Question Form Dialog ─────────────────────────────────────────────────────

interface QuestionFormState {
  content: string;
  type: QuestionType;
  answers: AnswerRow[];
}

function defaultForm(): QuestionFormState {
  return { content: '', type: 'MULTIPLE_CHOICE', answers: [{ text: '', isCorrect: false }] };
}

interface QuestionDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: QuestionFormState;
  onClose: () => void;
  onSave: (data: QuestionFormState) => Promise<void>;
}

const QuestionDialog = ({ open, mode, initialData, onClose, onSave }: QuestionDialogProps) => {
  const [form, setForm] = useState<QuestionFormState>(initialData ?? defaultForm());
  const [saving, setSaving] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (open) setForm(initialData ?? defaultForm());
  }, [open, initialData]);

  const needsAnswers = form.type === 'MULTIPLE_CHOICE' || form.type === 'TRUE_FALSE';

  const setField = <K extends keyof QuestionFormState>(k: K, v: QuestionFormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const updateAnswer = (idx: number, patch: Partial<AnswerRow>) =>
    setForm((prev) => {
      const answers = prev.answers.map((a, i) => (i === idx ? { ...a, ...patch } : a));
      return { ...prev, answers };
    });

  const addAnswer = () =>
    setForm((prev) => ({ ...prev, answers: [...prev.answers, { text: '', isCorrect: false }] }));

  const removeAnswer = (idx: number) =>
    setForm((prev) => ({ ...prev, answers: prev.answers.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!form.content.trim()) {
      toast({ title: 'Vui lòng nhập nội dung câu hỏi', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin câu hỏi bên dưới.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Content */}
          <Field label="Nội dung câu hỏi *">
            <textarea
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              rows={3}
              placeholder="Nhập nội dung câu hỏi..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4">
            {/* Type */}
            <Field label="Loại câu hỏi">
              <Select value={form.type} onValueChange={(v) => setField('type', v as QuestionType)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(questionTypeLabel) as QuestionType[]).map((t) => (
                    <SelectItem key={t} value={t}>{questionTypeLabel[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Answers */}
          {needsAnswers && (
            <Field label="Đáp án">
              <div className="space-y-2">
                {form.answers.map((ans, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ans.text}
                      onChange={(e) => updateAnswer(idx, { text: e.target.value })}
                      placeholder={`Đáp án ${idx + 1}`}
                      className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <label className="flex items-center gap-1.5 text-sm text-muted-foreground select-none cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={ans.isCorrect}
                        onChange={(e) => updateAnswer(idx, { isCorrect: e.target.checked })}
                        className="h-4 w-4 accent-primary"
                      />
                      Đúng
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeAnswer(idx)}
                      disabled={form.answers.length <= 1}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-1" onClick={addAnswer}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Thêm đáp án
                </Button>
              </div>
            </Field>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Tạo câu hỏi' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Folder Name Dialog (create / rename) ─────────────────────────────────────

interface FolderNameDialogProps {
  open: boolean;
  mode: 'create' | 'rename';
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

const FolderNameDialog = ({ open, mode, initialName = '', onClose, onSave }: FolderNameDialogProps) => {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Vui lòng nhập tên thư mục', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await onSave(name.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tạo thư mục mới' : 'Đổi tên thư mục'}</DialogTitle>
        </DialogHeader>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Tên thư mục..."
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Tạo' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Move to Folder Dialog ────────────────────────────────────────────────────

interface MoveFolderDialogProps {
  open: boolean;
  folders: { id: string; name: string }[];
  currentId?: string;
  title: string;
  onClose: () => void;
  onSave: (targetId: string) => Promise<void>;
}

const MoveFolderDialog = ({ open, folders, currentId, title, onClose, onSave }: MoveFolderDialogProps) => {
  const [targetId, setTargetId] = useState('root');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setTargetId('root');
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(targetId);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const options = [{ id: 'root', name: 'Tất cả câu hỏi (gốc)' }, ...folders.filter((f) => f.id !== currentId)];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Chọn thư mục đích bên dưới.</DialogDescription>
        </DialogHeader>
        <Select value={targetId} onValueChange={setTargetId}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn thư mục..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Di chuyển
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

interface DeleteConfirmDialogProps {
  open: boolean;
  label: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmDialog = ({ open, label, description, onClose, onConfirm }: DeleteConfirmDialogProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            {description ?? `Bạn có chắc muốn xóa "${label}"? Hành động này không thể hoàn tác.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleting}>Hủy</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Folder Tree ──────────────────────────────────────────────────────────────

interface FolderTreeProps {
  nodes: FolderNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  questions: Question[];
  onRenameFolder: (id: string, name: string) => void;
  onMoveFolder: (id: string) => void;
  onDeleteFolder: (id: string, name: string) => void;
  onCreateFolder: (parentId: string) => void;
}

const FolderTree = ({
  nodes,
  selectedId,
  onSelect,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
  onCreateFolder,
}: FolderTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ root: true });
  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderNode = (node: FolderNode, depth = 0) => {
    const hasChildren = !!node.children?.length;
    const isExpanded = expanded[node.id] ?? true;
    const isSelected = selectedId === node.id;
    const isRoot = node.id === 'root';

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`group flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${isSelected ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-muted/80'
            }`}
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <button
            type="button"
            className="flex flex-1 min-w-0 items-center gap-2"
            onClick={() => {
              onSelect(node.id);
              if (hasChildren) toggle(node.id);
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )
            ) : (
              <span className="w-3.5" />
            )}
            <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{node.name}</span>
          </button>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {node.questionCount}
          </span>
          {!isRoot && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-70 hover:opacity-100" aria-label="Thao tác thư mục">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRenameFolder(node.id, node.name); }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Đổi tên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreateFolder(node.id); }}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Thư mục con
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMoveFolder(node.id); }}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Di chuyển
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDeleteFolder(node.id, node.name); }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-0.5">{nodes.map((n) => renderNode(n))}</div>;
};

// ─── Main component ───────────────────────────────────────────────────────────

const QuestionBankTab = () => {
  const [bankId, setBankId] = useState<number | null>(null);
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const toggleQuestion = (id: string) => setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── Modal state ──────────────────────────────────────────────────────────
  const [questionModal, setQuestionModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    question?: Question;
    initialData?: ReturnType<typeof defaultForm>;
  }>({ open: false, mode: 'create' });

  const [folderNameModal, setFolderNameModal] = useState<{
    open: boolean;
    mode: 'create' | 'rename';
    folderId?: string;
    parentId?: string;
    initialName?: string;
  }>({ open: false, mode: 'create' });

  const [moveFolderModal, setMoveFolderModal] = useState<{
    open: boolean;
    folderId?: string;
  }>({ open: false });

  const [moveQuestionModal, setMoveQuestionModal] = useState<{
    open: boolean;
    question?: Question;
  }>({ open: false });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: 'question' | 'folder';
    id?: string;
    name?: string;
    description?: string;
  }>({ open: false, type: 'question' });

  // ── Data loading ─────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const bankRes = await questionBankService.getMyQuestionBank();
      setBankId(bankRes.id);

      const foldersRes = await folderService.getFolderTree();
      const mappedFolders = mapBackendFolders(foldersRes || []);
      const rootFolderNode: FolderNode = {
        id: 'root',
        name: 'Tất cả câu hỏi',
        questionCount: 0,
        children: mappedFolders,
      };

      let allQuestionsRaw: any[] = [];
      try {
        const qRes = await questionService.getAllQuestionsByBank(0, 1000);
        if (Array.isArray(qRes)) allQuestionsRaw = qRes;
        else if (Array.isArray(qRes?.content)) allQuestionsRaw = qRes.content;
        else if (Array.isArray(qRes?.items)) allQuestionsRaw = qRes.items;
        else if (qRes?.items?.items && Array.isArray(qRes.items.items)) {
          allQuestionsRaw = qRes.items.items;
        }
      } catch (e) {
        console.warn('Failed to load questions', e);
      }

      const mappedQuestions: Question[] = allQuestionsRaw.map((raw: any, idx: number) => {
        const q = raw.question || raw; // Handle both nested object and flat object
        return {
          id: q.id != null ? String(q.id) : `tmp-${idx}`,
          questionName: q.questionName || q.content || 'Untitled',
          subject: q.subject || 'Chung',
          difficulty: q.level === 'EASY' ? 'easy' : q.level === 'HARD' ? 'hard' : 'medium',
          points: q.points || 1,
          folderId: raw.folderId ? String(raw.folderId) : (q.folderId ? String(q.folderId) : 'root'),
          type: q.questionType || q.type as QuestionType | undefined,
          answers: q.answers?.map((a: any) => ({
            text: a.answerText || a.answerName || a.text || '',
            isCorrect: a.answerCorrect || a.isCorrect || false
          })) ?? [],
        };
      });

      setFolderTree([rootFolderNode]);
      setQuestions(mappedQuestions);
    } catch (error) {
      console.error(error);
      toast({ title: 'Lỗi tải ngân hàng câu hỏi', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const treeWithCounts = updateCounts(folderTree, questions);
  const allFolderOptions = getAllFolderIds(treeWithCounts);

  const visibleQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchTerm ||
      q.questionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFolderId === 'root') return true;
    return q.folderId === selectedFolderId;
  });

  // ── Handlers ─────────────────────────────────────────────────────────────

  // Folder name modal -> save
  const handleFolderNameSave = useCallback(async (name: string) => {
    if (!bankId) return;
    const { mode, folderId, parentId } = folderNameModal;

    if (mode === 'create') {
      await folderService.createFolder({
        name,
        bankId,
        parentId: parentId === 'root' || !parentId ? undefined : Number(parentId),
      });
      toast({ title: 'Đã tạo thư mục' });
    } else {
      const parentIdNum = parentId && parentId !== 'root' ? Number(parentId) : undefined;
      await folderService.updateFolder(Number(folderId), { name, bankId, parentId: parentIdNum });
      toast({ title: 'Đã cập nhật tên thư mục' });
    }
    loadData();
  }, [bankId, folderNameModal, loadData]);

  // Move folder -> save
  const handleMoveFolderSave = useCallback(async (targetId: string) => {
    if (!moveFolderModal.folderId) return;
    await folderService.moveFolder(
      Number(moveFolderModal.folderId),
      targetId === 'root' ? null : Number(targetId),
    );
    toast({ title: 'Đã di chuyển thư mục' });
    loadData();
  }, [moveFolderModal.folderId, loadData]);

  // Delete confirm -> action
  const handleDeleteConfirm = useCallback(async () => {
    if (deleteModal.type === 'folder' && deleteModal.id) {
      await folderService.deleteFolder(Number(deleteModal.id));
      toast({ title: 'Đã xóa thư mục' });
      if (selectedFolderId === deleteModal.id) setSelectedFolderId('root');
    } else if (deleteModal.type === 'question' && deleteModal.id) {
      await questionService.deleteQuestion(Number(deleteModal.id));
      toast({ title: 'Đã xóa câu hỏi' });
    }
    loadData();
  }, [deleteModal, selectedFolderId, loadData]);

  // Question form -> save
  const handleQuestionSave = useCallback(async (data: ReturnType<typeof defaultForm>) => {
    if (!bankId) return;
    const questionType: 'text' | 'image' = 'text';
    const payload = {
      questionName: data.content.trim(),
      questionType,
      answers: data.answers
        .filter((a) => a.text.trim())
        .map((a) => ({
          answerName: a.text.trim(),
          answerType: 'text' as const,
          answerCorrect: a.isCorrect,
        })),
    };

    if (questionModal.mode === 'create') {
      await questionService.createQuestionsInFolder([payload], selectedFolderId === 'root' ? undefined : Number(selectedFolderId));
      toast({ title: 'Đã thêm câu hỏi' });
    } else if (questionModal.question) {
      const q = questionModal.question;
      await questionService.updateQuestionInFolder(Number(q.id), {
        folderId: q.folderId === 'root' ? undefined : Number(q.folderId),
        questions: payload
      });
      toast({ title: 'Đã cập nhật câu hỏi' });
    }
    loadData();
  }, [bankId, selectedFolderId, questionModal, loadData]);

  // Move question -> save
  const handleMoveQuestionSave = useCallback(async (targetId: string) => {
    if (!moveQuestionModal.question) return;
    await questionService.moveQuestionToFolder(
      Number(moveQuestionModal.question.id),
      targetId === 'root' ? null : Number(targetId),
    );
    toast({ title: 'Đã di chuyển câu hỏi' });
    loadData();
  }, [moveQuestionModal.question, loadData]);

  // ── Open helpers ─────────────────────────────────────────────────────────

  const openCreateQuestion = () =>
    setQuestionModal({ open: true, mode: 'create', initialData: defaultForm() });

  const openEditQuestion = (q: Question) =>
    setQuestionModal({
      open: true,
      mode: 'edit',
      question: q,
      initialData: {
        content: q.questionName,
        type: (q.type as QuestionType) || 'MULTIPLE_CHOICE',
        answers: q.answers?.length ? q.answers : [{ text: '', isCorrect: false }],
      },
    });

  const openCreateFolder = (parentId: string) =>
    setFolderNameModal({ open: true, mode: 'create', parentId, initialName: '' });

  const openRenameFolder = (id: string, currentName: string) => {
    const findParent = (nodes: FolderNode[], fid: string): string | undefined => {
      for (const n of nodes) {
        if (n.id === fid) return n.parentId;
        if (n.children) { const p = findParent(n.children, fid); if (p) return p; }
      }
    };
    const parentId = findParent(folderTree, id);
    setFolderNameModal({ open: true, mode: 'rename', folderId: id, parentId, initialName: currentName });
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-foreground">Ngân hàng câu hỏi</h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm dark:bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-slate-50/80 px-3 py-2.5 dark:bg-muted/50">
          <div className="relative min-w-[200px] flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tiêu đề, môn học..."
              className="h-9 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => openCreateFolder(selectedFolderId)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Thư mục mới
            </Button>
            <Button size="sm" onClick={openCreateQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:flex-row min-h-0">
          {/* Folder sidebar */}
          <aside className="w-full rounded-lg border border-border bg-slate-50/60 p-3 dark:bg-muted/30 md:w-64 lg:w-72 shrink-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Thư mục</p>
            <div className="max-h-[280px] overflow-y-auto rounded-md bg-white py-1 pr-1 dark:bg-background">
              <FolderTree
                nodes={treeWithCounts}
                selectedId={selectedFolderId}
                onSelect={setSelectedFolderId}
                questions={questions}
                onRenameFolder={openRenameFolder}
                onMoveFolder={(id) => setMoveFolderModal({ open: true, folderId: id })}
                onDeleteFolder={(id, name) =>
                  setDeleteModal({
                    open: true,
                    type: 'folder',
                    id,
                    name,
                    description: `Xóa thư mục "${name}"? Câu hỏi bên trong sẽ chuyển về gốc.`,
                  })
                }
                onCreateFolder={openCreateFolder}
              />
            </div>
          </aside>

          {/* Question list */}
          <section className="flex-1 min-w-0 rounded-lg border border-border bg-slate-50/60 p-4 dark:bg-muted/30">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Câu hỏi trong thư mục</p>
                <p className="text-xs text-muted-foreground">{visibleQuestions.length} câu hỏi</p>
              </div>
            </div>

            {visibleQuestions.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white text-center text-sm text-muted-foreground dark:bg-background">
                <p className="font-medium">Chưa có câu hỏi</p>
                <p className="mt-1 text-xs">Thêm câu hỏi hoặc đổi bộ lọc.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {visibleQuestions.map((q) => (
                  <li
                    key={q.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-white p-3 text-sm shadow-sm transition-shadow hover:shadow dark:bg-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleQuestion(q.id)} className="text-muted-foreground hover:text-foreground">
                            {expandedQuestions[q.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                          <p className="font-medium text-foreground">{q.questionName}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs pl-6">
                          {q.type && (
                            <span className="rounded-md bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                              {questionTypeLabel[q.type] ?? q.type}
                            </span>
                          )}
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                            {q.subject}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Thao tác câu hỏi">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => openEditQuestion(q)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setMoveQuestionModal({ open: true, question: q })}>
                            <FolderInput className="mr-2 h-4 w-4" />
                            Di chuyển
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteModal({ open: true, type: 'question', id: q.id, name: q.questionName })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {expandedQuestions[q.id] && q.answers && q.answers.length > 0 && (
                      <div className="pl-6 space-y-1.5 pt-2 border-t border-border">
                        {q.answers.map((ans, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${ans.isCorrect ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                            <span className={ans.isCorrect ? 'font-medium text-foreground text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>{ans.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}

      {/* Create / Edit question */}
      <QuestionDialog
        open={questionModal.open}
        mode={questionModal.mode}
        initialData={questionModal.initialData}
        onClose={() => setQuestionModal((s) => ({ ...s, open: false }))}
        onSave={handleQuestionSave}
      />

      {/* Create folder / Rename folder */}
      <FolderNameDialog
        open={folderNameModal.open}
        mode={folderNameModal.mode}
        initialName={folderNameModal.initialName}
        onClose={() => setFolderNameModal((s) => ({ ...s, open: false }))}
        onSave={handleFolderNameSave}
      />

      {/* Move folder */}
      <MoveFolderDialog
        open={moveFolderModal.open}
        folders={allFolderOptions}
        currentId={moveFolderModal.folderId}
        title="Di chuyển thư mục"
        onClose={() => setMoveFolderModal({ open: false })}
        onSave={handleMoveFolderSave}
      />

      {/* Move question */}
      <MoveFolderDialog
        open={moveQuestionModal.open}
        folders={allFolderOptions}
        currentId={moveQuestionModal.question?.folderId}
        title="Di chuyển câu hỏi"
        onClose={() => setMoveQuestionModal({ open: false })}
        onSave={handleMoveQuestionSave}
      />

      {/* Delete confirm */}
      <DeleteConfirmDialog
        open={deleteModal.open}
        label={deleteModal.name ?? ''}
        description={deleteModal.description}
        onClose={() => setDeleteModal((s) => ({ ...s, open: false }))}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default QuestionBankTab;
