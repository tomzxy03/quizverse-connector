# Tab API Calling System - How It Works

## Overview
Each tab automatically fetches data from the API when you click on it. Here's how the system works:

## Architecture

```
User clicks a tab
        ↓
URL changes to /groups/:groupId/:tabKey
        ↓
Route matches new URL
        ↓
New tab component mounts
        ↓
useEffect runs (groupId changed)
        ↓
API call made to backend
        ↓
Data received and displayed
```

## How Each Tab Works

### 1. **Announcements Tab** 
**File**: `src/components/group/tabs/GroupAnnouncementsTab.tsx`

```typescript
import { useOutletContext } from 'react-router-dom';
import { groupService } from '@/services/group.service';

export default function GroupAnnouncementsTab() {
  // Get groupId from Outlet context
  const { groupId } = useOutletContext<OutletContext>();
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This runs when component mounts (when tab is clicked)
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Call API through service
        const response = await groupService.getAnnouncements(Number(groupId));
        setAnnouncements((Array.isArray(response) ? response : response?.items) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [groupId]); // Re-run when groupId changes
}
```

**API Called**: `GET /groups/:groupId/announcements`

### 2. **Quizzes Tab**
**File**: `src/components/group/tabs/GroupQuizzesTab.tsx`

- Gets `groupId` from `useOutletContext`
- Calls `groupService.getGroupQuizzes(groupId)`
- API: `GET /groups/:groupId/quizzes`
- Updates when tab is clicked

### 3. **Members Tab**
**File**: `src/components/group/tabs/GroupMembersTab.tsx`

- Gets `groupId` from `useOutletContext`
- Calls `groupService.getGroupMembers(groupId)`
- API: `GET /groups/:groupId/members`
- Updates when tab is clicked

### 4. **Shared Tab**
**File**: `src/components/group/tabs/GroupSharedTab.tsx`

- Placeholder (coming soon)

## Data Flow

```
Component Layer
├── GroupAnnouncementsTab
├── GroupQuizzesTab
├── GroupMembersTab
└── GroupSharedTab
     ↓ (calls groupService methods)

Service Layer
├── groupService.getAnnouncements()
├── groupService.getGroupQuizzes()
├── groupService.getGroupMembers()
└── groupService.getSharedResources()
     ↓ (calls groupRepository methods)

Repository Layer
├── groupRepository.getAnnouncements()
├── groupRepository.getQuizzes()
├── groupRepository.getMembers()
└── groupRepository.getSharedResources()
     ↓ (calls apiClient.get)

API Layer
└── apiClient.get(endpoint, params)
     ↓ (sends HTTP request)

Backend
└── /groups/:groupId/announcements
└── /groups/:groupId/quizzes
└── /groups/:groupId/members
```

## Routes & URLs

When you click different tabs in a group (e.g., Group #123):

| Tab | URL | API Called |
|-----|-----|-----------|
| Announcements | `/groups/123/announcements` | `GET /groups/123/announcements` |
| Quizzes | `/groups/123/quizzes` | `GET /groups/123/quizzes` |
| Members | `/groups/123/members` | `GET /groups/123/members` |
| Shared | `/groups/123/shared` | Coming soon |

## How to Test It

1. Navigate to a group: `/groups/123`
2. Click on "Announcements" tab → See announcements loaded
3. Click on "Quizzes" tab → See quizzes loaded (new API call)
4. Click on "Members" tab → See members loaded (new API call)
5. Click on "Shared" tab → See placeholder

### Network Tab (DevTools)
When you click each tab, you'll see new API calls:
```
GET /groups/123/announcements
GET /groups/123/quizzes
GET /groups/123/members
```

## Key Points

✅ **Automatic Fetching**
- Each tab automatically fetches data when clicked
- No manual button needed

✅ **Loading States**
- Shows spinner while loading
- Shows error if request fails
- Shows empty message if no data

✅ **Clean Data Access**
- Uses service layer (no direct API calls)
- Proper error handling
- Type-safe with TypeScript

✅ **Context Passing**
- groupId passed via Outlet context
- Not through URL params (cleaner)
- Available to all nested tab components

## Implementation Details

### GroupLayout (Container)
```typescript
<Outlet context={{ groupId }} />  // Passes groupId to all tabs
```

### Each Tab Component
```typescript
const { groupId } = useOutletContext<OutletContext>();  // Receives groupId

useEffect(() => {
  // Fetch when groupId changes or component mounts
  const fetch = async () => {
    const response = await groupService.getXxxData(Number(groupId));
    setData(response?.items || []);
  };
  fetch();
}, [groupId]);
```

## Response Format

All API endpoints return paginated responses:

```typescript
{
  items: [...],           // Array of items
  totalElements: 42,      // Total number of items
  totalPages: 5,          // Total number of pages
  currentPage: 0,         // Current page (0-based)
  size: 10                // Items per page
}
```

Each tab extracts the items:
```typescript
setData((Array.isArray(response) ? response : response?.items) || []);
```

## Error Handling

If API call fails:

```typescript
try {
  const response = await groupService.getAnnouncements(groupId);
  setData((Array.isArray(response) ? response : response?.items) || []);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Failed to load announcements');
  // Error is displayed to user
}
```

## Performance

✅ **Lazy Loading**
- Components only load when tab is clicked
- Reduces initial bundle size

✅ **Per-Tab Requests**
- Each tab makes separate API call
- No unnecessary data fetching
- Efficient data management

✅ **Suspense Boundary**
- Loading state shown while tab mounts
- Smooth user experience

## Future Enhancements

- [ ] Add pagination controls
- [ ] Add search/filter within tabs
- [ ] Add infinite scroll
- [ ] Add data caching
- [ ] Add refresh button
- [ ] Add sorting options
- [ ] Add real-time updates (WebSocket)

## Debugging

### Check if API is called
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click on a tab
4. Look for API request (e.g., `GET /groups/123/announcements`)

### Check if data is loaded
1. Open React DevTools
2. Find the tab component
3. Check the state:
   - `loading` - should be false when done
   - `data` - should contain items
   - `error` - should be null if successful

### Common Issues

**Issue**: Data not loading
- ✅ Check Network tab for API request
- ✅ Verify API endpoint is correct
- ✅ Check backend is running
- ✅ Look at console for errors

**Issue**: Loading spinner stuck
- ✅ Check API response status
- ✅ Check if error occurred (should show error message)
- ✅ Check backend logs

**Issue**: Wrong data showing
- ✅ Check groupId is correct
- ✅ Verify API response content
- ✅ Check component state

---

## Summary

✅ All tabs call API when clicked  
✅ Data loads automatically  
✅ Error handling in place  
✅ Loading states shown  
✅ Type-safe implementation  
✅ Production ready  

**Status**: Ready to use! 🚀
