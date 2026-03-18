# QuizVerse Examining Page - Design Implementation

## 📋 Overview

This document outlines the design and implementation of the Quiz Taking (Examining) Page based on the requirements in `require_examing.md`. The system handles real-time answer saving, offline support, countdown timers, and robust error handling.

## 🏗️ Architecture

### Core Components

#### 1. **QuizAttemptContext** (`src/contexts/QuizAttemptContext.tsx`)
Global state management for quiz-taking session using React Context.

**Key State:**
```typescript
{
  instanceId: number;
  answers: { [questionId]: value[] };
  syncStatus: { [questionId]: 'idle' | 'saving' | 'saved' | 'error' };
  remainingSeconds: number;
  retryQueue: { questionId, answers }[];
  isOnline: boolean;
  activeQuestionId: string;
  connectionUnstable: boolean;
}
```

**Features:**
- Auto-saves to localStorage
- Detects online/offline status
- Manages retry queue for failed saves
- Persists across page refreshes

#### 2. **useAutoSave Hook** (`src/hooks/useAutoSave.ts`)
Handles answer auto-saving with debounce and retry logic.

**Methods:**
- `saveImmediately()` - For radio/checkbox (instant save)
- `saveDebouncedAnswer()` - For text input (debounced 800ms)
- `retryFailedSaves()` - Retry queue flush on reconnect

**Features:**
- Auto-increments clientSeq to prevent race conditions
- Distinguishes between immediate and debounced saves
- Manages per-question debounce timers

#### 3. **useCountdown Hook** (`src/hooks/useCountdown.ts`)
Manages quiz countdown timer with server synchronization.

**Methods:**
- `startCountdown()` - Begin counting down
- `pauseCountdown()` - Pause without stopping
- `resumeCountdown()` - Resume from pause
- `syncWithServer()` - Sync timer with backend
- `formatTime()` - Format seconds to HH:MM:SS

**Features:**
- Server time is source of truth
- Auto-sync every 30-45 seconds
- Time warning levels: normal, warning (≤5m), critical (≤1m)
- Triggers auto-submit when time reaches 0

#### 4. **QuestionContent Component** (`src/components/quiz/QuestionContent.tsx`)
Displays individual question with appropriate input method.

**Question Types:**
- **Radio Buttons** - Single choice questions
- **Checkboxes** - Multiple choice questions  
- **Textarea** - Essay/short answer questions
- **Image Display** - Questions with image content

**Features:**
- Live sync status indicator (saving/saved/error)
- Real-time validation
- Automatic save trigger on change
- Question points and number display

#### 5. **QuestionGrid Component** (`src/components/quiz/QuestionGrid.tsx`)
Sidebar showing all questions with status indicators.

**Color Scheme:**
- **Gray** - Not answered yet
- **Blue** - Answered & saved
- **Yellow** - Currently saving
- **Red** - Save error
- **Green (highlight)** - Current question

**Features:**
- Click to navigate to any question
- Tooltips showing status details
- Visual feedback of answer state
- Quick question overview

#### 6. **SyncStatusIndicator Component** (`src/components/quiz/SyncStatusIndicator.tsx`)
Displays overall sync state and pending retry count.

**Statuses:**
- Saving - Operation in progress
- Saved - Latest state persisted
- Error - Failed to save
- Pending - X items awaiting sync

## 🔄 Answer Saving Flow

### 1.1 User Interaction

```
User clicks/types answer
         ↓
Update Local State (React Context)
         ↓
Check question type
         ├─ Multiple Choice → saveImmediately()
         └─ Text Input → saveDebouncedAnswer(800ms)
```

### 1.2 Immediate Save (Radio/Checkbox)

```
Click option
   ↓
setSyncStatus(questionId, 'saving')
   ↓
Call onSave API (POST /instances/{id}/answers)
   ├─ Success → setSyncStatus('saved')
   └─ Error → setSyncStatus('error') + addToRetryQueue()
```

### 1.3 Debounced Save (Text Input)

```
User typing (A)
   ├─ Clear prev timer
   └─ Set 800ms timer
      └─ Still typing (B) → Cancel & restart timer
         └─ Stop typing → Timer fires → Save
```

### 1.4 Offline & Retry

```
Network Error Detected
   ↓
setSyncStatus(questionId, 'error')
   ↓
addToRetryQueue(questionId, answers)
   ↓
Show warning: "Connection unstable. Latest answer may not be saved."
   ↓
[User reconnects] → window 'online' event
   ↓
Automatically flush retry queue
   ↓
Try saving each queued answer
```

## ⏱️ Timer Management

### 2.1 Initial Load

