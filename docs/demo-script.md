# Live Demo Script

Follow this sequence (based on `ToDo_App_Build_Guide.pdf`, Page 16) during the walkthrough:

1. **Register (`/register`)**
   - First click **Register** with empty/invalid inputs to demonstrate inline field validation errors.
   - Type into a field to show the inline error clears immediately while typing.
   - Complete valid registration (Name, Email, Password, Confirm Password).
   - Point out the `"Registration successful! Please log in."` toast and automatic redirect to `/login`.

2. **Login (`/login`)**
   - Try a wrong password once to show the `"Invalid email or password"` error toast.
   - Log in with the newly registered credentials → `"Welcome back!"` toast → `/dashboard`.

3. **Empty Dashboard (`/dashboard`)**
   - Point out `"Welcome, {name}!"`, today's date, completion rate `0%`, `0 / 0 / 0` stat cards, sidebar navigation, and the empty state `"No tasks yet — add your first one!"`.

4. **Add 3 Tasks**
   - Add 3 tasks (including one with a past due date to demonstrate red overdue highlighting).
   - Point out the `"Saving…"` disabled button state, `"Task added"` toast, and instant stat updates (`Total Tasks: 3`, `Pending Tasks: 3`, `Completed Tasks: 0`).

5. **Search & Filter**
   - Click the **Pending** / **Completed** tabs (or sidebar links) and type in the search box to show live filtering without extra network queries.

6. **Edit One Task**
   - Click **Edit** on a task → form pre-fills → update title/description/date → `"Task updated"` toast.

7. **Complete & Reopen**
   - Click **Complete** on one task → strikethrough styling, status badge flips to **Completed**, button switches to **Reopen**, stats update to `Pending Tasks: 2`, `Completed Tasks: 1`.
   - Click **Reopen** → strikethrough disappears, stats return to `Pending Tasks: 3`, `Completed Tasks: 0`.

8. **Delete One Task**
   - Click **Delete** → show the `window.confirm('Delete this task?')` dialog → confirm → `"Task deleted"` toast and stats update (`Total Tasks: 2`).

9. **Refresh Persistence**
   - Press browser **Refresh** (`F5`) on `/dashboard` → spinner appears briefly while `getSession()` restores the session, user stays logged in, tasks reload.

10. **Android & iOS / Mobile Responsiveness**
    - Open DevTools device toolbar at **360px** (Android) and **390px** (iOS) and **768px** (Tablet) → open the mobile sidebar drawer, verify stats stack to 1 column on mobile and expand to 3 columns at `>= 640px`, confirm inputs do not zoom or overflow, and verify zero horizontal scroll.

11. **Logout**
    - Click **Logout** in the Navbar → `"Logged out"` toast → redirected to `/login`.
    - Visit `/dashboard` directly while logged out → `ProtectedRoute` redirects back to `/login`.
