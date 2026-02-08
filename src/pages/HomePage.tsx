import { Link } from 'react-router-dom';
import { TrendingUp, Users, Clock, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizSlider from '@/components/shared/HomeSlider';
import CategoryNavigation from '@/components/shared/CategoryNavigation';
import { Quiz } from '@/domains';

const HomePage = () => {
  // Mock data - Replace with API call
  const latestQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Java Cơ Bản - Biến và Kiểu Dữ Liệu',
      description: 'Tìm hiểu về các loại biến và kiểu dữ liệu trong Java.',
      estimatedTime: 10,
      subject: 'Lập trình',
      questionCount: 15,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '1',
      title: 'Java Cơ Bản - Biến và Kiểu Dữ Liệu',
      description: 'Tìm hiểu về các loại biến và kiểu dữ liệu trong Java.',
      estimatedTime: 10,
      subject: 'Lập trình',
      questionCount: 15,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Luật Dân Sự - Giao Dịch Dân Sự Cơ Bản',
      description: 'Tìm hiểu về các quy định pháp luật liên quan đến giao dịch dân sự.',
      estimatedTime: 12,
      subject: 'Pháp luật',
      questionCount: 12,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '4',
      title: 'Cấu Trúc Dữ Liệu - Cây và Đồ Thị',
      description: 'Tìm hiểu về các cấu trúc dữ liệu cây và đồ thị trong lập trình.',
      estimatedTime: 15,
      subject: 'Lập trình',
      questionCount: 25,
      isPublic: true,
      difficulty: 'hard'
    },
    {
      id: '5',
      title: 'Giải Phẫu Người - Hệ Tuần Hoàn',
      description: 'Tìm hiểu về hệ tuần hoàn trong cơ thể người.',
      estimatedTime: 12,
      subject: 'Y khoa',
      questionCount: 18,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '6',
      title: 'Marketing Cơ Bản - 4P và Chiến Lược',
      description: 'Tìm hiểu về mô hình 4P và các chiến lược marketing cơ bản.',
      estimatedTime: 7,
      subject: 'Quản trị',
      questionCount: 10,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '7',
      title: 'Spring Boot - REST API và Database',
      description: 'Tìm hiểu về cách xây dựng REST API với Spring Boot và kết nối cơ sở dữ liệu.',
      estimatedTime: 20,
      subject: 'Lập trình',
      questionCount: 22,
      isPublic: true,
      difficulty: 'hard'
    },
    {
      id: '8',
      title: 'Toán Cao Cấp - Vi Phân và Tích Phân',
      description: 'Tìm hiểu về vi phân và tích phân trong toán học.',
      estimatedTime: 25,
      subject: 'Khoa học',
      questionCount: 16,
      isPublic: true,
      difficulty: 'medium'
    }
  ];

  const popularQuizzes: Quiz[] = [
    {
      id: '9',
      title: 'Tiếng Anh TOEIC - Reading Comprehension',
      description: 'Tìm hiểu về kỹ năng đọc hiểu trong bài thi TOEIC.',
      estimatedTime: 30,
      subject: 'Ngoại ngữ',
      questionCount: 30,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '10',
      title: 'React + TypeScript - Hooks và Components',
      description: 'Tìm hiểu về Hooks và Components trong React với TypeScript.',
      estimatedTime: 25,
      subject: 'Lập trình',
      questionCount: 20,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '11',
      title: 'Kinh Tế Vĩ Mô - GDP và Lạm Phát',
      description: 'Tìm hiểu về GDP và lạm phát trong kinh tế vĩ mô.',
      estimatedTime: 30,
      subject: 'Kinh tế',
      questionCount: 18,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '12',
      title: 'Hóa Học Hữu Cơ - Hydrocarbon',
      description: 'Tìm hiểu về Hydrocarbon trong hóa học hữu cơ.',
      estimatedTime: 28,
      subject: 'Khoa học',
      questionCount: 14,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '13',
      title: 'Quản Trị Chiến Lược - SWOT và BCG',
      subject: 'Quản trị',
      questionCount: 15,
      isPublic: true,
      difficulty: 'medium',
      estimatedTime: 18,
      description: 'Tìm hiểu về phân tích SWOT và ma trận BCG trong quản trị chiến lược.'
    }
  ];

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
                Tại sao chọn QuizVerse?
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
              Tham gia cùng hàng nghìn sinh viên đang học tập trên QuizVerse
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