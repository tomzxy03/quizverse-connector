
import { useState } from 'react';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  FolderPlus,
  Folder,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Difficulty = 'easy' | 'medium' | 'hard';

type FolderNode = {
  id: string;
  name: string;
  questionCount: number;
  children?: FolderNode[];
};

type Question = {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  points: number;
  folderId: string;
};

const folderTree: FolderNode[] = [
  {
    id: 'root',
    name: 'Tất cả câu hỏi',
    questionCount: 4,
    children: [
      {
        id: 'math',
        name: 'Toán học',
        questionCount: 2,
        children: [
          { id: 'algebra', name: 'Đại số', questionCount: 1 },
          { id: 'geometry', name: 'Hình học', questionCount: 1 },
        ],
      },
      {
        id: 'physics',
        name: 'Vật lý',
        questionCount: 1,
      },
      {
        id: 'chemistry',
        name: 'Hóa học',
        questionCount: 1,
      },
    ],
  },
];

const dummyQuestions: Question[] = [
  {
    id: '1',
    title: 'Phương trình bậc hai có dạng tổng quát như thế nào?',
    subject: 'Toán học',
    difficulty: 'easy',
    points: 2,
    folderId: 'algebra',
  },
  {
    id: '2',
    title: 'Định lý Pythagore phát biểu như thế nào?',
    subject: 'Toán học',
    difficulty: 'medium',
    points: 3,
    folderId: 'geometry',
  },
  {
    id: '3',
    title: 'Định luật II Newton mô tả mối quan hệ nào?',
    subject: 'Vật lý',
    difficulty: 'medium',
    points: 3,
    folderId: 'physics',
  },
  {
    id: '4',
    title: 'Liên kết cộng hóa trị là gì?',
    subject: 'Hóa học',
    difficulty: 'hard',
    points: 4,
    folderId: 'chemistry',
  },
];

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

const difficultyColor: Record<Difficulty, string> = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-rose-50 text-rose-700',
};

interface FolderTreeProps {
  nodes: FolderNode[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const FolderTree = ({ nodes, selectedId, onSelect }: FolderTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
  });

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: FolderNode, depth = 0) => {
    const hasChildren = !!node.children?.length;
    const isExpanded = expanded[node.id] ?? true;
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id} className="space-y-1">
        <button
          type="button"
          onClick={() => {
            onSelect(node.id);
            if (hasChildren) toggle(node.id);
          }}
          className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
            isSelected
              ? 'bg-quiz-lightBlue text-quiz-darkBlue'
              : 'text-foreground hover:bg-muted'
          }`}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          <span className="inline-flex items-center gap-2">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )
            ) : (
              <span className="w-3" />
            )}
            <Folder className="h-4 w-4 text-quiz-darkBlue" />
            <span className="truncate">{node.name}</span>
          </span>
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-quiz-darkBlue">
            {node.questionCount}
          </span>
        </button>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-1">{nodes.map((n) => renderNode(n))}</div>;
};

const QuestionBankTab = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root');
  const [searchTerm, setSearchTerm] = useState('');

  const visibleQuestions = dummyQuestions.filter((q) => {
    const matchesSearch =
      !searchTerm ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFolderId === 'root') return true;

    return q.folderId === selectedFolderId;
  });

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-foreground">
            Ngân hàng câu hỏi
          </h2>
         
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-xl border bg-muted/40 p-3 md:p-4 lg:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-background/80 px-3 py-2.5 shadow-sm">
          <div className="relative min-w-[200px] flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, môn học..."
              className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-quiz-accent"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-quiz-accent/50 text-quiz-darkBlue hover:bg-quiz-lightBlue/60 hover:text-darkBlue"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Thư mục mới
            </Button>
            <Button
              size="sm"
              className="bg-quiz-darkBlue text-white hover:bg-quiz-accent"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm câu hỏi
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          <aside className="w-full rounded-lg border border-sidebar-border bg-quiz-lightBlue/40 p-3 md:w-64 lg:w-72">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Thư mục
            </p>
            <div className="max-h-[260px] space-y-1 overflow-y-auto text-sm b">
              <FolderTree
                nodes={folderTree}
                selectedId={selectedFolderId}
                onSelect={setSelectedFolderId}
              />
            </div>
          </aside>

          <section className="flex-1 rounded-lg bg-background p-3 md:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Câu hỏi trong thư mục
                </p>
                <p className="text-xs text-muted-foreground">
                  {visibleQuestions.length} câu hỏi phù hợp với bộ lọc hiện tại
                </p>
              </div>
            </div>

            {visibleQuestions.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
                <p className="font-medium">
                  Chưa có câu hỏi trong thư mục này
                </p>
                <p className="mt-1 text-xs">
                  Hãy thêm câu hỏi mới hoặc điều chỉnh bộ lọc tìm kiếm.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {visibleQuestions.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium text-foreground">
                        {q.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-quiz-lightBlue/70 px-2 py-0.5 text-[11px] font-medium text-quiz-darkBlue">
                          {q.subject}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${difficultyColor[q.difficulty]}`}
                        >
                          {difficultyLabel[q.difficulty]}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                          {q.points} điểm
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Sửa câu hỏi"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Xóa câu hỏi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
