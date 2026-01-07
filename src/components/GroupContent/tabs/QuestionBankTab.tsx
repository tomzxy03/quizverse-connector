// GroupContent/tabs/QuestionBankTab.tsx
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyQuestions = [
  {
    id: '1',
    text: 'Phương trình bậc hai có dạng tổng quát như thế nào?',
    subject: 'Toán học',
    difficulty: 'easy',
    points: 2,
  },
];

const QuestionBankTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ngân hàng câu hỏi</h2>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Tìm câu hỏi..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />
          </div>

          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      {dummyQuestions.map(q => (
        <div key={q.id} className="bg-white p-4 rounded-xl card-shadow">
          <div className="flex justify-between gap-4">
            <div>
              <p className="font-medium">{q.text}</p>
              <p className="text-xs text-muted-foreground">
                {q.subject} · {q.points} điểm
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionBankTab;
