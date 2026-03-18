import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GeneralInfo from "./QuizSections/GeneralInfo";
import AdvancedSettings from "./QuizSections/AdvancedSettings";
import QuestionsSection from "./QuizSections/QuestionsSection";
import type { CreateQuizRequest, QuizDetailResDTO, QuestionResDTO } from "@/domains";

export interface FormQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  points: number;
}

export interface QuizFormRef {
  validate: () => boolean;
  getPayload: () => CreateQuizRequest | null;
}

const defaultQuizData = {
  title: "",
  description: "",
  subject: "",
  visibility: "public",
  duration: 0,
  useStartTime: false,
  useEndTime: false,
  startTime: "",
  startDate: "",
  endTime: "",
  endDate: "",
  maxPoints: 10,
  autoDistributePoints: true,
  showStudentWork: true,
  showCorrectAnswers: true,
  questionNumbering: "A, B, C...",
  questionsPerPage: 50,
  answersPerRow: 1,
  maxAttempts: 100,
  resultDisplay: "after_submission",
  reviewScore: false,
  passingScore: 50,
  randomizeQuestions: false,
  randomizeOptions: false,
};

const createEmptyQuestion = (): FormQuestion => ({
  id: `q-${Date.now()}`,
  text: "",
  options: [
    { id: `opt-1-${Date.now()}`, text: "", isCorrect: false },
    { id: `opt-2-${Date.now()}`, text: "", isCorrect: false },
    { id: `opt-3-${Date.now()}`, text: "", isCorrect: false },
    { id: `opt-4-${Date.now()}`, text: "", isCorrect: false },
  ],
  points: 1,
});

/** Map backend QuestionResDTO[] to FormQuestion[] for editing */
function mapBackendQuestions(questions: QuestionResDTO[]): FormQuestion[] {
  return questions.map((q, idx) => ({
    id: `q-be-${q.id}`,
    text: q.questionName,
    options: (q.answers || []).map((a, aIdx) => ({
      id: `opt-be-${a.id}`,
      text: a.answerText,
      isCorrect: a.answerType === 'text' && (a as any).answerCorrect === true,
    })),
    points: 1,
  }));
}

interface QuizFormProps {
  initialData?: QuizDetailResDTO | null;
  initialQuestions?: QuestionResDTO[];
}

