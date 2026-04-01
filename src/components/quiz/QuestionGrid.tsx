/**
 * Question Grid Sidebar
 * Modernized version with premium aesthetics and clear status indicators
 */

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuizAttempt } from '@/contexts/QuizAttemptContext';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface QuestionGridProps {
  totalQuestions: number;
  onNavigate: (index: number) => void;
  flaggedQuestions?: Set<number>;
  getQuestionLabel?: (index: number) => string;
}

export default function QuestionGrid({
  totalQuestions,
  onNavigate,
  flaggedQuestions = new Set(),
  getQuestionLabel,
}: QuestionGridProps) {
  const { activeQuestionIndex } = useQuizAttempt();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2.5">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === activeQuestionIndex;
          const isFlagged = flaggedQuestions.has(idx);
          const label = getQuestionLabel ? getQuestionLabel(idx) : '';
          const displayLabel = label || String(idx + 1);

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
                    {displayLabel}
                  </Button>

                  {isFlagged && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                      <Flag className="h-2 w-2 text-white fill-white" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-popover/90 backdrop-blur-sm border-border">
                <p className="text-xs font-medium">Câu số {displayLabel}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
