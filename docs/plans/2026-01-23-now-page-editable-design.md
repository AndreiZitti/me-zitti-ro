# Now Page - Editable Updates Feature

## Overview

Add the ability to manage "Now" page entries through inline editing when logged in. Entries are stored in Supabase with public read access and authenticated-only write access.

## Database Schema

```sql
create table now_entries (
  id uuid default gen_random_uuid() primary key,
  label text not null,           -- "Working on", "Reading", etc.
  text text not null,            -- The content
  sort_order integer not null,   -- For ordering entries
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table now_entries enable row level security;

-- Public can read
create policy "Public read" on now_entries for select using (true);

-- Only authenticated users can modify
create policy "Auth insert" on now_entries for insert with check (auth.role() = 'authenticated');
create policy "Auth update" on now_entries for update using (auth.role() = 'authenticated');
create policy "Auth delete" on now_entries for delete using (auth.role() = 'authenticated');
```

## Component Architecture

```
page.tsx (server component)
  - Fetches entries from Supabase using server client
  - Fetches current user authentication status
  - Renders NowContent client component

NowContent (client component within page.tsx)
  - Receives entries and isAuthenticated as props
  - Handles edit/add/delete with optimistic UI
  - Uses Supabase browser client for mutations
```

## UI Behavior

### When logged out:
- Displays entries from database (read-only)
- Current styling preserved

### When logged in:
- Each entry shows edit (pencil) and delete (trash) icons on hover
- "Add entry" button appears at the bottom
- Clicking edit transforms entry into inline form (label + text inputs)
- Save/Cancel buttons appear while editing
- Optimistic updates for smooth UX

## Files to Modify

1. **`nextjs/src/app/now/page.tsx`**
   - Convert to hybrid server/client component
   - Add NowContent client component for interactivity
   - Fetch entries and auth status on server

2. **`nextjs/src/app/now/actions.ts`** (new)
   - Server actions: createEntry, updateEntry, deleteEntry, reorderEntries

## Data Migration

Seed database with existing hardcoded entries:
1. "Working on" - master thesis / NCA content
2. "Chasing" - astrophotography content
3. "Reading" - Dracula content
4. "Dealing with" - broken tendon content
5. "Updated" - January 1, 2026

## Security

- RLS policies ensure only authenticated users can modify
- Public read access maintained for visitors
- No protected route needed - page is public, editing is conditional
