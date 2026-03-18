# React Query Architecture Guide

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Browser                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │          React Application (with React Query)             │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │              GroupLayout Component                  │ │  │
│  │  │  (Outlet context provides groupId to tab components)│ │  │
│  │  │                                                      │ │  │
│  │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │  │  │        GroupTabs Component                  │  │ │  │
│  │  │  │                                              │  │ │  │
│  │  │  │  🖱️ Hover "Announcements" → prefetch       │  │ │  │
│  │  │  │  🖱️ Hover "Quizzes" → prefetch             │  │ │  │
│  │  │  │  🖱️ Hover "Members" → prefetch             │  │ │  │
│  │  │  │                                              │  │ │  │
│  │  │  │  useTabPrefetch() hook provides functions   │  │ │  │
│  │  │  └─────────────┬──────────────────────────────┘  │ │  │
│  │  │                │                                  │ │  │
│  │  ├────────────────┼──────────────────────────────────┤ │  │
│  │  │                │ onClick navigate                 │ │  │
│  │  │                ▼                                  │ │  │
│  │  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │  │    Tab Content (Route-based Outlet)         │ │  │
│  │  │  │                                              │ │  │
│  │  │  │  ┌──────────────────────────────────────┐   │ │  │
│  │  │  │  │ GroupAnnouncementsTab                │   │ │  │
│  │  │  │  │ ├─ useGroupAnnouncements(groupId)   │   │ │  │
│  │  │  │  │ │  └─ Returns cached data instantly ✓   │ │  │
│  │  │  │  │ └─ Renders announcements list       │   │ │  │
│  │  │  │  └──────────────────────────────────────┘   │ │  │
│  │  │  │                                              │ │  │
│  │  │  │  ┌──────────────────────────────────────┐   │ │  │
│  │  │  │  │ GroupQuizzesTab                     │   │ │  │
│  │  │  │  │ ├─ useGroupQuizzes(groupId)        │   │ │  │
│  │  │  │  │ │  └─ Returns cached data instantly ✓   │ │  │
│  │  │  │  │ └─ Renders quizzes list             │   │ │  │
│  │  │  │  └──────────────────────────────────────┘   │ │  │
│  │  │  │                                              │ │  │
│  │  │  │  ┌──────────────────────────────────────┐   │ │  │
│  │  │  │  │ GroupMembersTab                     │   │ │  │
│  │  │  │  │ ├─ useGroupMembers(groupId)        │   │ │  │
│  │  │  │  │ │  └─ Returns cached data instantly ✓   │ │  │
│  │  │  │  │ └─ Renders members list             │   │ │  │
│  │  │  │  └──────────────────────────────────────┘   │ │  │
│  │  │  └──────────────────────────────────────────────┘ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │        React Query Cache (In Memory)             │ │  │
│  │  │                                                  │ │  │
│  │  │  Cache Key                    Data              │ │  │
│  │  │  ─────────────────────────────────────          │ │  │
│  │  │  ['groups','announcements',123] ← [Ann1,Ann2] │ │  │
│  │  │  ['groups','quizzes',123]       ← [Q1,Q2,Q3]  │ │  │
│  │  │  ['groups','members',123]       ← [M1,M2,M3]  │ │  │
│  │  │  ['groups','shared',123]        ← (pending)    │ │  │
│  │  │                                                  │ │  │
│  │  │  Automatic Features:                             │ │  │
│  │  │  • 5-min freshness window                       │ │  │
│  │  │  • 10-min garbage collection                    │ │  │
│  │  │  • Automatic deduplication                      │ │  │
│  │  │  • Background refresh when stale                │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────┬──────────────────────────────────────┘
                        │ API Calls (only when needed)
                        ▼
