-- Step 2: Enable Row Level Security (RLS) and restrict access per user.
-- Without RLS, anyone holding the public anon key could query every user's tasks.

alter table tasks enable row level security;

-- Single policy covering SELECT, INSERT, UPDATE, and DELETE:
-- - USING controls which existing rows a user can read, update, or delete.
-- - WITH CHECK controls which rows a user can insert or update to.
create policy "Users manage own tasks" on tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

