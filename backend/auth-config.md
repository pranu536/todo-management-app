# Supabase Auth Configuration Notes

## Email Provider Settings

Location in Supabase Dashboard: **Authentication** → **Providers** → **Email**

- **Enable Email provider:** ON (enabled by default).
- **Confirm email:** Turn **OFF** for this interview demo so users can register and immediately log in via `/login` without inbox verification.
  - Note: Even with Confirm email off, `Register.jsx` explicitly calls `await supabase.auth.signOut()` right after `signUp()` and redirects to `/login` so the user follows the required `Register → Login → Dashboard` flow.
- **User Metadata (`name`):** Registration passes `options: { data: { name: form.name.trim() } }` to `supabase.auth.signUp()`. Supabase stores this inside `auth.users.raw_user_meta_data`, which the frontend reads via `user?.user_metadata?.name`.

## URL Configuration

Location in Supabase Dashboard: **Authentication** → **URL Configuration**

- **Site URL:**
  - During local development: `http://localhost:5173`
  - After deploying to Vercel: set to your production Vercel URL (e.g., `https://your-app.vercel.app`)
- **Redirect URLs:**
  - Add `http://localhost:5173/**` for local testing and `https://your-app.vercel.app/**` for production if needed.

## Session Persistence

- `supabase-js` stores the session JWT and refresh token in browser `localStorage`.
- On page load or refresh, `AuthContext.jsx` calls `supabase.auth.getSession()` to restore the session and subscribes to `supabase.auth.onAuthStateChange()` to stay synchronized across login, token refresh, and logout.

