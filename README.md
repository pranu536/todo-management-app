# To-Do Management App

A responsive task manager built with React (Vite) and Supabase (Auth, PostgreSQL, and Row Level Security).

**Live demo:** https://your-app.onrender.com *(replace after Render deploy)*

## Features

- Register / login / logout with persistent browser sessions (`getSession` + `onAuthStateChange`)
- Protected routes with automatic redirect for unauthenticated and already-authenticated users
- Error boundary recovery screen and resilient network/loading state handling
- Dashboard displaying `"Welcome, {name}!"`, today's date, completion rate, responsive sidebar navigation, and derived Total / Pending / Completed counts
- Add, edit, delete (with confirmation), complete, reopen, search, and filter tasks (All / Pending / Completed)
- Overdue due date highlighting in red and completed strikethrough styling
- Client-side inline form validation (errors clear as you type), loading indicators, and toast notifications
- Responsive mobile-first UI optimized for Desktop, Tablet, Android, and iOS (`100dvh`, safe-area insets, `16px` input font size, `44px` touch targets)
- PostgreSQL Row Level Security (`auth.uid() = user_id`): users can only access their own tasks

## Tech Stack

- **Frontend:** React (Vite, JavaScript), `react-router-dom`, `react-hot-toast`, plain mobile-first CSS with CSS variables
- **Backend & Database:** Supabase (`@supabase/supabase-js`, Auth, Postgres, Row Level Security)
- **Deployment:** Render Static Site (`render.yaml` + SPA rewrite)

## Setup

1. Clone the repository and enter the frontend directory:
   ```bash
   git clone https://github.com/pranu536/todo-management-app.git
   cd todo-management-app/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `frontend/.env` (see `frontend/.env.example` or `backend/.env.example`) with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. In your Supabase SQL Editor, run `database/schema.sql` and then `database/policies.sql`.
   Also turn **Confirm email** OFF in **Authentication → Providers → Email** for smooth demo sign-up/login (see `backend/supabase-setup.md`).
5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment (Render)

1. Push your repository to GitHub (verify `frontend/.env` is NOT committed).
2. In [Render](https://render.com), choose **New → Static Site** and connect this GitHub repo.
3. Use these settings (also defined in `render.yaml`):
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)
5. Deploy, then copy the live Render URL.
6. In Supabase → **Authentication → URL Configuration**, set **Site URL** (and Redirect URLs) to your Render URL.
7. SPA refreshes on `/dashboard` are handled by `frontend/public/_redirects` and `render.yaml` rewrite rules.

## Project Structure

```text
todo-management-app/
├── render.yaml
├── database/
│   ├── schema.sql
│   ├── policies.sql
│   └── README.md
├── backend/
│   ├── supabase-setup.md
│   ├── .env.example
│   └── auth-config.md
├── frontend/
│   ├── .env                # local only (ignored by .gitignore)
│   ├── .env.example
│   ├── public/_redirects   # Render SPA rewrite
│   ├── vercel.json
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── lib/supabaseClient.js
│       ├── context/AuthContext.jsx
│       ├── services/taskService.js
│       ├── utils/validators.js
│       ├── components/
│       │   ├── ErrorBoundary.jsx
│       │   ├── Icons.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Sidebar.jsx
│       │   ├── Spinner.jsx
│       │   ├── StatCard.jsx
│       │   ├── TaskForm.jsx
│       │   └── TaskItem.jsx
│       ├── pages/
│       │   ├── Register.jsx
│       │   ├── Login.jsx
│       │   └── Dashboard.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── docs/
│   ├── app-flow.md
│   ├── architecture.md
│   ├── database-design.md
│   ├── interview-notes.md
│   ├── demo-script.md
│   └── screenshots/
├── .gitignore
└── README.md
```

## Documentation

- [App Flow](docs/app-flow.md)
- [Architecture](docs/architecture.md)
- [Database Design](docs/database-design.md)
- [Interview Notes](docs/interview-notes.md)
- [Demo Script](docs/demo-script.md)

## Screenshots

| Screen | Preview |
| --- | --- |
| Register | ![Register](docs/screenshots/register.png) |
| Register Validation Errors | ![Register Errors](docs/screenshots/register-errors.png) |
| Login | ![Login](docs/screenshots/login.png) |
| Login Error Toast | ![Login Error](docs/screenshots/login-error.png) |
| Dashboard | ![Dashboard](docs/screenshots/dashboard.png) |
| Add / Edit Task | ![Add Edit Task](docs/screenshots/add-edit-task.png) |
| Completed Task | ![Completed Task](docs/screenshots/completed-task.png) |
| Mobile View | ![Mobile View](docs/screenshots/mobile.png) |

