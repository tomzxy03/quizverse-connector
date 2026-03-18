# Route-Based Tab Navigation System - Implementation Guide

## Overview
Converted the Groups component from a state-based tab system to a modern route-based navigation architecture. This provides better UX, URL-based state persistence, and cleaner component structure.

## Architecture

### URL Structure
```
/groups                          # Groups list page
/groups/:groupId                 # Redirects to /groups/:groupId/announcements
/groups/:groupId/announcements   # Announcements tab
/groups/:groupId/quizzes         # Quizzes tab
/groups/:groupId/members         # Members tab
/groups/:groupId/shared          # Shared resources tab
```

### Component Hierarchy
```
App.tsx (Router Configuration)
  ↓
GroupLayout (Container)
  ├── Header
  ├── GroupTabs (Navigation)
  └── Outlet
      ├── GroupAnnouncementsTab (Lazy-loaded)
      ├── GroupQuizzesTab (Lazy-loaded)
      ├── GroupMembersTab (Lazy-loaded)
      └── GroupSharedTab (Lazy-loaded)
```

## Files Structure

### Configuration
- **`src/components/group/config/groupTabsConfig.ts`**
  - Centralized tab definitions
  - `GROUP_TABS`: Array of 4 tab objects
  - Each tab has: key, label, icon, path helper function
  - Helper functions: `getTabByKey()`, `getTabPath()`

### Layout Components
- **`src/components/group/GroupLayout.tsx`**
  - Container component for group pages
  - Extracts `groupId` from route params
  - Renders Header → GroupTabs → Outlet with Suspense
  - Provides `groupId` via Outlet context
  - Features: Error handling, loading states

- **`src/components/group/GroupTabs.tsx`**
  - Tab navigation bar
  - Uses `NavLink` from react-router-dom for active styling
  - Dynamic icon rendering
  - Sticky positioning for better UX
  - Active tab automatically highlighted based on current URL

### Tab Components (Lazy-Loaded)
All tab components follow the same pattern:

#### **`src/components/group/tabs/GroupAnnouncementsTab.tsx`**
- Fetches announcements via `groupService.getAnnouncements(groupId)`
- Manages loading/error/empty states
- Displays list with timestamps and content

#### **`src/components/group/tabs/GroupQuizzesTab.tsx`**
- Fetches quizzes via `groupService.getGroupQuizzes(groupId)`
- Renders QuizCard components
- Responsive grid layout

#### **`src/components/group/tabs/GroupMembersTab.tsx`**
- Fetches members via `groupService.getGroupMembers(groupId)`
- Displays user profile cards with avatars
- Shows email and member badge

#### **`src/components/group/tabs/GroupSharedTab.tsx`**
- Placeholder component (coming soon feature)
- Ready for file sharing functionality
- Shows coming soon message with icon

### Router Configuration
**`src/App.tsx`**
```typescript
<Route path="/groups/:groupId" element={<GroupLayout />}>
  <Route path="announcements" element={<GroupAnnouncementsTab />} />
  <Route path="quizzes" element={<GroupQuizzesTab />} />
  <Route path="members" element={<GroupMembersTab />} />
  <Route path="shared" element={<GroupSharedTab />} />
  <Route index element={<Navigate to="announcements" replace />} />
</Route>
```

## Key Features

### 1. URL-Based State
- Tab selection is preserved in URL
- Browser back/forward buttons work correctly
- Page refresh maintains tab position

### 2. Lazy Loading
- Tab components load only when mounted
- Each tab has independent data fetching
- Reduces bundle size and initial load time

### 3. Per-Tab API Calls
- Each component has `useEffect` that fetches on mount
- Only runs when tab is active (component mounted)
- Prevents unnecessary API calls when switching tabs

### 4. Active Tab Highlighting
- Uses NavLink's `isActive` prop from React Router
- Automatic highlighting based on current URL
- No manual state management needed

### 5. Error Handling
- All tabs have error state management
- Displays user-friendly error messages
- Console logging for debugging

### 6. Loading States
- Spinner shown during data fetch
- Smooth transitions between states
- Disabled state while loading

## Type System

### API Response Handling
The service methods return `PageResponse<T>`:
```typescript
interface PageResponse<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}
```

