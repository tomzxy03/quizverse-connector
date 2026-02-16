import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  FileQuestion,
  Award,
  RotateCcw,
  Shuffle,
  Calendar,
  Users,
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
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
import { examService } from '@/services';
import type { QuizDetail as QuizDetailType } from '@/domains';
import { useAuth } from '@/contexts';

type UserParticipationStatus =
  | 'NOT_JOINED'
  | 'JOINED_NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED';

type Availability = 'upcoming' | 'active' | 'closed';


const MOCK_ACTIVE: Availability = 'active';
const MOCK_UPCOMING: Availability = 'upcoming';
const MOCK_CLOSED: Availability = 'closed';
const MOCK_OPEN_AT: Date | null = null;
const MOCK_CLOSE_AT: Date | null = null;
const MOCK_RESUME_ALLOWED = true;

const QuizDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<QuizDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participationStatus, setParticipationStatus] = useState<UserParticipationStatus>('NOT_JOINED');
  const [hasJoined, setHasJoined] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [userAttempts, setUserAttempts] = useState<Array<{ id: string; score: string; completedAt: string; points?: number }>>([]);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);

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
      const quizData = await quizService.getQuizById(id);
      if (!quizData) {
        setError('Không tìm thấy quiz');
        setLoading(false);
        return;
      }
      setQuiz(quizData);

      if (!user?.id) {
        setParticipationStatus('NOT_JOINED');
        setUserAttempts([]);
        setRemainingAttempts(quizData.settings.maxAttempts ?? null);
        setLoading(false);
        return;
      }

      const attempts = await examService.getQuizAttempts(id, user.id);
      const normalized = (attempts || []).map((a: { id: string; score?: string; completedAt?: string | Date; points?: number }) => ({
        id: a.id,
        score: a.score ?? '0/0',
        completedAt: a.completedAt ? new Date(a.completedAt).toISOString() : '',
        points: a.points,
      }));
      setUserAttempts(normalized);

      const hasAnyAttempt = normalized.length > 0;
      const latest = normalized[0];
      const latestCompleted = latest?.completedAt;

      if (!hasAnyAttempt) {
        setParticipationStatus('NOT_JOINED');
        setHasJoined(false);
      } else if (!latestCompleted) {
        setParticipationStatus('IN_PROGRESS');
        setHasJoined(true);
      } else {
        setParticipationStatus('SUBMITTED');
        setHasJoined(true);
      }

      if (quizData.settings.maxAttempts != null) {
        setRemainingAttempts(Math.max(0, quizData.settings.maxAttempts - normalized.length));
      } else {
        setRemainingAttempts(null);
      }
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

  const handleConfirmStart = () => {
    setStartConfirmOpen(false);
    if (!id) return;
    navigate(`/quiz/${id}/start`);
  };

  const handleContinueQuiz = () => {
    if (!id || userAttempts.length === 0) return;
    navigate(`/quiz/${id}/attempt/${userAttempts[0].id}`);
  };

  const handleRetry = () => {
    setStartConfirmOpen(true);
  };

  const difficultyLabel: Record<string, string> = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
  };

  const difficultyColor: Record<string, string> = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    hard: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const availabilityLabel: Record<Availability, string> = {
    upcoming: 'Sắp mở',
    active: 'Đang mở',
    closed: 'Đã đóng',
  };

  const visibility = ((quiz as any)?.visibility ?? (quiz?.isPublic ? 'PUBLIC' : 'GROUP')) as
    | 'PUBLIC'
    | 'GROUP'
    | 'DRAFT';

  const isGuest = !user;
  const isGroupQuiz = visibility === 'GROUP';

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

  const maxScore = quiz.settings.pointsPerQuestion
    ? quiz.questionCount * quiz.settings.pointsPerQuestion
    : quiz.questionCount * 10;
  const passingScore = quiz.settings.passingScore ?? null;

  const isAvailable = MOCK_ACTIVE === 'active';
  const isUpcoming = MOCK_UPCOMING === 'upcoming';
  const isClosed = MOCK_CLOSED === 'closed';

  const noAttemptsLeft = remainingAttempts !== null && remainingAttempts <= 0;

  const attemptsWithScore = userAttempts
    .filter((a) => a.completedAt)
    .map((a) => {
      const [correct, total] = (a.score || '0/0').split('/').map(Number);
      const numericScore = total ? (correct / total) * maxScore : 0;
      return { ...a, numericScore };
    });

  const bestAttempt = [...attemptsWithScore].sort((a, b) => b.numericScore - a.numericScore)[0];

  const getPass = (numericScore: number) =>
    passingScore != null ? numericScore >= passingScore : null;

  const accessBadgeLabel =
    visibility === 'PUBLIC' ? 'Công khai' : visibility === 'GROUP' ? 'Nhóm' : 'Bản nháp';

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
            <Badge variant="outline" className={`border ${difficultyColor[quiz.difficulty] ?? ''}`}>
              {difficultyLabel[quiz.difficulty] ?? quiz.difficulty}
            </Badge>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              {quiz.subject}
            </span>
            {quiz.attemptCount != null && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Award className="h-4 w-4" />
                {quiz.attemptCount} lượt làm
              </span>
            )}
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
                      <p className="text-lg font-semibold text-foreground">{quiz.questionCount}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian</p>
                      <p className="text-lg font-semibold text-foreground">
                        {quiz.settings.timeLimit
                          ? `${quiz.settings.timeLimit} phút`
                          : `${quiz.estimatedTime} phút`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                    <Award className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Điểm tối đa</p>
                      <p className="text-lg font-semibold text-foreground">{maxScore}</p>
                    </div>
                  </div>
                  {quiz.settings.maxAttempts != null && (
                    <div className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                      <RotateCcw className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số lần làm tối đa</p>
                        <p className="text-lg font-semibold text-foreground">
                          {quiz.settings.maxAttempts}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cài đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {quiz.settings.randomizeQuestions ? (
                      <><Shuffle className="h-4 w-4 text-primary" /><span className="text-foreground">Câu hỏi được xáo trộn</span></>
                    ) : (
                      <><FileQuestion className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Câu hỏi theo thứ tự</span></>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.settings.randomizeOptions ? (
                      <><Shuffle className="h-4 w-4 text-primary" /><span className="text-foreground">Đáp án được xáo trộn</span></>
                    ) : (
                      <><FileQuestion className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Đáp án theo thứ tự</span></>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.settings.showCorrectAnswers ? (
                      <><CheckCircle2 className="h-4 w-4 text-primary" /><span className="text-foreground">Hiển thị đáp án đúng sau khi nộp</span></>
                    ) : (
                      <><XCircle className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Không hiển thị đáp án đúng</span></>
                    )}
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
                  {MOCK_RESUME_ALLOWED && (
                    <li>Bạn có thể tạm dừng và tiếp tục làm bài sau (tiến độ được lưu).</li>
                  )}
                  <li>Hãy đảm bảo kết nối internet ổn định trong khi làm bài.</li>
                  {passingScore != null && (
                    <li className="font-medium text-primary">
                      Điểm đạt: {passingScore} / {maxScore} điểm
                    </li>
                  )}
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
                      <Badge
                        variant={MOCK_ACTIVE === 'active' ? 'default' : 'outline'}
                        className="gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {availabilityLabel[MOCK_ACTIVE]}
                      </Badge>
                    </div>
                    {MOCK_OPEN_AT && (
                      <p className="text-xs text-muted-foreground">
                        Mở: {new Date(MOCK_OPEN_AT).toLocaleString('vi-VN')}
                      </p>
                    )}
                    {MOCK_CLOSE_AT && (
                      <p className="text-xs text-muted-foreground">
                        Đóng: {new Date(MOCK_CLOSE_AT).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trạng thái của bạn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User status */}
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
                      {participationStatus === 'NOT_JOINED' && (
                        <>
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Chưa tham gia</span>
                        </>
                      )}
                      {participationStatus === 'JOINED_NOT_STARTED' && (
                        <>
                          <Play className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Đã tham gia, chưa làm</span>
                        </>
                      )}
                      {participationStatus === 'IN_PROGRESS' && (
                        <>
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-foreground">Đang làm dở</span>
                        </>
                      )}
                      {participationStatus === 'SUBMITTED' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-medium text-foreground">Đã nộp bài</span>
                        </>
                      )}
                    </div>
                  )}

                  {user && remainingAttempts !== null && (
                    <p className="text-sm text-muted-foreground">
                      Còn lại <span className="font-medium text-foreground">{remainingAttempts}</span> lượt làm
                    </p>
                  )}

                  {user && passingScore != null && (
                    <p className="text-sm text-muted-foreground">
                      Điểm đạt: <span className="font-medium text-foreground">{passingScore}/{maxScore}</span>
                    </p>
                  )}

                  {/* Best attempt */}
                  {user && bestAttempt && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Trophy className="h-3.5 w-3.5" />
                        Điểm cao nhất
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {Math.round(bestAttempt.numericScore)} / {maxScore}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bestAttempt.completedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}

                  {/* Last attempts summary */}
                  {user && attemptsWithScore.length > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Lần làm gần đây</p>
                      <ul className="space-y-2">
                        {attemptsWithScore.slice(0, 3).map((attempt) => {
                          const passed = getPass(attempt.numericScore);
                          return (
                            <li
                              key={attempt.id}
                              className="flex items-center justify-between rounded-md bg-muted/30 px-2 py-1.5 text-xs"
                            >
                              <span className="font-medium text-foreground">{attempt.score}</span>
                              <span className="text-muted-foreground">
                                {attempt.completedAt
                                  ? new Date(attempt.completedAt).toLocaleDateString('vi-VN')
                                  : '—'}
                              </span>
                              {passed === true && (
                                <Badge variant="default" className="text-[10px]">Đạt</Badge>
                              )}
                              {passed === false && (
                                <Badge variant="secondary" className="text-[10px]">Chưa đạt</Badge>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Start warning */}
                  {(participationStatus === 'JOINED_NOT_STARTED' || participationStatus === 'SUBMITTED') &&
                    isAvailable &&
                    !noAttemptsLeft && (
                      <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>Thời gian sẽ bắt đầu ngay khi bạn bắt đầu làm bài.</p>
                      </div>
                    )}

                  {/* CTA */}
                  <div className="border-t border-border pt-4 space-y-2">
                    {/* Guest users */}
                    {!user && visibility === 'PUBLIC' && (
                      <Button
                        onClick={handleStartClick}
                        disabled={!isAvailable}
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

                    {/* Logged-in users */}
                    {user && participationStatus === 'NOT_JOINED' && (
                      <Button
                        onClick={handleStartClick}
                        disabled={!isAvailable}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Bắt đầu làm quiz
                      </Button>
                    )}

                    {user && participationStatus === 'IN_PROGRESS' && (
                      <Button
                        onClick={handleContinueQuiz}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        size="lg"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Tiếp tục làm
                      </Button>
                    )}

                    {user &&
                      participationStatus === 'SUBMITTED' &&
                      remainingAttempts !== null &&
                      remainingAttempts > 0 && (
                        <Button
                          onClick={handleRetry}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          size="lg"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Làm lại
                        </Button>
                      )}

                    {user && participationStatus === 'SUBMITTED' && noAttemptsLeft && (
                      <div className="rounded-lg border border-border bg-muted/50 px-3 py-3 text-center text-sm text-muted-foreground">
                        Bạn đã hết lượt làm bài
                      </div>
                    )}

                    {isUpcoming && (
                      <p className="text-center text-sm text-muted-foreground">
                        Quiz sẽ mở vào thời gian được chỉ định
                      </p>
                    )}
                    {isClosed && (
                      <p className="text-center text-sm text-muted-foreground">
                        Quiz đã đóng
                      </p>
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
