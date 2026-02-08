import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, User } from 'lucide-react';
import { examService } from '@/services';
import { ExamAttempt } from '@/domains';

const ExamHistory = () => {
  const [examHistory, setExamHistory] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - Replace with actual user from auth context
  const currentUserId = 'user1';

  useEffect(() => {
    loadExamHistory();
  }, []);

  const loadExamHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await examService.getExamHistory(currentUserId);
      setExamHistory(data);
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
                <h2 className="text-lg font-semibold text-foreground">thichcakhia20</h2>
                <p className="text-sm text-muted-foreground">Trang công khai</p>
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
                  <CardTitle className="text-base font-medium">Kết quả luyện thi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {examHistory.map((exam) => (
                      <li
                        key={exam.id}
                        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-foreground mb-2">
                            {exam.title || 'Quiz'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Ngày làm</p>
                              <p className="text-foreground">{exam.date}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {exam.badges.map((badge, idx) => (
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
                              <p className="text-foreground">{exam.duration}</p>
                            </div>
                          </div>
                        </div>
                        <Button variant="link" className="text-primary p-0 shrink-0">
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
