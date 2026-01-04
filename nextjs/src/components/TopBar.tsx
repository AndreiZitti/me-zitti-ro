'use client';

import { useState, useEffect } from 'react';

export default function TopBar() {
  const [time, setTime] = useState('');

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

  return (
    <header className="flex justify-between items-center h-7 px-4 bg-[rgba(15,23,42,0.85)] backdrop-blur-[20px] border-b border-[var(--border-subtle)] relative z-50">
      <div className="flex items-center h-full">
        <div className="flex items-center gap-1.5 px-2.5 h-full">
          <span className="text-sm text-accent-primary">&#10022;</span>
          <span className="text-[13px] font-medium text-text-primary">ZittiHub</span>
        </div>
      </div>

      <div className="flex items-center h-full">
        <span className="font-mono text-xs text-text-secondary">{time}</span>
      </div>
    </header>
  );
}
