import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Send,
    AlertCircle,
    WifiOff,
    Flag,
    LayoutGrid,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useQuizTimer } from '@/hooks/useQuizTimer';
import { quizService } from '@/services';
import { quizInstanceRepository } from '@/repositories';
import { useAuth, useQuizAttempt } from '@/contexts';
import QuestionContent from '@/components/quiz/QuestionContent';
import QuestionGrid from '@/components/quiz/QuestionGrid';
import type { QuizSubmissionReqDTO } from '@/domains';

const QuizTakingPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        instanceId,
        answers,
        syncStatus,
        activeQuestionIndex,
        isOnline,
        initialize,
        setAnswer,
        setActiveQuestionIndex,
        flushPending,
        resetStore
    } = useQuizAttempt();

    const [instance, setInstance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            const inst = await quizService.startQuiz(Number(id));
            if (!inst) {
                setError('Không thể khởi tạo bài thi');
                return;
            }

            if (inst.status === 'SUBMITTED' || inst.status === 'COMPLETED') {
                navigate(`/quiz/${id}/result/${inst.id}`, { replace: true });
                return;
            }

            setInstance(inst);
            // Initialize global quiz context
            initialize(inst.id, {}, inst.remainingTimeSeconds);
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

    // Auto-submit handler
    const handleAutoSubmit = useCallback(async () => {
        if (!instance || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            await flushPending();
            const submission: QuizSubmissionReqDTO = {
                quizInstanceId: instance.id,
                userId: user?.id,
                totalTimeSpentSeconds: (instance.totalTimeSeconds || (instance.timeLimitMinutes * 60))
                    ? (instance.totalTimeSeconds || (instance.timeLimitMinutes * 60)) - timer.remainingSeconds
                    : undefined,
                submittedAt: new Date().toISOString(),
            };
            await quizInstanceRepository.submit(instance.id, submission);
            resetStore();
            navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
        } catch (err) {
            console.error('Auto-submit failed:', err);
            setError('Hết giờ nhưng không thể nộp bài. Vui lòng thử lại.');
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    }, [instance, user, id, navigate, flushPending, resetStore]);

    // Timer hook
    const timer = useQuizTimer({
        serverRemainingSeconds: instance?.remainingTimeSeconds ?? instance?.remainingSeconds ?? 0,
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
            await flushPending();
            const submission: QuizSubmissionReqDTO = {
                quizInstanceId: instance.id,
                userId: user?.id,
                submittedAt: new Date().toISOString(),
            };
            await quizInstanceRepository.submit(instance.id, submission);
            resetStore();
            navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
        } catch (err: any) {
            if (err?.message?.includes('already submitted') || err?.message?.includes('đã nộp')) {
                resetStore();
                navigate(`/quiz/${id}/result/${instance.id}`, { replace: true });
                return;
            }
            setError('Không thể nộp bài. Vui lòng thử lại.');
            setIsSubmitting(false);
            isSubmittingRef.current = false;
        }
    };

    const toggleFlag = (idx: number) => {
        setFlaggedQuestions((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    const questions = useMemo(() => instance?.questions || [], [instance]);
    const currentQuestion = questions[activeQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
                        <p className="text-muted-foreground font-medium animate-pulse">Chuẩn bị nội dung bài thi...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !instance) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full overflow-hidden border-destructive/20 shadow-2xl">
                        <div className="h-2 bg-destructive" />
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-6 h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-destructive" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{error || 'Không tìm thấy bài thi'}</h2>
                            <p className="text-muted-foreground mb-8">Có lỗi xảy ra khi truy cập bài thi này.</p>
                            <Button className="w-full h-12 rounded-xl text-base font-semibold" onClick={() => navigate(`/quiz/${id}`)}>
                                Quay lại trang chi tiết
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    const timerColorClass =
        timer.remainingSeconds <= 60
            ? 'text-destructive animate-pulse'
            : timer.remainingSeconds <= 300
                ? 'text-amber-500 font-bold'
                : 'text-foreground font-bold';

    return (
        <div className="min-h-screen flex flex-col bg-muted/20 selection:bg-primary/10">
            {/* Premium Header with Glassmorphism */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl px-4 py-4 md:py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-bold text-foreground truncate max-w-xs md:max-w-xl tracking-tight">
                                {instance.quizTitle}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <span className="hidden sm:inline">Tiến độ:</span>
                                    <span className="text-foreground">{activeQuestionIndex + 1}</span> / {totalQuestions} câu
                                </span>
                                <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                                <span className="text-xs font-medium text-muted-foreground">
                                    Đã làm: <span className="text-emerald-500 font-bold">{answeredCount}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-5">
                            {/* Online status */}
                            {!isOnline && (
                                <Badge variant="destructive" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-destructive/20 border-none">
                                    <WifiOff className="h-3 w-3" />
                                    Mất kết nối
                                </Badge>
                            )}

                            {/* Timer */}
                            {(instance.timeLimitMinutes > 0 || instance.totalTimeSeconds > 0 || (instance.remainingTimeSeconds || instance.remainingSeconds) > 0) && (
                                <div className={`flex items-center px-4 py-2 rounded-2xl bg-muted/30 border border-border/50 transition-colors ${timerColorClass}`}>
                                    <Clock className="h-5 w-5 mr-3 opacity-70" />
                                    <span className="font-mono text-xl tabular-nums leading-none">
                                        {timer.formattedTime}
                                    </span>
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                onClick={() => setSubmitConfirmOpen(true)}
                                disabled={isSubmitting}
                                className="h-11 md:h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-base"
                            >
                                <Send className="mr-2.5 h-4.5 w-4.5" />
                                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                            </Button>
                        </div>
                    </div>

                    {/* Fancy Progress bar */}
                    <div className="absolute bottom-0 left-0 w-full px-0">
                        <div className="w-full h-0.5 bg-muted-foreground/10">
                            <div
                                className="h-full bg-primary transition-all duration-700 ease-in-out"
                                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
                    {/* Question Area */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {currentQuestion && (
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 to-primary/0 rounded-3xl blur-2xl opacity-50 transition-opacity group-hover:opacity-70" />
                                <Card className="relative border-border/40 bg-background/50 backdrop-blur-sm shadow-xl p-8 md:p-10 rounded-3xl overflow-hidden min-h-[400px]">
                                    <QuestionContent
                                        question={currentQuestion}
                                        index={activeQuestionIndex}
                                        selectedAnswers={answers[currentQuestion.id] || []}
                                        syncStatus={syncStatus[currentQuestion.id] || 'idle'}
                                        onChange={(answerIndices) => setAnswer(currentQuestion.id, answerIndices)}
                                    />

                                    <div className="absolute top-6 right-8">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleFlag(activeQuestionIndex)}
                                            className={flaggedQuestions.has(activeQuestionIndex)
                                                ? 'bg-amber-100/50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 rounded-full'
                                                : 'text-muted-foreground hover:bg-muted rounded-full'}
                                        >
                                            <Flag className={`h-5 w-5 ${flaggedQuestions.has(activeQuestionIndex) ? 'fill-amber-500' : ''}`} />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Premium Navigation Buttons */}
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                                disabled={activeQuestionIndex === 0}
                                className="h-14 px-8 rounded-2xl border-border bg-background/50 backdrop-blur font-bold group"
                            >
                                <ChevronLeft className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                Câu trước
                            </Button>

                            <div className="hidden md:flex gap-1.5">
                                {Array.from({ length: Math.min(5, totalQuestions) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${(totalQuestions > 5 ? Math.floor(activeQuestionIndex / (totalQuestions / 5)) === i : activeQuestionIndex === i)
                                            ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={() => setActiveQuestionIndex(Math.min(totalQuestions - 1, activeQuestionIndex + 1))}
                                disabled={activeQuestionIndex >= totalQuestions - 1}
                                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/10 group"
                            >
                                Câu tiếp theo
                                <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 lg:sticky lg:top-[120px] h-fit self-start">
                        <section className="space-y-6">
                            {/* Desktop Navigator */}
                            <Card className="hidden lg:block border-border/40 bg-background/50 backdrop-blur-sm shadow-lg overflow-hidden rounded-3xl">
                                <div className="p-6 border-b border-border/40 bg-muted/30">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-bold tracking-tight text-foreground uppercase opacity-70">
                                            Navigator
                                        </h3>
                                        <LayoutGrid className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {answeredCount} trên {totalQuestions} câu đã hoàn tất
                                    </p>
                                </div>
                                <div className="p-6">
                                    <QuestionGrid
                                        totalQuestions={totalQuestions}
                                        onNavigate={setActiveQuestionIndex}
                                        flaggedQuestions={flaggedQuestions}
                                    />
                                </div>
                            </Card>

                            {/* Results Preview or Instructions Card */}
                            <Card className="border-border/40 bg-gradient-to-br from-primary/10 via-primary/[0.02] to-transparent p-6 rounded-3xl shadow-sm border-2 border-primary/5">
                                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-primary" />
                                    Lưu ý quan trọng
                                </h4>
                                <ul className="text-xs text-muted-foreground space-y-2.5 leading-relaxed">
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Hệ thống sẽ <strong className="text-foreground">tự động lưu</strong> đáp án mỗi khi bạn chọn xong.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        Nếu mất mạng, vui lòng không tải lại trang cho đến khi thấy biểu tượng "Đã lưu".
                                    </li>
                                </ul>
                            </Card>

                            {/* Mobile Grid Trigger */}
                            <div className="block lg:hidden w-full">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-bold flex items-center justify-between px-6">
                                            <span>Xem danh sách câu hỏi</span>
                                            <LayoutGrid className="h-5 w-5 text-primary" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto">
                                        <SheetHeader className="mb-6">
                                            <SheetTitle className="text-2xl font-bold tracking-tight">Danh sách câu hỏi</SheetTitle>
                                        </SheetHeader>
                                        <QuestionGrid
                                            totalQuestions={totalQuestions}
                                            onNavigate={(idx) => {
                                                setActiveQuestionIndex(idx);
                                                // Close sheet (handled automatically by SheetTrigger asChild usually but might need explicit state)
                                            }}
                                            flaggedQuestions={flaggedQuestions}
                                        />
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Premium Submit Confirmation */}
            <AlertDialog open={submitConfirmOpen} onOpenChange={setSubmitConfirmOpen}>
                <AlertDialogContent className="rounded-3xl p-0 overflow-hidden shadow-2xl border-none max-w-md">
                    <div className="h-2 bg-primary" />
                    <div className="p-8">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-center mb-2">
                                Bạn đã sẵn sàng nộp bài?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-base">
                                {answeredCount < totalQuestions ? (
                                    <span className="flex flex-col gap-3">
                                        <span className="bg-amber-50 text-amber-600 p-4 rounded-2xl border border-amber-100 font-medium">
                                            Chú ý: Bạn còn {totalQuestions - answeredCount} câu hỏi chưa trả lời.
                                        </span>
                                        <span>Nếu nộp bây giờ, những câu này sẽ được tính 0 điểm.</span>
                                    </span>
                                ) : (
                                    <span>Tất cả {totalQuestions} câu hỏi đã được hoàn tất. Chúc bạn nhận được kết quả cao nhất!</span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3">
                            <AlertDialogCancel className="w-full h-14 rounded-2xl font-bold text-muted-foreground border-2 mt-0">
                                Tiếp tục kiểm tra
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleSubmit}
                                className="w-full h-14 rounded-2xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-base border-none"
                            >
                                Xác nhận nộp bài
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default QuizTakingPage;