┌───────────────────────────────────────────────────────────────┐
│                    Backend Services                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  GET /groups/{groupId}/announcements                   │ │
│  │  ├─ Called on: Page load (cache miss)                  │ │
│  │  ├─ NOT called on: Tab hover (prefetched)              │ │
│  │  ├─ NOT called on: Tab switch (cached)                 │ │
│  │  └─ Status: Cached for 5 min, kept for 10 min          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  GET /groups/{groupId}/quizzes                         │ │
│  │  ├─ Called on: Prefetch on hover                       │ │
│  │  ├─ NOT called on: Tab switch (cached)                 │ │
│  │  └─ Status: Cached for 5 min, kept for 10 min          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  GET /groups/{groupId}/members                         │ │
│  │  ├─ Called on: Prefetch on hover                       │ │
│  │  ├─ NOT called on: Tab switch (cached)                 │ │
│  │  └─ Status: Cached for 5 min, kept for 10 min          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow Timeline

```
Time    Event                          Action                   API Call?
────────────────────────────────────────────────────────────────────────
T+0s    Page loads                     → Fetch announcements    ✓ YES
        (Announcements tab active)       (cache miss)

T+0.3s  Announcements data received    → Display announcements  (done)

T+1s    User hovers "Quizzes" tab      → Prefetch quizzes       ✓ YES
                                         (starts background)

T+1.3s  Quizzes data prefetched        → Cached & ready        (done)

T+2s    User hovers "Members" tab      → Prefetch members       ✓ YES
                                         (starts background)

T+2.3s  Members data prefetched        → Cached & ready        (done)

T+3s    User CLICKS "Quizzes" tab      → Show quizzes           ✗ NO
        (from cache instantly)           (already cached)       (instant)

T+3.1s  Quizzes displayed              → User sees data         (done)

T+4s    User CLICKS "Members" tab      → Show members           ✗ NO
        (from cache instantly)           (already cached)       (instant)

T+4.1s  Members displayed              → User sees data         (done)

T+5s    User CLICKS "Announcements"    → Show announcements     ✗ NO
        (still fresh, from cache)        (cache hit)            (instant)

T+5.1s  Announcements displayed        → User sees data         (done)

T+5.1m  Announcements cache stale      → Still show cached      ✗ (implicit)
        (5 min staleTime reached)        data but refetch in
                                         background

T+5.2m  Fresh announcements received   → Updated in cache       (done)
        (user never sees loading)

T+10.1m Cache GC triggered             → Remove from memory     (n/a)
        (10 min gcTime reached)          (will refetch on next
                                         use)
```

## Hook Dependency Chain

```
┌─────────────────────────────────────────────────────┐
│         GroupAnnouncementsTab (Component)            │
│                                                      │
│  const { data, isLoading, error } =                 │
│    useGroupAnnouncements(groupId)                   │
└─────────────────────────┬───────────────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────────────┐
│      useGroupAnnouncements (Hook)                    │
│                                                      │
│  export function useGroupAnnouncements(groupId) {   │
│    return useQuery({                                │
│      queryKey: groupQueryKeys.announcements          │
│      queryFn: async () => {                         │
│        const response =                             │
│          await groupService.getAnnouncements(...)   │
│        return normalize(response)                   │
│      },                                             │
│      staleTime: 5 * 60 * 1000,                     │
│      gcTime: 10 * 60 * 1000,                       │
│    })                                               │
│  }                                                  │
└─────────────────────────┬───────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────┐
│      groupQueryKeys (Query Keys)                     │
│                                                      │
│  groupQueryKeys.announcements.byGroup(groupId)     │
│  → ['groups', 'announcements', 123]                │
└─────────────────────────┬───────────────────────────┘
                          │ used by
┌─────────────────────────▼───────────────────────────┐
│      React Query useQuery                            │
│                                                      │
│  • Checks cache for key                             │
│  • If not found: executes queryFn                   │
│  • If found & fresh: returns cached data            │
│  • If found & stale: returns stale + refetches     │
│  • Stores result in cache with key                 │
│  • Manages loading/error/success states            │
│  • Sets up garbage collection timer                │
│  • Returns { data, isLoading, error, ... }        │
└─────────────────────────┬───────────────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────────────┐
│      groupService.getAnnouncements (Service)        │
│                                                      │
│  export async function getAnnouncements(            │
│    groupId: number,                                 │
│    skip: number,                                    │
│    take: number                                     │
│  ): Promise<AnnouncementResDTO[]> {                 │
│    return groupRepository                           │
│      .getAnnouncements(groupId, skip, take)        │
│  }                                                  │
└─────────────────────────┬───────────────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────────────┐
│      groupRepository (Repository)                    │
│                                                      │
│  export async function getAnnouncements(            │
│    groupId: number,                                 │
│    skip: number,                                    │
│    take: number                                     │
│  ): Promise<AnnouncementResDTO[]> {                 │
│    return apiClient.get(                            │
│      `/api/groups/${groupId}/announcements`,        │
│      { skip, take }                                 │
│    )                                                │
│  }                                                  │
└─────────────────────────┬───────────────────────────┘
                          │ uses
┌─────────────────────────▼───────────────────────────┐
│      apiClient (API Client)                         │
│                                                      │
│  Makes actual HTTP GET request to backend           │
│  Returns response or throws error                   │
└─────────────────────────┬───────────────────────────┘
                          │ calls
┌─────────────────────────▼───────────────────────────┐
│      Backend API Server                             │
│                                                      │
│  GET /api/groups/123/announcements                 │
│  ├─ Query: skip=0, take=50                          │
│  └─ Response: AnnouncementResDTO[]                  │
└─────────────────────────────────────────────────────┘
```

