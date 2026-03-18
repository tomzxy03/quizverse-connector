# React Query - Quick Reference Guide

## 🚀 Quick Start

### Using a Query Hook in Your Component

```typescript
import { useGroupAnnouncements } from '@/hooks/group';

export function MyComponent() {
  const groupId = 123;
  
  // ✨ Single line replaces entire state management!
  const { data = [], isLoading, error, refetch } = useGroupAnnouncements(groupId);
  
  return (
    <div>
      {isLoading && <Skeleton />}
      {error && <ErrorAlert error={error} />}
      {data.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

---

## 📋 Available Hooks

### Announcements
```typescript
import { useGroupAnnouncements, useAnnouncementsPrefetch } from '@/hooks/group';

// Fetch announcements
const { data, isLoading, error } = useGroupAnnouncements(groupId);

// Prefetch on hover/load
const prefetch = useAnnouncementsPrefetch(groupId);
prefetch(); // triggers prefetch
```

### Quizzes
```typescript
import { useGroupQuizzes, useQuizzesPrefetch } from '@/hooks/group';

const { data, isLoading, error } = useGroupQuizzes(groupId);
const prefetch = useQuizzesPrefetch(groupId);
```

### Members
```typescript
import { useGroupMembers, useMembersPrefetch } from '@/hooks/group';

const { data, isLoading, error } = useGroupMembers(groupId);
const prefetch = useMembersPrefetch(groupId);
```

### Unified Prefetch
```typescript
import { useTabPrefetch } from '@/hooks/group';

const {
  prefetchAnnouncements,
  prefetchQuizzes,
  prefetchMembers,
  prefetchAll, // Prefetch all at once
} = useTabPrefetch();

// Prefetch single tab
prefetchQuizzes(groupId);

// Prefetch all tabs
prefetchAll(groupId);
```

---

## ⚙️ Configuration

### Custom Cache Times
```typescript
const { data } = useGroupAnnouncements(groupId, {
  staleTime: 10 * 60 * 1000,    // 10 min instead of 5
  gcTime: 20 * 60 * 1000,       // 20 min instead of 10
});
```

### Conditional Fetching
```typescript
// Don't fetch until user is authenticated
const { data } = useGroupAnnouncements(groupId, {
  enabled: isUserLoggedIn,
});
```

### Manual Refetch
```typescript
const { data, refetch, isRefetching } = useGroupAnnouncements(groupId);

// Trigger refetch manually
<button 
  onClick={() => refetch()}
  disabled={isRefetching}
>
  {isRefetching ? 'Refreshing...' : 'Refresh'}
