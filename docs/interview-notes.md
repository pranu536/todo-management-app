# Interview Preparation Notes

Short, clear answers for the technical interview walkthrough (from `ToDo_App_Build_Guide.pdf`, Pages 15–16).

## Q&A

### 1. How does the user stay logged in after a refresh?
Supabase saves the session token in browser storage (`localStorage`). On mount, `AuthContext` calls `supabase.auth.getSession()` to restore the existing session (with `.catch()` handling if browser storage is restricted), and `supabase.auth.onAuthStateChange()` keeps React state synchronized whenever the user logs in, logs out, or refreshes tokens.

### 2. What is Row Level Security (RLS)?
RLS is a PostgreSQL feature that filters rows per user at the database layer. The `"Users manage own tasks"` policy allows access only where `auth.uid() = user_id` (`USING` for read/update/delete and `WITH CHECK` for insert/update), so even a modified frontend or direct REST call with someone else's public key cannot read or modify another user's tasks.

### 3. Why is the anon / publishable key safe in the frontend?
The public key only identifies the Supabase project. What any request can actually read or write is strictly limited by RLS policies and the logged-in user's JWT token.

### 4. Why are stats derived instead of fetched?
`total`, `completed`, `pending`, and `completionRate` are computed directly from the `tasks` array in `Dashboard.jsx`. That gives one single source of truth, avoids extra database queries, and guarantees the counts update instantaneously after every add, edit, complete/reopen, or delete.

### 5. Why `useEffect` with an empty dependency array `[]` on the Dashboard?
It runs once after the initial mount to fetch the user's tasks. Every subsequent mutation (add, update, toggle, delete) updates local React state directly with the returned row from Supabase, so no full list refetch is needed.

### 6. How does `ProtectedRoute` work?
It reads `user` and `loading` from `useAuth()`. While `loading` is `true` (waiting for `getSession()`), it renders `<Spinner fullPage />`. Once loading completes, if `user` is `null` it redirects to `/login` using `<Navigate to="/login" replace />`; otherwise it renders the protected page.

### 7. Where do validations happen?
In `frontend/src/utils/validators.js` on the client for instant inline feedback (clearing each field's error as the user types), and in PostgreSQL via `NOT NULL` and `CHECK` constraints (`char_length(title) between 1 and 100`) as a server-side safety net.

### 8. Why does `Register.jsx` call `signOut()` after `signUp()`?
When email confirmation is turned off in Supabase, `signUp()` automatically creates an active session. Calling `signOut()` (guarded with an `isRegistering` ref so `onAuthStateChange` does not flash `/dashboard`) and navigating to `/login` fulfills the required flow (`Register → toast → Login`).

### 9. Why is `vercel.json` needed?
In a Single Page Application using React Router (`BrowserRouter`), refreshing `/dashboard` directly requests `/dashboard` from the static host. The rewrite rule in `frontend/vercel.json` routes all paths to `/index.html` so React Router can resolve `/dashboard` without a 404.

### 10. How is mobile (Android & iOS) responsiveness handled, and what could be added next?
The CSS is mobile-first using `100dvh`, `env(safe-area-inset-*)` notch padding, `16px` (`1rem`) input font sizes to prevent iOS Safari auto-zoom, `44px` touch targets, and a collapsible sidebar drawer below `960px`. Future enhancements could include sorting by due date, task priorities, dark mode, password reset, and Vitest unit tests.
