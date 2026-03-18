# Quick Start Guide - Quiz Taking Page

## 🚀 5-Minute Setup

### 1. Add Provider to App Root

In `src/main.tsx` or your App component:

```tsx
import { QuizAttemptProvider } from '@/contexts/QuizAttemptContext';

export default function App() {
  return (
    <QuizAttemptProvider>
      {/* Your routes */}
    </QuizAttemptProvider>
  );
}
```

### 2. Add Route

In your router configuration:

```tsx
import QuizTaking from '@/pages/QuizTaking';

const routes = [
  {
    path: '/quiz/:quizId/take/:instanceId',
    element: <QuizTaking />
  }
];
```

### 3. Update Services

In `src/services/quiz-instance.service.ts`:

```tsx
export class QuizInstanceService {
  async getQuizState(instanceId: number) {
    return await this.api.get(`/quiz_instances/${instanceId}/state`);
  }

  async saveAnswer(instanceId: number, payload: any) {
    return await this.api.post(`/quiz_instances/${instanceId}/answers`, payload);
  }

  async submitQuiz(instanceId: number) {
    return await this.api.post(`/quiz_instances/${instanceId}/submit`);
  }
}
```

### 4. Done!

Visit: `http://localhost:5173/quiz/21/take/55`

## 📖 Usage Examples

### Using the Context

```tsx
import { useQuizAttempt } from '@/contexts/QuizAttemptContext';

function MyComponent() {
  const {
    answers,
    syncStatus,
    remainingSeconds,
    isOnline,
    setAnswer,
    setSyncStatus
  } = useQuizAttempt();

  return (
    <div>
      <p>Remaining: {remainingSeconds}s</p>
      <p>Status: {syncStatus['1']}</p>
    </div>
  );
}
```

### Using Auto-Save Hook

```tsx
import { useAutoSave } from '@/hooks/useAutoSave';

function QuestionComponent() {
  const { saveImmediately, saveDebouncedAnswer } = useAutoSave({
    instanceId: 55,
    debounceMs: 800,
    onSave: async (payload) => {
      await quizService.saveAnswer(55, payload);
    }
  });

  return (
    <input
      onChange={(e) => saveDebouncedAnswer('1', [e.target.value])}
    />
  );
}
```

### Using Countdown Hook

```tsx
import { useCountdown } from '@/hooks/useCountdown';

function TimerComponent() {
  const { 
    formatTime, 
    getTimeWarningLevel,
    startCountdown 
  } = useCountdown({
    onTimeUp: () => console.log('Time up!'),
    syncIntervalMs: 45000
  });

  useEffect(() => {
    startCountdown();
  }, []);

  return <p>{formatTime(remainingSeconds)}</p>;
}
```

## 🎨 Component Integration

### QuestionContent

```tsx
<QuestionContent
  question={{
    questionId: '1',
    content: 'What is 2+2?',
    type: 'text',
    orderIndex: 0,
    points: 10,
    answers: [
      { index: 0, content: '3', type: 'text' },
      { index: 1, content: '4', type: 'text' }
    ]
  }}
  answer={[1]}
  syncStatus="saved"
  onChange={(answers) => console.log(answers)}
/>
```

### QuestionGrid

```tsx
<QuestionGrid
  totalQuestions={50}
  currentIndex={5}
  answers={{
    '0': [1],
    '1': ['Answer text'],
    '2': [0, 1]
  }}
  syncStatus={{
    '0': 'saved',
    '1': 'saving',
    '2': 'error'
  }}
  onNavigate={(idx) => setCurrentIndex(idx)}
/>
```

### SyncStatusIndicator

```tsx
<SyncStatusIndicator
  status="saved"
  retryCount={2}
/>
```

## 🔍 Debugging

### Check Context State

```tsx
import { useQuizAttempt } from '@/contexts/QuizAttemptContext';

export function DebugPanel() {
  const state = useQuizAttempt();
  
  return (
    <pre style={{ fontSize: '10px', overflow: 'auto' }}>
      {JSON.stringify(state, null, 2)}
    </pre>
  );
}
```

