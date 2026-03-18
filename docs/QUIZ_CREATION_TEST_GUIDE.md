# 🧪 Quiz Creation Bug - Quick Test Guide

## What Was the Bug?

You reported two issues:
1. ❌ Creating 1 question → validation says "no questions exist"
2. ❌ Creating 2+ questions → only first question saves to database

**Example:** Create quiz with Questions A, B, C → Only Question A saves ❌

---

## What Was Fixed?

The bug was a **state synchronization issue**:

- **QuestionsSection** manages questions in its own `internalSections` state
- **QuizForm** manages questions in its own `questions` state
- When you added a question, they weren't syncing properly
- Validation ran before state updated → validation failed
- Backend received incomplete data → missing questions

**Fix:** Properly synchronized state between components ✅

---

## How to Test - 5 Minute Walkthrough

### ✅ Test 1: Single Question (Previously Failed)

**Before Fix:** Got error "Cần ít nhất một câu hỏi"  
**After Fix:** Should work ✅

**Steps:**
1. Go to Quiz Creation page
2. Fill in:
   - **Title:** "Test Quiz 1"
   - **Description:** "Testing single question"
   - **Subject:** Pick any subject
   - **Time:** 30 minutes
3. Under "Cài đặt câu hỏi" section:
   - Add 1 question with text "What is 2+2?"
   - Add 4 options (only mark one as correct)
   - Click "Thêm câu hỏi"
4. Click "Đăng bài"

**Expected Results:**
- ✅ Form validates successfully (NO error message)
- ✅ Console shows: `questionsCount: 1`
- ✅ Quiz created in database
- ✅ Question visible in quiz detail

**If you see 🔴 RED X:**
- Check browser console (F12 → Console tab)
- Look for error messages
- Verify all required fields filled

---

### ✅ Test 2: Multiple Questions (Previously Lost)

**Before Fix:** Only first question saved  
**After Fix:** All questions saved ✅

**Steps:**
1. Go to Quiz Creation page
2. Fill in metadata (Title, Subject, etc.)
3. Add Question 1:
   - Text: "Question 1: What is a cat?"
   - Options: A) Animal, B) Food, C) Color, D) Number
   - Mark A as correct
   - Click "Thêm câu hỏi"
4. Add Question 2:
   - Text: "Question 2: What is 5+3?"
   - Options: A) 7, B) 8, C) 9, D) 10
   - Mark B as correct
   - Click "Thêm câu hỏi"
5. Add Question 3:
   - Text: "Question 3: What is the capital of France?"
   - Options: A) Paris, B) London, C) Berlin, D) Rome
   - Mark A as correct
   - Click "Thêm câu hỏi"
6. You should see all 3 questions listed
7. Click "Đăng bài"

**Expected Results:**
- ✅ All 3 questions visible in UI before saving
- ✅ Form validates successfully
- ✅ Console shows: `questionsCount: 3`
- ✅ In database: Find the quiz and verify it has 3 questions
- ✅ Edit the quiz → All 3 questions load

**How to Verify in Database:**
```sql
-- After creating quiz, run this query:
SELECT COUNT(*) FROM questions WHERE quiz_id = {your_quiz_id};
-- Should return: 3 (not 1 ❌)
```

---

### ✅ Test 3: Edit Existing Quiz

**Before Fix:** Might have issues with loading/saving edits  
**After Fix:** Should work smoothly ✅

**Steps:**
1. Edit a quiz you just created (with multiple questions)
2. Modify a question or add a new one
3. Click "Cập nhật bài"

**Expected Results:**
- ✅ All existing questions load
- ✅ Changes save correctly
- ✅ New questions added are included

---

## 🔍 Debug Using Console

### View Payload Before Sending

**Steps:**
1. Open DevTools: `F12` (or Right-click → Inspect)
2. Go to "Console" tab
3. Create a quiz with questions
4. Click "Đăng bài"
5. Look for 📦 message showing payload

