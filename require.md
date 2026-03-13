You are a senior frontend architect.
Your task is to design the **client-side requirements for a Quiz System** implemented with Angular.

## Backend Architecture

The backend is implemented using:

* Spring Boot
* PostgreSQL
* Redis (temporary answer storage)

The system supports **quiz attempts with snapshots**.

### Important backend behaviors

1. When a user starts a quiz, the server creates a **QuizInstance** and stores a **snapshot of questions** in JSONB.
2. User answers are **temporarily stored in Redis**.
3. When the user submits the quiz, the backend:

   * loads the snapshot
   * loads answers from Redis
   * calculates the score
   * saves results into PostgreSQL

### Key APIs

Start quiz

POST /api/quizzes/{quizId}/start

Response:

* quizInstanceId
* snapshot (questions + answers)
* timeLimit
* startTime

Check active quiz instance

GET /api/quizzes/{quizId}/active-instance

Save answer

POST /api/quiz-instances/{instanceId}/answer

Payload:
{
questionId,
answerId,
clientTime
}

Submit quiz

POST /api/quiz-instances/{instanceId}/submit

---

## Your Task

Generate a **complete client requirement specification** for the Angular application.

The requirement must include:

1. User flow
2. Component architecture
3. State management strategy
4. API integration
5. Timer logic
6. Resume quiz logic
7. Answer storage on client
8. Autosave strategy
9. Error handling
10. UX features for quiz experience

---

## Expected Output Structure

The answer must include the following sections:

1. Quiz User Flow
2. Angular Component Structure
3. Client State Management
4. API Integration Layer
5. Answer Handling Logic
6. Timer System
7. Resume Quiz Mechanism
8. Submit Quiz Flow
9. Edge Cases
10. Recommended UX Enhancements

---

## Important Constraints

The client must support:

* quiz resume after refresh
* autosave answers
* timer expiration
* prevention of double submission
* network failure handling
* highlighting answered questions

---

## Technology Stack

Frontend:

* Angular
* RxJS
* TypeScript

The design should be **clean, scalable, and production-ready**.

Provide the solution as a **technical requirement document for frontend developers**.
