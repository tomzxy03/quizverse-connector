import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubjectTag from '../components/SubjectTag';
import QuizCard from '../components/QuizCard';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import HoverFilter from '../components/HoverFilter';
import Footer from '../components/Footer';
import { quizService } from '@/services';
import { Quiz, QuizFilter } from '@/domains';

/* ---------------- DATA ---------------- */

const categories = {
  difficulty: ['All', 'Easy', 'Medium', 'Hard'],
  questionCount: ['All', '< 10', '10-20', '> 20'],
  duration: ['All', '< 15 min', '15-30 min', '> 30 min'],
};

/* ---------------- COMPONENT ---------------- */

const QuizLibrary = () => {
  const [subjects, setSubjects] = useState<string[]>(['All']);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState({
    difficulty: 'All',
    questionCount: 'All',
    duration: 'All',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load subjects on mount
  useEffect(() => {
    loadSubjects();
  }, []);

  // Load quizzes when filters change
  useEffect(() => {
    loadQuizzes();
  }, [selectedSubject, searchQuery, selectedCategories]);

  const loadSubjects = async () => {
    try {
      const subjectsList = await quizService.getAllSubjects();
      setSubjects(subjectsList);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);

    try {
      const filter: QuizFilter = {
        subject: selectedSubject !== 'All' ? selectedSubject : undefined,
        search: searchQuery || undefined,
        difficulty: selectedCategories.difficulty !== 'All'
          ? selectedCategories.difficulty.toLowerCase() as any
          : undefined,
      };

      const data = await quizService.getAllQuizzes(filter);
      setQuizzes(data);
    } catch (err) {
      setError('Không thể tải danh sách quiz. Vui lòng thử lại.');
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string, value: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

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
              {/* <HoverFilter
                label="Độ khó"
                value={selectedCategories.difficulty}
                options={categories.difficulty}
                onSelect={(v) => handleCategorySelect('difficulty', v)}
              /> */}
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

          {/* LOADING STATE */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-slate-600">Đang tải...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadQuizzes}
                className="btn-primary"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* QUIZ GRID */}
          {!loading && !error && (
            <>
              {quizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500">
                  Không tìm thấy quiz phù hợp
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizLibrary;
