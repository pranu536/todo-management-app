-- Step 2: Create the tasks table for the To-Do Management App.
-- user_id defaults to auth.uid() so Postgres automatically stamps the logged-in user
-- and the frontend never sends or trusts a client-supplied user_id.

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  title text not null check (char_length(title) between 1 and 100),
  description text,
  due_date date,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

