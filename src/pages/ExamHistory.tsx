import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, User } from 'lucide-react';
import { examService } from '@/services';
import type { AttemptResDTO } from '@/domains';
import type { PageResponse } from '@/core/types';
import { useAuth } from '@/contexts';

const ExamHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [examHistory, setExamHistory] = useState<AttemptResDTO[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<AttemptResDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatDuration = (value?: number | string) => {
    if (value == null) return '—';
    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) return String(value);
    const totalSeconds = Math.max(0, Math.floor(parsed / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  useEffect(() => {
    loadExamHistory();
  }, []);

  const loadExamHistory = async () => {
    if (!user) {
      setError('Vui lòng đăng nhập để xem lịch sử thi.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await examService.getMyAttempts(0, 50);
      setExamHistory(data.items || []);
      setPageInfo(data);
    } catch (err) {
      setError('Không thể tải lịch sử thi. Vui lòng thử lại.');
      console.error('Failed to load exam history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container px-4 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <BarChart3 className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">Lịch sử thi</h1>
        </div>

        {error && !loading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 mb-6">
            {error}
            <Button variant="outline" size="sm" className="mt-2 ml-2" onClick={loadExamHistory}>
              Thử lại
            </Button>
          </div>
        )}

        {/* Profile & Tabs Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-border flex items-center justify-center">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-foreground">{user?.userName || 'Người dùng'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
              </div>
            </div>
            <div className="flex gap-8 border-b border-border">
              <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                Khoá học
              </button>
              <button className="pb-3 text-foreground border-b-2 border-primary font-medium text-sm">
                Kết quả luyện thi
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Button */}
        <Button variant="outline" size="lg" className="w-full mb-6 gap-2">
          <BarChart3 className="h-5 w-5" />
          Tới trang thống kê kết quả luyện thi
        </Button>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        )}

        {/* Exam History List */}
        {!loading && !error && (
          <div className="space-y-6">
            {examHistory.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Kết quả luyện thi
                    {pageInfo?.total != null && (
                      <span className="ml-2 text-xs text-muted-foreground">({pageInfo.total})</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {examHistory.map((exam) => (
                      <li
                        key={exam.id}
                        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-foreground mb-2">
                            {exam.quiz?.title || exam.title || 'Quiz'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Ngày làm</p>
                              <p className="text-foreground">{exam.date}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {(exam.badges || []).map((badge, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className={exam.badgeColors?.[idx] ? `${exam.badgeColors[idx]} text-white border-0` : ''}
                                  >
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Kết quả</p>
                              <p className="text-foreground">
                                {exam.score}
                                {exam.points != null && ` (Điểm: ${exam.points})`}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Thời gian</p>
                              <p className="text-foreground">{formatDuration(exam.duration)}</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="link"
                          className="text-primary p-0 shrink-0"
                          onClick={() => navigate(`/history/${exam.quizInstanceId ?? exam.id}`)}
                        >
                          Xem chi tiết
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  Bạn chưa có lịch sử thi nào
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamHistory;