## Prefetch Architecture

```
┌────────────────────────────────────────────┐
│         GroupTabs Component                 │
│                                             │
│  <NavLink onMouseEnter={...}>Quizzes</N... │
│           └─ calls handleTabMouseEnter()   │
└────────────────────────┬────────────────────┘
                         │
┌────────────────────────▼────────────────────┐
│  handleTabMouseEnter(tabKey: string)        │
│                                             │
│  const prefetcher = tabPrefetchMap[tabKey] │
│  prefetcher(tabPrefetch, groupIdNumber)   │
└────────────────────────┬────────────────────┘
                         │
┌────────────────────────▼────────────────────┐
│  tabPrefetchMap['quizzes']()                │
│                                             │
│  (prefetch, groupId) =>                    │
│    prefetch.prefetchQuizzes(groupId)       │
└────────────────────────┬────────────────────┘
                         │
┌────────────────────────▼────────────────────┐
│  useTabPrefetch() Hook                      │
│                                             │
│  export function useTabPrefetch() {        │
│    const queryClient = useQueryClient()    │
│    return {                                 │
│      prefetchQuizzes: (groupId) => {       │
│        queryClient.prefetchQuery({         │
│          queryKey: [                       │
│            'groups',                       │
│            'quizzes',                      │
│            groupId                        │
│          ],                                │
│          queryFn: async () => {            │
│            return await getQuizzes(...)    │
│          }                                 │
│        })                                  │
│      }                                     │
│    }                                       │
│  }                                         │
└────────────────────────┬────────────────────┘
                         │
┌────────────────────────▼────────────────────┐
│  queryClient.prefetchQuery()                │
│                                             │
│  Checks cache:                              │
│  ├─ Already cached & fresh?                │
│  │  └─ Yes → Do nothing                   │
│  ├─ Already cached but stale?              │
│  │  └─ Yes → Refetch in background        │
│  └─ Not cached?                            │
│     └─ Yes → Fetch in background & cache  │
└────────────────────────┬────────────────────┘
                         │
             (Prefetch completes in background)
                         │
             User clicks tab, sees instant data ✓
```

## Cache State Machine

