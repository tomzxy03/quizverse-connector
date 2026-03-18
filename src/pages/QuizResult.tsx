import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Trophy,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    RotateCcw,
    BarChart3,
    Clock,
    AlertCircle,
    LayoutGrid,
    Share2,
    Home
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
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

    const metrics = useMemo(() => {
        if (!result) return null;
        const total = result.questionResults?.length ?? 0;
        const correct = result.questionResults?.filter((q) => q.correct)?.length ?? 0;
        const incorrect = total - correct;
        const scorePercent = result.scorePercentage ?? (
            result.totalPoints > 0
                ? Math.round((result.earnedPoints / result.totalPoints) * 100)
                : 0
        );
        const timeSpent = result.totalTimeSpentMinutes ?? 0;
        return { total, correct, incorrect, scorePercent, timeSpent };
    }, [result]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
                        <p className="text-muted-foreground font-medium animate-pulse">Đang tính toán kết quả...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !result || !metrics) {
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
                            <h2 className="mb-3 text-2xl font-bold text-foreground">{error || 'Không tìm thấy kết quả'}</h2>
                            <p className="text-muted-foreground mb-8">Có lỗi xảy ra khi truy cập kết quả này.</p>
                            <Button className="w-full h-12 rounded-xl text-base font-semibold" onClick={() => navigate(`/quiz/${id}`)}>
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Quay lại bài thi
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    const { scorePercent, correct, incorrect, total, timeSpent } = metrics;

    const getScoreTheme = (percent: number) => {
        if (percent >= 80) return {
            text: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            label: 'Xuất sắc!',
            icon: Trophy
        };
        if (percent >= 50) return {
            text: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            label: 'Hoàn thành!',
            icon: BarChart3
        };
        return {
            text: 'text-destructive',
            bg: 'bg-destructive/10',
            border: 'border-destructive/20',
            label: 'Cần cố gắng!',
            icon: AlertCircle
        };
    };

    const theme = getScoreTheme(scorePercent);
    const ThemeIcon = theme.icon;

    return (
        <div className="min-h-screen flex flex-col bg-muted/20 selection:bg-primary/10">
            {/* Header matches QuizTaking */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl px-4 py-4 md:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/quiz/${id}`)}
                            className="rounded-full hover:bg-muted"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Kết quả bài thi</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl bg-background/50 backdrop-blur border-border/40">
                            <Share2 className="mr-2 h-4 w-4" />
                            Chia sẻ
                        </Button>
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="rounded-xl h-10 px-5 font-bold shadow-lg shadow-primary/10"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Về Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto max-w-5xl px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 max-w-4xl mx-auto">
                    {/* Score Summary Side */}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[120px] h-fit">
                        <div className="relative group">
                            <div className={`absolute -inset-1 rounded-[3rem] blur-2xl opacity-20 transition-opacity bg-primary group-hover:opacity-30`} />
                            <Card className="relative border-border/40 bg-background/50 backdrop-blur-sm shadow-xl p-8 rounded-[2.5rem] overflow-hidden flex flex-col items-center text-center border-2">
                                <div className={`mb-6 h-20 w-20 rounded-3xl ${theme.bg} flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500`}>
                                    <ThemeIcon className={`h-10 w-10 ${theme.text}`} />
                                </div>
                                <h2 className="text-sm font-bold tracking-[0.2em] text-muted-foreground uppercase mb-1">{theme.label}</h2>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-6xl font-black tracking-tighter ${theme.text}`}>{scorePercent}</span>
                                    <span className="text-2xl font-bold text-muted-foreground opacity-50">%</span>
                                </div>

                                <div className="w-full mt-8 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-muted-foreground">Điểm số:</span>
                                        <span className="font-bold text-foreground">{result.earnedPoints || 0} / {result.totalPoints || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Thời gian:
                                        </span>
                                        <span className="font-bold text-foreground">{timeSpent} phút</span>
                                    </div>
                                    <Progress value={scorePercent} className="h-2 rounded-full" />
                                </div>

                                <div className="grid grid-cols-2 w-full mt-10 gap-3">
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Đúng</p>
                                        <p className="text-xl font-bold text-emerald-600">{correct}</p>
                                    </div>
                                    <div className="bg-destructive/5 border border-destructive/10 p-3 rounded-2xl">
                                        <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1">Sai</p>
                                        <p className="text-xl font-bold text-destructive/80">{incorrect}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/quiz/${id}/take/${instanceId}`)}
                                    className="w-full mt-8 h-14 rounded-2xl font-bold bg-muted/50 border border-border/30 hover:bg-muted text-foreground transition-all flex items-center justify-center gap-3"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    Thử lại lần nữa
                                </Button>
                            </Card>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-foreground">Chi tiết câu hỏi</h3>
                            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[10px] uppercase opacity-60">
                                {total} Tổng cộng
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {(result.questionResults || []).map((q, idx) => (
                                <Card key={q.questionInstanceId || idx} className="group relative border-border/30 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all p-6 rounded-3xl overflow-hidden border-2">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${q.correct ? 'bg-emerald-500' : 'bg-destructive/60'}`} />
                                    <div className="flex items-start gap-5">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${q.correct
                                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <p className="font-bold text-foreground leading-snug mb-4">{q.questionText}</p>

                                            <div className="grid gap-3 mb-4">
                                                {q.userAnswer && (
                                                    <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${q.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-destructive/5 border-destructive/20'
                                                        }`}>
                                                        <div className={`h-2 w-2 rounded-full ${q.correct ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                                        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Bạn chọn:</span>
                                                        <span className={`text-sm font-bold ${q.correct ? 'text-emerald-700' : 'text-destructive/80'}`}>{q.userAnswer}</span>
                                                    </div>
                                                )}

                                                {!q.correct && q.correctAnswer && (
                                                    <div className="flex items-center gap-3 p-3 rounded-2xl border-2 border-emerald-500/10 bg-muted/20">
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Đáp án đúng:</span>
                                                        <span className="text-sm font-bold text-emerald-700">{q.correctAnswer}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-muted-foreground/5 text-[10px] font-bold rounded-full py-0">
                                                    {q.earnedPoints || 0}/{q.points || 0} Điểm
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="shrink-0 mt-1">
                                            {q.correct ? (
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
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizResultPage;
