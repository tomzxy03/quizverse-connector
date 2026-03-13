import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizSlider from '@/components/shared/HomeSlider';
import CategoryNavigation from '@/components/shared/CategoryNavigation';
import type { QuizResDTO } from '@/domains';
import { quizService } from '@/services';

const HomePage = () => {
  const [latestQuizzes, setLatestQuizzes] = useState<QuizResDTO[]>([]);
  const [popularQuizzes, setPopularQuizzes] = useState<QuizResDTO[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizService.getAllQuizzes(0, 10);
        setLatestQuizzes(response.items);
        setPopularQuizzes(response.items);
      } catch (err) {
        console.error('Failed to load quizzes directly on Home:', err);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Compact */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Nền tảng Quiz học thuật
              </h1>
              <p className="text-lg text-indigo-100 mb-6">
                Luyện tập, ôn thi và nâng cao kiến thức với hàng nghìn quiz chất lượng
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/library"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-white text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Khám phá quiz
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">1,200+</div>
                <div className="text-sm text-slate-600">Quiz công khai</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">15,000+</div>
                <div className="text-sm text-slate-600">Sinh viên</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">10+ môn</div>
                <div className="text-sm text-slate-600">Ngành học</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">Miễn phí</div>
                <div className="text-sm text-slate-600">100%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Quizzes Slider */}
        <section className="container mx-auto px-4 py-12">
          <QuizSlider
            quizzes={latestQuizzes}
            title="Quiz mới nhất"
            slidesPerView={{
              mobile: 1,
              tablet: 2,
              desktop: 4
            }}
          />
        </section>

        {/* Category Navigation */}
        <CategoryNavigation
          title="Khám phá theo môn học"
          showCount={true}
        />

        {/* Popular Quizzes Slider */}
        <section className="container mx-auto px-4 py-12">
          <QuizSlider
            quizzes={popularQuizzes}
            title="Quiz phổ biến"
            slidesPerView={{
              mobile: 1,
              tablet: 2,
              desktop: 4
            }}
          />
        </section>

        {/* Features Section - Clean & Academic */}
        <section className="bg-white border-y py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Tại sao chọn Quizory?
              </h2>
              <p className="text-slate-600">
                Nền tảng học tập được thiết kế dành riêng cho sinh viên
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Không cần đăng nhập</h3>
                <p className="text-slate-600 text-sm">
                  Làm quiz public ngay lập tức mà không cần tạo tài khoản
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Theo dõi tiến độ</h3>
                <p className="text-slate-600 text-sm">
                  Đăng ký để lưu lịch sử và xem chi tiết kết quả học tập
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Học nhóm</h3>
                <p className="text-slate-600 text-sm">
                  Tham gia lớp học và làm quiz chung với bạn bè, giảng viên
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Sẵn sàng nâng cao kiến thức?
            </h2>
            <p className="text-indigo-100 mb-6 text-lg">
              Tham gia cùng hàng nghìn sinh viên đang học tập trên Quizory
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium bg-white text-indigo-600 hover:bg-indigo-50 transition-colors text-lg"
            >
              Đăng ký miễn phí ngay
            </Link>
            <p className="text-sm text-indigo-200 mt-4">
              Hoàn toàn miễn phí • Không cần thẻ tín dụng
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;