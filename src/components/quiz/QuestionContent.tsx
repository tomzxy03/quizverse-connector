/**
 * QuestionContent Component
 * Modernized version for premium quiz taking experience
 */

import { useMemo } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { QuizInstanceQuestionResDTO } from '@/domains';
import type { SyncStatus } from '@/contexts/QuizAttemptContext';

interface QuestionContentProps {
  question: QuizInstanceQuestionResDTO;
  index: number;
  selectedAnswers: number[];
  syncStatus: SyncStatus;
  onChange: (answerIndices: number[]) => void;
  questionNumbering?: string;
  answerPerRow?: number;
}

export default function QuestionContent({
  question,
  index,
  selectedAnswers,
  syncStatus,
  onChange,
  questionNumbering,
  answerPerRow = 1,
}: QuestionContentProps) {
  const isMultipleChoice = useMemo(() => {
    // In a real app, this would come from questionType or metadata
    // For now, we assume if questionType is 'multiple_choice' or similar
    return question.answerType?.toLowerCase().includes('multiple') || false;
  }, [question.answerType]);

  const handleOptionSelect = (optionId: number) => {
    if (isMultipleChoice) {
      const next = selectedAnswers.includes(optionId)
        ? selectedAnswers.filter(id => id !== optionId)
        : [...selectedAnswers, optionId];
      onChange(next);
    } else {
      onChange([optionId]);
    }
  };

  const handleTextChange = (value: string) => {
    // Assuming text answer is stored as a single entry in the array or handled differently
    // Actually, BE usually expects indices for choice and text for essay.
    // Given the index-based format, text questions might be handled separately or use dummy indices.
    // For now, let's keep it simple.
  };

  const questionLabel = useMemo(() => {
    if (questionNumbering === 'A, B, C...') {
      return String.fromCharCode(65 + index);
    }
    if (questionNumbering === '1, 2, 3...') {
      return String(index + 1);
    }
    if (questionNumbering === 'none') {
      return '';
    }
    return String(index + 1);
  }, [index, questionNumbering]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border-none">
              {questionLabel ? `Câu ${questionLabel}` : 'Câu hỏi'}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {question.points} Điểm
            </Badge>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium">
            {syncStatus === 'saving' && (
              <span className="flex items-center gap-1.5 text-amber-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Đang lưu
              </span>
            )}
            {syncStatus === 'saved' && (
              <span className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã lưu
              </span>
            )}
            {syncStatus === 'error' && (
              <span className="flex items-center gap-1.5 text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                Lỗi lưu
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold leading-tight text-foreground tracking-tight">
          {question.questionText}
        </h2>
      </div>

      {question.type?.toLowerCase() === 'image' && (
        <div className="relative group overflow-hidden rounded-2xl border border-border bg-muted/30 aspect-video flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
          {/* In a real app, img tag with question.questionImage would be here */}
        </div>
      )}

      <div className={answerPerRow === 2 ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
        {(question.answers || []).map((answer) => {
          const isSelected = selectedAnswers.includes(answer.id);

          return (
            <button
              key={answer.id}
              onClick={() => handleOptionSelect(answer.id)}
              className={`group relative flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${isSelected
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-base font-bold transition-colors ${isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/20 text-muted-foreground group-hover:border-primary/40'
                  }`}
              >
                {answer.optionLabel || String.fromCharCode(64 + answer.displayOrder)}
              </div>

              <div className="flex-1">
                <p className={`text-base leading-snug ${isSelected ? 'font-medium text-foreground' : 'text-foreground'}`}>
                  {answer.answerText}
                </p>
              </div>

              <div className={`shrink-0 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                {isMultipleChoice ? (
                  <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
