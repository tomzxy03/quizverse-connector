import { useState } from 'react';
import Header from '../components/Header';
import SubjectTag from '../components/SubjectTag';
import QuizCard, { Quiz } from '../components/QuizCard';
import { Search, Filter } from 'lucide-react';
import { useRef } from 'react';
import HoverFilter from '../components/HoverFilter';
import Footer from '../components/Footer';

/* ---------------- DATA ---------------- */

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

const quizzes: Quiz[] = [
  {
    id: '1',
    title: '2024 Practice Set TOEIC – Test 5',
    description: 'Luyện đề TOEIC đầy đủ kỹ năng',
    subject: 'Tiếng Anh',
    questionCount: 200,
    estimatedTime: 120,
    isPublic: true,
    difficulty: 'hard',
    attemptCount: 5
  },
  {
    id: '2',
    title: 'Đại số cơ bản',
    description: 'Ôn tập các khái niệm đại số và phương trình cơ bản.',
    subject: 'Toán',
    questionCount: 15,
    estimatedTime: 20,
    isPublic: true,
    difficulty: 'easy'
  },
  {
    id: '3',
    title: 'Định luật Newton',
    description: 'Khám phá các nguyên lý cơ học cổ điển.',
    subject: 'Vật lý',
    questionCount: 10,
    estimatedTime: 15,
    isPublic: true,
    difficulty: 'medium',
    attemptCount: 67
  },
  {
    id: '4',
    title: 'Sinh học tế bào',
    description: 'Kiểm tra hiểu biết về cấu trúc và chức năng tế bào.',
    subject: 'Sinh học',
    questionCount: 20,
    estimatedTime: 25,
    isPublic: true,
    difficulty: 'hard',
    attemptCount: 92
  },
  {
    id: '5',
    title: 'Thế chiến thứ II',
    description: 'Các sự kiện và nhân vật quan trọng trong WWII.',
    subject: 'Lịch sử',
    questionCount: 25,
    estimatedTime: 30,
    isPublic: true,
    difficulty: 'medium',
    attemptCount: 76
  },
  {
    id: '6',
    title: 'Bảng tuần hoàn các nguyên tố',
    description: 'Bạn biết gì về bảng tuần hoàn?',
    subject: 'Hóa học',
    questionCount: 18,
    estimatedTime: 22,
    isPublic: true,
    difficulty: 'hard',
    attemptCount: 54
  },
];

const categories = {
  difficulty: ['All', 'Easy', 'Medium', 'Hard'],
  questionCount: ['All', '< 10', '10-20', '> 20'],
  duration: ['All', '< 15 min', '15-30 min', '> 30 min'],
};

/* ---------------- COMPONENT ---------------- */

const QuizLibrary = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState({
    difficulty: 'All',
    questionCount: 'All',
    duration: 'All',
  });

  const handleCategorySelect = (category: string, value: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (selectedSubject !== 'All' && quiz.subject !== selectedSubject) return false;

    if (searchQuery && !quiz.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;

    if (
      selectedCategories.difficulty !== 'All' &&
      quiz.difficulty !== selectedCategories.difficulty.toLowerCase()
    )
      return false;

    return true;
  });


return (
  <div className="min-h-screen bg-slate-100">
    <Header />

    <main className="container px-4 py-8">
      {/* SURFACE */}
      <div
        className="
          bg-white
          rounded-xl
          px-6 py-5
        "
      >
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-slate-900 mb-5">
          Thư viện Quiz
        </h1>

        {/* SUBJECT TAGS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((subject) => (
            <SubjectTag
              key={subject}
              subject={subject}
              isSelected={selectedSubject === subject}
              onClick={setSelectedSubject}
            />
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-slate-200 mb-6" />

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm quiz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2
                text-sm
                bg-slate-50
                border border-slate-200
                rounded-md
                focus:outline-none
                focus:ring-0
              "
            />
          </div>

          {/* Filters */}
          <div className="hidden md:flex gap-2">
            <HoverFilter
              label="Độ khó"
              value={selectedCategories.difficulty}
              options={categories.difficulty}
              onSelect={(v) => handleCategorySelect('difficulty', v)}
            />
            <HoverFilter
              label="Số câu"
              value={selectedCategories.questionCount}
              options={categories.questionCount}
              onSelect={(v) => handleCategorySelect('questionCount', v)}
            />
            <HoverFilter
              label="Thời gian"
              value={selectedCategories.duration}
              options={categories.duration}
              onSelect={(v) => handleCategorySelect('duration', v)}
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-slate-200 mb-6" />

        {/* QUIZ GRID */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            Không tìm thấy quiz phù hợp
          </div>
        )}
      </div>
    </main>
    <Footer />
  </div>
);
};


export default QuizLibrary;

