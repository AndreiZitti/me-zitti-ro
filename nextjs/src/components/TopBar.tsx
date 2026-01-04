'use client';

import { useState, useEffect, useRef } from 'react';

interface TopBarProps {
  onOpenSettings?: () => void;
}

export default function TopBar({ onOpenSettings }: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleAction = (action: string) => {
    setIsMenuOpen(false);
    if (action === 'about') {
      alert('ZittiOS v2.0\n\nA desktop-style personal website.\n\nBuilt with Next.js, TypeScript, and love.');
    } else if (action === 'settings') {
      onOpenSettings?.();
    }
  };

  return (
    <header className="flex justify-between items-center h-7 px-4 bg-[rgba(15,23,42,0.85)] backdrop-blur-[20px] border-b border-[var(--border-subtle)] relative z-50">
      <div className="flex items-center h-full">
        <div
          ref={menuRef}
          className={`flex items-center gap-1.5 px-2.5 h-full cursor-pointer relative rounded transition-colors duration-fast ${
            isMenuOpen ? 'bg-white/10' : 'hover:bg-white/10'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span className="text-sm text-accent-primary">&#10022;</span>
          <span className="text-[13px] font-medium text-text-primary">ZittiOS</span>
          <svg
            className={`w-2.5 h-2.5 text-text-muted transition-transform duration-fast ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 12 12"
            fill="currentColor"
          >
            <path d="M3 5l3 3 3-3" />
          </svg>

          {/* Dropdown */}
          <div
            className={`absolute top-full left-0 min-w-[200px] mt-1 py-1 bg-[var(--bg-surface)] backdrop-blur-[20px] border border-[var(--border-subtle)] rounded-md shadow-[var(--shadow-soft)] z-[100] transition-all duration-fast ${
              isMenuOpen
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            <button
              className="block w-full px-4 py-2 bg-transparent border-none text-left text-[13px] text-text-primary cursor-pointer transition-colors duration-fast hover:bg-[rgba(99,102,241,0.2)]"
              onClick={() => handleAction('about')}
            >
              About ZittiOS
            </button>
            <div className="h-px bg-[var(--border-subtle)] my-1" />
            <button
              className="block w-full px-4 py-2 bg-transparent border-none text-left text-[13px] text-text-primary cursor-pointer transition-colors duration-fast hover:bg-[rgba(99,102,241,0.2)]"
              onClick={() => handleAction('settings')}
            >
              Settings...
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center h-full">
        <span className="font-mono text-xs text-text-secondary">{time}</span>
      </div>
    </header>
  );
}
