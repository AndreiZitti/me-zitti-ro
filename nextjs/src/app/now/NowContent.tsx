'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEntry, updateEntry, deleteEntry, type NowEntry } from './actions';

interface NowContentProps {
  entries: NowEntry[];
  canEdit: boolean;
}

interface EditingState {
  id: string | 'new';
  label: string;
  text: string;
  entryDate: string;
}

interface DateGroup {
  date: string;
  dateLabel: string;
  entries: NowEntry[];
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function groupEntriesByDate(entries: NowEntry[]): DateGroup[] {
  const groups: DateGroup[] = [];
  let currentGroup: DateGroup | null = null;

  for (const entry of entries) {
    if (!currentGroup || currentGroup.date !== entry.entry_date) {
      currentGroup = {
        date: entry.entry_date,
        dateLabel: formatDateLabel(entry.entry_date),
        entries: [entry],
      };
      groups.push(currentGroup);
    } else {
      currentGroup.entries.push(entry);
    }
  }

  return groups;
}

export default function NowContent({ entries: initialEntries, canEdit }: NowContentProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = (entry: NowEntry) => {
    setEditing({ id: entry.id, label: entry.label, text: entry.text, entryDate: entry.entry_date });
    setError(null);
  };

  const handleAddNew = () => {
    setEditing({ id: 'new', label: '', text: '', entryDate: getTodayString() });
    setError(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    
    if (!editing.label.trim() || !editing.text.trim()) {
      setError('Both label and text are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editing.id === 'new') {
        // Optimistic update - add to top
        const tempEntry: NowEntry = {
          id: 'temp-' + Date.now(),
          label: editing.label,
          text: editing.text,
          entry_date: editing.entryDate,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setEntries([tempEntry, ...entries]);
        setEditing(null);

        const result = await createEntry(editing.label, editing.text, editing.entryDate);
        if (!result.success) {
          // Revert on error
          setEntries(entries);
          setError(result.error || 'Failed to create entry');
        } else {
          // Refresh to get real ID from server
          router.refresh();
        }
      } else {
        // Optimistic update
        const updatedEntries = entries.map(e =>
          e.id === editing.id
            ? { ...e, label: editing.label, text: editing.text, entry_date: editing.entryDate, updated_at: new Date().toISOString() }
            : e
        );
        setEntries(updatedEntries);
        setEditing(null);

        const result = await updateEntry(editing.id, editing.label, editing.text, editing.entryDate);
        if (!result.success) {
          // Revert on error
          setEntries(entries);
          setError(result.error || 'Failed to update entry');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Don't delete temp entries (still being created)
    if (id.startsWith('temp-')) {
      setError('Please wait for the entry to finish saving');
      return;
    }

    if (!confirm('Delete this entry?')) return;

    const originalEntries = [...entries];
    // Optimistic update
    setEntries(entries.filter(e => e.id !== id));
    setError(null);

    const result = await deleteEntry(id);
    if (!result.success) {
      // Revert on error
      setEntries(originalEntries);
      setError(result.error || 'Failed to delete entry');
    }
  };

  
  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-[var(--bg-deep)]/80 border-b border-[var(--border-subtle)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          {canEdit && (
            <span className="text-xs text-[var(--accent-primary)]">Editing enabled</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-2">Now</h1>
          <p className="text-[var(--text-muted)]">
            What is happening now with me.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Add new button at top */}
        {canEdit && !editing && (
          <button
            onClick={handleAddNew}
            className="mb-8 flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-sm">Add entry</span>
          </button>
        )}

        {/* Add new entry form at top */}
        {editing?.id === 'new' && (
          <div className="mb-8 space-y-3 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)]">
            <div className="flex gap-3">
              <input
                type="date"
                value={editing.entryDate}
                onChange={(e) => setEditing({ ...editing, entryDate: e.target.value })}
                className="px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <input
                type="text"
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                placeholder="Label (e.g., Working on, Reading)"
                className="flex-1 px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                autoFocus
              />
            </div>
            <textarea
              value={editing.text}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              placeholder="Content..."
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] disabled:opacity-50 text-white text-sm rounded transition-colors"
              >
                {saving ? 'Saving...' : 'Add'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Entries grouped by date */}
        <section className="space-y-10">
          {groupEntriesByDate(entries).map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="mb-4 pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-sm font-medium text-[var(--accent-primary)]">
                  {group.dateLabel}
                </span>
              </div>

              {/* Entries for this date */}
              <div className="space-y-4">
                {group.entries.map((entry) => (
                  <div key={entry.id} className="group relative">
                    {editing?.id === entry.id ? (
                      // Edit mode
                      <div className="space-y-3 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)]">
                        <div className="flex gap-3">
                          <input
                            type="date"
                            value={editing.entryDate}
                            onChange={(e) => setEditing({ ...editing, entryDate: e.target.value })}
                            className="px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                          />
                          <input
                            type="text"
                            value={editing.label}
                            onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                            placeholder="Label (e.g., Working on, Reading)"
                            className="flex-1 px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                          />
                        </div>
                        <textarea
                          value={editing.text}
                          onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                          placeholder="Content..."
                          rows={3}
                          className="w-full px-3 py-2 bg-white/5 border border-[var(--border-subtle)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] disabled:opacity-50 text-white text-sm rounded transition-colors"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] text-sm rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="flex items-start gap-3">
                        <p className="flex-1 text-[var(--text-secondary)] leading-relaxed">
                          <span className="font-semibold text-[var(--accent-primary)]">
                            {entry.label}
                          </span>{' '}
                          {entry.text}
                        </p>
                        {canEdit && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Footer note */}
        <footer className="mt-16 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)]">
            This is a{' '}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:underline"
            >
              now page
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
