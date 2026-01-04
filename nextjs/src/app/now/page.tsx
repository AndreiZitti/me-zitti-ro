'use client';

import { useState } from 'react';
import Link from 'next/link';

// Current "now" snapshot - edit this section to update
const currentSnapshot = {
  lastUpdated: 'January 1, 2026',
  sections: [
    {
      label: 'Working on',
      text: `my master thesis in the medical AI domain. Currently playing with Neural Cellular Automata (NCAs) - watching patterns emerge from simple rules is endlessly fascinating. This is my last semester.`,
    },
    {
      label: 'Chasing',
      text: `clear skies for astrophotography. Winter nights are long but clouds have been relentless. Waiting for that perfect window.`,
    },
    {
      label: 'Reading',
      text: `Dracula by Bram Stoker. Finally getting around to the original after years of pop culture references.`,
    },
    {
      label: 'Dealing with',
      text: `a broken tendon in my left thumb. Opening doors and putting on shoes have become surprisingly difficult puzzles to solve one-handed.`,
    },
    {
      label: 'Updated',
      text: `January 1, 2026.`,
    },
  ],
};

// Past updates archive - add old snapshots here when you update
const pastUpdates: { date: string; title: string; content: string }[] = [];

export default function NowPage() {
  const [archiveOpen, setArchiveOpen] = useState(false);

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

        {/* Current Snapshot */}
        <section className="mb-16 space-y-6">
          {currentSnapshot.sections.map((section, index) => (
            <p key={index} className="text-[var(--text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--accent-primary)]">
                {section.label}
              </span>{' '}
              {section.text}
            </p>
          ))}
        </section>

        {/* Archive Section */}
        {pastUpdates.length > 0 && (
          <section>
            <button
              onClick={() => setArchiveOpen(!archiveOpen)}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-6"
            >
              <svg
                className={`w-4 h-4 transition-transform ${archiveOpen ? 'rotate-90' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
              <span className="text-sm font-medium">Past updates ({pastUpdates.length})</span>
            </button>

            {archiveOpen && (
              <div className="space-y-8 pl-6 border-l border-[var(--border-subtle)]">
                {pastUpdates.map((update, index) => (
                  <article key={index}>
                    <div className="text-xs font-medium uppercase tracking-wider text-[var(--accent-primary)] mb-2">
                      {update.date}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{update.title}</h3>
                    <p className="text-[var(--text-secondary)]">{update.content}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

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
