
import { Clock, Users, FileText } from 'lucide-react';

export interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  questionCount: number;
  duration: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

const QuizCard = ({ 
  title, 
  description, 
  subject, 
  questionCount, 
  duration, 
  participants, 
  difficulty
}: QuizCardProps) => {
  return (
    <div className="quiz-card overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className={`subject-tag text-xs ${difficultyColors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="subject-tag text-xs bg-quiz-blue text-quiz-darkBlue">
            {subject}
          </span>
        </div>
        
        <h3 className="text-base font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center">
            <FileText className="h-3.5 w-3.5 mr-1" />
            <span>{questionCount}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{duration}m</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{participants}</span>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-3 py-2 text-sm text-center text-white bg-quiz-accent rounded-md hover:bg-quiz-darkBlue transition-colors duration-200">
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;
