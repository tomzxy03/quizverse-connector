import {
  Clock,
  FileQuestion,
  TrendingUp,
  Globe,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  questionCount: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublic: boolean;
  attemptCount?: number;
}

interface QuizCardProps {
  quiz: Quiz;
  className?: string;
}

// Difficulty config
const difficultyConfig = {
  easy: { label: 'Dễ', color: 'text-green-600' },
  medium: { label: 'TB', color: 'text-amber-600' },
  hard: { label: 'Khó', color: 'text-red-600' },
};

const QuizCard: React.FC<QuizCardProps> = ({ quiz, className = '' }) => {
  const difficulty = difficultyConfig[quiz.difficulty];

  return (
    <Link
      to={`/quiz/${quiz.id}`}
      className={`
        group block
        bg-slate-50
        border border-slate-200/80
        rounded-xl
        p-4
        transition-all duration-200
        hover:bg-white
        hover:border-indigo-300
        hover:shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500/20
        ${className}
      `}
    >
      {/* TITLE */}
      <h3 className="
        text-base font-semibold text-slate-900
        mb-2 leading-snug
        line-clamp-2 min-h-[3rem]
      ">
        {quiz.title}
      </h3>

      {/* DESCRIPTION */}
      {quiz.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-1">
          {quiz.description}
        </p>
      )}

      {/* META */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <FileQuestion className="h-3.5 w-3.5" />
          {quiz.questionCount} câu
        </div>

        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {quiz.estimatedTime} phút
        </div>

        <span className={`font-medium ${difficulty.color}`}>
          {difficulty.label}
        </span>

        {quiz.attemptCount !== undefined && (
          <div className="flex items-center gap-1 ml-auto">
            <TrendingUp className="h-3.5 w-3.5" />
            {quiz.attemptCount.toLocaleString()}
          </div>
        )}
      </div>

      {/* TAGS */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-indigo-700 font-medium">
          #{quiz.subject}
        </span>

        <span className="flex items-center gap-1 text-slate-500">
          {quiz.isPublic ? (
            <>
              <Globe className="h-3 w-3" />
              Public
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              Private
            </>
          )}
        </span>
      </div>

      {/* HOVER CTA (subtle) */}
      <div className="
        mt-3 text-sm font-medium text-indigo-600
        opacity-0 translate-y-1
        group-hover:opacity-100 group-hover:translate-y-0
        transition-all
      ">
        Chi tiết &rarr;
      </div>
    </Link>
  );
};

export default QuizCard;
