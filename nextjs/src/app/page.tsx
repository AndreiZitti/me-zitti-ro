'use client';

import { useState, useEffect } from 'react';
import BootAnimation from '@/components/BootAnimation';
import Starfield from '@/components/Starfield';
import TopBar from '@/components/TopBar';
import WelcomePanel from '@/components/WelcomePanel';
import DesktopIcons from '@/components/DesktopIcons';
import Modal from '@/components/Modal';
import ProfilePanel from '@/components/ProfilePanel';

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [layout, setLayout] = useState<'constellation' | 'grid'>('constellation');
  const [iconStyle, setIconStyle] = useState<'minimal' | 'colorful' | 'animated'>('minimal');

  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);

    // Load layout preference
    const savedLayout = localStorage.getItem('zittihub-layout') as 'constellation' | 'grid' || 'constellation';
    setLayout(savedLayout);

    // Load icon style preference
    const savedIconStyle = localStorage.getItem('zittihub-icon-style') as 'minimal' | 'colorful' | 'animated' || 'minimal';
    setIconStyle(savedIconStyle);

    // Listen for layout changes from ProfilePanel
    const handleLayoutChange = (e: CustomEvent) => setLayout(e.detail);
    window.addEventListener('layout-change', handleLayoutChange as EventListener);

    // Listen for icon style changes from ProfilePanel
    const handleIconStyleChange = (e: CustomEvent) => setIconStyle(e.detail);
    window.addEventListener('icon-style-change', handleIconStyleChange as EventListener);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }

    return () => {
      window.removeEventListener('layout-change', handleLayoutChange as EventListener);
      window.removeEventListener('icon-style-change', handleIconStyleChange as EventListener);
    };
  }, []);

  const handleOpenModal = (url: string) => {
    setModalUrl(url);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalUrl(''), 300);
  };

  return (
    <>
      {/* Boot Animation */}
      <BootAnimation />

      {/* Starfield Background */}
      <Starfield />

      {/* Desktop Container */}
      <div
        className="relative z-[1] min-h-screen flex flex-col opacity-0 lg:h-screen lg:overflow-hidden"
        style={{
          animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: isBooted ? '0s' : '1s',
        }}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible">
          {/* Welcome Panel */}
          <WelcomePanel />

          {/* Desktop Icons */}
          <DesktopIcons
            onOpenModal={handleOpenModal}
            onOpenProfile={() => setProfileOpen(true)}
            layout={layout}
            iconStyle={iconStyle}
          />
        </div>
      </div>

      {/* Modal for App Windows */}
      <Modal isOpen={modalOpen} url={modalUrl} onClose={handleCloseModal} />

      {/* Profile Panel */}
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
