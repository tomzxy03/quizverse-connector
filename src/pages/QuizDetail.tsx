import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  FileQuestion,
  Award,
  RotateCcw,
  Users,
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  UserPlus,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { quizService } from '@/services';
import type { QuizResDTO, AttemptState, QuizConfig } from '@/domains';
import { useAuth } from '@/contexts';
const QuizDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<QuizResDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptState, setAttemptState] = useState<AttemptState>('NOT_STARTED');
  const [instanceId, setInstanceId] = useState<number | null>(null);
  const [totalAttempt, setTotalAttempt] = useState<number | null>(0);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Quiz ID không hợp lệ');
      setLoading(false);
      return;
    }
    loadQuizData();
  }, [id, user?.id]);

  const loadQuizData = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const detail = await quizService.getQuizById(Number(id));
      if (!detail || !detail.quiz) {
        setError('Không tìm thấy quiz');
        setLoading(false);
        return;
      }
      setQuiz(detail.quiz);
      setAttemptState(detail.attemptState || 'NOT_STARTED');
      setInstanceId(detail.instanceId ?? null);
      setTotalAttempt(detail.totalAttempt ?? 0);
      setQuizConfig(detail.quizConfig ?? null);
    } catch (err) {
      setError('Không thể tải thông tin quiz. Vui lòng thử lại.');
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = () => {
    setStartConfirmOpen(true);
  };

  const handleConfirmStart = async () => {
    setStartConfirmOpen(false);
    if (!id) return;

    setIsStarting(true);
    try {
      const instance = await quizService.startQuiz(Number(id));
      navigate(`/quiz/${id}/take/${instance.id}`, {
        state: instance
    });
    } catch (err) {
      console.error('Failed to start quiz:', err);
      setError('Không thể bắt đầu quiz. Vui lòng thử lại.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleContinueQuiz = () => {
    if (!id) return;
    navigate(`/quiz/${id}/take`);
  };

  const handleViewResult = () => {
    if (!id || !instanceId) return;
    navigate(`/quiz/${id}/result/${instanceId}`);
  };

  const handleRetry = () => {
    setStartConfirmOpen(true);
  };

  const visibility = quiz?.quizVisibility === 'public' ? 'PUBLIC' : quiz?.quizVisibility === 'class_only' ? 'GROUP' : 'DRAFT';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container px-4 py-6 max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container px-4 py-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-16 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                {error || 'Không tìm thấy quiz'}
              </h2>
              <Button asChild className="mt-4">
                <Link to="/library">Quay lại thư viện</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const maxScore = quizConfig?.passingScore ?? quiz.totalQuestion * 10;
  const maxAttempts = quizConfig?.maxAttempts;
  const canRetry = maxAttempts ? totalAttempt < maxAttempts : true;
  const accessBadgeLabel =
    visibility === 'PUBLIC' ? 'Công khai' : visibility === 'GROUP' ? 'Nhóm' : 'Bản nháp';

  const statusLabel: Record<AttemptState, string> = {
    NOT_STARTED: 'Chưa tham gia',
    IN_PROGRESS: 'Đang làm dở',
    SUBMITTED: 'Đã nộp bài',
    EXPIRED: 'Đã hết hạn',
  };

  const StatusIcon = () => {
    switch (attemptState) {
      case 'NOT_STARTED':
        return <UserPlus className="h-4 w-4 text-muted-foreground" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'SUBMITTED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <UserPlus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{quiz.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              {quiz.lobbyName || quiz.hostName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {quiz.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                    {quiz.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <FileQuestion className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Số câu hỏi</p>
                      <p className="text-lg font-semibold text-foreground">{quiz.totalQuestion}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <Award className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Điểm tối đa (dự kiến)</p>
                      <p className="text-lg font-semibold text-foreground">{maxScore}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Giới hạn thời gian</p>
                      <p className="text-lg font-semibold text-foreground">
                        {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} phút` : 'Không giới hạn'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <RotateCcw className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {maxAttempts ? 'Số lần đã làm / Tối đa' : 'Số lần đã làm'}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {totalAttempt}
                        {maxAttempts && ` / ${maxAttempts}`}
                      </p>
                      {maxAttempts && (
                        <div className="mt-2 w-full overflow-hidden rounded-full bg-muted h-2">
                          <div
                            className={`h-full transition-all ${
                              totalAttempt >= maxAttempts
                                ? 'bg-destructive'
                                : totalAttempt >= maxAttempts * 0.75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min((totalAttempt / maxAttempts) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quy định & trải nghiệm</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-foreground">
                  <li>Thời gian sẽ bắt đầu ngay khi bạn bắt đầu làm bài.</li>
                  <li>Bài làm sẽ tự động nộp khi hết giờ (nếu có giới hạn thời gian).</li>
                  <li>Câu trả lời được tự động lưu sau mỗi lần chọn.</li>
                  <li>Hãy đảm bảo kết nối internet ổn định trong khi làm bài.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right column – sticky action panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Access & availability */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1">
                        {visibility === 'PUBLIC' && <Globe className="h-3.5 w-3.5" />}
                        {visibility === 'GROUP' && <Lock className="h-3.5 w-3.5" />}
                        {visibility === 'DRAFT' && <FileQuestion className="h-3.5 w-3.5" />}
                        {accessBadgeLabel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trạng thái của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User status from backend attemptState */}
                  {!user && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Bạn đang làm với tư cách khách (kết quả sẽ không được lưu)
                      </span>
                    </div>
                  )}
                  {user && (
                    <div className="flex items-center gap-2">
                      <StatusIcon />
                      <span className="text-sm font-medium text-foreground">
                        {statusLabel[attemptState]}
                      </span>
                    </div>
                  )}

                  {/* Start warning */}
                  {attemptState === 'NOT_STARTED' && (
                    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p>Thời gian sẽ bắt đầu ngay khi bạn bắt đầu làm bài.</p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-border pt-4 space-y-2">
                    {/* Guest users on public quiz */}
                    {!user && visibility === 'PUBLIC' && (
                      <Button
                        onClick={handleStartClick}
                        disabled={isStarting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Bắt đầu làm quiz
                      </Button>
                    )}

                    {!user && visibility === 'GROUP' && (
                      <div className="rounded-lg border border-border bg-muted/50 px-3 py-3 text-center text-sm text-muted-foreground">
                        Đây là quiz trong nhóm. Vui lòng đăng nhập và tham gia nhóm để làm bài.
                      </div>
                    )}

                    {/* Logged-in: NOT_STARTED */}
                    {user && attemptState === 'NOT_STARTED' && (
                      <Button
                        onClick={handleStartClick}
                        disabled={isStarting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {isStarting ? 'Đang khởi tạo...' : 'Bắt đầu làm quiz'}
                      </Button>
                    )}

                    {/* Logged-in: IN_PROGRESS */}
                    {user && attemptState === 'IN_PROGRESS' && (
                      <Button
                        onClick={handleContinueQuiz}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Tiếp tục làm
                      </Button>
                    )}

                    {/* Logged-in: SUBMITTED — view result + retry */}
                    {user && attemptState === 'SUBMITTED' && (
                      <>
                        {instanceId && (
                          <Button
                            onClick={handleViewResult}
                            variant="outline"
                            className="w-full"
                            size="lg"
                          >
                            <Trophy className="mr-2 h-4 w-4" />
                            Xem kết quả
                          </Button>
                        )}
                        {canRetry ? (
                        <Button
                          onClick={handleRetry}
                          disabled={isStarting}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          size="lg"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          {isStarting ? 'Đang khởi tạo...' : 'Làm lại'}
                        </Button>
                        ) : (
                          <div className="rounded-lg border border-border bg-muted/50 px-3 py-3 text-center text-sm text-muted-foreground">
                            Bạn đã đạt giới hạn số lần làm bài ({quiz.maxAttempts} lần)
                          </div>
                        )}
                      </>
                    )}

                    {/* EXPIRED */}
                    {user && attemptState === 'EXPIRED' && (
                      <div className="rounded-lg border border-border bg-muted/50 px-3 py-3 text-center text-sm text-muted-foreground">
                        Bài thi đã hết hạn
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={startConfirmOpen} onOpenChange={setStartConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bắt đầu làm quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Thời gian sẽ bắt đầu ngay khi bạn bắt đầu làm bài. Bạn có chắc muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStart}>
              Bắt đầu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizDetailPage;
