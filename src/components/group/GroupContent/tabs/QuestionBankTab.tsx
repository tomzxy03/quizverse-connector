import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type Difficulty = 'easy' | 'medium' | 'hard';

export type FolderNode = {
  id: string;
  name: string;
  questionCount: number;
  children?: FolderNode[];
  parentId?: string;
};

export type Question = {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  points: number;
  folderId: string;
};

const initialFolderTree: FolderNode[] = [
  {
    id: 'root',
    name: 'Tất cả câu hỏi',
    questionCount: 4,
    parentId: undefined,
    children: [
      {
        id: 'math',
        name: 'Toán học',
        questionCount: 2,
        parentId: 'root',
        children: [
          { id: 'algebra', name: 'Đại số', questionCount: 1, parentId: 'math' },
          { id: 'geometry', name: 'Hình học', questionCount: 1, parentId: 'math' },
        ],
      },
      {
        id: 'physics',
        name: 'Vật lý',
        questionCount: 1,
        parentId: 'root',
      },
      {
        id: 'chemistry',
        name: 'Hóa học',
        questionCount: 1,
        parentId: 'root',
      },
    ],
  },
];

const initialQuestions: Question[] = [
  { id: '1', title: 'Phương trình bậc hai có dạng tổng quát như thế nào?', subject: 'Toán học', difficulty: 'easy', points: 2, folderId: 'algebra' },
  { id: '2', title: 'Định lý Pythagore phát biểu như thế nào?', subject: 'Toán học', difficulty: 'medium', points: 3, folderId: 'geometry' },
  { id: '3', title: 'Định luật II Newton mô tả mối quan hệ nào?', subject: 'Vật lý', difficulty: 'medium', points: 3, folderId: 'physics' },
  { id: '4', title: 'Liên kết cộng hóa trị là gì?', subject: 'Hóa học', difficulty: 'hard', points: 4, folderId: 'chemistry' },
];

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

const difficultyColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

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
  const descendantIds = (node: FolderNode): string[] => {
    if (node.id === folderId) {
      const ids = [node.id];
      node.children?.forEach((c) => ids.push(...(descendantIds(c) || [])));
      return ids;
    }
    return node.children?.flatMap(descendantIds) ?? [];
  };
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
  return nodes.map((node) => {
    const count = node.id === 'root' ? questions.length : countQuestionsInFolder(node.id, questions, nodes);
    return {
      ...node,
      questionCount: count,
      children: node.children ? updateCounts(node.children, questions) : undefined,
    };
  });
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

function findAndUpdateFolder(
  nodes: FolderNode[],
  folderId: string,
  updater: (node: FolderNode) => FolderNode
): FolderNode[] {
  return nodes.map((n) => {
    if (n.id === folderId) return updater(n);
    if (n.children) return { ...n, children: findAndUpdateFolder(n.children, folderId, updater) };
    return n;
  });
}

function findAndRemoveFolder(nodes: FolderNode[], folderId: string): FolderNode[] {
  return nodes
    .map((n) => {
      if (n.id === folderId) return null;
      if (n.children) return { ...n, children: findAndRemoveFolder(n.children, folderId).filter(Boolean) as FolderNode[] };
      return n;
    })
    .filter(Boolean) as FolderNode[];
}

function addFolderUnder(nodes: FolderNode[], parentId: string, newFolder: FolderNode): FolderNode[] {
  if (parentId === 'root') {
    const root = nodes.find((n) => n.id === 'root');
    if (!root) return nodes;
    return nodes.map((n) =>
      n.id === 'root' ? { ...n, children: [...(n.children ?? []), { ...newFolder, parentId: 'root' }] } : n
    );
  }
  return findAndUpdateFolder(nodes, parentId, (parent) => ({
    ...parent,
    children: [...(parent.children ?? []), { ...newFolder, parentId: parent.id }],
  }));
}

interface FolderTreeProps {
  nodes: FolderNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  questions: Question[];
  onRenameFolder: (id: string, name: string) => void;
  onMoveFolder: (id: string, targetParentId: string) => void;
  onDeleteFolder: (id: string) => void;
  onCreateFolder: (parentId: string) => void;
}

const FolderTree = ({
  nodes,
  selectedId,
  onSelect,
  questions,
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
    const folderOptions = getAllFolderIds(nodes).filter((f) => f.id !== node.id && f.id !== node.parentId);

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`group flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
            isSelected ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-muted/80'
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
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    const name = window.prompt('Tên thư mục mới', node.name);
                    if (name?.trim()) onRenameFolder(node.id, name.trim());
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Đổi tên
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolder(node.id);
                  }}
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Thư mục con
                </DropdownMenuItem>
                {folderOptions.length > 0 && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      const targetId = window.prompt(
                        'Di chuyển vào thư mục (nhập id):\n' + folderOptions.map((f) => `${f.id} - ${f.name}`).join('\n')
                      );
                      if (targetId) onMoveFolder(node.id, targetId.trim());
                    }}
                  >
                    <FolderInput className="mr-2 h-4 w-4" />
                    Di chuyển
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Xóa thư mục "${node.name}"? Câu hỏi bên trong sẽ chuyển về gốc.`)) onDeleteFolder(node.id);
                  }}
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

