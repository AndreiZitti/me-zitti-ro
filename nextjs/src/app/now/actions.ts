'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface NowEntry {
  id: string;
  label: string;
  text: string;
  entry_date: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getEntries(): Promise<NowEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('now_entries')
    .select('*')
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }

  return data || [];
}

export async function createEntry(label: string, text: string, entryDate: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get the highest sort_order
  const { data: existing } = await supabase
    .from('now_entries')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error } = await supabase
    .from('now_entries')
    .insert({ label, text, entry_date: entryDate, sort_order: nextOrder });

  if (error) {
    console.error('Error creating entry:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/now');
  return { success: true };
}

export async function updateEntry(id: string, label: string, text: string, entryDate: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('now_entries')
    .update({ label, text, entry_date: entryDate, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating entry:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/now');
  return { success: true };
}

export async function deleteEntry(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('now_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/now');
  return { success: true };
}

export async function reorderEntries(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Update each entry with its new sort_order
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('now_entries')
      .update({ sort_order: i })
      .eq('id', orderedIds[i]);

    if (error) {
      console.error('Error reordering entries:', error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath('/now');
  return { success: true };
}
