import { supabase } from '../lib/supabaseClient';

// Keep all Supabase database queries in one service file so UI components stay clean.
// Why no user_id filter here? Postgres Row Level Security (auth.uid() = user_id) enforces
// per-user isolation on the database side, even if client code were modified.

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask({ title, description, due_date, is_completed = false }) {
  // Why omit user_id? The column defaults to auth.uid() in Postgres so the frontend never sends it.
  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, description, due_date, is_completed })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTasks(tasks) {
  const { data, error } = await supabase.from('tasks').insert(tasks).select();
  if (error) throw error;
  return data ?? [];
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
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

