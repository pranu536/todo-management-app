# Database Setup (`database/`)

This folder contains the PostgreSQL schema and Row Level Security (RLS) policy used by Supabase.

## Files

- `schema.sql` — Creates the `tasks` table with primary key, `auth.users` foreign key (`default auth.uid()`), title length constraint (`1..100` characters), completion flag, and creation timestamp.
- `policies.sql` — Enables Row Level Security on `tasks` and adds the `"Users manage own tasks"` policy (`auth.uid() = user_id`).

## How to Run in Supabase SQL Editor

1. Open your project at [supabase.com](https://supabase.com).
2. In the left sidebar, select **SQL Editor** → **New query**.
3. Copy the contents of `database/schema.sql`, paste them into the editor, and click **Run**.
4. Open a new query (or clear the editor), paste the contents of `database/policies.sql`, and click **Run**.

## Verify

1. Open **Table Editor** → verify the `tasks` table exists with columns `id`, `user_id`, `title`, `description`, `due_date`, `is_completed`, and `created_at`.
2. Open **Authentication** → **Policies** (or **Database** → **Policies**) → verify **RLS is enabled** on `tasks` and the policy `"Users manage own tasks"` is active for `ALL` commands.