```
GET /instances/{id}/state
   ↓
Response: { remainingSeconds: 1800, questions: [...] }
   ↓
Set remainingSeconds in context
   ↓
startCountdown()
```

### 2.2 Countdown Loop

```
Every 1 second:
   remainingSeconds -= 1
   UI updates
   
Every 45 seconds:
   syncWithServer() → GET /instances/{id}/state
   ↓
   Adjust local timer if drift detected
   
When remainingSeconds === 0:
   onTimeUp() → Auto-submit quiz
```

### 2.3 Time Warning Levels

```
> 5 minutes  → Normal (blue)
1-5 minutes → Warning (amber) 
< 1 minute  → Critical (red) + bigger font
```

## 📱 Page Layout

```
┌─────────────────────────────────────────────┐
│ Top Bar: Title | Connection | Timer        │
├─────────────────────────────────────────────┤
│  Sidebar  │          Main Content            │
│  Questions│  Current Question Display        │
│  Grid     │  - Question text                 │
│           │  - Answer options                │
│ [1][2][3]│  - Sync indicator                │
│ [4][5][6]│  - Auto-save status              │
│ [7][8]   │                                   │
├─────────────────────────────────────────────┤
│ Bottom: Navigation | Sync Status | Submit   │
└─────────────────────────────────────────────┘
```

## 🔐 Data Persistence

### 3.1 LocalStorage Backup

```javascript
// Auto-saved every time answer changes
localStorage.setItem('quiz-instance-{instanceId}', JSON.stringify({
  answers: {
    "1": [2],
    "2": [1,3],
    "3": ["Lorem ipsum..."]
  },
  instanceId: 55,
  timestamp: "2026-03-16T10:30:00Z"
}));
```

### 3.2 Browser Crash Recovery

```
1. Page closes/crashes
2. User reopens quiz URL
3. Load localStorage data → Restore answers immediately
4. Fetch server state → Get remaining time & sync
5. Continue from where left off
```

## 🌐 Offline Handling

### 4.1 Detection

```javascript
window.addEventListener('online', () => {
  quizAttempt.setOnlineStatus(true);
  // Flush retry queue
});

window.addEventListener('offline', () => {
  quizAttempt.setOnlineStatus(false);
  // Mark as unstable
});
```

### 4.2 Retry Logic

```
Failed Save
   ↓
addToRetryQueue(questionId, answers)
   ↓
[Network Reconnected]
   ↓
forEach queued answer:
   Try POST /instances/{id}/answers
   ├─ Success → Remove from queue
   └─ Still error → Stay in queue
```

## 🛡️ Double Tab Protection

```javascript
const activeTabKey = `quiz-active-tab-${quizId}`;
const existingTab = sessionStorage.getItem(activeTabKey);

if (existingTab) {
  // Another tab is open - show warning
  setTabWarning(true);
} else {
  // Mark this tab as active
  sessionStorage.setItem(activeTabKey, instanceId);
}
```

## 📊 Submit Flow

### 5.1 Manual Submit

```
User clicks "Nộp bài"
   ↓
Show confirmation dialog
   ↓
Check retry queue (warn if items pending)
   ↓
Lock UI (disable all inputs)
   ↓
POST /instances/{id}/submit
   ├─ Success → Redirect to /quiz/{id}/result/{id}
   └─ Error → Show error message, unlock UI
```

### 5.2 Auto Submit

```
remainingSeconds === 0
   ↓
onTimeUp() triggered
   ↓
Auto-submit quiz (no confirmation)
   ↓
Navigate to results
```

### 5.3 Tab Close (Optional)

```
beforeunload event
   ↓
navigator.sendBeacon(
  '/api/instances/{id}/submit',
  JSON.stringify(answers)
)
```

## 🎨 UI/UX Features

### 6.1 Sync Status Indicators

| Component | State | Icon | Color |
|-----------|-------|------|-------|
| Question | Answered | ● | Blue |
| Question | Saving | ⏳ | Yellow |
| Question | Saved | ✓ | Green |
| Question | Error | ⚠ | Red |
| Bottom Bar | Saving | ⏳ | Amber |
| Bottom Bar | Saved | ✓ | Emerald |
| Bottom Bar | Error | ⚠ | Red |

### 6.2 Connection Status

```
Top Right Corner:
├─ Online ✓ (Wifi icon + "Online")
└─ Offline ✗ (Wifi Off icon + "Offline")

If unstable:
└─ ⚠️ "Kết nối không ổn định"
```

### 6.3 Multiple Tab Warning