const QuestionBankTab = () => {
  const [folderTree, setFolderTree] = useState<FolderNode[]>(initialFolderTree);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root');
  const [searchTerm, setSearchTerm] = useState('');

  const treeWithCounts = updateCounts(folderTree, questions);

  const visibleQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchTerm ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFolderId === 'root') return true;
    return q.folderId === selectedFolderId;
  });

  const handleRenameFolder = useCallback((folderId: string, name: string) => {
    setFolderTree((prev) => findAndUpdateFolder(prev, folderId, (n) => ({ ...n, name })));
  }, []);

  const handleMoveFolder = useCallback((folderId: string, targetParentId: string) => {
    const findNode = (nodes: FolderNode[], id: string): FolderNode | null => {
      for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) { const r = findNode(n.children, id); if (r) return r; }
      }
      return null;
    };
    setFolderTree((prev) => {
      const node = findNode(prev, folderId);
      if (!node || node.id === targetParentId) return prev;
      const without = findAndRemoveFolder(prev, folderId);
      return addFolderUnder(without, targetParentId, { ...node, parentId: targetParentId });
    });
  }, []);

  const handleDeleteFolder = useCallback((folderId: string) => {
    setFolderTree((prev) => findAndRemoveFolder(prev, folderId));
    setQuestions((prev) => prev.map((q) => (q.folderId === folderId ? { ...q, folderId: 'root' } : q)));
  }, []);

  const handleCreateFolder = useCallback((parentId: string) => {
    const name = window.prompt('Tên thư mục mới');
    if (!name?.trim()) return;
    const newId = 'folder-' + Date.now();
    setFolderTree((prev) => addFolderUnder(prev, parentId, { id: newId, name: name.trim(), questionCount: 0, parentId }));
  }, []);

  const handleAddQuestion = useCallback(() => {
    const title = window.prompt('Nội dung câu hỏi');
    if (!title?.trim()) return;
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q-' + Date.now(),
        title: title.trim(),
        subject: 'Chung',
        difficulty: 'medium',
        points: 1,
        folderId: selectedFolderId === 'root' ? 'math' : selectedFolderId,
      },
    ]);
  }, [selectedFolderId]);

  const handleEditQuestion = useCallback((q: Question) => {
    const title = window.prompt('Nội dung câu hỏi', q.title);
    if (title != null && title.trim()) setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, title: title.trim() } : x)));
  }, []);

  const handleMoveQuestion = useCallback((q: Question) => {
    const folders = getAllFolderIds(treeWithCounts);
    const targetId = window.prompt('Chọn thư mục (id):\n' + folders.map((f) => `${f.id} - ${f.name}`).join('\n'));
    if (targetId?.trim()) setQuestions((prev) => prev.map((x) => (x.id === q.id ? { ...x, folderId: targetId.trim() } : x)));
  }, [treeWithCounts]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    if (window.confirm('Xóa câu hỏi này?')) setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  return (
    <div className="flex h-full min-h-[420px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Ngân hàng câu hỏi</h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm dark:bg-card">
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
            <Button size="sm" variant="outline" onClick={() => handleCreateFolder(selectedFolderId === 'root' ? 'root' : selectedFolderId)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Thư mục mới
            </Button>
            <Button size="sm" onClick={handleAddQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:flex-row min-h-0">
          <aside className="w-full rounded-lg border border-border bg-slate-50/60 p-3 dark:bg-muted/30 md:w-64 lg:w-72 shrink-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Thư mục</p>
            <div className="max-h-[280px] overflow-y-auto rounded-md bg-white py-1 pr-1 dark:bg-background">
              <FolderTree
                nodes={treeWithCounts}
                selectedId={selectedFolderId}
                onSelect={setSelectedFolderId}
                questions={questions}
                onRenameFolder={handleRenameFolder}
                onMoveFolder={handleMoveFolder}
                onDeleteFolder={handleDeleteFolder}
                onCreateFolder={handleCreateFolder}
              />
            </div>
          </aside>

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
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-white p-3 text-sm shadow-sm transition-shadow hover:shadow dark:bg-card"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="font-medium text-foreground">{q.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
                          {q.subject}
                        </span>
                        <span className={`rounded-md px-2 py-0.5 font-medium ${difficultyColor[q.difficulty]}`}>
                          {difficultyLabel[q.difficulty]}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground/80">
                          {q.points} điểm
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
                        <DropdownMenuItem onClick={() => handleEditQuestion(q)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMoveQuestion(q)}>
                          <FolderInput className="mr-2 h-4 w-4" />
                          Di chuyển
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteQuestion(q.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankTab;