All tab components handle both response formats:
```typescript
const response = await groupService.getAnnouncements(groupId);
setAnnouncements((Array.isArray(response) ? response : response?.items) || []);
```

This supports:
- Paginated API responses: Extract `.items`
- Array responses: Use directly
- Null/undefined: Default to empty array

## Usage Flow

### Navigating Between Tabs
1. User clicks a NavLink in GroupTabs
2. URL changes (e.g., `/groups/1/quizzes`)
3. Route matches new URL
4. Component re-renders with new route
5. Old tab component unmounts
6. New tab component mounts
7. `useEffect` in new component fetches data

### Component Lifecycle
```
Tab Click
  ↓
URL Changes
  ↓
Route Matches
  ↓
Old Component Unmounts → useEffect cleanup (cancel requests)
  ↓
New Component Mounts
  ↓
useEffect Runs → API Call → setState → Re-render
```

## Performance Optimizations

1. **Suspense Boundary**: Wraps Outlet for loading state
2. **Lazy Loading**: Tab components load on-demand
3. **Cleanup Functions**: useEffect cleanup prevents memory leaks
4. **Context Passing**: groupId via Outlet context (not prop drilling)
5. **Debounced Search**: Can be added for announcements/members filtering

## Future Enhancements

1. **Search/Filter**: Add search within each tab
2. **Pagination**: Handle paginated responses
3. **Real-time Updates**: WebSocket for announcements
4. **Infinite Scroll**: For long lists
5. **Tab Caching**: Cache tab data to avoid re-fetching on re-visit
6. **Shared Resources**: Implement file upload for shared tab
7. **Bulk Actions**: Multi-select and batch operations

## Migration Notes

### From Old System
**Before** (State-based):
```typescript
const [activeTab, setActiveTab] = useState('announcements');

function handleTabChange(tab) {
  setActiveTab(tab);
}

// All data in one component
```

**After** (Route-based):
```typescript
// URL handles state
// Each tab is separate component
// Data fetching isolated per tab
```

### Benefits
- ✅ URL is the source of truth
- ✅ Shareable links with specific tab
- ✅ Browser history navigation works
- ✅ Better performance (lazy loading)
- ✅ Cleaner component structure
- ✅ Easier to test (independent components)
- ✅ SEO friendly
- ✅ Works with browser extensions

## Testing

### Unit Tests
```typescript
// Test tab component renders when mounted
// Test useEffect triggers API call
// Test error state displays
// Test empty state displays
```

### Integration Tests
```typescript
// Test route navigation
// Test URL changes on tab click
// Test back button works
// Test page refresh preserves tab
```

### E2E Tests
```typescript
// Test full user flow
// Test switching between all tabs
// Test API calls are made correctly
// Test data renders correctly
```

## Troubleshooting

### Tab Not Rendering
- Check route path matches URL format
- Verify component is exported in tabs/index.ts
- Check Suspense fallback is displayed

### API Not Called
- Verify `groupId` is extracted correctly from params
- Check useEffect dependencies include `groupId`
- Look for errors in console

### Wrong Data Showing
- Check service method returns correct type
- Verify response handling (extract .items if needed)
- Check component receives correct groupId

### Navigation Not Working
- Verify NavLink paths use `getTabPath(groupId)`
- Check route params match URL
- Ensure Navigate redirect works

## Code Examples

### Adding a New Tab

1. Create component:
```typescript
// src/components/group/tabs/GroupNewTab.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { groupService } from '@/services';

export default function GroupNewTab() {
  const { groupId } = useParams<{ groupId: string }>();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const response = await groupService.getNewData(Number(groupId));
      setData((Array.isArray(response) ? response : response?.items) || []);
      setLoading(false);
    };
    fetch();
  }, [groupId]);

  return <div>...</div>;
}
```

2. Add to config:
```typescript
// src/components/group/config/groupTabsConfig.ts
{ key: "new", label: "New Tab", icon: Icon, path: (id) => `/groups/${id}/new` }
```

3. Add route:
```typescript
// src/App.tsx
<Route path="new" element={<GroupNewTab />} />
```

4. Export from index:
```typescript
// src/components/group/tabs/index.ts
export { default as GroupNewTab } from './GroupNewTab';
```

That's it! The new tab is now fully integrated.
