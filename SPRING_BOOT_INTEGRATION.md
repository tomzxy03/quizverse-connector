# Spring Boot Integration Guide

## Overview

This guide helps you integrate the QuizVerse Connector frontend with your Spring Boot backend.

## Quick Start

### 1. Set Up Environment Variables

Create `.env.local` in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

### 2. Spring Boot Expected Structure

Your Spring Boot application should have the following structure:

```
spring-boot-backend/
├── src/main/java/com/quizverse/
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── QuizController.java
│   │   ├── GroupController.java
│   │   ├── ExamController.java
│   │   └── UserController.java
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── dto/
```

## Required Spring Boot Endpoints

### Authentication Endpoints

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Return: { token, user, expiresIn }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
        // Return: { token, user, expiresIn }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Return: 204 No Content
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        // Return current authenticated user
    }
}
```

**Request/Response Models**:
```java
// LoginRequest.java
public class LoginRequest {
    private String email;
    private String password;
}

// SignUpRequest.java
public class SignUpRequest {
    private String email;
    private String password;
    private String username;
    private String fullName;
}

// AuthResponse.java
public class AuthResponse {
    private String token;
    private User user;
    private long expiresIn;
}
```

### Quiz Endpoints

```java
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isPublic
    ) {
        // Return filtered list of quizzes
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetail> getQuizById(@PathVariable String id) {
        // Return quiz with questions and settings
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Quiz>> getQuizzesBySubject(@PathVariable String subject) {
        // Return quizzes for a specific subject
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Quiz>> getPopularQuizzes(
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Return most attempted quizzes
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Quiz>> getLatestQuizzes(
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Return recently created quizzes
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getAllSubjects() {
        // Return list of all unique subjects
    }

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody CreateQuizRequest request) {
        // Create new quiz with questions
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(
            @PathVariable String id,
            @RequestBody UpdateQuizRequest request
    ) {
        // Update existing quiz
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        // Delete quiz (204 No Content)
    }
}
```

**Entity Models**:
```java
// Quiz.java
@Entity
public class Quiz {
    @Id
    private String id;
    private String title;
    private String description;
    private String subject;
    private Integer questionCount;
    private Integer estimatedTime;
    private String difficulty; // "easy", "medium", "hard"
    private Boolean isPublic;
    private Integer attemptCount;
    private String creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "quiz")
    private List<Question> questions;
}

// Question.java
@Entity
public class Question {
    @Id
    private String id;

    @ManyToOne
    private Quiz quiz;

    private String text;
    private String type; // "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"
    private Integer points;
    private Integer orderIndex;
    private String explanation;

    @OneToMany(mappedBy = "question")
    private List<QuestionOption> options;
}

// QuestionOption.java
@Entity
public class QuestionOption {
    @Id
    private String id;

    @ManyToOne
    private Question question;

    private String text;
    private Boolean isCorrect;
    private Integer orderIndex;
}
```

### Group Endpoints

```java
@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        // Return groups for current user
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDetail> getGroupById(@PathVariable String id) {
        // Return group with members, quizzes, announcements
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody CreateGroupRequest request) {
        // Create new group
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable String id,
            @RequestBody UpdateGroupRequest request
    ) {
        // Update group details
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id) {
        // Delete group (204 No Content)
    }

    // Member endpoints
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMember>> getMembers(@PathVariable String groupId) {
        // Return group members
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupMember> addMember(
            @PathVariable String groupId,
            @RequestBody AddMemberRequest request
    ) {
        // Add member to group
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable String groupId,
            @PathVariable String userId
    ) {
        // Remove member (204 No Content)
    }

    // Announcement endpoints
    @GetMapping("/{groupId}/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements(@PathVariable String groupId) {
        // Return announcements (sorted by pinned, then date)
    }

    @PostMapping("/{groupId}/announcements")
    public ResponseEntity<Announcement> createAnnouncement(
            @PathVariable String groupId,
            @RequestBody CreateAnnouncementRequest request
    ) {
        // Create announcement
    }
}
```

### Exam Attempt Endpoints

```java
@RestController
@RequestMapping("/api/attempts")
public class ExamController {

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamAttempt>> getUserAttempts(@PathVariable String userId) {
        // Return exam history for user
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamAttemptDetail> getAttemptById(@PathVariable String id) {
        // Return attempt with answers
    }

    @PostMapping
    public ResponseEntity<ExamAttempt> createAttempt(
            @RequestBody CreateExamAttemptRequest request
    ) {
        // Submit quiz attempt with answers
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttempt(@PathVariable String id) {
        // Delete attempt (204 No Content)
    }

    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<UserStatistics> getUserStatistics(@PathVariable String userId) {
        // Return aggregated statistics
    }
}
```

## CORS Configuration

Enable CORS in your Spring Boot application:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## JWT Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                .requestMatchers("/api/**").authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

## Response Format Options

The frontend API client supports two response formats:

### Option 1: Wrapped Response (Recommended)

```java
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private ApiError error;
    private LocalDateTime timestamp;
}

@GetMapping("/{id}")
public ResponseEntity<ApiResponse<Quiz>> getQuiz(@PathVariable String id) {
    Quiz quiz = quizService.findById(id);
    return ResponseEntity.ok(ApiResponse.success(quiz));
}
```

### Option 2: Direct Response

```java
@GetMapping("/{id}")
public ResponseEntity<Quiz> getQuiz(@PathVariable String id) {
    Quiz quiz = quizService.findById(id);
    return ResponseEntity.ok(quiz);
}
```

Both formats are supported by the frontend.

## Error Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        ApiError error = new ApiError("NOT_FOUND", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(ValidationException ex) {
        ApiError error = new ApiError("VALIDATION_ERROR", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(error));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        ApiError error = new ApiError("UNAUTHORIZED", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(error));
    }
}
```

## Migration Steps

### Step 1: Start with Mock Data (Current)

The frontend is currently using mock data in repositories. All features work without a backend.

### Step 2: Implement Spring Boot Backend

Implement the controllers and endpoints listed above.

### Step 3: Update Frontend Repositories

Replace mock implementations with API calls:

```typescript
// Before (Mock)
async getAll(filter?: QuizFilter): Promise<Quiz[]> {
  return this.mockQuizzes.filter(/* ... */);
}

// After (API)
async getAll(filter?: QuizFilter): Promise<Quiz[]> {
  return await apiClient.get<Quiz[]>(
    API_ENDPOINTS.QUIZZES.BASE,
    filter
  );
}
```

### Step 4: Test Integration

```bash
# Start Spring Boot backend
cd spring-boot-backend
./mvnw spring-boot:run

# Start frontend
cd quizverse-connector
npm run dev
```

### Step 5: Handle Authentication

```typescript
// Login flow
const response = await userService.login({ email, password });
// Token is automatically stored in apiClient
// All subsequent requests include: Authorization: Bearer <token>
```

## Testing Endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get quizzes
curl -X GET http://localhost:8080/api/quizzes \
  -H "Authorization: Bearer <token>"

# Create quiz
curl -X POST http://localhost:8080/api/quizzes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @quiz-data.json
```

### Using Postman

1. Import collection from `/docs/postman-collection.json` (create this)
2. Set environment variable: `API_BASE_URL=http://localhost:8080/api`
3. Test each endpoint

## Database Schema

Recommended PostgreSQL schema:

```sql
-- Users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes
CREATE TABLE quizzes (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject VARCHAR(50) NOT NULL,
    question_count INTEGER NOT NULL,
    estimated_time INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    is_public BOOLEAN DEFAULT TRUE,
    attempt_count INTEGER DEFAULT 0,
    creator_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions
CREATE TABLE questions (
    id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) REFERENCES quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    points INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question Options
CREATE TABLE question_options (
    id VARCHAR(36) PRIMARY KEY,
    question_id VARCHAR(36) REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL
);

-- Groups
CREATE TABLE groups (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Members
CREATE TABLE group_members (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36) REFERENCES groups(id) ON DELETE CASCADE,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Exam Attempts
CREATE TABLE exam_attempts (
    id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) REFERENCES quizzes(id),
    user_id VARCHAR(36) REFERENCES users(id),
    score VARCHAR(20) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    points INTEGER,
    duration VARCHAR(20) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Answers
CREATE TABLE user_answers (
    id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(36) REFERENCES questions(id),
    selected_option_ids TEXT[],
    answer_text TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER
);

-- Announcements
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36) REFERENCES groups(id) ON DELETE CASCADE,
    author_id VARCHAR(36) REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Common Issues & Solutions

### Issue: CORS Errors

**Solution**: Enable CORS in Spring Boot (see CORS Configuration above)

### Issue: 401 Unauthorized

**Solution**: Check JWT token is being sent in Authorization header

### Issue: Type Mismatches

**Solution**: Ensure Spring Boot entities match TypeScript interfaces

### Issue: API Not Responding

**Solution**:
1. Check Spring Boot is running
2. Check `VITE_API_BASE_URL` is correct
3. Check network tab in browser DevTools

## Next Steps

1. ✅ Frontend architecture is ready
2. ⏳ Implement Spring Boot backend following this guide
3. ⏳ Update repositories to use API client
4. ⏳ Test integration
5. ⏳ Deploy to production

## Support

For questions or issues:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for frontend details
- Review TypeScript types in `src/types/`
- Review API endpoints in `src/api/endpoints.ts`
