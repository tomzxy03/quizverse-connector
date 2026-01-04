import { FileText, Clock, Flame, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  questionCount: number;
  duration: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  // Trạng thái người dùng
  isCompleted?: boolean;
  lastScore?: number;
}

const difficultyConfig = {
  easy: {
    label: 'Dễ',
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  medium: {
    label: 'Trung bình',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  hard: {
    label: 'Khó',
    className: 'bg-red-50 text-red-700 border-red-200'
  }
};

const QuizCard = ({ 
  title, 
  description, 
  questionCount, 
  duration, 
  difficulty,
  isCompleted = false,
  lastScore
}: QuizCardProps) => {
  const difficultyInfo = difficultyConfig[difficulty];
  
  // Xác định nút CTA
  const ctaText = isCompleted ? 'Làm lại' : 'Làm bài';
  const CtaIcon = isCompleted ? RotateCcw : undefined;

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      {/* Trạng thái đã làm (nếu có) */}
      {isCompleted && (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">Đã hoàn thành</span>
          {lastScore !== undefined && (
            <span className="ml-auto text-muted-foreground">
              Điểm gần nhất: <span className="font-semibold text-foreground">{lastScore}%</span>
            </span>
          )}
        </div>
      )}

      {/* Tiêu đề - Quan trọng nhất */}
      <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
        {title}
      </h3>
      
      {/* Mô tả ngắn */}
      <p className="text-sm text-muted-foreground line-clamp-1">
        {description}
      </p>
      
      {/* Thông tin chính - 1 dòng với icon */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span>{questionCount} câu</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{duration} phút</span>
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium",
          difficultyInfo.className
        )}>
          <Flame className="h-3.5 w-3.5" />
          <span>{difficultyInfo.label}</span>
        </div>
      </div>
      
      {/* Nút CTA */}
      <button className="w-full mt-auto py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2">
        {CtaIcon && <CtaIcon className="h-4 w-4" />}
        {ctaText}
      </button>
    </div>
  );
};

export default QuizCard;
