
import { useState } from 'react';
import Header from '../components/Header';
import SubjectTag from '../components/SubjectTag';
import QuizCard, { QuizCardProps } from '../components/QuizCard';
import { Search, Filter } from 'lucide-react';

// Sample data
const subjects = [
  'All',
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Literature',
  'Computer Science',
  'Languages',
  'Arts',
  'Economics',
];

const quizzes: QuizCardProps[] = [
  {
    id: '1',
    title: '2024 Practice Set TOEIC – Test 5',
    description: 'Luyện đề TOEIC đầy đủ kỹ năng',
    subject: 'Tiếng Anh',
    questionCount: 200,
    duration: 120,
    participants: 120,
    difficulty: 'hard',
    isCompleted: true,
    lastScore: 85
  },
  {
    id: '2',
    title: 'Đại số cơ bản',
    description: 'Ôn tập các khái niệm đại số và phương trình cơ bản.',
    subject: 'Toán',
    questionCount: 15,
    duration: 20,
    participants: 85,
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'Định luật Newton',
    description: 'Khám phá các nguyên lý cơ học cổ điển.',
    subject: 'Vật lý',
    questionCount: 10,
    duration: 15,
    participants: 67,
    difficulty: 'medium',
    isCompleted: true,
    lastScore: 72
  },
  {
    id: '4',
    title: 'Sinh học tế bào',
    description: 'Kiểm tra hiểu biết về cấu trúc và chức năng tế bào.',
    subject: 'Sinh học',
    questionCount: 20,
    duration: 25,
    participants: 92,
    difficulty: 'hard'
  },
  {
    id: '5',
    title: 'Thế chiến thứ II',
    description: 'Các sự kiện và nhân vật quan trọng trong WWII.',
    subject: 'Lịch sử',
    questionCount: 25,
    duration: 30,
    participants: 76,
    difficulty: 'medium'
  },
  {
    id: '6',
    title: 'Bảng tuần hoàn các nguyên tố',
    description: 'Bạn biết gì về bảng tuần hoàn?',
    subject: 'Hóa học',
    questionCount: 18,
    duration: 22,
    participants: 54,
    difficulty: 'hard',
    isCompleted: true,
    lastScore: 90
  },
];

const categories = {
  difficulty: ['All', 'Easy', 'Medium', 'Hard'],
  questionCount: ['All', '< 10', '10-20', '> 20'],
  duration: ['All', '< 15 min', '15-30 min', '> 30 min'],
};

const QuizLibrary = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    difficulty: 'All',
    questionCount: 'All',
    duration: 'All',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };
  
  const handleCategorySelect = (category: string, value: string) => {
    setSelectedCategories({
      ...selectedCategories,
      [category]: value,
    });
  };
  
  const filteredQuizzes = quizzes.filter((quiz) => {
    // Filter by subject
    if (selectedSubject !== 'All' && quiz.subject !== selectedSubject) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by difficulty
    if (selectedCategories.difficulty !== 'All') {
      if (selectedCategories.difficulty.toLowerCase() !== quiz.difficulty) {
        return false;
      }
    }
    
    // Filter by question count
    if (selectedCategories.questionCount !== 'All') {
      if (selectedCategories.questionCount === '< 10' && quiz.questionCount >= 10) {
        return false;
      } else if (selectedCategories.questionCount === '10-20' && (quiz.questionCount < 10 || quiz.questionCount > 20)) {
        return false;
      } else if (selectedCategories.questionCount === '> 20' && quiz.questionCount <= 20) {
        return false;
      }
    }
    
    // Filter by duration
    if (selectedCategories.duration !== 'All') {
      if (selectedCategories.duration === '< 15 min' && quiz.duration >= 15) {
        return false;
      } else if (selectedCategories.duration === '15-30 min' && (quiz.duration < 15 || quiz.duration > 30)) {
        return false;
      } else if (selectedCategories.duration === '> 30 min' && quiz.duration <= 30) {
        return false;
      }
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quiz Library</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((subject) => (
            <SubjectTag
              key={subject}
              subject={subject}
              isSelected={selectedSubject === subject}
              onClick={handleSubjectSelect}
            />
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <button
            className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md md:hidden w-full"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto ${filtersOpen ? 'block' : 'hidden md:flex'}`}>
            <div className="relative group">
              <button className="px-4 py-2 border border-border rounded-md w-full md:w-auto flex justify-between items-center">
                <span>Difficulty: {selectedCategories.difficulty}</span>
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                {categories.difficulty.map((value) => (
                  <button
                    key={value}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedCategories.difficulty === value
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleCategorySelect('difficulty', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 border border-border rounded-md w-full md:w-auto flex justify-between items-center">
                <span>Questions: {selectedCategories.questionCount}</span>
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                {categories.questionCount.map((value) => (
                  <button
                    key={value}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedCategories.questionCount === value
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleCategorySelect('questionCount', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 border border-border rounded-md w-full md:w-auto flex justify-between items-center">
                <span>Duration: {selectedCategories.duration}</span>
                <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                {categories.duration.map((value) => (
                  <button
                    key={value}
                    className={`block px-4 py-2 text-sm text-left w-full ${
                      selectedCategories.duration === value
                        ? 'bg-primary text-white'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleCategorySelect('duration', value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizLibrary;