### Monitor API Calls

```tsx
// Browser DevTools → Network tab
// Filter: "answers" or "submit"
// Check request/response payloads
```

### Check LocalStorage

```ts
// Browser Console
localStorage.getItem('quiz-instance-55');
// Copy paste result here to view
```

### Enable Logging

```tsx
// In useAutoSave hook
console.log('[Auto-Save]', questionId, answers, status);
```

## 🧪 Test Scenarios

### Scenario 1: Normal Save

```
1. Navigate to quiz page
2. Click on answer option
3. Check: 
   - LocalStorage updated
   - Status changes: idle → saving → saved
   - Network request sent
```

### Scenario 2: Offline Recovery

```
1. Start answering questions
2. Open DevTools → Network → Offline
3. Try to save answer → should fail
4. Status: saving → error
5. Warning shown: "Connection unstable"
6. Toggle back Online
7. Verify auto-retry happens
```

### Scenario 3: Timer Sync

```
1. Start quiz with time limit
2. Wait 45 seconds
3. Check: Sync request sent to server
4. Verify timer accuracy matches server
5. Continue until < 5 minutes
6. Timer background turns amber
```

### Scenario 4: Browser Crash

```
1. Answer 5 questions
2. Force close browser (Alt+F4 or kill process)
3. Reopen same URL
4. Verify: 
   - Answers restored from localStorage
   - Questions show answered state
   - Continue quiz from same position
```

## 📊 What's Saved Where

```
LocalStorage (Browser)
├── quiz-instance-55
│   ├── answers (all saved answers)
│   ├── instanceId
│   └── timestamp

Context (React Memory)
├── syncStatus (per-question state)
├── retryQueue (failed saves)
├── isOnline (connection status)
└── remainingSeconds (current timer)

Server (Database)
├── Quiz Instance state
├── Saved answers
├── Submission record
└── Result scores
```

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "QuizAttemptProvider not found" | Provider not wrapped | Add provider to App root |
| "Cannot read property 'answers'" | Context not initialized | Check provider setup |
| "Network error on save" | API endpoint wrong | Verify service URL |
| "Timer keeps jumping" | Server time incorrect | Check server clock |
| "LocalStorage full" | Too much data | Clear after submission |

## 📚 Documentation Files

- **`QUIZ_TAKING_DESIGN.md`** - Complete architecture & design
- **`IMPLEMENTATION_SUMMARY.md`** - Technical details & checklist
- **`require_examing.md`** - Original requirements
- **Component JSDoc** - Built-in code documentation

## 🎯 Next Steps

1. ✅ Setup Provider
2. ✅ Add Router
3. ✅ Implement Services
4. ✅ Test Integration
5. ✅ Deploy to production

## 💡 Pro Tips

- **Mobile:** Grid collapses on small screens
- **Dark Mode:** Fully supported with Tailwind
- **Accessibility:** Keyboard navigation enabled
- **Performance:** Text input debounced to reduce API calls
- **Offline:** Works without network, syncs when reconnected

## 🤝 Need Help?

Check files in this order:
1. Component error → Check `src/components/quiz/*.tsx`
2. State error → Check `src/contexts/QuizAttemptContext.tsx`
3. Hook error → Check `src/hooks/*.ts`
4. API error → Check service implementation
5. Design question → Check `QUIZ_TAKING_DESIGN.md`

## ✨ Features Included

✅ Auto-save (immediate for MCQ, debounced for text)  
✅ Offline support with retry queue  
✅ Server-synced countdown timer  
✅ Multi-tab detection & warning  
✅ LocalStorage persistence  
✅ Real-time sync indicators  
✅ Responsive design  
✅ Dark mode support  
✅ Error handling & recovery  
✅ Performance optimized  

---

**You're all set!** 🎉 Start building with Quiz Taking page.