```
Sticky banner at top:
┌────────────────────────────────┐
│⚠️ You opened quiz in another tab│
│   Use only this tab to prevent  │
│   data loss [Đóng]              │
└────────────────────────────────┘
```

## 📈 Performance Optimization

### 7.1 Request Rate

- **Per user:** ~1 request per 20-30 seconds (auto-save)
- **Concurrent:** 60-120 users → ~5-10 req/sec total
- **Backend:** Redis + Spring Boot handle easily

### 7.2 Debounce Strategy

```
Text Input (essay questions):
  debounce: 800ms
  Reduces text input from ~50 req/min → ~5-10 req/min

Multiple Choice:
  Immediate save (no debounce)
  Prevents accidental data loss
```

### 7.3 LocalStorage Usage

- Per instance: ~2-5 KB (depending on answers)
- Auto-cleared after quiz submission
- Typical quota: 5-10 MB per domain

## 🧪 Test Scenarios

### 8.1 Offline Scenario

1. Start quiz online
2. Save answers (verify "Đã lưu")
3. Toggle offline (DevTools)
4. Answer more questions
5. Verify sync status → "Đang lưu" → "Lỗi"
6. See warning: "Connection unstable"
7. Go back online
8. Verify queue auto-flushes

### 8.2 Tab Close Scenario

1. Start quiz
2. Save few answers
3. Close tab abruptly
4. Reopen quiz URL
5. Verify answers restored from localStorage
6. Verify remaining time updated from server

### 8.3 Time Warning Scenario

1. Start quiz with < 5 min remaining (in dev)
2. Timer shows warning level (amber)
3. When < 1 min (red)
4. When = 0 sec → Auto-submit

### 8.4 Multiple Tab Scenario

1. Open quiz in Tab A
2. Open same quiz in Tab B
3. Verify warning shown in both tabs
4. Modify answer in Tab A
5. Check Tab B (should show stale data warning)

## 📁 File Structure

```
src/
├── contexts/
│   ├── QuizAttemptContext.tsx       (State management)
│   └── index.ts                       (Export)
├── hooks/
│   ├── useAutoSave.ts                (Auto-save logic)
│   ├── useCountdown.ts               (Timer logic)
│   └── index.ts                       (Export)
├── components/quiz/
│   ├── QuestionContent.tsx           (Question display)
│   ├── QuestionGrid.tsx              (Sidebar grid)
│   ├── SyncStatusIndicator.tsx       (Sync status)
│   └── index.ts                       (Export)
└── pages/
    └── QuizTaking.tsx                (Main page)
```

## 🚀 Integration Steps

1. **Import QuizAttemptProvider** in app root or route layout
2. **Mount page** with route: `/quiz/:quizId/take/:instanceId`
3. **Connect APIs:**
   - `GET /instances/{id}/state` - Load quiz state
   - `POST /instances/{id}/answers` - Save answer
   - `POST /instances/{id}/submit` - Submit quiz
4. **Update domain types** in `src/domains/index.ts`
5. **Test all scenarios** (see section 8)

## 📝 API Contract

### Get Quiz State
```
GET /api/quiz_instances/{instanceId}/state

Response: {
  instanceId: 55,
  status: "IN_PROGRESS",
  remainingSeconds: 1800,
  questions: [
    {
      questionId: "1",
      content: "What is 2+2?",
      type: "text",
      orderIndex: 0,
      points: 10,
      answers: [
        { index: 0, content: "3", type: "text" },
        { index: 1, content: "4", type: "text" }
      ],
      userAnswer: [1]
    }
  ]
}
```

### Save Answer
```
POST /api/quiz_instances/{instanceId}/answers

Request: {
  questionId: "1",
  answers: [1, 3],
  clientSeq: 17
}

Response: {
  code: 200,
  message: "Answer saved",
  items: null
}
```

### Submit Quiz
```
POST /api/quiz_instances/{instanceId}/submit

Response: {
  code: 200,
  message: "Quiz submitted",
  items: {
    id: 55,
    quizId: 21,
    status: "COMPLETED",
    score: 85
  }
}
```

## 🎯 Key Takeaways

✅ **Server time is source of truth** - Don't rely on client clock  
✅ **Always send full answer state** - Prevents race conditions  
✅ **Persist locally** - Survive browser crash  
✅ **Retry on reconnect** - Auto-flush queue when online  
✅ **Debounce text input** - Reduce API load  
✅ **Double tab warning** - Prevent data conflicts  
✅ **Status indicators** - Keep user informed  
✅ **Graceful degradation** - Work offline, resync online  

---

**Version:** 1.0  
**Last Updated:** March 16, 2026  
**Status:** ✅ Implemented & Deployed
