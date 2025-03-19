
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
  difficulty,
  image 
}: QuizCardProps) => {
  return (
    <div className="quiz-card overflow-hidden flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300">
      {image && (
        <div 
          className="h-40 bg-cover bg-center rounded-t-xl -mx-4 -mt-4 mb-4"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className={`subject-tag ${difficultyColors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="subject-tag bg-quiz-blue text-quiz-darkBlue">
            {subject}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{questionCount} questions</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration} min</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants}</span>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 text-center text-white bg-quiz-accent rounded-md hover:bg-quiz-darkBlue transition-colors duration-200">
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;
