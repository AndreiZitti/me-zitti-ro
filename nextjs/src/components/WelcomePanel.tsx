'use client';

import { useEffect, useState } from 'react';

export default function WelcomePanel() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);
  }, []);

  return (
    <div
      className="relative px-6 py-8 max-w-[320px] z-[1] opacity-0 mx-auto text-center lg:absolute lg:top-1/2 lg:left-12 lg:-translate-y-1/2 lg:mx-0 lg:text-left lg:px-0 lg:py-0"
      style={{
        animation: `welcomeFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        animationDelay: isBooted ? '0.1s' : '1.15s',
      }}
    >
      <h1 className="text-[1.75rem] font-semibold text-text-primary mb-2">
        Welcome to my hub
      </h1>
      <p className="text-[0.9375rem] text-text-secondary leading-[1.7] mb-3">
        AI Engineer by day, stargazer by night. I build things that interest me and share them here for free. When I&apos;m not coding, you&apos;ll find me sailing or photographing the cosmos.
      </p>
      <p className="text-base text-text-secondary leading-relaxed mb-5">
        Feel free to explore the apps, and if you find bugs or have ideas, just reach out.
      </p>

      <a
        href="https://projects.zitti.ro"
        className="inline-flex items-center gap-2 text-accent-primary no-underline font-medium text-[0.9375rem] transition-all duration-fast hover:text-accent-secondary hover:gap-3 group"
      >
        <span>View my portfolio</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-[18px] h-[18px] transition-transform duration-fast group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>

      {/* Social Links */}
      <div className="flex gap-3 mt-6 justify-center lg:justify-start">
        <a
          href="https://www.linkedin.com/in/zitti"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 bg-white/5 border border-[var(--border-subtle)] rounded-sm text-text-muted transition-all duration-fast hover:bg-[rgba(99,102,241,0.15)] hover:border-[var(--border-hover)] hover:text-accent-primary hover:-translate-y-0.5"
          aria-label="LinkedIn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://github.com/AndreiZitti"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 bg-white/5 border border-[var(--border-subtle)] rounded-sm text-text-muted transition-all duration-fast hover:bg-[rgba(99,102,241,0.15)] hover:border-[var(--border-hover)] hover:text-accent-primary hover:-translate-y-0.5"
          aria-label="GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://instagram.com/lensoftheuniverse_"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 bg-white/5 border border-[var(--border-subtle)] rounded-sm text-text-muted transition-all duration-fast hover:bg-[rgba(99,102,241,0.15)] hover:border-[var(--border-hover)] hover:text-accent-primary hover:-translate-y-0.5"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>

      {/* Contact Section */}
      <div className="mt-8 pt-5 border-t border-[var(--border-subtle)]">
        <p className="text-[0.8125rem] text-text-muted mb-1">
          Found a bug or have suggestions?
        </p>
        <a
          href="mailto:andrei@zitti.ro"
          className="text-text-secondary no-underline text-sm transition-colors duration-fast hover:text-accent-primary"
        >
          andrei@zitti.ro
        </a>
      </div>
    </div>
  );
}
