import { supabase } from '../lib/supabaseClient';

// Keep all Supabase database queries in one service file so UI components stay clean.
// Why no user_id filter here? Postgres Row Level Security (auth.uid() = user_id) enforces
// per-user isolation on the database side, even if client code were modified.

function normalizeTaskInput({ title, description, due_date, is_completed }) {
  return {
    title: String(title || '').trim(),
    description: description ? String(description).trim() : null,
    due_date: due_date || null,
    ...(typeof is_completed === 'boolean' ? { is_completed } : {}),
  };
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTask(input) {
  // Why omit user_id? The column defaults to auth.uid() in Postgres so the frontend never sends it.
  const payload = normalizeTaskInput(input);
  const { data, error } = await supabase.from('tasks').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function createTasks(tasks) {
  const payload = (tasks || []).map((task) => normalizeTaskInput(task));
  const { data, error } = await supabase.from('tasks').insert(payload).select();
  if (error) throw error;
  return data ?? [];
}

export async function updateTask(id, updates) {
  const payload =
    updates && (updates.title !== undefined || updates.description !== undefined || updates.due_date !== undefined)
      ? {
          ...updates,
          ...(updates.title !== undefined ? { title: String(updates.title).trim() } : {}),
          ...(updates.description !== undefined
            ? { description: updates.description ? String(updates.description).trim() : null }
            : {}),
        }
      : updates;

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

// Complete and Reopen are the same update with a different boolean value
export const setCompleted = (id, isCompleted) =>
  updateTask(id, { is_completed: isCompleted });
