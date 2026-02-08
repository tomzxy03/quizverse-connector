You are a senior product designer & frontend engineer.

Upgrade the Quiz Detail page for an online learning & exam platform (similar to Study4 / Quizizz / NineQuiz).

Context:
- Platform name: Quizory
- Purpose: Practice quizzes, exams, and group-based learning
- Users may attempt a quiz multiple times
- Backend uses quiz instance & attempt model
- Quiz supports shuffle questions/answers, time limit, max attempts

Requirements:

1. Add a clear JOIN QUIZ flow
- Separate "Join quiz" from "Start quiz"
- Join action validates access and creates a quiz instance
- States:
  - Not joined → Show "Join quiz"
  - Joined but not started → Show "Start quiz"
  - In progress → Show "Continue"
  - Submitted + remaining attempts → Show "Retry"
  - No attempts left → Disabled state

2. Improve quiz status visibility
- Display quiz access type:
  - Public quiz
  - Group-restricted quiz (show group name)
- Display quiz availability:
  - Upcoming (with open time)
  - Active
  - Closed (with close time)

3. Enhance information hierarchy
- Left column:
  - Quiz title, difficulty, subject
  - Description
  - Quiz overview (questions, time, max score, attempts)
  - Quiz rules & experience notes (auto submit, resume allowed, etc.)

- Right column (sticky action panel):
  - Current user status (Not joined / In progress / Submitted)
  - Remaining attempts
  - Last attempts summary (score, date, pass/fail)
  - Primary CTA button (Join / Start / Continue / Retry)

4. Add learning-focused UX improvements
- Highlight best attempt score
- Show passing score requirement if exists
- Friendly warning before starting:
  "Time will start immediately after you begin"

5. UI / UX style
- Clean, modern, education-focused
- Clear call-to-action buttons
- Use icons for status clarity
- Avoid clutter, prioritize decision-making for the learner

6. Technical constraints
- React + TypeScript
- Tailwind CSS
- Existing structure should be reusable
- No backend logic required, UI only

Output:
- Updated page layout structure
- CTA logic explanation
- Suggested UI sections
- Optional microcopy for better UX
