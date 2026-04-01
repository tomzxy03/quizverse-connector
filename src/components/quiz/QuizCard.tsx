import {
  Clock,
  FileQuestion,
  TrendingUp,
  Globe,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

import type { QuizResDTO } from '@/domains';

interface QuizCardProps {
  quiz: QuizResDTO;
  className?: string;
  onClick?: () => void;
}


const QuizCard: React.FC<QuizCardProps> = ({ quiz, className = '', onClick }) => {

  return (
    <div
      onClick={onClick}
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
        select-none
        cursor-pointer
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500/20
        ${className}
      `}
    >
      {/* TITLE */}
      <h3 className="
        text-base font-medium text-slate-900
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
          {quiz.totalQuestion} câu
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {quiz.timeLimitMinutes} phút
        </div>

      </div>

      {/* TAGS */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-indigo-700 font-medium">
          #{quiz.subjectName || 'Quiz'}
        </span>

        <span className="flex items-center gap-1 text-slate-500">
          {quiz.quizVisibility === 'public' ? (
            <>
              <Globe className="h-3 w-3" />
              Công khai
            </>
          ) : quiz.quizVisibility === 'class_only' ? (
            <>
              <Lock className="h-3 w-3" />
              Lớp học
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              Riêng tư
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
    </div>
  );
};

export default QuizCard;