```
                    ┌─────────────────────────────────┐
                    │      Never Fetched              │
                    │  (No cache entry)               │
                    └─────────────────┬───────────────┘
                                      │ First useQuery/prefetch
                                      ▼
        ┌─────────────────────────────────────────────────┐
        │  Fetching                                       │
        │  ├─ Data: pending                              │
        │  ├─ isLoading: true                            │
        │  └─ ⏳ Waiting for API response                │
        │                                                 │
        └─────────────────┬────────────────────────┬─────┘
                          │ Success              │ Error
                          ▼                      ▼
        ┌─────────────────────────────┐  ┌─────────────┐
        │  Fresh (Cached)              │  │  Error      │
        │  ├─ Data: [response]          │  ├─ error: E  │
        │  ├─ isLoading: false          │  └─ isError: │
        │  ├─ isFetching: false         │    true      │
        │  ├─ staleTime: 5 min timer    │              │
        │  └─ Return cached data        │              │
        │                                │              │
        └─────────────────┬──────────────┴──────────────┘
                          │ 5 minutes pass (staleTime reached)
                          ▼
        ┌──────────────────────────────────────┐
        │  Stale (Cached but needs refresh)    │
        │  ├─ Data: [old data]                 │
        │  ├─ isStale: true                    │
        │  ├─ Return data + refetch if access  │
        │  └─ gcTime: 10 min timer set         │
        │                                      │
        └──────────────────┬───────────────────┘
                           │ 10 minutes pass (gcTime reached)
                           ▼
        ┌────────────────────────────────┐
        │  Garbage Collected              │
        │  ├─ Cache entry deleted         │
        │  └─ Back to "Never Fetched"     │
        └────────────────────────────────┘


Legend:
• staleTime: How long data is "fresh" (5 min default)
• gcTime: How long to keep data in memory (10 min default)
• After staleTime: Data considered old, background refetch on access
• After gcTime: Cache entry completely removed
```

## Query Key Structure

```
groupQueryKeys
│
├─ all
│  └─ ['groups']
│
├─ announcements
│  ├─ all
│  │  └─ ['groups', 'announcements']
│  └─ byGroup(groupId: number)
│     └─ ['groups', 'announcements', groupId]
│
├─ quizzes
│  ├─ all
│  │  └─ ['groups', 'quizzes']
│  └─ byGroup(groupId: number)
│     └─ ['groups', 'quizzes', groupId]
│
├─ members
│  ├─ all
│  │  └─ ['groups', 'members']
│  └─ byGroup(groupId: number)
│     └─ ['groups', 'members', groupId]
│
└─ shared
   ├─ all
   │  └─ ['groups', 'shared']
   └─ byGroup(groupId: number)
      └─ ['groups', 'shared', groupId]
```

## File Organization

```
src/
│
├─ hooks/
│  ├─ queryKeys/
│  │  └─ groupQueryKeys.ts
│  │     └─ Centralized query key factory
│  │
│  └─ group/
│     ├─ index.ts (exports)
│     ├─ useGroupAnnouncements.ts
│     │  ├─ useGroupAnnouncements(groupId)
│     │  └─ useAnnouncementsPrefetch(groupId)
│     ├─ useGroupQuizzes.ts
│     │  ├─ useGroupQuizzes(groupId)
│     │  └─ useQuizzesPrefetch(groupId)
│     ├─ useGroupMembers.ts
│     │  ├─ useGroupMembers(groupId)
│     │  └─ useMembersPrefetch(groupId)
│     └─ useTabPrefetch.ts
│        └─ useTabPrefetch() - unified interface
│
├─ components/
│  └─ group/
│     ├─ GroupLayout.tsx
│     ├─ GroupTabs.tsx ← with prefetch handlers
│     ├─ GroupAnnouncementsTab.tsx ← useGroupAnnouncements
│     ├─ GroupQuizzesTab.tsx ← useGroupQuizzes
│     └─ GroupMembersTab.tsx ← useGroupMembers
│
└─ docs/
   ├─ REACT_QUERY_MIGRATION.md
   └─ REACT_QUERY_IMPLEMENTATION_SUMMARY.md
```

## Comparison: Manual vs React Query

```
Manual State Management           React Query
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

useState(data)          →  Auto managed by useQuery
useState(loading)       →  isLoading: boolean
useState(error)         →  error: Error | null
useEffect + fetch       →  queryFn: async function
try-catch blocks        →  error handling built-in
manual normalization    →  normalize in queryFn once
no caching              →  automatic caching
no deduplication        →  automatic deduplication
manual error display    →  use error property
manual cleanup          →  automatic garbage collection
manual refetch logic    →  automatic background refetch
45+ lines per component →  20 lines per component

Result: Simpler, faster, more reliable
```

---

## Next: See Usage Examples

Check these files for complete working examples:
- `src/components/group/GroupAnnouncementsTab.tsx`
- `src/components/group/GroupQuizzesTab.tsx`
- `src/components/group/GroupMembersTab.tsx`
- `src/components/group/GroupTabs.tsx` (with prefetch)
