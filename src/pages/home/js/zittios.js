/**
 * ZittiOS - Main Desktop Launcher Script
 */

// ========================================
// Clock
// ========================================

class Clock {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        this.element.textContent = `${hours}:${minutes}`;
    }
}

// ========================================
// Modal Manager
// ========================================

class ModalManager {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.container = document.getElementById('modal-container');
        this.iframe = document.getElementById('modal-iframe');
        this.closeBtn = document.getElementById('modal-close');
        this.activeApp = null;

        if (!this.overlay) return;

        this.bindEvents();
    }

    bindEvents() {
        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open(url, appName) {
        this.iframe.src = url;
        this.activeApp = appName;
        this.overlay.classList.add('active');
        this.overlay.setAttribute('aria-hidden', 'false');
        this.container.classList.add('loading');
        document.body.style.overflow = 'hidden';

        // Remove loading state when iframe loads
        this.iframe.onload = () => {
            this.container.classList.remove('loading');
        };

        // Update dock active state
        this.updateDockState(appName, true);

        // Focus the close button for accessibility
        setTimeout(() => this.closeBtn?.focus(), 100);
    }

    close() {
        this.overlay.classList.remove('active');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Clear iframe after animation
        setTimeout(() => {
            if (!this.isOpen()) {
                this.iframe.src = '';
                this.container.classList.remove('loading');
            }
        }, 300);

        // Update dock active state
        if (this.activeApp) {
            this.updateDockState(this.activeApp, false);
            this.activeApp = null;
        }
    }

    isOpen() {
        return this.overlay.classList.contains('active');
    }

    updateDockState(appName, isActive) {
        const dockItem = document.querySelector(`[data-app="${appName}"]`);
        if (dockItem) {
            dockItem.classList.toggle('active', isActive);
        }
    }
}


// ========================================
// Menu Bar
// ========================================

class MenuBar {
    constructor() {
        this.menuItem = document.getElementById('menu-zittios');
        if (!this.menuItem) return;

        this.isOpen = false;
        this.bindEvents();
    }

    bindEvents() {
        // Toggle on click
        this.menuItem.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Handle dropdown item clicks
        this.menuItem.querySelectorAll('.menu-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                this.handleAction(action);
                this.close();
            });
        });

        // Close on outside click
        document.addEventListener('click', () => this.close());

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.menuItem.classList.toggle('active', this.isOpen);
    }

    close() {
        this.isOpen = false;
        this.menuItem.classList.remove('active');
    }

    handleAction(action) {
        switch (action) {
            case 'about':
                this.showAbout();
                break;
            case 'settings':
                window.dispatchEvent(new CustomEvent('openSettings'));
                break;
        }
    }

    showAbout() {
        alert('ZittiOS v2.0\n\nA desktop-style personal website.\n\nBuilt with vanilla JS, CSS, and love.');
    }
}

// ========================================
// Desktop Icons Controller
// ========================================

class DesktopIconsController {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.container = document.querySelector('.desktop-icons');
        this.hint = document.getElementById('icon-hint');
        this.hintText = document.getElementById('icon-hint-text');

        if (!this.container) return;

        this.bindEvents();
    }

    bindEvents() {
        // Apps that should open full screen instead of in modal
        const fullScreenApps = ['now', 'cosmos'];

        // Click events
        this.container.addEventListener('click', (e) => {
            const icon = e.target.closest('.desktop-icon');
            if (!icon) return;

            const appName = icon.dataset.app;
            const externalUrl = icon.dataset.external;
            const internalUrl = icon.dataset.internal;

            if (appName === 'profile') {
                window.dispatchEvent(new CustomEvent('openProfile'));
            } else if (externalUrl) {
                window.location.href = externalUrl;
            } else if (internalUrl && fullScreenApps.includes(appName)) {
                // Open full screen
                window.location.href = internalUrl;
            } else if (internalUrl) {
                this.modalManager.open(internalUrl, appName);
            }
        });

        // Hover events for hint tooltip - attach to each icon directly
        const icons = this.container.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                if (icon.dataset.hint) {
                    this.showHint(icon.dataset.hint);
                }
            });

            icon.addEventListener('mouseleave', () => {
                this.hideHint();
            });
        });
    }

    showHint(text) {
        if (!this.hint || !this.hintText) return;
        this.hintText.textContent = text;
        this.hint.classList.add('visible');
    }

    hideHint() {
        if (!this.hint) return;
        this.hint.classList.remove('visible');
    }
}

// ========================================
// Profile Panel
// ========================================

class ProfilePanel {
    constructor() {
        this.overlay = document.getElementById('profile-overlay');
        this.closeBtn = document.getElementById('profile-close');
        this.loginBtn = document.getElementById('profile-login-btn');
        this.backgroundOptions = document.querySelectorAll('.background-option');
        this.storageKey = 'zittios-background';

        if (!this.overlay) return;

        this.bindEvents();
        this.loadSavedBackground();
    }

    bindEvents() {
        // Listen for openProfile event
        window.addEventListener('openProfile', () => this.open());

        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Login button (placeholder for now)
        this.loginBtn?.addEventListener('click', () => {
            alert('Login coming soon!');
        });

        // Background options
        this.backgroundOptions.forEach(option => {
            option.addEventListener('click', () => {
                const bg = option.dataset.bg;
                this.setBackground(bg);
            });
        });
    }

    open() {
        this.overlay.classList.add('active');
        setTimeout(() => this.closeBtn?.focus(), 100);
    }

    close() {
        this.overlay.classList.remove('active');
    }

    isOpen() {
        return this.overlay.classList.contains('active');
    }

    setBackground(bg) {
        // Update active state on options
        this.backgroundOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.bg === bg);
        });

        // Apply background to body
        document.body.classList.remove('bg-starfield', 'bg-aurora');
        if (bg !== 'starfield') {
            document.body.classList.add(`bg-${bg}`);
        }

        // Save preference
        localStorage.setItem(this.storageKey, bg);
    }

    loadSavedBackground() {
        const saved = localStorage.getItem(this.storageKey) || 'starfield';
        this.setBackground(saved);
    }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    if (window.Starfield) {
        new Starfield('starfield');
    }

    // Initialize clock
    new Clock('clock');

    // Initialize menu bar
    new MenuBar();

    // Initialize modal and desktop icons
    const modalManager = new ModalManager();
    new DesktopIconsController(modalManager);

    // Initialize profile panel
    new ProfilePanel();

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});
