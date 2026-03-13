import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Send,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Wifi,
    WifiOff,
    Flag,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { useAnswerManager } from '@/hooks/useAnswerManager';
import { quizService } from '@/services';
import { quizInstanceRepository } from '@/repositories';
import { useAuth } from '@/contexts';
import type {
    QuizInstanceResDTO,
    QuizInstanceQuestionResDTO,
    QuizSubmissionReqDTO,
} from '@/domains';

const QuizTakingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [instance, setInstance] = useState<QuizInstanceResDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const isSubmittingRef = useRef(false);

    // Load quiz instance
    useEffect(() => {
        if (!id) {
            setError('Quiz ID không hợp lệ');
            setLoading(false);
            return;
        }
        loadInstance();
    }, [id]);

    const loadInstance = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        try {
            // Start or resume the quiz
            const inst = await quizService.startQuiz(Number(id));
            if (!inst) {
                setError('Không thể khởi tạo bài thi');
                return;
            }

            // If already submitted, redirect to result
            if (inst.status === 'SUBMITTED' || inst.status === 'COMPLETED') {
                navigate(`/quiz/${id}/result/${inst.id}`, { replace: true });
                return;
            }

            setInstance(inst);
        } catch (err: any) {
            if (err?.code === 400 || err?.code === 404) {
                setError('Bài thi đã hết hạn hoặc không tồn tại');
            } else {
                setError('Không thể tải bài thi. Vui lòng thử lại.');
            }
            console.error('Failed to load quiz instance:', err);
        } finally {
            setLoading(false);
        }
    };

    // Online/Offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // beforeunload warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (instance && !isSubmittingRef.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [instance]);

    // Answer manager hook
    const answerManager = useAnswerManager({
        instanceId: instance?.id ?? 0,
        onSaveError: (questionId, err) => {
            console.error(`Failed to save answer for question ${questionId}:`, err);
        },
    });

    // Auto-submit handler
    const handleAutoSubmit = useCallback(async () => {
        if (!instance || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            await answerManager.flushPending();
            const submission: QuizSubmissionReqDTO = {
                quizInstanceId: instance.id,
                userId: user?.id,
                totalTimeSpentSeconds: instance.timeLimitMinutes
                    ? instance.timeLimitMinutes * 60 - 0
                    : undefined,
                submittedAt: new Date().toISOString(),
            };
            await quizInstanceRepository.submit(instance.id, submission);
            answerManager.clearCache();
            navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
        } catch (err) {
            console.error('Auto-submit failed:', err);
            // Retry once
            try {
                const submission: QuizSubmissionReqDTO = {
                    quizInstanceId: instance.id,
                    userId: user?.id,
                    submittedAt: new Date().toISOString(),
                };
                await quizInstanceRepository.submit(instance.id, submission);
                answerManager.clearCache();
                navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
            } catch {
                setError('Hết giờ nhưng không thể nộp bài. Vui lòng thử lại.');
                setIsSubmitting(false);
                isSubmittingRef.current = false;
            }
        }
    }, [instance, user, id, navigate, answerManager]);

    // Timer hook
    const timer = useQuizTimer({
        serverRemainingSeconds: instance?.remainingTimeSeconds ?? 0,
        onExpire: handleAutoSubmit,
        enabled: !!instance && !isSubmitting,
    });

    // Manual submit
    const handleSubmit = async () => {
        if (!instance || isSubmittingRef.current) return;
        setSubmitConfirmOpen(false);
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            await answerManager.flushPending();
            const submission: QuizSubmissionReqDTO = {
                quizInstanceId: instance.id,
                userId: user?.id,
                submittedAt: new Date().toISOString(),
            };
            const result = await quizInstanceRepository.submit(instance.id, submission);
            answerManager.clearCache();
            navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
        } catch (err: any) {
            // Check if already submitted
            if (err?.message?.includes('already submitted') || err?.message?.includes('đã nộp')) {
                answerManager.clearCache();
                navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
                return;
            }
            setError('Không thể nộp bài. Vui lòng thử lại.');
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    const handleSelectAnswer = (questionId: number, answerId: number) => {
        answerManager.selectAnswer(questionId, [answerId]);
    };

    const toggleFlag = (questionId: number) => {
        setFlaggedQuestions((prev) => {
            const next = new Set(prev);
            if (next.has(questionId)) next.delete(questionId);
            else next.add(questionId);
            return next;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="mt-4 text-muted-foreground">Đang tải bài thi...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !instance) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Card className="max-w-md w-full mx-4">
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                            <h2 className="mb-2 text-xl font-semibold">{error || 'Không tìm thấy bài thi'}</h2>
                            <Button className="mt-4" onClick={() => navigate(`/quiz/${id}`)}>
                                Quay lại
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    const questions = instance.questions || [];
    const currentQuestion: QuizInstanceQuestionResDTO | undefined = questions[currentIndex];
    const totalQuestions = questions.length;
    const answeredCount = Array.from(answerManager.answers.keys()).filter((qId) =>
        questions.some((q) => q.id === qId)
    ).length;

    const getQuestionStatus = (question: QuizInstanceQuestionResDTO): 'answered' | 'current' | 'flagged' | 'unanswered' => {
        if (questions[currentIndex]?.id === question.id) return 'current';
        if (flaggedQuestions.has(question.id)) return 'flagged';
        if (answerManager.answers.has(question.id)) return 'answered';
        return 'unanswered';
    };

    const statusColors: Record<string, string> = {
        current: 'bg-primary text-primary-foreground',
        answered: 'bg-emerald-600 text-white',
        flagged: 'bg-amber-500 text-white',
        unanswered: 'bg-muted text-muted-foreground hover:bg-muted/80',
    };

    const timerColorClass =
        timer.remainingSeconds <= 60
            ? 'text-destructive'
            : timer.remainingSeconds <= 300
                ? 'text-amber-600'
                : 'text-foreground';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Top bar with timer */}
            <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                                {instance.quizTitle}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Câu {currentIndex + 1} / {totalQuestions} • Đã trả lời: {answeredCount}/{totalQuestions}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Online status */}
                            {!isOnline && (
                                <Badge variant="destructive" className="gap-1 text-xs">
                                    <WifiOff className="h-3 w-3" />
                                    Offline
                                </Badge>
                            )}

                            {/* Timer */}
                            {instance.timeLimitMinutes > 0 && (
                                <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timerColorClass}`}>
                                    <Clock className="h-5 w-5" />
                                    {timer.formattedTime}
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                onClick={() => setSubmitConfirmOpen(true)}
                                disabled={isSubmitting}
                                className="bg-primary text-primary-foreground"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                            </Button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <Progress value={(answeredCount / totalQuestions) * 100} className="mt-2 h-1.5" />
                </div>
            </div>

            <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Question content */}
                    <div className="lg:col-span-3 space-y-4">
                        {currentQuestion && (
                            <Card className="relative">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Badge variant="outline" className="mb-3">
                                                Câu {currentIndex + 1} • {currentQuestion.points} điểm
                                            </Badge>
                                            <CardTitle className="text-lg leading-relaxed">
                                                {currentQuestion.questionText}
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleFlag(currentQuestion.id)}
                                            className={flaggedQuestions.has(currentQuestion.id) ? 'text-amber-500' : 'text-muted-foreground'}
                                        >
                                            <Flag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {(currentQuestion.answers || []).map((answer) => {
                                        const selectedAnswers = answerManager.answers.get(currentQuestion.id) ?? [];
                                        const isSelected = Array.isArray(selectedAnswers)
                                            ? selectedAnswers.includes(answer.id)
                                            : selectedAnswers === answer.id;
                                        const saveStatus = answerManager.saveStatuses.get(currentQuestion.id);

                                        return (
                                            <button
                                                key={answer.id}
                                                onClick={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                                                className={`w-full text-left rounded-lg border-2 p-4 transition-all ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-sm'
                                                        : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'border-muted-foreground/30 text-muted-foreground'
                                                            }`}
                                                    >
                                                        {answer.optionLabel || String.fromCharCode(65 + answer.displayOrder)}
                                                    </div>
                                                    <span className={`text-sm ${isSelected ? 'font-medium text-foreground' : 'text-foreground'}`}>
                                                        {answer.answerText}
                                                    </span>
                                                    {isSelected && saveStatus === 'saved' && (
                                                        <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500 shrink-0" />
                                                    )}
                                                    {isSelected && saveStatus === 'saving' && (
                                                        <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent shrink-0" />
                                                    )}
                                                    {isSelected && saveStatus === 'error' && (
                                                        <XCircle className="ml-auto h-4 w-4 text-destructive shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Navigation buttons */}
                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Câu trước
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                                disabled={currentIndex >= totalQuestions - 1}
                            >
                                Câu sau
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Question navigator sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Danh sách câu hỏi</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {answeredCount}/{totalQuestions} đã trả lời
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-2">
                                        {questions.map((q, idx) => {
                                            const status = getQuestionStatus(q);
                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => setCurrentIndex(idx)}
                                                    className={`h-9 w-full rounded-md text-xs font-medium transition-colors ${statusColors[status]}`}
                                                    title={`Câu ${idx + 1}`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Legend */}
                                    <div className="mt-4 space-y-1.5 text-[10px]">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-sm bg-emerald-600" />
                                            <span className="text-muted-foreground">Đã trả lời</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-sm bg-primary" />
                                            <span className="text-muted-foreground">Đang xem</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-sm bg-amber-500" />
                                            <span className="text-muted-foreground">Đánh dấu</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-sm bg-muted" />
                                            <span className="text-muted-foreground">Chưa trả lời</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Submit confirmation */}
            <AlertDialog open={submitConfirmOpen} onOpenChange={setSubmitConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Nộp bài thi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {answeredCount < totalQuestions ? (
                                <span className="text-amber-600">
                                    Bạn mới trả lời {answeredCount}/{totalQuestions} câu hỏi. Các câu chưa trả lời sẽ được tính 0 điểm.
                                </span>
                            ) : (
                                <span>Bạn đã trả lời tất cả {totalQuestions} câu hỏi. Bạn có chắc muốn nộp bài?</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tiếp tục làm</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Nộp bài
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default QuizTakingPage;