const QuizForm = forwardRef<QuizFormRef, QuizFormProps>(function QuizForm({ initialData, initialQuestions = [] }, ref) {
  const [quizData, setQuizData] = useState(() => ({
    ...defaultQuizData,
    ...(initialData && {
      title: initialData.quiz.title,
      description: initialData.quiz.description ?? "",
      subject: initialData.quiz.lobbyName || "",
      visibility: initialData.quiz.quizVisibility || "public",
      duration: initialData.quiz.timeLimitMinutes ?? 0,
      randomizeQuestions: initialData.quizConfig?.shuffleQuestions ?? false,
      randomizeOptions: initialData.quizConfig?.shuffleAnswers ?? false,
      showCorrectAnswers: initialData.quizConfig?.showScoreImmediately ?? true,
      autoDistributePoints: initialData.quizConfig?.autoDistributePoints ?? true,
      reviewScore: initialData.quizConfig?.allowReview ?? false,
      passingScore: initialData.quizConfig?.passingScore ?? 50,
      maxAttempts: initialData.quiz.maxAttempt ?? 100,
      questionNumbering: initialData.questionLayout?.questionNumbering ?? "A, B, C...",
      questionsPerPage: initialData.questionLayout?.questionPerPage ?? 50,
      answersPerRow: initialData.questionLayout?.answerPerRow ?? 1,
    }),
  }));

  const [questions, setQuestions] = useState<FormQuestion[]>(() =>
    initialQuestions.length > 0 ? mapBackendQuestions(initialQuestions) : []
  );

  const validationErrorsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!initialData) return;
    setQuizData((prev) => ({
      ...prev,
      title: initialData.quiz.title,
      description: initialData.quiz.description ?? "",
      subject: initialData.quiz.lobbyName || "",
      visibility: initialData.quiz.quizVisibility || "public",
      duration: initialData.quiz.timeLimitMinutes ?? 0,
      randomizeQuestions: initialData.quizConfig?.shuffleQuestions ?? false,
      randomizeOptions: initialData.quizConfig?.shuffleAnswers ?? false,
      showCorrectAnswers: initialData.quizConfig?.showScoreImmediately ?? true,
      autoDistributePoints: initialData.quizConfig?.autoDistributePoints ?? true,
      reviewScore: initialData.quizConfig?.allowReview ?? false,
      passingScore: initialData.quizConfig?.passingScore ?? 50,
      maxAttempts: initialData.quiz.maxAttempt ?? 100,
      questionNumbering: initialData.questionLayout?.questionNumbering ?? "A, B, C...",
      questionsPerPage: initialData.questionLayout?.questionPerPage ?? 50,
      answersPerRow: initialData.questionLayout?.answerPerRow ?? 1,
    }));
  }, [initialData?.quiz.id]);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(mapBackendQuestions(initialQuestions));
    }
  }, [initialQuestions]);

  const handleQuizDataChange = (field: string, value: unknown) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = (question: FormQuestion) => {
    setQuestions((prev) => [...prev, question]);
  };

  const updateQuestion = (index: number, question: FormQuestion) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = question;
      return next;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errors: string[] = [];
    if (!quizData.title?.trim()) errors.push("Tiêu đề bài kiểm tra là bắt buộc.");
    if (!quizData.subject?.trim()) errors.push("Vui lòng chọn môn học.");
    if (questions.length === 0) errors.push("Cần ít nhất một câu hỏi.");
    questions.forEach((q, i) => {
      if (!q.text?.trim()) errors.push(`Câu hỏi ${i + 1}: Nội dung không được để trống.`);
      const hasCorrect = q.options?.some((o) => o.isCorrect);
      if (!hasCorrect) errors.push(`Câu hỏi ${i + 1}: Phải chọn ít nhất một đáp án đúng.`);
    });
    validationErrorsRef.current = errors;
    return errors.length === 0;
  };

  const getPayload = (): CreateQuizRequest | null => {
    if (!quizData.title?.trim() || !quizData.subject?.trim() || questions.length === 0) return null;
    const estimatedTime = Math.max(0, Number(quizData.duration) || 0) || 30;
    return {
      title: quizData.title.trim(),
      description: quizData.description?.trim() || undefined,
      subject: quizData.subject,
      estimatedTime,
      visibility: quizData.visibility as any,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text.trim(),
        type: "text" as const,
        points: Math.max(0, Number(q.points) || 0),
        options: (q.options || []).map((o) => ({
          id: o.id,
          text: o.text.trim(),
          isCorrect: Boolean(o.isCorrect),
        })),
      })),
      settings: {
        randomizeQuestions: Boolean(quizData.randomizeQuestions),
        randomizeOptions: Boolean(quizData.randomizeOptions),
        showCorrectAnswers: Boolean(quizData.showCorrectAnswers ?? quizData.showStudentWork),
        maxAttempts: Math.max(1, Number(quizData.maxAttempts) || 1),
        timeLimit: estimatedTime,
        autoDistributePoints: Boolean(quizData.autoDistributePoints),
        allowReview: Boolean(quizData.reviewScore),
        passingScore: Number(quizData.passingScore) || 50,
        questionNumbering: quizData.questionNumbering,
        questionPerPage: Number(quizData.questionsPerPage) || 50,
        answerPerRow: Number(quizData.answersPerRow) || 1,
      },
    };
  };

  useImperativeHandle(ref, () => ({
    validate,
    getPayload,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Accordion type="single" collapsible defaultValue="general" className="w-full">
        <AccordionItem value="general" className="border rounded-xl shadow-sm">
          <AccordionTrigger className="px-6 py-4">Thông tin chung</AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <GeneralInfo quizData={quizData} onChange={handleQuizDataChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="advanced" className="border rounded-xl shadow-sm mt-4">
          <AccordionTrigger className="px-6 py-4">Cài đặt nâng cao</AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <AdvancedSettings quizData={quizData} onChange={handleQuizDataChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <QuestionsSection
        questions={questions}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        removeQuestion={removeQuestion}
        quizData={quizData}
        onChange={handleQuizDataChange}
      />
    </div>
  );
});

export default QuizForm;
