'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'account' | 'desktop';

const apps = [
  { name: 'Games', url: 'https://games.zitti.ro', icon: 'gamepad' },
  { name: 'Stargazing', url: 'https://astro.zitti.ro', icon: 'stars' },
  { name: 'Travel', url: 'https://travelling.zitti.ro', icon: 'plane' },
];

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [selectedBackground, setSelectedBackground] = useState('starfield');
  const [selectedLayout, setSelectedLayout] = useState<'constellation' | 'grid'>('constellation');
  const [selectedIconStyle, setSelectedIconStyle] = useState<'minimal' | 'colorful' | 'animated'>('minimal');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Password reset state
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, loading, supabase } = useAuth();

  useEffect(() => {
    // Load saved preferences
    const savedBg = localStorage.getItem('zittihub-background') || 'starfield';
    setSelectedBackground(savedBg);
    applyBackground(savedBg);

    const savedLayout = localStorage.getItem('zittihub-layout') as 'constellation' | 'grid' || 'constellation';
    setSelectedLayout(savedLayout);

    const savedIconStyle = localStorage.getItem('zittihub-icon-style') as 'minimal' | 'colorful' | 'animated' || 'minimal';
    setSelectedIconStyle(savedIconStyle);
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
    localStorage.setItem('zittihub-background', bg);
  };

  const handleLayoutChange = (layout: 'constellation' | 'grid') => {
    setSelectedLayout(layout);
    localStorage.setItem('zittihub-layout', layout);
    window.dispatchEvent(new CustomEvent('layout-change', { detail: layout }));
  };

  const handleIconStyleChange = (style: 'minimal' | 'colorful' | 'animated') => {
    setSelectedIconStyle(style);
    localStorage.setItem('zittihub-icon-style', style);
    window.dispatchEvent(new CustomEvent('icon-style-change', { detail: style }));
  };

  const handleSignIn = () => {
    onClose();
    router.push('/login');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    router.refresh();
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return '??';
    return user.email.substring(0, 2).toUpperCase();
  };

  // Reset password form state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setPasswordSuccess('');
      setResetEmailSent(false);
    }
  }, [isOpen]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      // First verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError('Current password is incorrect');
        setIsChangingPassword(false);
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPasswordError(updateError.message);
      } else {
        setPasswordSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordForm(false), 2000);
      }
    } catch {
      setPasswordError('An error occurred. Please try again.');
    }

    setIsChangingPassword(false);
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;

    setIsSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (!error) {
      setResetEmailSent(true);
    }
    setIsSendingReset(false);
  };

  const renderAppIcon = (iconType: string) => {
    switch (iconType) {
      case 'gamepad':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="8" cy="12" r="2" />
            <path d="M15 10v4M13 12h4" />
          </svg>
        );
      case 'stars':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
          </svg>
        );
      case 'plane':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        );
      default:
        return null;
    }
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

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-fast ${
              activeTab === 'account'
                ? 'text-text-primary border-b-2 border-accent-primary -mb-px'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-fast ${
              activeTab === 'desktop'
                ? 'text-text-primary border-b-2 border-accent-primary -mb-px'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Desktop
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'account' && (
            <>
              {/* User Info Section */}
              <div className="mb-6">
                {loading ? (
                  <div className="flex flex-col items-center p-5 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md">
                    <div className="w-14 h-14 bg-white/10 rounded-full animate-pulse mb-3" />
                    <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="flex flex-col items-center p-5 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md">
                    <div className="w-14 h-14 flex items-center justify-center bg-accent-primary rounded-full text-white text-lg font-semibold mb-3">
                      {getInitials()}
                    </div>
                    <p className="text-sm text-text-primary font-medium truncate max-w-full">
                      {user.email}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Signed in
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-sm text-text-secondary hover:text-text-primary text-sm cursor-pointer transition-all duration-fast"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                ) : (
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
                      onClick={handleSignIn}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-primary border-none rounded-sm text-white text-sm font-medium cursor-pointer transition-all duration-fast hover:bg-accent-secondary hover:-translate-y-px"
                    >
                      Sign in
                    </button>
                  </div>
                )}
              </div>

              {/* Password Section - Only for logged in users */}
              {user && (
                <div className="mb-6">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                    Password
                  </h3>

                  {!showPasswordForm ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-md text-text-secondary hover:text-text-primary text-sm cursor-pointer transition-all duration-fast"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Change password
                      </button>
                      <button
                        onClick={handleSendPasswordReset}
                        disabled={isSendingReset || resetEmailSent}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-md text-text-secondary hover:text-text-primary text-sm cursor-pointer transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {resetEmailSent ? 'Reset email sent!' : isSendingReset ? 'Sending...' : 'Send password reset email'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <input
                          type="password"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white/[0.03] border border-[var(--border-subtle)] rounded-md text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                          required
                        />
                      </div>

                      {passwordError && (
                        <p className="text-xs text-red-400">{passwordError}</p>
                      )}
                      {passwordSuccess && (
                        <p className="text-xs text-green-400">{passwordSuccess}</p>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordError('');
                            setPasswordSuccess('');
                          }}
                          className="flex-1 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-[var(--border-subtle)] rounded-md text-text-secondary text-sm transition-all duration-fast"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="flex-1 px-4 py-2 bg-accent-primary hover:bg-accent-secondary border-none rounded-md text-white text-sm font-medium transition-all duration-fast disabled:opacity-50"
                        >
                          {isChangingPassword ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Your Apps Section */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Your Apps
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {apps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-md text-text-secondary hover:text-text-primary transition-all duration-fast"
                    >
                      {renderAppIcon(app.icon)}
                      <span className="text-xs font-medium">{app.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'desktop' && (
            <>
              {/* Desktop Background Section */}
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Background
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

              {/* Desktop Layout Section */}
              <div className="mt-6">
                <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Layout
                </h3>
                <p className="text-xs text-text-muted mb-3">
                  Only affects desktop view
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`flex flex-col items-center gap-2 p-3 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                      selectedLayout === 'constellation'
                        ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => handleLayoutChange('constellation')}
                  >
                    <div className="w-full aspect-video rounded-sm overflow-hidden bg-[#0a0f1a] relative">
                      {/* Scattered dots preview */}
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '20%', left: '60%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '40%', left: '80%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '60%', left: '65%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '80%', left: '75%' }} />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        selectedLayout === 'constellation' ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Constellation
                    </span>
                  </button>

                  <button
                    className={`flex flex-col items-center gap-2 p-3 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                      selectedLayout === 'grid'
                        ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => handleLayoutChange('grid')}
                  >
                    <div className="w-full aspect-video rounded-sm overflow-hidden bg-[#0a0f1a] relative">
                      {/* Grid dots preview */}
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '25%', left: '60%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '25%', left: '80%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '50%', left: '60%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '50%', left: '80%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '75%', left: '60%' }} />
                      <div className="absolute w-1.5 h-1.5 bg-text-muted rounded-full" style={{ top: '75%', left: '80%' }} />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        selectedLayout === 'grid' ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Grid
                    </span>
                  </button>
                </div>
              </div>

              {/* Icon Style Section */}
              <div className="mt-6">
                <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                  Icon Style
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`flex flex-col items-center gap-2 p-2 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                      selectedIconStyle === 'minimal'
                        ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => handleIconStyleChange('minimal')}
                  >
                    <div className="w-full aspect-square rounded-sm overflow-hidden bg-[#0a0f1a] relative flex items-center justify-center">
                      <div className="w-8 h-8 border border-text-muted rounded-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-text-muted">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        selectedIconStyle === 'minimal' ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Minimal
                    </span>
                  </button>

                  <button
                    className={`flex flex-col items-center gap-2 p-2 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                      selectedIconStyle === 'colorful'
                        ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => handleIconStyleChange('colorful')}
                  >
                    <div className="w-full aspect-square rounded-sm overflow-hidden bg-[#0a0f1a] relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        selectedIconStyle === 'colorful' ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Colorful
                    </span>
                  </button>

                  <button
                    className={`flex flex-col items-center gap-2 p-2 bg-transparent border-2 rounded-md cursor-pointer transition-all duration-fast ${
                      selectedIconStyle === 'animated'
                        ? 'border-accent-primary bg-[rgba(99,102,241,0.1)]'
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)]'
                    }`}
                    onClick={() => handleIconStyleChange('animated')}
                  >
                    <div className="w-full aspect-square rounded-sm overflow-hidden bg-[#0a0f1a] relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-medium ${
                        selectedIconStyle === 'animated' ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Animated
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
