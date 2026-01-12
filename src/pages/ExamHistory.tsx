import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, User } from 'lucide-react';
import { examService } from '@/services';
import { ExamAttempt } from '@/types';

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

      <main className="flex-1 container px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-300 via-purple-400 to-orange-300"></div>
          <div className="px-6 pb-6">
            <div className="flex items-center -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-900 border-4 border-white flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">thichcakhia20</h1>
                <p className="text-sm text-muted-foreground">Trang công khai</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-border">
          <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">
            Khoá học
          </button>
          <button className="pb-3 text-foreground border-b-2 border-primary font-medium">
            Kết quả luyện thi
          </button>
        </div>

        {/* Statistics Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full mb-6 gap-2"
        >
          <BarChart3 className="h-5 w-5" />
          Tới trang thống kê kết quả luyện thi
        </Button>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadExamHistory}>
              Thử lại
            </Button>
          </div>
        )}

        {/* Exam History List */}
        {!loading && !error && (
          <div className="space-y-6">
            {examHistory.length > 0 ? (
              examHistory.map((exam) => (
                <Card key={exam.id} className="p-6">
                  <h3 className="text-lg font-bold mb-4">{exam.title || 'Quiz'}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-semibold mb-1">Ngày làm</p>
                      <p className="text-sm text-muted-foreground">{exam.date}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {exam.badges.map((badge, idx) => (
                          <Badge
                            key={idx}
                            className={`${exam.badgeColors[idx]} text-white hover:${exam.badgeColors[idx]}`}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-1">Kết quả</p>
                      <p className="text-sm text-muted-foreground">
                        {exam.score}
                        {exam.points && ` (Điểm: ${exam.points})`}
                      </p>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold mb-1">Thời gian làm bài</p>
                        <p className="text-sm text-muted-foreground">{exam.duration}</p>
                      </div>
                      <Button variant="link" className="text-primary p-0">
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                Bạn chưa có lịch sử thi nào
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamHistory;