</button>
```

---

## 🎯 Common Patterns

### Pattern 1: Simple Data Display
```typescript
export function AnnouncementsList({ groupId }) {
  const { data = [], isLoading, error } = useGroupAnnouncements(groupId);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert error={error} />;
  if (data.length === 0) return <EmptyState />;
  
  return (
    <div className="space-y-4">
      {data.map(item => (
        <AnnouncementCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### Pattern 2: Tab Prefetch on Hover
```typescript
export function GroupTabs({ groupId }) {
  const { prefetchQuizzes, prefetchMembers } = useTabPrefetch();
  
  return (
    <nav className="flex gap-4">
      <button onMouseEnter={() => prefetchQuizzes(groupId)}>
        Quizzes
      </button>
      <button onMouseEnter={() => prefetchMembers(groupId)}>
        Members
      </button>
    </nav>
  );
}
```

### Pattern 3: Conditional Data Fetch
```typescript
export function OptionalData({ groupId, shouldFetch }) {
  const { data } = useGroupAnnouncements(groupId, {
    enabled: shouldFetch,
  });
  
  if (!shouldFetch) {
    return <p>Enable fetching in settings</p>;
  }
  
  return <DataDisplay data={data} />;
}
```

### Pattern 4: With Filtering/Search
```typescript
export function SearchAnnouncements({ groupId, searchTerm }) {
  const { data = [] } = useGroupAnnouncements(groupId);
  
  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <input 
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filtered.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## 🔄 Data State Explanations

### isLoading
```typescript
// true = Fetching for the FIRST time (no data yet)
// false = Have data (either cached or fresh)

const { data, isLoading } = useGroupAnnouncements(123);
if (isLoading) {
  // Show skeleton/loading spinner
  // data will be undefined or empty array
}
```

### isFetching
```typescript
// true = Currently fetching (might have stale data)
// false = Not fetching

const { isFetching } = useGroupAnnouncements(123);
if (isFetching) {
  // Background refresh in progress
  // data is available but may be stale
}
```

### error
```typescript
// null = No error
// Error object = Something went wrong

const { error } = useGroupAnnouncements(123);
if (error) {
  // Display error message
  console.log(error.message);
}
```

### isStale
```typescript
// true = Data is old (5+ minutes since fetch)
// false = Data is fresh

const { isStale } = useGroupAnnouncements(123);
if (isStale) {
  // Next access will trigger background refetch
}
```

---

## 🐛 Debugging

### Enable React Query DevTools
```bash
npm install @tanstack/react-query-devtools
```

```typescript
// In App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Inspect Cache in Console
```typescript
// Get query data directly
const query = queryClient.getQueryData(
  ['groups', 'announcements', 123]
);
console.log(query);

// See all queries
console.log(queryClient.getQueryCache().getAll());
```

### Manual Cache Invalidation
```typescript
import { useQueryClient } from '@tanstack/react-query';
import { groupQueryKeys } from '@/hooks/queryKeys/groupQueryKeys';

export function RefreshButton() {
  const queryClient = useQueryClient();
  
  return (
    <button onClick={() => {
      queryClient.invalidateQueries({
        queryKey: groupQueryKeys.announcements.byGroup(123),
      });
    }}>
      Invalidate Cache
    </button>
  );
}
```

---

## 📊 Performance Tips

### 1. Prefetch on Mount
```typescript
useEffect(() => {
  // Eagerly prefetch data on component mount
  prefetchAnnouncements(groupId);
}, [groupId, prefetchAnnouncements]);
```

### 2. Prefetch on Hover
```typescript
<button onMouseEnter={() => prefetchQuizzes(groupId)}>
  Quizzes
</button>
```

### 3. Increase Cache Duration for Static Data
```typescript
const { data } = useGroupMembers(groupId, {
  staleTime: 60 * 60 * 1000, // 1 hour for members
  gcTime: 120 * 60 * 1000,   // Keep 2 hours
});
```

### 4. Reduce Cache Duration for Dynamic Data
```typescript
const { data } = useGroupAnnouncements(groupId, {
  staleTime: 60 * 1000,      // 1 minute for announcements
  gcTime: 5 * 60 * 1000,     // Keep 5 minutes
});
```

---

## ❌ Common Mistakes

### ❌ Don't: Create useEffect for simple fetch
```typescript
// BAD - Never do this!
useEffect(() => {
  const { data } = useGroupAnnouncements(groupId);
}, [groupId]);
```

### ✅ Do: Just use the hook directly
```typescript
// GOOD - Use hook directly in component
const { data } = useGroupAnnouncements(groupId);
```

---

### ❌ Don't: Access response?.items in component
```typescript
// BAD - Response handling scattered
const announcements = data?.items || [];
```

### ✅ Do: Normalize in hook
```typescript
// GOOD - Normalized in hook, component gets clean array
const { data = [] } = useGroupAnnouncements(groupId);
```

---

### ❌ Don't: Manual loading state
```typescript
// BAD
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  setIsLoading(true);
  fetchData().then(() => setIsLoading(false));
}, []);
```

### ✅ Do: Use hook's isLoading
```typescript
// GOOD
const { isLoading } = useGroupAnnouncements(groupId);
```

---

### ❌ Don't: Multiple instances of same query
```typescript
// BAD - Creates separate cache entries
const query1 = useGroupAnnouncements(groupId);
const query2 = useGroupAnnouncements(groupId);
```

### ✅ Do: Query is automatically cached
```typescript
// GOOD - Same query shares cache
const announcements = useGroupAnnouncements(groupId);
const quizzes = useGroupQuizzes(groupId);
```

---

## 🎓 Learning Resources

### Official Docs
- [TanStack React Query](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Caching Explained](https://tanstack.com/query/latest/docs/react/guides/caching)

### Internal Docs
- `docs/REACT_QUERY_MIGRATION.md` - Full migration guide
- `docs/REACT_QUERY_ARCHITECTURE.md` - System architecture
- `docs/REACT_QUERY_IMPLEMENTATION_SUMMARY.md` - Implementation details

### Working Examples
- `src/components/group/GroupAnnouncementsTab.tsx`
- `src/components/group/GroupQuizzesTab.tsx`
- `src/components/group/GroupMembersTab.tsx`
- `src/components/group/GroupTabs.tsx`

---

## 🔗 Related Files

```
Hooks:
├── src/hooks/queryKeys/groupQueryKeys.ts
├── src/hooks/group/useGroupAnnouncements.ts
├── src/hooks/group/useGroupQuizzes.ts
├── src/hooks/group/useGroupMembers.ts
├── src/hooks/group/useTabPrefetch.ts
└── src/hooks/group/index.ts

Components:
├── src/components/group/GroupLayout.tsx
├── src/components/group/GroupTabs.tsx
├── src/components/group/GroupAnnouncementsTab.tsx
├── src/components/group/GroupQuizzesTab.tsx
└── src/components/group/GroupMembersTab.tsx

Services & Repos:
├── src/services/group.service.ts
└── src/repositories/group.repository.ts
```

---

## 💡 Pro Tips

### Tip 1: Use groupQueryKeys for consistency
```typescript
// Don't hardcode keys
❌ queryKey: ['groups', 'announcements', 123]

// Use the factory
✅ queryKey: groupQueryKeys.announcements.byGroup(123)
```

### Tip 2: Enable prefetch early
```typescript
// In GroupLayout or GroupTabs
useEffect(() => {
  const { prefetchAll } = useTabPrefetch();
  prefetchAll(groupId);
}, [groupId]);
```

### Tip 3: Use React Query DevTools in development
```typescript
<ReactQueryDevtools initialIsOpen={true} /> // During dev
<ReactQueryDevtools initialIsOpen={false} /> // Production-like
```

### Tip 4: Combine with error boundaries
```typescript
<ErrorBoundary>
  <GroupAnnouncements groupId={groupId} />
</ErrorBoundary>
```

### Tip 5: Add loading skeletons
```typescript
const { data = [], isLoading } = useGroupAnnouncements(groupId);

if (isLoading) {
  return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}
```

---

## 📞 Support & Help

- Check React Query DevTools in browser
- Review component examples for patterns
- Read full documentation for advanced topics
- Check browser console for error messages
- Use TypeScript for IDE hints and autocomplete

---

## ✅ Checklist for Using Hooks

When adding React Query to a new tab:

- [ ] Import hook: `import { useGroupXXX } from '@/hooks/group'`
- [ ] Call hook: `const { data = [], isLoading, error } = useGroupXXX(groupId)`
- [ ] Show loading state: `if (isLoading) return <Skeleton />`
- [ ] Show error state: `if (error) return <ErrorAlert />`
- [ ] Render data: `{data.map(item => ...)}`
- [ ] Add prefetch: `onMouseEnter={() => prefetchXXX(groupId)}`
- [ ] Test caching: Use DevTools to verify cache hits
- [ ] Done! ✓

---

Generated: React Query Migration Complete ✨
