import { useOutletContext } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useGroupQuizzes } from '@/hooks/group';
import QuizCard from '@/components/quiz/QuizCard';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OutletContext {
  groupId: string;
}

/**
 * Group Quizzes Tab Component (React Query Version)
 * 
 * Uses React Query for data fetching with automatic caching
 * - No manual loading/error state management
 * - Data is cached and not re-fetched when switching tabs
 * - Supports prefetching on tab hover
 * 
 * Architecture: Component → Hook → Service → Repository → API
 */
export default function GroupQuizzesTab() {
  const { groupId } = useOutletContext<OutletContext>();
  
  // React Query automatically handles: loading, error, caching, refetching
  const { data: quizzes = [], isLoading, error } = useGroupQuizzes(Number(groupId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load quizzes'}
        </AlertDescription>
      </Alert>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Chưa có bài tập nào trong nhóm</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
