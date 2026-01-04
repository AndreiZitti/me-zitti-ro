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
// Dock Controller
// ========================================

class DockController {
    constructor(modalManager) {
        this.modalManager = modalManager;
        this.dock = document.querySelector('.dock');

        if (!this.dock) return;

        this.bindEvents();
    }

    bindEvents() {
        this.dock.addEventListener('click', (e) => {
            const dockItem = e.target.closest('.dock-item');
            if (!dockItem) return;

            const appName = dockItem.dataset.app;
            const externalUrl = dockItem.dataset.external;
            const internalUrl = dockItem.dataset.internal;

            if (externalUrl) {
                // External link - navigate
                window.location.href = externalUrl;
            } else if (internalUrl) {
                // Internal app - open modal
                this.modalManager.open(internalUrl, appName);
            }
        });
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

    // Initialize modal and dock
    const modalManager = new ModalManager();
    new DockController(modalManager);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});
