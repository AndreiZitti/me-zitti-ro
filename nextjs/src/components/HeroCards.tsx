'use client';

import type { ReactNode } from 'react';
import type { NowEntry } from '@/app/now/actions';

interface HeroCardsProps {
  onOpenModal: (url: string) => void;
  latestNow: NowEntry | null;
}

interface CardConfig {
  id: string;
  label: string;
  tagline: string;
  icon: ReactNode;
  meta?: string;
  internal?: string;
  external?: string;
  fullScreen?: boolean;
}

function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function HeroCards({ onOpenModal, latestNow }: HeroCardsProps) {
  const cards: CardConfig[] = [
    {
      id: 'now',
      label: 'Now',
      tagline: "What I'm currently up to",
      internal: '/now',
      fullScreen: true,
      meta: latestNow ? `Last updated ${formatDate(latestNow.entry_date)}` : undefined,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'cosmos',
      label: 'Cosmos Map',
      tagline: 'Collection of my astronomy photographs',
      internal: '/pages/star-map/index.html',
      fullScreen: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      tagline: 'My portfolio of work and experiments',
      external: 'https://projects.zitti.ro',
      meta: 'Stargazing · Library · Food Tracker · Games · Travel · Stash',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      ),
    },
  ];

  const handleClick = (card: CardConfig) => {
    if (card.external) {
      window.location.href = card.external;
    } else if (card.internal) {
      if (card.fullScreen) {
        window.location.href = card.internal;
      } else {
        onOpenModal(card.internal);
      }
    }
  };

  return (
    <div className="z-[1] flex flex-col gap-4 px-6 pb-8 pt-4 lg:absolute lg:right-12 lg:top-1/2 lg:-translate-y-1/2 lg:w-[420px] lg:px-0 lg:py-0">
      {cards.map((card, i) => (
        <button
          key={card.id}
          onClick={() => handleClick(card)}
          className="group relative flex items-center gap-4 bg-bg-surface backdrop-blur-xl border border-[var(--border-subtle)] rounded-lg p-5 text-left opacity-0 transition-all duration-fast hover:border-[var(--border-hover)] hover:bg-[rgba(99,102,241,0.08)] hover:[box-shadow:0_0_40px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 cursor-pointer"
          style={{
            animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
            animationDelay: `${1.3 + i * 0.12}s`,
          }}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[rgba(99,102,241,0.08)] border border-[var(--border-subtle)] text-text-secondary transition-colors duration-fast group-hover:text-accent-primary group-hover:border-[var(--border-hover)] shrink-0">
            <div className="w-6 h-6">{card.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[0.9375rem] font-semibold text-text-primary mb-0.5 transition-colors duration-fast group-hover:text-accent-primary">
              {card.label}
            </h3>
            <p className="text-[0.8125rem] text-text-secondary leading-snug">
              {card.tagline}
            </p>
            {card.meta && (
              <p className="text-[0.75rem] text-text-muted mt-1.5 truncate">
                {card.meta}
              </p>
            )}
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 text-text-muted transition-all duration-fast group-hover:text-accent-primary group-hover:translate-x-1 shrink-0"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );
}
