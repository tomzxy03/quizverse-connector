// GroupContent/tabs/QuizzesTab.tsx
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizCard from '../QuizCard';

const dummyQuizzes = [
  {
    id: '1',
    title: 'Đại số cơ bản',
    subject: 'Toán',
    questionCount: 15,
    estimatedTime: 20,
    difficulty: 'easy',
  },
];

const QuizzesTab = ({ canManage }: { canManage: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quiz</h2>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Tìm quiz..."
              className="pl-9 pr-3 py-2 border rounded-md w-64"
            />
          </div>

          {canManage && (
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm quiz
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyQuizzes.map(q => (
          <QuizCard key={q.id} quiz={q} />
        ))}
      </div>
    </div>
  );
};

export default QuizzesTab;
