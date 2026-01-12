// Quiz Repository - Mock implementation
// This will be replaced with actual API calls to Spring Boot backend

import { Quiz, QuizDetail, QuizFilter, CreateQuizRequest, UpdateQuizRequest } from '@/types';

export class QuizRepository {
  private mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: '2024 Practice Set TOEIC – Test 5',
      description: 'Luyện đề TOEIC đầy đủ kỹ năng',
      subject: 'Tiếng Anh',
      questionCount: 200,
      estimatedTime: 120,
      isPublic: true,
      difficulty: 'hard',
      attemptCount: 5
    },
    {
      id: '2',
      title: 'Đại số cơ bản',
      description: 'Ôn tập các khái niệm đại số và phương trình cơ bản.',
      subject: 'Toán',
      questionCount: 15,
      estimatedTime: 20,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Định luật Newton',
      description: 'Khám phá các nguyên lý cơ học cổ điển.',
      subject: 'Vật lý',
      questionCount: 10,
      estimatedTime: 15,
      isPublic: true,
      difficulty: 'medium',
      attemptCount: 67
    },
    {
      id: '4',
      title: 'Sinh học tế bào',
      description: 'Kiểm tra hiểu biết về cấu trúc và chức năng tế bào.',
      subject: 'Sinh học',
      questionCount: 20,
      estimatedTime: 25,
      isPublic: true,
      difficulty: 'hard',
      attemptCount: 92
    },
    {
      id: '5',
      title: 'Thế chiến thứ II',
      description: 'Các sự kiện và nhân vật quan trọng trong WWII.',
      subject: 'Lịch sử',
      questionCount: 25,
      estimatedTime: 30,
      isPublic: true,
      difficulty: 'medium',
      attemptCount: 76
    },
    {
      id: '6',
      title: 'Bảng tuần hoàn các nguyên tố',
      description: 'Bạn biết gì về bảng tuần hoàn?',
      subject: 'Hóa học',
      questionCount: 18,
      estimatedTime: 22,
      isPublic: true,
      difficulty: 'hard',
      attemptCount: 54
    },
    {
      id: '7',
      title: 'Java Cơ Bản - Biến và Kiểu Dữ Liệu',
      description: 'Tìm hiểu về các loại biến và kiểu dữ liệu trong Java.',
      estimatedTime: 10,
      subject: 'Lập trình',
      questionCount: 15,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '8',
      title: 'Luật Dân Sự - Giao Dịch Dân Sự Cơ Bản',
      description: 'Tìm hiểu về các quy định pháp luật liên quan đến giao dịch dân sự.',
      estimatedTime: 12,
      subject: 'Pháp luật',
      questionCount: 12,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '9',
      title: 'Cấu Trúc Dữ Liệu - Cây và Đồ Thị',
      description: 'Tìm hiểu về các cấu trúc dữ liệu cây và đồ thị trong lập trình.',
      estimatedTime: 15,
      subject: 'Lập trình',
      questionCount: 25,
      isPublic: true,
      difficulty: 'hard'
    },
    {
      id: '10',
      title: 'Giải Phẫu Người - Hệ Tuần Hoàn',
      description: 'Tìm hiểu về hệ tuần hoàn trong cơ thể người.',
      estimatedTime: 12,
      subject: 'Y khoa',
      questionCount: 18,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '11',
      title: 'Marketing Cơ Bản - 4P và Chiến Lược',
      description: 'Tìm hiểu về mô hình 4P và các chiến lược marketing cơ bản.',
      estimatedTime: 7,
      subject: 'Quản trị',
      questionCount: 10,
      isPublic: true,
      difficulty: 'easy'
    },
    {
      id: '12',
      title: 'Spring Boot - REST API và Database',
      description: 'Tìm hiểu về cách xây dựng REST API với Spring Boot và kết nối cơ sở dữ liệu.',
      estimatedTime: 20,
      subject: 'Lập trình',
      questionCount: 22,
      isPublic: true,
      difficulty: 'hard'
    },
    {
      id: '13',
      title: 'Toán Cao Cấp - Vi Phân và Tích Phân',
      description: 'Tìm hiểu về vi phân và tích phân trong toán học.',
      estimatedTime: 25,
      subject: 'Khoa học',
      questionCount: 16,
      isPublic: true,
      difficulty: 'medium'
    },
    {
      id: '14',
      title: 'Tiếng Anh TOEIC - Reading Comprehension',
      description: 'Tìm hiểu về kỹ năng đọc hiểu trong bài thi TOEIC.',
      estimatedTime: 30,
      subject: 'Ngoại ngữ',
      questionCount: 20,
      isPublic: true,
      difficulty: 'hard',
      attemptCount: 145
    }
  ];

  async getAll(filter?: QuizFilter): Promise<Quiz[]> {
    let result = [...this.mockQuizzes];

    if (filter) {
      if (filter.subject && filter.subject !== 'All') {
        result = result.filter(q => q.subject === filter.subject);
      }
      if (filter.difficulty) {
        result = result.filter(q => q.difficulty === filter.difficulty);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(q =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description?.toLowerCase().includes(searchLower)
        );
      }
      if (filter.minQuestions !== undefined) {
        result = result.filter(q => q.questionCount >= filter.minQuestions!);
      }
      if (filter.maxQuestions !== undefined) {
        result = result.filter(q => q.questionCount <= filter.maxQuestions!);
      }
      if (filter.minDuration !== undefined) {
        result = result.filter(q => q.estimatedTime >= filter.minDuration!);
      }
      if (filter.maxDuration !== undefined) {
        result = result.filter(q => q.estimatedTime <= filter.maxDuration!);
      }
      if (filter.isPublic !== undefined) {
        result = result.filter(q => q.isPublic === filter.isPublic);
      }
    }

    return Promise.resolve(result);
  }

  async getById(id: string): Promise<QuizDetail | null> {
    const quiz = this.mockQuizzes.find(q => q.id === id);
    if (!quiz) return null;

    // Mock quiz detail with questions
    return Promise.resolve({
      ...quiz,
      questions: [],
      settings: {
        randomizeQuestions: false,
        randomizeOptions: false,
        showCorrectAnswers: true,
        pointsPerQuestion: 10
      }
    });
  }

  async getBySubject(subject: string): Promise<Quiz[]> {
    const result = this.mockQuizzes.filter(q => q.subject === subject);
    return Promise.resolve(result);
  }

  async getPopular(limit: number = 10): Promise<Quiz[]> {
    const result = this.mockQuizzes
      .filter(q => q.attemptCount !== undefined)
      .sort((a, b) => (b.attemptCount || 0) - (a.attemptCount || 0))
      .slice(0, limit);
    return Promise.resolve(result);
  }

  async getLatest(limit: number = 10): Promise<Quiz[]> {
    const result = this.mockQuizzes.slice(0, limit);
    return Promise.resolve(result);
  }

  async create(data: CreateQuizRequest): Promise<Quiz> {
    const newQuiz: Quiz = {
      id: String(this.mockQuizzes.length + 1),
      ...data,
      questionCount: data.questions.length,
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockQuizzes.push(newQuiz);
    return Promise.resolve(newQuiz);
  }

  async update(id: string, data: UpdateQuizRequest): Promise<Quiz | null> {
    const index = this.mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) return null;

    this.mockQuizzes[index] = {
      ...this.mockQuizzes[index],
      ...data,
      updatedAt: new Date()
    };
    return Promise.resolve(this.mockQuizzes[index]);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) return false;

    this.mockQuizzes.splice(index, 1);
    return Promise.resolve(true);
  }

  async getSubjects(): Promise<string[]> {
    const subjects = new Set(this.mockQuizzes.map(q => q.subject));
    return Promise.resolve(Array.from(subjects));
  }
}

export const quizRepository = new QuizRepository();
