'use client';

import { useEffect, useState } from 'react';

export default function BootAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we should skip the boot animation (visited this hour)
    const now = new Date();
    const currentHour = `${now.toDateString()}-${now.getHours()}`;
    const lastBoot = localStorage.getItem('zittihub-last-boot');

    if (lastBoot === currentHour) {
      setIsVisible(false);
    } else {
      localStorage.setItem('zittihub-last-boot', currentHour);
      // Hide after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-boot-fade-out"
      id="boot-screen"
    >
      <div
        className="w-1 h-1 rounded-full bg-white animate-boot-dot-to-line"
        style={{
          boxShadow: '0 0 8px #fff, 0 0 16px #fff, 0 0 32px rgba(255, 255, 255, 0.6)',
          animation: 'dotToLine 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards, lineExpand 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards',
        }}
      />
    </div>
  );
}
