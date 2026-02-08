// GroupContent/tabs/QuizzesTab.tsx
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizCard from '@/components/quiz/QuizCard';
import { useNavigate } from 'react-router-dom';

type LocalQuiz = {
  id: string;
  title: string;
  subject: string;
  questionCount: number;
  estimatedTime: number;
  isPublic: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
};

const dummyQuizzes: LocalQuiz[] = [
  {
    id: '1',
    title: 'Đại số cơ bản',
    subject: 'Toán',
    questionCount: 15,
    estimatedTime: 20,
    isPublic: true,
    difficulty: 'easy',
  },
  {
    id: '2',
    title: 'Định luật Newton',
    subject: 'Vật lý',
    questionCount: 10,
    estimatedTime: 15,
    isPublic: true,
    difficulty: 'medium',
  },
  {
    id: '3',
    title: 'Hóa học hữu cơ cơ bản',
    subject: 'Hóa học',
    questionCount: 12,
    estimatedTime: 18,
    isPublic: false,
    difficulty: 'hard',
  },
  {
    id: '4',
    title: 'Lịch sử thế giới hiện đại',
    subject: 'Lịch sử',
    questionCount: 20,
    estimatedTime: 25,
    isPublic: true,
    difficulty: 'medium',
  }
];

const QuizzesTab = ({ canManage }: { canManage: boolean }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-base font-medium text-foreground">Quiz</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Tìm quiz..."
              className="pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-md w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {canManage && (
            <Button size="sm" onClick={() => navigate('/groups/add-quiz')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm quiz
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyQuizzes.map((q) => (
          <QuizCard key={q.id} quiz={q} />
        ))}
      </div>
    </div>
  );
};

export default QuizzesTab;
