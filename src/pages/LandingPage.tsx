import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Library, 
  Clock, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle,
  Lightbulb,
  UserPlus,
  Play,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const problems = [
    {
      icon: AlertCircle,
      text: "Luyện quiz nhưng không biết mình yếu phần nào"
    },
    {
      icon: AlertCircle,
      text: "Làm bài xong là quên, không xem lại kết quả"
    },
    {
      icon: AlertCircle,
      text: "Học nhóm nhưng thiếu bài tập chung"
    },
    {
      icon: AlertCircle,
      text: "Không có lộ trình học rõ ràng"
    }
  ];

  const solutions = [
    {
      icon: Target,
      text: "Quiz có mức độ từ dễ đến khó"
    },
    {
      icon: Clock,
      text: "Có thời gian làm bài giống thi thật"
    },
    {
      icon: BarChart3,
      text: "Lưu lại lịch sử làm bài và điểm số"
    },
    {
      icon: Users,
      text: "Nhóm học có quiz chung và thông báo chung"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Luyện quiz có cấu trúc",
      description: "Câu hỏi rõ ràng, có giới hạn thời gian. Phù hợp tự học và ôn thi."
    },
    {
      icon: BarChart3,
      title: "Theo dõi kết quả học tập",
      description: "Xem lại các lần làm bài, so sánh điểm số theo thời gian. Dễ nhận ra phần cần cải thiện."
    },
    {
      icon: Users,
      title: "Học nhóm hiệu quả",
      description: "Chia sẻ quiz trong nhóm, thông báo hoạt động nhóm. Phù hợp học cùng lớp, cùng đội."
    },
    {
      icon: Library,
      title: "Thư viện quiz đa dạng",
      description: "Nhiều môn học, nhiều mức độ. Có quiz công khai và quiz theo nhóm."
    }
  ];

  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản miễn phí chỉ trong vài giây"
    },
    {
      number: 2,
      icon: Play,
      title: "Chọn quiz hoặc tham gia nhóm",
      description: "Tìm quiz phù hợp hoặc tham gia nhóm học của bạn"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Làm bài – Xem kết quả – Cải thiện",
      description: "Luyện tập đều đặn và theo dõi tiến bộ của bạn"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-quiz-lightBlue to-background py-16 md:py-24">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Luyện quiz hiệu quả – Học nhóm có định hướng
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                QuizVerse giúp bạn luyện đề, theo dõi kết quả và học cùng nhóm một cách rõ ràng, dễ hiểu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Bắt đầu học miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  to="/" 
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Library className="h-4 w-4" />
                  Xem thư viện quiz
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Vấn đề người học thường gặp
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Bạn có đang gặp những khó khăn này không?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problems.map((problem, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30"
                  >
                    <problem.icon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{problem.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-16 bg-quiz-lightBlue">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                  QuizVerse giải quyết như thế nào
                </h2>
              </div>
              <p className="text-muted-foreground text-center mb-10">
                Chúng tôi thiết kế QuizVerse để giải quyết những vấn đề trên
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solutions.map((solution, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-white dark:bg-card rounded-lg border border-green-100 dark:border-green-900/30 shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex items-center gap-2">
                      <solution.icon className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{solution.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Tính năng chính
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Những công cụ giúp bạn học tập hiệu quả hơn
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-card p-6 rounded-xl card-shadow text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 bg-quiz-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-7 w-7 text-quiz-darkBlue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-quiz-lightBlue">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Cách sử dụng
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Chỉ 3 bước đơn giản để bắt đầu
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="py-16 bg-background">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Giao diện QuizVerse
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Trải nghiệm giao diện thân thiện, dễ sử dụng
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Link to="/" className="group">
                <div className="bg-white dark:bg-card rounded-xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-quiz-lightBlue flex items-center justify-center">
                    <Library className="h-12 w-12 text-primary" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                      Thư viện quiz
                    </h3>
                  </div>
                </div>
              </Link>
              <Link to="/groups" className="group">
                <div className="bg-white dark:bg-card rounded-xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-quiz-lightBlue flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                      Nhóm học
                    </h3>
                  </div>
                </div>
              </Link>
              <Link to="/history" className="group">
                <div className="bg-white dark:bg-card rounded-xl overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-quiz-lightBlue flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-primary" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                      Lịch sử làm bài
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-t from-quiz-lightBlue to-background">
          <div className="container px-4">
            <div className="bg-white dark:bg-card p-8 md:p-12 rounded-2xl card-shadow max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sẵn sàng học hiệu quả hơn?
              </h2>
              <p className="text-muted-foreground mb-8">
                Tham gia cùng hàng nghìn người đang sử dụng QuizVerse để luyện quiz và học nhóm mỗi ngày.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Đăng ký miễn phí
                </Link>
                <Link 
                  to="/" 
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Bắt đầu luyện quiz
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-card border-t border-border">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-semibold text-primary">
                QuizVerse
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                © 2024 QuizVerse. Nền tảng luyện quiz trực tuyến.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Giới thiệu
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Liên hệ
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Bảo mật
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Điều khoản
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
