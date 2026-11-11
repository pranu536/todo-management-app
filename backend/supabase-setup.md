# Supabase Backend Setup Guide

In this architecture, **Supabase** serves as the complete backend (Authentication, PostgreSQL database, PostgREST API, and Row Level Security) — no custom Node/Express server is required.

## 1. Create the Supabase Project

1. Sign in at [supabase.com](https://supabase.com) and click **New Project**.
2. Choose an organization, enter a project name (e.g., `todo-app`), set a strong database password, and pick a nearby region.
3. Wait for the database provisioning to finish.

## 2. Copy Project URL and Anon Public Key

1. In your Supabase dashboard, go to **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (or **publishable**) key → `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)
3. Create `frontend/.env` (using `backend/.env.example` as a template) and paste both values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Note: `frontend/src/lib/supabaseClient.js` accepts both `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY`.)*
4. Never commit `frontend/.env` to Git (`.gitignore` already excludes it).

> **Why is the anon key safe in the frontend?**
> The anon key only identifies your Supabase project. Actual read/write permissions are enforced by Postgres Row Level Security (`auth.uid() = user_id`) using the logged-in user's JWT.

## 3. Create Table & Row Level Security

Run `database/schema.sql` followed by `database/policies.sql` in the Supabase **SQL Editor** (see `database/README.md`).

## 4. Turn Off "Confirm Email" for Demo

1. Go to **Authentication** → **Providers** → **Email**.
2. Toggle **Confirm email** **OFF** and save.
   *(If left ON, newly registered users cannot log in until they click the confirmation link in their inbox.)*

## 5. Render Deployment & Post-Deploy Site URL

1. Push your repository to GitHub (verify `.env` is NOT on GitHub).
2. In [render.com](https://render.com), click **New → Static Site** and connect the repository.
3. Set:
   - **Root Directory** → `frontend`
   - **Build Command** → `npm install && npm run build`
   - **Publish Directory** → `dist`
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. After deployment finishes, copy your live Render URL (e.g., `https://your-app.onrender.com`).
7. In Supabase, go to **Authentication** → **URL Configuration** and set **Site URL** (plus Redirect URLs) to your live Render URL.
8. SPA routing is covered by `frontend/public/_redirects` and `render.yaml` so refreshing `/dashboard` does not return a `404`.

