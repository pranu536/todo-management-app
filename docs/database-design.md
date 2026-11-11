# Database Design (`tasks` Table & RLS)

The PostgreSQL schema and security policies live in `database/schema.sql` and `database/policies.sql`.

## `tasks` Table Columns

| Column | Type | Default / Constraints | Purpose |
| --- | --- | --- | --- |
| `id` | `uuid` | `primary key default gen_random_uuid()` | Unique identifier generated automatically per task |
| `user_id` | `uuid` | `references auth.users not null default auth.uid()` | Owner of the task; auto-filled by Postgres from the logged-in user's JWT |
| `title` | `text` | `not null check (char_length(title) between 1 and 100)` | Task title enforced both on client (`validators.js`) and database |
| `description` | `text` | nullable | Optional details for the task |
| `due_date` | `date` | nullable in DB (required in UI form) | Target date (`YYYY-MM-DD`) used for display and overdue highlighting |
| `is_completed` | `boolean` | `not null default false` | Tracks whether the task is Pending (`false`) or Completed (`true`) |
| `created_at` | `timestamptz` | `not null default now()` | Creation timestamp used for descending sort order |

## Row Level Security (RLS)

```sql
alter table tasks enable row level security;

create policy "Users manage own tasks" on tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### How It Works

1. **`alter table tasks enable row level security;`**
   Once enabled, Postgres denies all access through the public API unless an explicit policy grants permission.
2. **`for all`**
   Applies the single rule uniformly to `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
3. **`using (auth.uid() = user_id)`**
   Filters existing rows on reads (`SELECT`), updates (`UPDATE`), and deletes (`DELETE`). Even without a `.eq('user_id', ...)` filter in `taskService.js`, a user only receives and modifies rows where `user_id` matches their JWT `auth.uid()`.
4. **`with check (auth.uid() = user_id)`**
   Validates newly inserted or updated row values. Combined with `default auth.uid()`, the frontend never sends `user_id`, and a tampered client cannot write tasks under another user's ID.

