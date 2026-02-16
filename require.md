You are a senior product designer & system architect.

I am building an online quiz platform similar to Study4, with public quizzes, group-based quizzes, and a shared question bank.

Please redesign and refine the system with the following STRICT requirements:

1. QUESTION BANK
- Question Bank is GLOBAL, shared across the whole system.
- It must NOT appear inside any group page.
- Access location:
  - Either in the main header navigation
  - Or inside a profile dropdown menu.
- Question Bank structure:
  - Folder + Question model.
  - Folder must support actions: create, rename, move, delete.
  - Question supports edit, move, delete.
- Question Bank is used when creating quizzes (select questions from it).

2. GROUP LOGIC
- Group is a permission boundary.
- Only members of a group can:
  - View group quizzes
  - Access quiz detail pages
  - Participate in group quizzes
- Non-members:
  - Cannot access group quizzes even via direct URL.
- Joining a group requires confirmation:
  - User sends join request
  - Group owner/admin approves
- There is NO "confirm join" step for quizzes inside a group.

3. QUIZ TYPES
- Quiz has 3 visibility states:
  - PUBLIC
  - GROUP
  - DRAFT
- DRAFT quizzes are visible only to owner/admin and should be pinned to the top of quiz lists.

4. PUBLIC QUIZ (Study4-style behavior)
- Users can take public quizzes without logging in.
- Score is calculated for everyone.
- Result handling:
  - Guest users: score is NOT saved.
  - Logged-in users: score IS saved.

5. GROUP QUIZ
- Only accessible by group members.
- No guest access.
- Joining a quiz does NOT require confirmation.
- Participation depends only on:
  - Quiz availability
  - maxAttempts
  - time constraints (if any).

6. QUIZ DETAIL PAGE
- Must clearly show:
  - Quiz information
  - Rules & settings
  - User attempt history (if logged in)
  - Best score
- CTA buttons must be context-aware:
  - Join / Start / Continue / Retry
- CTA logic must differ correctly for:
  - Guest user
  - Logged-in non-member
  - Logged-in group member
  - Owner/admin

7. ROUTING & SECURITY
- Frontend routing must NOT rely solely on login checks.
- Backend must enforce:
  - Group membership validation
  - Quiz access permission
- Prevent URL guessing for group quizzes.

8. UI / UX REQUIREMENTS
- Group pages should use full-width layout (not constrained to 2/3 width).
- Avoid overcrowding small cards with too many actions.
- Use dropdown/context menus for edit/delete actions.
- Ensure consistency of action placement across all pages.

Deliver:
- Clear system structure
- Permission logic explanation
- UI layout suggestions
- Edge cases and trade-offs

Think like a real production system, not a demo.
