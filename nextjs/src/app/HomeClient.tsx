'use client';

import { useState, useEffect } from 'react';
import BootAnimation from '@/components/BootAnimation';
import Starfield from '@/components/Starfield';
import TopBar from '@/components/TopBar';
import WelcomePanel from '@/components/WelcomePanel';
import HeroCards from '@/components/HeroCards';
import Modal from '@/components/Modal';
import type { NowEntry } from './now/actions';

interface HomeClientProps {
  latestNow: NowEntry | null;
}

export default function HomeClient({ latestNow }: HomeClientProps) {
  const [isBooted, setIsBooted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);

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
      <BootAnimation />
      <Starfield />

      <div
        className="relative z-[1] min-h-screen flex flex-col opacity-0 lg:h-screen lg:overflow-hidden"
        style={{
          animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: isBooted ? '0s' : '1s',
        }}
      >
        <TopBar />

        <div className="flex-1 overflow-y-auto lg:overflow-visible">
          <WelcomePanel latestNow={latestNow} />
          <HeroCards onOpenModal={handleOpenModal} latestNow={latestNow} />
        </div>
      </div>

      <Modal isOpen={modalOpen} url={modalUrl} onClose={handleCloseModal} />
    </>
  );
}
