import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Play,
  Clock,
  Users,
  FileEdit,
  ChevronRight,
  BookOpen,
  Trash2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts';
import { fetchDashboard } from '@/services';
import type {
  DashboardSummary,
  InProgressQuizInstance,
  QuizRecentItem,
  QuizInstanceStatus,
} from '@/domains/dashboard.types';
import { GroupRole } from '@/core/types';

function formatTimeRemaining(seconds?: number): string {
  if (seconds == null || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function statusLabel(status: QuizInstanceStatus): string {
  switch (status) {
    case 'DONE':
      return 'Đã nộp';
    case 'UPCOMING':
      return 'Sắp mở';
    case 'MISSED':
      return 'Đã hết hạn';
    default:
      return status;
  }
}

function statusVariant(status: QuizInstanceStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'DONE':
      return 'default';
    case 'UPCOMING':
      return 'secondary';
    case 'MISSED':
      return 'destructive';
    default:
      return 'outline';
  }
}

function roleLabel(role: GroupRole): string {
  switch (role) {
    case 'OWNER':
    case 'HOST':
      return 'Chủ nhóm';
    case 'ADMIN':
      return 'Admin';
    case 'MEMBER':
      return 'Thành viên';
    default:
      return role;
  }
}

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDashboard(user.id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Không tải được dashboard.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const canManageDrafts =
    data?.groups?.some((g) => g.role === 'OWNER' || g.role === 'HOST' || g.role === 'ADMIN') ?? false;
  const showDrafts = canManageDrafts && (data?.draftQuizzes?.length ?? 0) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container px-4 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <LayoutDashboard className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : data ? (
          <div className="space-y-6">
            {/* 3.1 User summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={data.user.avatar} alt={data.user.username} />
                  <AvatarFallback>
                    {(data.user.username || data.user.fullName || 'U').slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {data.user.fullName || data.user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">@{data.user.username}</p>
                </div>
                <div className="flex gap-4 ml-auto flex-wrap">
                  <StatPill
                    label="Đã tham gia"
                    value={data.userStats.totalQuizzesTaken}
                    icon={<BookOpen className="h-4 w-4" />}
                  />
                  <StatPill
                    label="Đang làm"
                    value={data.userStats.inProgressCount}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <StatPill
                    label="Đã hoàn thành"
                    value={data.userStats.completedCount}
                    icon={<Play className="h-4 w-4" />}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3.2 Resume in-progress */}
            {data.inProgressInstances.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Quiz đang làm dở</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.inProgressInstances.map((inst: InProgressQuizInstance) => (
                      <li
                        key={inst.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{inst.quizTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {inst.answeredCount} / {inst.totalQuestions} câu
                            {inst.timeRemainingSeconds != null && (
                              <> · Còn {formatTimeRemaining(inst.timeRemainingSeconds)}</>
                            )}
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/quiz/${inst.quizId}/attempt/${inst.id}`}>
                            Tiếp tục <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 3.3 Recent & upcoming */}
            {data.recentAndUpcoming.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Gần đây & sắp tới</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.recentAndUpcoming.map((item: QuizRecentItem) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium text-sm">{item.quizTitle}</p>
                          {item.submittedAt && (
                            <p className="text-xs text-muted-foreground">
                              Nộp: {new Date(item.submittedAt).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                          {item.startDate && item.status === 'UPCOMING' && (
                            <p className="text-xs text-muted-foreground">
                              Mở: {new Date(item.startDate).toLocaleDateString('vi-VN')}
                            </p>
                          )}
                        </div>
                        <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 3.4 Groups */}
            {data.groups.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" /> Nhóm của bạn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.groups.map((g) => (
                      <li key={g.id}>
                        <Link
                          to={`/groups?id=${g.id}`}
                          className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{g.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {roleLabel(g.role)} · {g.openQuizzesCount} quiz đang mở
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* 3.5 Draft quizzes (Host/Admin) */}
            {showDrafts && data.draftQuizzes.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileEdit className="h-4 w-4" /> Draft quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.draftQuizzes.map((d) => (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border bg-muted/20"
                      >
                        <div>
                          <p className="font-medium">{d.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {d.subject} · {d.questionCount} câu · Cập nhật{' '}
                            {new Date(d.updatedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/groups/add-quiz?edit=${d.id}`}>Tiếp tục sửa</Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {!data.inProgressInstances.length &&
              !data.recentAndUpcoming.length &&
              !data.groups.length &&
              !showDrafts && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Chưa có hoạt động. Tham gia quiz hoặc nhóm để bắt đầu.
                    <div className="mt-4 flex justify-center gap-2">
                      <Button asChild>
                        <Link to="/library">Thư viện quiz</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/groups">Nhóm học</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        ) : null}
      </main>
    </div>
  );
};

function StatPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
      {icon}
      <div>
        <p className="text-lg font-semibold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="flex gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-4 ml-auto">
            <Skeleton className="h-12 w-24 rounded-lg" />
            <Skeleton className="h-12 w-24 rounded-lg" />
            <Skeleton className="h-12 w-24 rounded-lg" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
