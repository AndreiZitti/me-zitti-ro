'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  url: string;
  onClose: () => void;
}

export default function Modal({ isOpen, url, onClose }: ModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(5,8,15,0.7)] backdrop-blur transition-all duration-normal ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div
        className={`relative w-[90vw] h-[85vh] max-w-[1200px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden transition-transform duration-normal ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
        style={{ boxShadow: 'var(--shadow-glow), var(--shadow-soft)' }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full text-text-secondary cursor-pointer transition-all duration-fast hover:bg-[rgba(239,68,68,0.2)] hover:border-[rgba(239,68,68,0.3)] hover:text-[#ef4444]"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          ref={iframeRef}
          src={isOpen ? url : ''}
          title="App content"
          loading="lazy"
          className="w-full h-full border-none bg-[var(--bg-deep)]"
        />
      </div>
    </div>
  );
}
