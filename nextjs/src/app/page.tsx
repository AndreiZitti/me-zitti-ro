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

  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittios-last-boot');
    setIsBooted(lastBoot === today);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }
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
        className="relative z-[1] h-screen flex flex-col opacity-0"
        style={{
          animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: isBooted ? '0s' : '1s',
        }}
      >
        {/* Top Bar */}
        <TopBar onOpenSettings={() => setProfileOpen(true)} />

        {/* Welcome Panel */}
        <WelcomePanel />

        {/* Desktop Icons */}
        <DesktopIcons
          onOpenModal={handleOpenModal}
          onOpenProfile={() => setProfileOpen(true)}
        />
      </div>

      {/* Modal for App Windows */}
      <Modal isOpen={modalOpen} url={modalUrl} onClose={handleCloseModal} />

      {/* Profile Panel */}
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
