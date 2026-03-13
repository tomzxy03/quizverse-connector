# API Updates for AddQuiz Feature

## New Endpoints and Schemas

### 1. Create Complete Quiz with Questions and Config
**Endpoint:** `POST /api/quizzes/complete`

**Description:** Create a quiz with questions and configuration in a single request.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "subject": "string (required)",
  "estimatedTime": "number (minutes)",
  "isPublic": "boolean",
  "questions": [
    {
      "text": "string (required)",
      "type": "multiple_choice",
      "points": "number",
      "options": [
        {
          "text": "string (required)",
          "isCorrect": "boolean (required)"
        }
      ]
    }
  ],
  "settings": {
    "randomizeQuestions": "boolean",
    "randomizeOptions": "boolean",
    "showCorrectAnswers": "boolean",
    "maxAttempts": "number (minimum 1)",
    "timeLimit": "number (minutes)"
  }
}
```

**Response:** `201 Created`
```json
{
  "code": 201,
  "message": "Quiz created successfully with questions and configuration",
  "items": {
    "id": "number",
    "title": "string",
    "description": "string",
    "totalQuestion": "number",
    "quizConfig": {
      "shuffleQuestions": "boolean",
      "shuffleAnswers": "boolean",
      "showScoreImmediately": "boolean",
      "allowReview": "boolean",
      "maxAttempts": "number",
      "passingScore": "number"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data or missing required fields
- `409 Conflict`: Invalid subject ID or quiz configuration

---

### 2. Update Quiz Config
**Endpoint:** `PUT /api/quizzes/{quizId}/config`

**Description:** Update quiz configuration and settings separately from quiz metadata.

**Request Body:**
```json
{
  "shuffleQuestions": "boolean",
  "shuffleAnswers": "boolean",
  "showScoreImmediately": "boolean",
  "allowReview": "boolean",
  "maxAttempts": "number (minimum 1)",
  "passingScore": "number"
}
```

**Response:** `200 OK`
```json
{
  "code": 200,
  "message": "Quiz configuration updated successfully",
  "items": {
    "quizConfig": {
      "shuffleQuestions": "boolean",
      "shuffleAnswers": "boolean",
      "showScoreImmediately": "boolean",
      "allowReview": "boolean",
      "maxAttempts": "number",
      "passingScore": "number"
    }
  }
}
```

---

## Schema Updates

### CreateQuizCompleteRequest
```json
{
  "title": "string",
  "description": "string",
  "subject": "string",
  "estimatedTime": "number",
  "isPublic": "boolean",
  "questions": [
    {
      "text": "string",
      "type": "string (enum: multiple_choice)",
      "points": "number",
      "options": [
        {
          "text": "string",
          "isCorrect": "boolean"
        }
      ]
    }
  ],
  "settings": {
    "randomizeQuestions": "boolean",
    "randomizeOptions": "boolean",
    "showCorrectAnswers": "boolean",
    "maxAttempts": "number",
    "timeLimit": "number"
  }
}
```

### QuizConfigUpdateRequest
```json
{
  "shuffleQuestions": "boolean",
  "shuffleAnswers": "boolean",
  "showScoreImmediately": "boolean",
  "allowReview": "boolean",
  "maxAttempts": "number",
  "passingScore": "number"
}
```

---

## Implementation Notes

1. **For AddQuiz Create Flow:**
   - Call `POST /api/quizzes/complete` with full quiz data including questions and config
   - Backend will create quiz, add questions, and save configuration in one transaction
   - Returns created quiz with ID for navigation

2. **For AddQuiz Edit Flow:**
   - Call `GET /api/quizzes/{quizId}` to fetch existing quiz and config
   - Form pre-populates with existing data
   - On save:
     - Update quiz metadata: `PUT /api/quizzes/{quizId}` (existing endpoint)
     - Update configuration: `PUT /api/quizzes/{quizId}/config` (new endpoint)
     - Update questions separately as needed

3. **Subject ID Handling:**
   - Form currently uses subject as string (name)
   - Backend should accept subject name and map to ID
   - Alternative: Return subject list with IDs in GenenralInfo component

4. **Configuration Mapping:**
   - Frontend `randomizeQuestions` → Backend `shuffleQuestions`
   - Frontend `randomizeOptions` → Backend `shuffleAnswers`
   - Frontend `showCorrectAnswers` → Backend `showScoreImmediately`
   - Frontend `maxAttempts` → Backend `maxAttempts`
   - Frontend `reviewScore` → Backend `showScoreImmediately` (boolean toggle)

---

## Testing Checklist

- [ ] Create quiz with all questions and config
- [ ] Edit existing quiz (update metadata and config)
- [ ] Validate subject ID mapping
- [ ] Verify question ordering and points
- [ ] Check configuration is properly saved
- [ ] Test max attempts and timeout settings
- [ ] Verify quiz can be started after creation

