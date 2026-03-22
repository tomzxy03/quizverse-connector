import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { X, Eye, Download, Save, Send, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import QuizForm, { type QuizFormRef } from "@/components/quiz/QuizForm";
import { quizService, questionService } from "@/services";
import type { QuizDetailResDTO, QuestionResDTO } from "@/domains";
import { toast } from "@/hooks/use-toast";

const AddQuiz = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const formRef = useRef<QuizFormRef>(null);
  const [initialQuiz, setInitialQuiz] = useState<QuizDetailResDTO | null>(null);
  const [initialQuestions, setInitialQuestions] = useState<QuestionResDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId) {
      setInitialQuiz(null);
      setInitialQuestions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);

    Promise.all([
      quizService.getQuizById(Number(editId)),
      quizService.getQuizQuestions(Number(editId)).catch(() => [] as QuestionResDTO[]),
    ])
      .then(([quizData, questions]) => {
        if (!cancelled && quizData) {
          setInitialQuiz(quizData);
          setInitialQuestions(questions);
        }
      })
      .catch(() => {
        if (!cancelled) toast({ title: "Không tải được bài kiểm tra", variant: "destructive" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const handleBack = () => navigate(-1);

  const handlePublish = async () => {
    if (!formRef.current) return;
    const valid = formRef.current.validate();
    if (!valid) {
      toast({
        title: "Vui lòng kiểm tra lại",
        description: "Điền đủ tiêu đề, môn học và ít nhất một câu hỏi có đáp án đúng.",
        variant: "destructive",
      });
      return;
    }
    const payload = formRef.current.getPayload();
    if (!payload) {
      toast({
        title: "Lỗi",
        description: "Không thể lấy dữ liệu form. Vui lòng kiểm tra lại.",
        variant: "destructive",
      });
      return;
    }

    // Debug: Log payload to see what we're sending
    console.log('📦 Payload:', {
      title: payload.title,
      questionsCount: payload.questions.length,
      questions: payload.questions.map((q, i) => ({
        index: i,
        text: q.text.substring(0, 50),
        optionsCount: q.options.length,
        hasCorrectAnswer: q.options.some(o => o.isCorrect)
      }))
    });

    const subjectId = Number(payload.subject);
    if (!subjectId || isNaN(subjectId)) {
      toast({ title: "Vui lòng chọn môn học hợp lệ", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const quizReqDTO = {
        title: payload.title,
        description: payload.description,
        timeLimitMinutes: payload.estimatedTime,
        visibility: payload.visibility,
        maxAttempt: payload.settings.maxAttempts,
        subjectId,
        quizConfig: {
          shuffleQuestions: payload.settings.randomizeQuestions,
          shuffleAnswers: payload.settings.randomizeOptions,
          autoDistributePoints: payload.settings.autoDistributePoints,
          showScoreImmediately: payload.settings.showCorrectAnswers,
          allowReview: payload.settings.allowReview,
          passingScore: payload.settings.passingScore
        },
        questionLayout: {
          questionNumbering: payload.settings.questionNumbering,
          questionPerPage: payload.settings.questionPerPage,
          answerPerRow: payload.settings.answerPerRow
        }
      };

      let quizId: number;

      if (editId) {
        const updated = await quizService.updateQuiz(Number(editId), quizReqDTO);
        quizId = updated.id;
      } else {
        if (groupId) {
          const response = await quizService.createGroupQuiz(Number(groupId), quizReqDTO);
          console.log(response);
          quizId = response.quizzes[0].id;
        } else {
          const response = await quizService.createQuiz(quizReqDTO);
          quizId = response.id;
        }

      }

      if (quizId && payload.questions.length > 0) {
        console.log(payload.questions);
        if (editId) {
          await questionService.updateQuestionsToQuiz(quizId, payload.questions);
        } else {
          await questionService.addQuestionsToQuiz(quizId, payload.questions);
        }
      }

      toast({ title: editId ? "Đã cập nhật bài kiểm tra" : "Đã tạo bài kiểm tra" });
      if (groupId) {
        navigate(`/groups/${groupId}/quizzes`);
      } else {
        navigate("/library");
      }
    } catch (err) {
      toast({
        title: editId ? "Cập nhật thất bại" : "Tạo bài thất bại",
        description: err instanceof Error ? err.message : "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!formRef.current) return;
    const valid = formRef.current.validate();
    if (!valid) {
      toast({
        title: "Lưu nháp",
        description: "Một số trường chưa hợp lệ. Bạn vẫn có thể lưu để chỉnh sau.",
      });
    }
    // TODO: call draft API when available
    toast({ title: "Đã lưu nháp" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-2 px-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
            aria-label="Quay lại"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex space-x-6 ml-20 pl-20"> 
            <button
              type="button"
              className="px-4 py-2 border-b-2 border-primary font-medium text-primary"
            >
              Bài kiểm tra
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Eye className="h-4 w-4" />
              <span>Xem trước</span>
            </button>
            {/* <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button> */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Save className="h-4 w-4" />
              <span>Lưu nháp</span>
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{editId ? "Cập nhật bài" : "Đăng bài"}</span>
            </button>
            <button
              type="button"
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              aria-label="Lịch"
            >
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto py-6 px-4">
        {loading && !initialQuiz && editId ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <QuizForm
            ref={formRef}
            initialData={editId ? initialQuiz ?? undefined : undefined}
            initialQuestions={editId ? initialQuestions : []}
            groupId={groupId ? Number(groupId) : undefined}
          />
        )}
      </main>
    </div>
  );
};

export default AddQuiz;
