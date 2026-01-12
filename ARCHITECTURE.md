# QuizVerse Connector - Architecture Documentation

## Overview

This document describes the frontend architecture of QuizVerse Connector, including the layer separation pattern (Types → Repositories → Services → Components) that prepares the application for Spring Boot backend integration.

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Components (UI Layer)              │
│  Pages, Components - User Interface Logic       │
└─────────────┬───────────────────────────────────┘
              │ uses
┌─────────────▼───────────────────────────────────┐
│           Services (Business Logic)             │
│  Validation, Data Transformation, Rules         │
└─────────────┬───────────────────────────────────┘
              │ uses
┌─────────────▼───────────────────────────────────┐
│         Repositories (Data Access)              │
│  Data Fetching, Caching, API Calls              │
└─────────────┬───────────────────────────────────┘
              │ uses
┌─────────────▼───────────────────────────────────┐
│           API Client (HTTP Layer)               │
│  REST API Communication with Spring Boot        │
└─────────────┬───────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────┐
│          Spring Boot Backend (API)              │
│  Controllers, Services, Entities, Database      │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── types/                    # TypeScript interfaces and types
│   ├── common.ts            # Shared types (Difficulty, PageResponse, etc.)
│   ├── user.types.ts        # User and authentication types
│   ├── quiz.types.ts        # Quiz and question types
│   ├── group.types.ts       # Group collaboration types
│   ├── exam.types.ts        # Exam attempt and statistics types
│   └── index.ts             # Central export
│
├── repositories/             # Data access layer (mock → API)
│   ├── quiz.repository.ts   # Quiz data operations
│   ├── exam.repository.ts   # Exam attempt operations
│   ├── group.repository.ts  # Group operations
│   ├── user.repository.ts   # User operations
│   └── index.ts             # Central export
│
├── services/                 # Business logic layer
│   ├── quiz.service.ts      # Quiz business logic
│   ├── exam.service.ts      # Exam business logic
│   ├── group.service.ts     # Group business logic
│   ├── user.service.ts      # User business logic
│   └── index.ts             # Central export
│
├── api/                      # HTTP client layer
│   ├── client.ts            # API client class (fetch wrapper)
│   ├── endpoints.ts         # API endpoint constants
│   └── index.ts             # Central export
│
├── components/               # Reusable UI components
├── pages/                    # Route pages
└── hooks/                    # Custom React hooks
```

## Layer Responsibilities

### 1. Types Layer (`src/types/`)

**Purpose**: Define TypeScript interfaces that match Spring Boot entities

**Files**:
- `common.ts` - Shared enums and utility types
- `user.types.ts` - User, UserProfile, LoginRequest, SignUpRequest
- `quiz.types.ts` - Quiz, Question, QuizSettings
- `group.types.ts` - Group, GroupMember, Announcement
- `exam.types.ts` - ExamAttempt, UserAnswer, Statistics

**Example**:
```typescript
// types/quiz.types.ts
export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  questionCount: number;
  estimatedTime: number;
  isPublic: boolean;
}
```

### 2. Repositories Layer (`src/repositories/`)

**Purpose**: Handle data fetching and API communication

**Current State**: Mock implementation with in-memory data
**Future State**: Will use API client to call Spring Boot endpoints

**Files**:
- `quiz.repository.ts` - CRUD operations for quizzes
- `exam.repository.ts` - Exam attempt management
- `group.repository.ts` - Group and member operations
- `user.repository.ts` - User authentication and profile

**Example**:
```typescript
// repositories/quiz.repository.ts
export class QuizRepository {
  async getAll(filter?: QuizFilter): Promise<Quiz[]> {
    // Currently: Return mock data
    // Future: return await apiClient.get('/quizzes', filter);
    return this.mockQuizzes;
  }
}
```

**Migration Path**:
```typescript
// Before (Mock)
async getAll(filter?: QuizFilter): Promise<Quiz[]> {
  return this.mockQuizzes.filter(/* ... */);
}

// After (API)
async getAll(filter?: QuizFilter): Promise<Quiz[]> {
  return await apiClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES.BASE, filter);
}
```

### 3. Services Layer (`src/services/`)

**Purpose**: Implement business logic and validation

**Files**:
- `quiz.service.ts` - Quiz creation validation, filtering
- `exam.service.ts` - Score calculation, statistics
- `group.service.ts` - Permission checking, member management
- `user.service.ts` - Login validation, profile updates

**Example**:
```typescript
// services/quiz.service.ts
export class QuizService {
  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    // Validation logic
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }

    if (data.questions.length === 0) {
      throw new Error('Quiz must have at least one question');
    }

    // Call repository
    return await quizRepository.create(data);
  }
}
```

**Responsibilities**:
- Input validation
- Business rule enforcement
- Data transformation
- Error handling
- Permission checking

### 4. API Client Layer (`src/api/`)

**Purpose**: HTTP communication with Spring Boot backend

**Files**:
- `client.ts` - ApiClient class with fetch wrapper
- `endpoints.ts` - API endpoint constants

**Features**:
- JWT token management
- Request/response interceptors
- Error handling
- File upload support

**Example**:
```typescript
// api/client.ts
export class ApiClient {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
}
```

**Endpoints** (matches Spring Boot controllers):
```typescript
// api/endpoints.ts
export const API_ENDPOINTS = {
  QUIZZES: {
    BASE: '/quizzes',
    BY_ID: (id: string) => `/quizzes/${id}`,
    POPULAR: '/quizzes/popular',
    // ...
  }
}
```

### 5. Components Layer (`src/components/`, `src/pages/`)

**Purpose**: UI rendering and user interaction

**Example**:
```typescript
// pages/QuizLibrary.tsx
const QuizLibrary = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      // Use service layer
      const data = await quizService.getAllQuizzes(filter);
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    }
  };

  return (
    <div>
      {quizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
    </div>
  );
};
```

## Spring Boot Integration

### Backend Expected Structure

```java
// Spring Boot Backend (Expected)
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes(
        @RequestParam(required = false) String subject,
        @RequestParam(required = false) String difficulty
    ) {
        // Implementation
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetail> getQuizById(@PathVariable String id) {
        // Implementation
    }

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody CreateQuizRequest request) {
        // Implementation
    }
}
```

### Entity Mapping

Frontend types should match Spring Boot entities:

```typescript
// Frontend: types/quiz.types.ts
interface Quiz {
  id: string;
  title: string;
  subject: string;
  // ...
}
```

```java
// Backend: entity/Quiz.java
@Entity
public class Quiz {
    @Id
    private String id;
    private String title;
    private String subject;
    // ...
}
```

### API Response Format

The API client supports two response formats:

**Format 1: Wrapped Response**
```json
{
  "success": true,
  "data": { /* quiz data */ },
  "message": "Quiz retrieved successfully",
  "timestamp": "2025-01-09T10:00:00Z"
}
```

**Format 2: Direct Response**
```json
{
  "id": "1",
  "title": "Quiz Title",
  "subject": "Math"
}
```

## Migration Guide

### Step 1: Keep Mock Data (Current State)

Repositories use in-memory mock data for development and testing.

### Step 2: Configure API Base URL

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3: Update Repositories One at a Time

```typescript
// repositories/quiz.repository.ts
import { apiClient, API_ENDPOINTS } from '@/api';