**Example Good Output:**
```
📦 Payload: {
  title: "My Quiz",
  questionsCount: 3,
  questions: [
    {
      index: 0,
      text: "Question 1: What is 2+2?",
      optionsCount: 4,
      hasCorrectAnswer: true
    },
    {
      index: 1,
      text: "Question 2: What is 5+3?",
      optionsCount: 4,
      hasCorrectAnswer: true
    },
    {
      index: 2,
      text: "Question 3: What is the capital...",
      optionsCount: 4,
      hasCorrectAnswer: true
    }
  ]
}
```

**If you see problem:**
- `questionsCount: 1` but added 3? → Questions not in state
- `questionsCount: 3` but question missing? → Question not in payload
- `hasCorrectAnswer: false`? → Didn't mark correct answer

---

## Network Request Check

**Steps:**
1. Open DevTools: `F12`
2. Go to "Network" tab
3. Clear network history (button in Network tab)
4. Create quiz with 2 questions
5. Click "Đăng bài"
6. Look for request: `POST /api/quizzes/{id}/questions`

**Check Request Body:**
- Should show all questions you added
- Count should match
- Each question should have correct answers

---

## Common Issues & Fixes

### ❌ "Cần ít nhất một câu hỏi"

**Cause:** Question wasn't added to state properly

**Fix:**
1. Check browser console for errors
2. Make sure question has:
   - ✓ Content/text
   - ✓ At least 1 option
   - ✓ One option marked as correct
3. Try adding question again

### ❌ Only 1 Question Saves When Added 2+

**Cause:** State sync issue (FIXED by this PR)

**Action:**
1. Check console → 📦 Payload should show correct count
2. If Payload is wrong → Report new issue (new bug)
3. If Payload is correct but DB wrong → Backend issue

### ❌ Questions Disappear After Refresh

**Cause:** Quiz not created yet (still as draft)

**Fix:**
1. Make sure you clicked "Đăng bài" (not "Lưu nháp")
2. Wait for toast message "Đã tạo bài kiểm tra"
3. Check quiz library to verify creation

---

## Rollback If Needed

If you need to revert the changes:

```bash
# Revert specific files
git checkout HEAD -- src/pages/AddQuiz.tsx
git checkout HEAD -- src/components/quiz/QuizForm.tsx
git checkout HEAD -- src/components/quiz/QuizSections/QuestionsSection.tsx

# Or revert entire commit
git revert {commit-hash}
```

---

## Success Indicators ✅

### After Fix, You Should See:

1. **Single Question Quiz:**
   - ✅ No validation errors
   - ✅ Question appears in quiz
   - ✅ Can edit/delete question

2. **Multiple Questions:**
   - ✅ All questions listed in UI
   - ✅ All questions save to database
   - ✅ Editing loads all questions
   - ✅ Can add more questions when editing

3. **Console Output:**
   - ✅ 📦 Payload shows correct `questionsCount`
   - ✅ No JavaScript errors in console

4. **Database:**
   - ✅ `SELECT COUNT(*) FROM questions WHERE quiz_id=X` returns correct count
   - ✅ All question content present

---

## Need Help?

### If Test Failed:

1. **Check console for errors** → Report what you see
2. **Note the questionsCount** in 📦 Payload
3. **Check database directly** to see what was saved
4. **Create detailed report** with:
   - How many questions added
   - What console shows
   - What database has
   - Expected vs actual count

---

## Summary

| Test | Before | After |
|------|--------|-------|
| 1 question quiz | ❌ Validation fails | ✅ Works |
| 2+ questions quiz | ❌ Only 1 saves | ✅ All save |
| Edit quiz | ⚠️ Issues | ✅ Works |
| Multiple questions load | ❌ Missing some | ✅ All load |

---

**Status:** 🟢 All tests should pass with fix  
**Time to test:** ~5 minutes per scenario  
**Confidence:** High - Root cause identified and fixed

Happy testing! 🎉
