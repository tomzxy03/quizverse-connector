import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trophy,
    CheckCircle2,
    XCircle,
    Clock,
    BarChart3,
    AlertCircle,
    MinusCircle,
    Home,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { examService } from '@/services';
import type { AttemptDetailResDTO } from '@/domains';

const HistoryResultDetail = () => {
    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const [detail, setDetail] = useState<AttemptDetailResDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!attemptId) {
            setError('Thiếu thông tin bài thi');
            setLoading(false);
            return;
        }
        loadDetail();
    }, [attemptId]);

    const loadDetail = async () => {
        if (!attemptId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await examService.getAttemptById(Number(attemptId));
            setDetail(data);
        } catch (err) {
            console.error('Failed to load attempt detail:', err);
            setError('Không thể tải chi tiết bài thi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const metrics = useMemo(() => {
        if (!detail) return null;
        const total = detail.totalQuestions;
        const correct = detail.correctAnswers;
        const incorrect = total - correct;
        // Parse score string like "8/10" or percentage
        let scorePercent = 0;
        if (detail.score) {
            if (detail.score.includes('/')) {
                const [numerator, denominator] = detail.score.split('/').map(Number);
                scorePercent = denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
            } else if (detail.score.includes('%')) {
                scorePercent = parseInt(detail.score, 10);
            } else {
                scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
            }
        } else {
            scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
        }
        return { total, correct, incorrect, scorePercent };
    }, [detail]);

    const getScoreTheme = (percent: number) => {
        if (percent >= 80)
            return {
                text: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                label: 'Xuất sắc!',
                icon: Trophy,
            };
        if (percent >= 50)
            return {
                text: 'text-amber-500',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                label: 'Hoàn thành!',
                icon: BarChart3,
            };
        return {
            text: 'text-destructive',
            bg: 'bg-destructive/10',
            border: 'border-destructive/20',
            label: 'Cần cố gắng!',
            icon: AlertCircle,
        };
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
                        <p className="text-muted-foreground font-medium animate-pulse">
                            Đang tải chi tiết bài thi...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    /* ── Error ── */
    if (error || !detail || !metrics) {
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
                            <h2 className="mb-3 text-2xl font-bold text-foreground">
                                {error || 'Không tìm thấy bài thi'}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Có lỗi xảy ra khi truy cập dữ liệu bài thi này.
                            </p>
                            <Button
                                className="w-full h-12 rounded-xl text-base font-medium"
                                onClick={() => navigate('/history')}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Quay lại lịch sử thi
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    const { scorePercent, correct, incorrect, total } = metrics;
    const theme = getScoreTheme(scorePercent);
    const ThemeIcon = theme.icon;

    return (
        <div className="min-h-screen flex flex-col bg-muted/20 selection:bg-primary/10">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl px-4 py-4 md:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/history')}
                            className="rounded-full hover:bg-muted"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-foreground">
                                Chi tiết bài thi
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {detail.title || 'Quiz'} · {detail.date || detail.completedAt}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="rounded-xl h-10 px-5 font-bold shadow-lg shadow-primary/10"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </div>
            </header>

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-4xl mx-auto">
                    {/* ── Score Summary ── */}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[120px] h-fit">
                        <div className="relative group">
                            <div className="absolute -inset-1 rounded-[3rem] blur-2xl opacity-20 transition-opacity bg-primary group-hover:opacity-30" />
                            <Card className="relative border-border/40 bg-background/50 backdrop-blur-sm shadow-xl p-8 rounded-[2.5rem] overflow-hidden flex flex-col items-center text-center border-2">
                                <div
                                    className={`mb-6 h-20 w-20 rounded-3xl ${theme.bg} flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500`}
                                >
                                    <ThemeIcon className={`h-10 w-10 ${theme.text}`} />
                                </div>
                                <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">
                                    {theme.label}
                                </h2>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-6xl font-black tracking-tighter ${theme.text}`}>
                                        {scorePercent}
                                    </span>
                                    <span className="text-2xl font-bold text-muted-foreground opacity-50">%</span>
                                </div>

                                <div className="w-full mt-8 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-muted-foreground">Kết quả:</span>
                                        <span className="font-bold text-foreground">{detail.score}</span>
                                    </div>
                                    {detail.points != null && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-muted-foreground">Điểm:</span>
                                            <span className="font-bold text-foreground">{detail.points}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Thời gian:
                                        </span>
                                        <span className="font-bold text-foreground">{detail.duration}</span>
                                    </div>
                                    <Progress value={scorePercent} className="h-2 rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 w-full mt-10 gap-3">
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">
                                            Đúng
                                        </p>
                                        <p className="text-xl font-bold text-emerald-600">{correct}</p>
                                    </div>
                                    <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1">
                                            Sai
                                        </p>
                                        <p className="text-xl font-bold text-destructive/80">{incorrect}</p>
                                    </div>
                                </div>

                                {/* Badges */}
                                {detail.badges && detail.badges.length > 0 && (
                                    <div className="flex gap-2 mt-6 flex-wrap justify-center">
                                        {detail.badges.map((badge, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className={
                                                    detail.badgeColors?.[idx]
                                                        ? `${detail.badgeColors[idx]} text-white border-0`
                                                        : ''
                                                }
                                            >
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    {/* ── Question Breakdown ── */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-foreground">Chi tiết câu hỏi</h3>
                            <Badge
                                variant="outline"
                                className="rounded-full px-3 py-1 font-bold text-[10px] uppercase opacity-60"
                            >
                                {total} Tổng cộng
                            </Badge>
                        </div>

                        {detail.answers && detail.answers.length > 0 ? (
                            <div className="space-y-4">
                                {detail.answers.map((answer, idx) => {
                                    const question = answer.question;
                                    return (
                                        <Card
                                            key={answer.id || idx}
                                            className="group relative border-border/30 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all p-6 rounded-3xl overflow-hidden border-2"
                                        >
                                            {/* Left color bar */}
                                            <div
                                                className={`absolute top-0 left-0 w-1.5 h-full ${answer.isCorrect ? 'bg-emerald-500' : 'bg-destructive/60'
                                                    }`}
                                            />

                                            <div className="flex items-start gap-5">
                                                {/* Question number badge */}
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${answer.isCorrect
                                                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                                                        }`}
                                                >
                                                    {idx + 1}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <p className="font-bold text-foreground leading-snug mb-4">
                                                        {question?.questionName || `Câu hỏi ${idx + 1}`}
                                                    </p>

                                                    <div className="grid gap-3 mb-4">
                                                        {/* User's answer */}
                                                        {answer.answerText && (
                                                            <div
                                                                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${answer.isCorrect
                                                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                                                        : 'bg-destructive/5 border-destructive/20'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`h-2 w-2 rounded-full ${answer.isCorrect ? 'bg-emerald-500' : 'bg-destructive'
                                                                        }`}
                                                                />
                                                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                                    Bạn chọn:
                                                                </span>
                                                                <span
                                                                    className={`text-sm font-bold ${answer.isCorrect
                                                                            ? 'text-emerald-700'
                                                                            : 'text-destructive/80'
                                                                        }`}
                                                                >
                                                                    {answer.answerText}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Show correct answer if user got it wrong */}
                                                        {!answer.isCorrect && question?.answers && (
                                                            <div className="flex items-center gap-3 p-3 rounded-2xl border-2 border-emerald-500/10 bg-muted/20">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                                                                    Đáp án đúng:
                                                                </span>
                                                                <span className="text-sm font-bold text-emerald-700">
                                                                    {question.answers
                                                                        .filter(
                                                                            (a) => a.answerType === 'text' && (a as any).answerCorrect
                                                                        )
                                                                        .map((a) => a.answerText)
                                                                        .join(', ') || '—'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-muted-foreground/5 text-[10px] font-bold rounded-full py-0"
                                                        >
                                                            {answer.pointsEarned || 0} Điểm
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Correct/Incorrect icon */}
                                                <div className="shrink-0 mt-1">
                                                    {answer.isCorrect ? (
                                                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                                                            <XCircle className="h-5 w-5 text-destructive" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="rounded-3xl border-border/30">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <MinusCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                    <p className="font-medium">Chưa có dữ liệu chi tiết câu hỏi</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HistoryResultDetail;
