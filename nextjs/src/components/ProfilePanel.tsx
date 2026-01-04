'use client';

import { useEffect, useRef, useState } from 'react';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const [selectedBackground, setSelectedBackground] = useState('starfield');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Load saved background preference
    const saved = localStorage.getItem('zittios-background') || 'starfield';
    setSelectedBackground(saved);
    applyBackground(saved);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const applyBackground = (bg: string) => {
    document.body.classList.remove('bg-starfield', 'bg-aurora');
    if (bg !== 'starfield') {
      document.body.classList.add(`bg-${bg}`);
    }
  };

  const handleBackgroundChange = (bg: string) => {
    setSelectedBackground(bg);
    applyBackground(bg);
    localStorage.setItem('zittios-background', bg);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(5,8,15,0.7)] backdrop-blur transition-all duration-normal ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`w-[90vw] max-w-[400px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg transition-transform duration-normal ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
        style={{ boxShadow: 'var(--shadow-glow), var(--shadow-soft)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-base font-semibold text-text-primary">Profile</h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-transparent border border-[var(--border-subtle)] rounded-full text-text-secondary cursor-pointer transition-all duration-fast hover:bg-[rgba(239,68,68,0.2)] hover:border-[rgba(239,68,68,0.3)] hover:text-[#ef4444]"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Login Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
              Account
            </h3>
            <div className="flex flex-col items-center p-5 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md">
              <div className="w-14 h-14 flex items-center justify-center bg-[rgba(99,102,241,0.1)] border border-[var(--border-subtle)] rounded-full text-text-muted mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                You&apos;re browsing as a guest
              </p>
              <button
                onClick={() => alert('Login coming soon!')}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-primary border-none rounded-sm text-white text-sm font-medium cursor-pointer transition-all duration-fast hover:bg-accent-secondary hover:-translate-y-px"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Desktop Background Section */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
              Desktop Background
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`flex flex-col items-center gap-2 p-3 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                  selectedBackground === 'starfield'
                    ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
                onClick={() => handleBackgroundChange('starfield')}
              >
                <div className="w-full aspect-video rounded-sm overflow-hidden bg-gradient-to-b from-[#0a0f1a] to-[#05080f] relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        radial-gradient(1px 1px at 20% 30%, white, transparent),
                        radial-gradient(1px 1px at 40% 70%, white, transparent),
                        radial-gradient(1px 1px at 60% 20%, white, transparent),
                        radial-gradient(1px 1px at 80% 60%, white, transparent),
                        radial-gradient(1px 1px at 10% 80%, white, transparent),
                        radial-gradient(1px 1px at 70% 40%, white, transparent)
                      `,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    selectedBackground === 'starfield' ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  Starfield
                </span>
              </button>

              <button
                className={`flex flex-col items-center gap-2 p-3 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                  selectedBackground === 'aurora'
                    ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                }`}
                onClick={() => handleBackgroundChange('aurora')}
              >
                <div
                  className="w-full aspect-video rounded-sm overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f3a 30%, #2d1f4a 60%, #1a2f3a 100%)',
                  }}
                />
                <span
                  className={`text-xs font-medium ${
                    selectedBackground === 'aurora' ? 'text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  Aurora
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
