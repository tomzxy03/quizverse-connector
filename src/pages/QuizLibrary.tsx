import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubjectTag from "@/components/shared/SubjectTag";
import QuizCard from "@/components/quiz/QuizCard";
import HoverFilter from "@/components/shared/HoverFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizService } from "@/services";
import { Quiz, QuizFilter } from "@/domains";
import { useNavigate, useParams } from "react-router-dom";
import { subjectRepository } from "@/repositories";
import { Subject } from "@/domains/subject/subject.types";
import { PageResponse } from "@/core/types";
import { QuizResDTO } from "@/domains";
import { useAuth } from "@/contexts";
const categories = {
  questionCount: ["All", "< 10", "10-20", "> 20"],
  duration: ["All", "< 15 min", "15-30 min", "> 30 min"],
};
const questionCountMap: Record<string, { min?: number; max?: number }> = {
  "All": {},
  "< 10": { max: 9 },
  "10-20": { min: 10, max: 20 },
  "> 20": { min: 21 },
};

const durationMap: Record<string, { min?: number; max?: number }> = {
  "All": {},
  "< 15 min": { max: 14 },
  "15-30 min": { min: 15, max: 30 },
  "> 30 min": { min: 31 },
};


const QuizLibrary = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [pageData, setPageData] = useState<PageResponse<QuizResDTO> | null>(null);
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({
    questionCount: "All",
    duration: "All",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const buildQuizFilter = (): QuizFilter => {
    const questionRange = questionCountMap[selectedCategories.questionCount];
    const durationRange = durationMap[selectedCategories.duration];

    return {
      subjectId: subjectId ? Number(subjectId) : undefined,
      search: searchQuery || undefined,

      minQuestions: questionRange.min,
      maxQuestions: questionRange.max,

      minDuration: durationRange.min,
      maxDuration: durationRange.max,

      page: 0,
      size: 10,
    };
  };
  const navigate = useNavigate();
  const canCreatePublicQuiz = user?.roles?.includes("ADMIN");

  useEffect(() => {
    loadSubjects();
  }, []);

  // ===============================
  // LOAD SUBJECTS
  // ===============================
  //   useEffect(() => {
  //   loadQuizzes();
  // }, [
  //   subjectId,
  //   searchQuery,
  //   selectedCategories.questionCount,
  //   selectedCategories.duration
  // ]);

  const loadSubjects = async () => {
    try {
      const subjectsList = await subjectRepository.getAll();
      setSubjects(subjectsList);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  // ===============================
  // LOAD QUIZZES
  // ===============================
  useEffect(() => {
    loadQuizzes();
  }, [subjectId, searchQuery, selectedCategories]);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);

    try {
      const filter = buildQuizFilter();

      const data = await quizService.getAllQuizzesByFilter(filter);

      setQuizzes(data.items);
      setPageData(data);

    } catch (err) {
      setError("Không thể tải danh sách quiz. Vui lòng thử lại.");
      console.error("Failed to load quizzes:", err);
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container px-4 py-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <h1 className="text-2xl font-bold text-foreground">
              Thư viện Quiz
            </h1>
          </div>
          {canCreatePublicQuiz && (
            <Button
              size="sm"
              className="ml-auto gap-2"
              onClick={() => navigate("/library/create")}
            >
              <Plus className="h-4 w-4" />
              Tạo quiz
            </Button>
          )}
        </div>

        {error && !loading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 mb-6">
            {error}
            <button onClick={loadQuizzes} className="btn-primary ml-2 mt-2">
              Thử lại
            </button>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">

            {/* ================= SUBJECT TAGS ================= */}
            <div className="flex flex-wrap gap-2 mb-6">

              {/* All */}
              <SubjectTag
                key="all"
                subject="All"
                isSelected={!subjectId}
                onClick={() => navigate("/library")}
              />

              {/* Real Subjects */}
              {subjects.map((subject) => (
                <SubjectTag
                  key={subject.id}
                  subject={subject.name}
                  isSelected={subjectId === String(subject.id)}
                  onClick={() =>
                    navigate(`/library/${subject.id}`)
                  }
                />
              ))}
            </div>

            <div className="h-px bg-border mb-6" />

            {/* ================= SEARCH + FILTER ================= */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm quiz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="hidden md:flex gap-2">
                <HoverFilter
                  label="Số câu"
                  value={selectedCategories.questionCount}
                  options={categories.questionCount}
                  onSelect={(v) =>
                    handleCategorySelect("questionCount", v)
                  }
                />
                <HoverFilter
                  label="Thời gian"
                  value={selectedCategories.duration}
                  options={categories.duration}
                  onSelect={(v) =>
                    handleCategorySelect("duration", v)
                  }
                />
              </div>
            </div>

            <div className="h-px bg-border mb-6" />

            {/* ================= LOADING ================= */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">
                  Đang tải...
                </p>
              </div>
            )}

            {/* ================= QUIZ GRID ================= */}
            {!loading && !error && (
              <>
                {quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {quizzes.map((quiz) => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    Không tìm thấy quiz phù hợp
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default QuizLibrary;