export class QuizRepository {
  // Before: Mock implementation
  // async getAll(filter?: QuizFilter): Promise<Quiz[]> {
  //   return this.mockQuizzes;
  // }

  // After: API implementation
  async getAll(filter?: QuizFilter): Promise<Quiz[]> {
    return await apiClient.get<Quiz[]>(
      API_ENDPOINTS.QUIZZES.BASE,
      filter
    );
  }
}
```

### Step 4: No Changes Needed in Services or Components

Services and components don't need to change - they only depend on the repository interface.

## Environment Configuration

### Development (Mock Data)

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

Repositories use mock data when API is unavailable.

### Production (Real API)

```
VITE_API_BASE_URL=https://api.quizverse.com/api
VITE_ENV=production
```

Repositories use real Spring Boot API.

## Error Handling

### Repository Layer
```typescript
// Repositories throw ApiError
async getById(id: string): Promise<Quiz | null> {
  try {
    return await apiClient.get(`/quizzes/${id}`);
  } catch (error) {
    // ApiError with code and message
    throw error;
  }
}
```

### Service Layer
```typescript
// Services add business logic errors
async getQuizById(id: string): Promise<QuizDetail | null> {
  const quiz = await quizRepository.getById(id);
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  return quiz;
}
```

### Component Layer
```typescript
// Components handle errors gracefully
const [error, setError] = useState<string | null>(null);

const loadQuizzes = async () => {
  try {
    const data = await quizService.getAllQuizzes();
    setQuizzes(data);
  } catch (err) {
    setError('Không thể tải quiz. Vui lòng thử lại.');
  }
};
```

## Authentication Flow

```typescript
// 1. User logs in
const response = await userService.login({ email, password });

// 2. Service calls repository
const authResponse = await userRepository.login(data);

// 3. Repository calls API
const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);

// 4. Store token in API client
apiClient.setToken(authResponse.token);

// 5. All subsequent requests include token
// Authorization: Bearer <token>
```

## Best Practices

### 1. Always Use Services in Components

❌ **Bad**: Component → Repository
```typescript
const quizzes = await quizRepository.getAll();
```

✅ **Good**: Component → Service → Repository
```typescript
const quizzes = await quizService.getAllQuizzes();
```

### 2. Validate in Services, Not Repositories

```typescript
// services/quiz.service.ts
async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
  // Validation here
  if (!data.title) throw new Error('Title required');

  return await quizRepository.create(data);
}
```

### 3. Use TypeScript Types

```typescript
// ✅ Type-safe
const quiz: Quiz = await quizService.getQuizById(id);

// ❌ Avoid any
const quiz: any = await quizService.getQuizById(id);
```

### 4. Handle Loading and Error States

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await service.getData();
    setData(data);
  } catch (err) {
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

## Testing Strategy

### Repository Tests
```typescript
// Mock API client
test('should fetch quizzes', async () => {
  const mockQuizzes = [{ id: '1', title: 'Test' }];
  apiClient.get = jest.fn().mockResolvedValue(mockQuizzes);

  const result = await quizRepository.getAll();
  expect(result).toEqual(mockQuizzes);
});
```

### Service Tests
```typescript
// Mock repository
test('should validate quiz creation', async () => {
  const invalidQuiz = { title: '', questions: [] };

  await expect(quizService.createQuiz(invalidQuiz))
    .rejects.toThrow('Quiz title is required');
});
```

### Component Tests
```typescript
// Mock service
test('should display quizzes', async () => {
  quizService.getAllQuizzes = jest.fn().mockResolvedValue(mockQuizzes);

  render(<QuizLibrary />);
  await waitFor(() => {
    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
  });
});
```

## Summary

- **Types**: Define data structure (matches Spring Boot entities)
- **Repositories**: Handle API calls (mock → real API)
- **Services**: Implement business logic and validation
- **API Client**: Manage HTTP communication
- **Components**: Render UI and handle user interaction

This architecture allows for:
- Easy migration from mock to real API
- Clear separation of concerns
- Type safety throughout the stack
- Testable code at each layer
- Scalability as the application grows
