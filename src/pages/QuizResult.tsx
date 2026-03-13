import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Trophy,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    RotateCcw,
    BarChart3,
    Clock,
    AlertCircle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { quizInstanceRepository } from '@/repositories';
import { useAuth } from '@/contexts';
import type { QuizResultDetailResDTO } from '@/domains';

const QuizResultPage = () => {
    const { id, instanceId } = useParams<{ id: string; instanceId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [result, setResult] = useState<QuizResultDetailResDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!instanceId || !user?.id) {
            setError('Thiếu thông tin kết quả');
            setLoading(false);
            return;
        }
        loadResult();
    }, [instanceId, user?.id]);

    const loadResult = async () => {
        if (!instanceId || !user?.id) return;
        setLoading(true);
        setError(null);

        try {
            const data = await quizInstanceRepository.getResult(Number(instanceId), user.id);
            setResult(data);
        } catch (err) {
            console.error('Failed to load result:', err);
            setError('Không thể tải kết quả. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="mt-4 text-muted-foreground">Đang tải kết quả...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Card className="max-w-md w-full mx-4">
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                            <h2 className="mb-2 text-xl font-semibold">{error || 'Không tìm thấy kết quả'}</h2>
                            <Button className="mt-4" onClick={() => navigate(`/quiz/${id}`)}>
                                Quay lại
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    const totalQuestions = result.questionResults?.length ?? 0;
    const correctCount = result.questionResults?.filter((q) => q.correct)?.length ?? 0;
    const incorrectCount = totalQuestions - correctCount;
    const scorePercent = result.scorePercentage ?? (
        result.totalPoints > 0
            ? Math.round((result.earnedPoints / result.totalPoints) * 100)
            : 0
    );

    const getScoreColor = (percent: number) => {
        if (percent >= 80) return 'text-emerald-600';
        if (percent >= 50) return 'text-amber-600';
        return 'text-destructive';
    };

    const getScoreBg = (percent: number) => {
        if (percent >= 80) return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800';
        if (percent >= 50) return 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800';
        return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
    };

    const getGradeLabel = (percent: number) => {
        if (percent >= 90) return 'Xuất sắc!';
        if (percent >= 80) return 'Giỏi!';
        if (percent >= 65) return 'Khá';
        if (percent >= 50) return 'Trung bình';
        return 'Cần cải thiện';
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/quiz/${id}`)}
                    className="mb-4 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại quiz
                </Button>

                {/* Score summary card */}
                <Card className={`mb-6 border-2 ${getScoreBg(scorePercent)}`}>
                    <CardContent className="py-8">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                            <div>
                                <Trophy className={`mx-auto mb-2 h-12 w-12 ${getScoreColor(scorePercent)}`} />
                                <h2 className="text-lg font-medium text-muted-foreground">
                                    {getGradeLabel(scorePercent)}
                                </h2>
                            </div>

                            <div className="border-l border-border pl-6 hidden sm:block" />

                            <div>
                                <p className={`text-5xl font-bold ${getScoreColor(scorePercent)}`}>
                                    {result.earnedPoints ?? 0}
                                    <span className="text-2xl font-normal text-muted-foreground">/{result.totalPoints ?? 0}</span>
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">{scorePercent}%</p>
                                <Progress value={scorePercent} className="mt-2 h-2 w-40" />
                            </div>

                            <div className="border-l border-border pl-6 hidden sm:block" />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-muted-foreground">Đúng: <strong className="text-foreground">{correctCount}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-destructive" />
                                    <span className="text-muted-foreground">Sai: <strong className="text-foreground">{incorrectCount}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 col-span-2">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Tổng: <strong className="text-foreground">{totalQuestions} câu</strong></span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question breakdown */}
                <h3 className="mb-4 text-lg font-semibold text-foreground">Chi tiết từng câu</h3>
                <div className="space-y-3">
                    {(result.questionResults || []).map((q, idx) => (
                        <Card key={q.questionInstanceId || idx} className="overflow-hidden">
                            <div className={`h-1 ${q.correct ? 'bg-emerald-500' : 'bg-destructive'}`} />
                            <CardContent className="py-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${q.correct
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">{q.questionText}</p>

                                        <div className="mt-2 space-y-1.5 text-sm">
                                            {q.userAnswer && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-muted-foreground whitespace-nowrap">Bạn chọn:</span>
                                                    <span className={q.correct ? 'text-emerald-600 font-medium' : 'text-destructive font-medium'}>
                                                        {q.userAnswer}
                                                    </span>
                                                </div>
                                            )}
                                            {!q.correct && q.correctAnswer && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-muted-foreground whitespace-nowrap">Đáp án:</span>
                                                    <span className="text-emerald-600 font-medium">{q.correctAnswer}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge variant="secondary" className="text-[10px]">
                                                {q.earnedPoints ?? 0}/{q.points ?? 0} điểm
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        {q.correct ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom actions */}
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <Button variant="outline" onClick={() => navigate(`/quiz/${id}`)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại quiz
                    </Button>
                    <Button onClick={() => navigate(`/quiz/${id}`)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Làm lại
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default QuizResultPage;
