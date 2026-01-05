'use client';

import { useEffect, useState, ReactNode } from 'react';

interface DesktopIconData {
  id: string;
  label: string;
  hint: string;
  icon: ReactNode;
  x: string;
  y: string;
  internal?: string;
  external?: string;
  action?: string;
}

interface DesktopIconsProps {
  onOpenModal: (url: string) => void;
  onOpenProfile: () => void;
  layout?: 'constellation' | 'grid';
}

const icons: DesktopIconData[] = [
  {
    id: 'now',
    label: 'Now',
    hint: "What I'm currently up to",
    internal: '/now',
    x: '82%',
    y: '18%',
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
    hint: 'Collection of my astronomy photographs',
    internal: '/pages/star-map/index.html',
    x: '88%',
    y: '28%',
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
    id: 'stargazing',
    label: 'Stargazing',
    hint: 'Find stargazing spots and check weather conditions',
    external: 'https://astro.zitti.ro',
    x: '80%',
    y: '40%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Library',
    hint: "Books I've read (under construction)",
    internal: '/pages/book-library/index.html',
    x: '90%',
    y: '52%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: 'games',
    label: 'Games',
    hint: 'Play games with friends, in person or online',
    external: 'https://games.zitti.ro',
    x: '78%',
    y: '62%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="10" r="1" />
        <circle cx="16" cy="14" r="1" />
      </svg>
    ),
  },
  {
    id: 'travel',
    label: 'Travel',
    hint: 'Record and share your travels',
    external: 'https://travelling.zitti.ro',
    x: '88%',
    y: '72%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    hint: 'My portfolio of work and experiments',
    external: 'https://projects.zitti.ro',
    x: '80%',
    y: '82%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    hint: 'Log in or customize your desktop',
    action: 'openProfile',
    x: '90%',
    y: '92%',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

// Apps that open full screen instead of in modal
const fullScreenApps = ['now', 'cosmos'];

// Grid positions for 2x4 layout
const getGridPosition = (index: number) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return {
    x: col === 0 ? '75%' : '90%',
    y: `${18 + row * 20}%`,
  };
};

export default function DesktopIcons({ onOpenModal, onOpenProfile, layout = 'constellation' }: DesktopIconsProps) {
  const [isBooted, setIsBooted] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);
  }, []);

  const handleClick = (icon: DesktopIconData) => {
    if (icon.action === 'openProfile') {
      onOpenProfile();
    } else if (icon.external) {
      window.location.href = icon.external;
    } else if (icon.internal) {
      if (fullScreenApps.includes(icon.id)) {
        window.location.href = icon.internal;
      } else {
        onOpenModal(icon.internal);
      }
    }
  };

  const getAnimationDelay = (index: number) => {
    if (isBooted) {
      return `${0.08 + index * 0.08}s`;
    }
    return `${1.15 + index * 0.1}s`;
  };

  return (
    <>
      <div className={`z-[1] ${isMobile ? 'relative grid grid-cols-2 gap-4 px-6 pb-8 pt-4' : 'absolute inset-0 pointer-events-none'}`}>
        {icons.map((icon, index) => (
          <button
            key={icon.id}
            className={`flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 opacity-0 hover:scale-[1.08] hover:bg-[rgba(99,102,241,0.1)] hover:[box-shadow:0_0_20px_rgba(99,102,241,0.4)] hover:text-accent-primary active:scale-95 ${
              isMobile
                ? 'relative w-full min-h-[100px] border border-[rgba(148,163,184,0.1)]'
                : 'absolute -translate-x-1/2 -translate-y-1/2 w-[100px] pointer-events-auto'
            }`}
            style={isMobile ? {
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${0.1 + index * 0.05}s`,
            } : {
              left: layout === 'grid' ? getGridPosition(index).x : icon.x,
              top: layout === 'grid' ? getGridPosition(index).y : icon.y,
              animation: `iconReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: getAnimationDelay(index),
            }}
            onClick={() => handleClick(icon)}
            onMouseEnter={() => {
              if (!isMobile) {
                setHintText(icon.hint);
                setShowHint(true);
              }
            }}
            onMouseLeave={() => setShowHint(false)}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-transparent border-none rounded-lg text-text-secondary transition-all duration-200">
              <div className="w-8 h-8">{icon.icon}</div>
            </div>
            <span className="text-xs font-medium text-text-secondary shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {icon.label}
            </span>
            {isMobile && (
              <span className="text-[10px] text-text-muted mt-1 line-clamp-2">
                {icon.hint}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Icon Hint Tooltip - Desktop only */}
      {!isMobile && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-[rgba(15,23,42,0.9)] backdrop-blur-[12px] border border-[var(--border-subtle)] rounded-md z-50 pointer-events-none transition-all duration-200 ${
            showHint ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <span className="text-[0.9375rem] text-text-secondary whitespace-nowrap">
            {hintText}
          </span>
        </div>
      )}
    </>
  );
}
