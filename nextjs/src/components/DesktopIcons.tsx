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
  className?: string;
  extraElements?: ReactNode;
}

interface DesktopIconsProps {
  onOpenModal: (url: string) => void;
  onOpenProfile: () => void;
  layout?: 'constellation' | 'grid';
  iconStyle?: 'minimal' | 'colorful' | 'animated';
}

// Animated GIF icon paths - place your GIFs in /public/icons/animated/
// Expected filenames: now.gif, cosmos.gif, stargazing.gif, library.gif, games.gif, travel.gif, projects.gif, profile.gif
const animatedIcons: Record<string, string> = {
  now: '/icons/animated/now.gif',
  cosmos: '/icons/animated/cosmos.gif',
  stargazing: '/icons/animated/stargazing.gif',
  library: '/icons/animated/library.gif',
  games: '/icons/animated/games.gif',
  travel: '/icons/animated/travel.gif',
  projects: '/icons/animated/projects.gif',
  profile: '/icons/animated/profile.gif',
  'food-tracker': '/icons/animated/food-tracker.gif',
};

// Colorful icon configurations with gradients
const colorfulIcons: Record<string, { gradient: string; icon: ReactNode }> = {
  now: {
    gradient: 'from-indigo-500 to-purple-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
    ),
  },
  cosmos: {
    gradient: 'from-violet-600 to-indigo-800',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.3" />
        <circle cx="12" cy="5" r="1" fill="white" />
        <circle cx="17" cy="9" r="0.75" fill="white" />
        <circle cx="7" cy="15" r="0.75" fill="white" />
      </svg>
    ),
  },
  stargazing: {
    gradient: 'from-amber-400 to-orange-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  library: {
    gradient: 'from-emerald-500 to-teal-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="white" fillOpacity="0.2" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="13" y2="11" />
      </svg>
    ),
  },
  games: {
    gradient: 'from-rose-500 to-pink-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="6" width="20" height="12" rx="3" fill="white" fillOpacity="0.2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="10" r="1.25" fill="white" />
        <circle cx="16" cy="14" r="1.25" fill="white" />
      </svg>
    ),
  },
  travel: {
    gradient: 'from-sky-400 to-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" fill="white" fillOpacity="0.15" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M12 3a13 13 0 0 1 3.5 9 13 13 0 0 1-3.5 9 13 13 0 0 1-3.5-9 13 13 0 0 1 3.5-9z" />
      </svg>
    ),
  },
  projects: {
    gradient: 'from-slate-600 to-slate-800',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  profile: {
    gradient: 'from-cyan-500 to-blue-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.3" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="white" fillOpacity="0.2" />
      </svg>
    ),
  },
  'food-tracker': {
    gradient: 'from-lime-500 to-green-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M7 3v5c0 1.5-1 2-1 4v9" />
        <path d="M5 3v3" />
        <path d="M9 3v3" />
        <path d="M7 6c-1 0-2 .5-2 2h4c0-1.5-1-2-2-2z" fill="white" fillOpacity="0.2" />
        <path d="M17 3v18" />
        <path d="M17 3c2 0 3 2 3 5s-1.5 4-3 4" fill="white" fillOpacity="0.3" />
      </svg>
    ),
  },
};

const icons: DesktopIconData[] = [
  {
    id: 'now',
    label: 'Now',
    hint: "What I'm currently up to",
    internal: '/now',
    x: '82%',
    y: '18%',
    className: 'icon-clock',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <g className="clock-hands">
          <polyline points="12 6 12 12 16 14" />
        </g>
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
    className: 'icon-cosmos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle className="radar-ring" cx="12" cy="12" r="4" />
        <circle className="radar-ring" cx="12" cy="12" r="4" />
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
    className: 'icon-star',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'food-tracker',
    label: 'Food Tracker',
    hint: 'Track nutrition and weight with AI-powered label scanning',
    external: 'https://food-tracker.zitti.ro',
    x: '84%',
    y: '57%',
    className: 'icon-food',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path className="fork" d="M7 3v5c0 1.5-1 2-1 4v9" />
        <path d="M5 3v3" />
        <path d="M9 3v3" />
        <path d="M7 6c-1 0-2 .5-2 2h4c0-1.5-1-2-2-2z" />
        <path className="knife" d="M17 3v18" />
        <path d="M17 3c2 0 3 2 3 5s-1.5 4-3 4" />
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
    className: 'icon-library',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path className="book-cover" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
    className: 'icon-games',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle className="game-dpad" cx="8" cy="12" r="2" />
        <circle className="game-btn-1" cx="16" cy="10" r="1" />
        <circle className="game-btn-2" cx="16" cy="14" r="1" />
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
    className: 'icon-travel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    extraElements: <div className="travel-dot" />,
  },
  {
    id: 'projects',
    label: 'Projects',
    hint: 'My portfolio of work and experiments',
    external: 'https://projects.zitti.ro',
    x: '80%',
    y: '82%',
    className: 'icon-terminal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline className="terminal-chevron" points="4 17 10 11 4 5" />
        <line className="terminal-cursor" x1="12" y1="19" x2="20" y2="19" />
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
    className: 'icon-profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path className="avatar-body" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle className="avatar-head" cx="12" cy="7" r="4" />
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

export default function DesktopIcons({ onOpenModal, onOpenProfile, layout = 'constellation', iconStyle = 'minimal' }: DesktopIconsProps) {
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
            className={`desktop-icon flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 opacity-0 hover:scale-[1.08] hover:bg-[rgba(99,102,241,0.1)] hover:[box-shadow:0_0_20px_rgba(99,102,241,0.4)] hover:text-accent-primary active:scale-95 ${
              icon.className || ''
            } ${
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
            {iconStyle === 'animated' && animatedIcons[icon.id] ? (
              <div className="icon-wrapper icon-animated relative w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animatedIcons[icon.id]}
                  alt={icon.label}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // Fallback to colorful icon if GIF not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback colorful icon (hidden by default) */}
                <div className={`hidden w-12 h-12 rounded-xl bg-gradient-to-br ${colorfulIcons[icon.id]?.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                  <div className="w-6 h-6">{colorfulIcons[icon.id]?.icon || icon.icon}</div>
                </div>
              </div>
            ) : iconStyle === 'colorful' && colorfulIcons[icon.id] ? (
              <div className={`icon-wrapper relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${colorfulIcons[icon.id].gradient} shadow-lg transition-all duration-200`}>
                <div className="w-6 h-6">{colorfulIcons[icon.id].icon}</div>
              </div>
            ) : (
              <div className={`icon-wrapper relative w-14 h-14 flex items-center justify-center bg-transparent border-none rounded-lg text-text-secondary transition-all duration-200 ${icon.className || ''}`}>
                <div className="w-8 h-8">{icon.icon}</div>
                {icon.extraElements}
              </div>
            )}
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
