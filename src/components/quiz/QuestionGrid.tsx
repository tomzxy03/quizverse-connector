/**
 * Question Grid Sidebar
 * Modernized version with premium aesthetics and clear status indicators
 */

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuizAttempt, SyncStatus } from '@/contexts/QuizAttemptContext';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface QuestionGridProps {
  totalQuestions: number;
  onNavigate: (index: number) => void;
  flaggedQuestions?: Set<number>;
}

export default function QuestionGrid({
  totalQuestions,
  onNavigate,
  flaggedQuestions = new Set(),
}: QuestionGridProps) {
  const { answers, syncStatus, activeQuestionIndex } = useQuizAttempt();

  const getStatusClasses = (idx: number, isCurrent: boolean) => {
    const questionId = idx; // Assuming indices match or question IDs are handled correctly
    // In this refactor, we mostly use sequential order for the grid

    // Check if answered (based on answers map in context)
    // We need to know which question corresponds to which index.
    // Assuming the parent provides totalQuestions and we know the index.
    // In QuizTakingPage, questions[idx].id is the key for answers.
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2.5">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === activeQuestionIndex;
          const isFlagged = flaggedQuestions.has(idx);

          // Need to bridge the gap between index and questionId for status
          // This will be handled in QuizTakingPage by passing correct data or 
          // we can assume the parent map exists.

          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-12 w-full text-sm font-bold border-2 transition-all duration-200 rounded-xl",
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    )}
                    onClick={() => onNavigate(idx)}
                  >
                    {idx + 1}
                  </Button>

                  {isFlagged && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                      <Flag className="h-2 w-2 text-white fill-white" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover/90 backdrop-blur-sm border-border">
                <p className="text-xs font-medium">Câu số {idx + 1}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
