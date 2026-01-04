# ZittiOS Launcher - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the main page into a ZittiOS desktop launcher with animated starfield, dock, and modal system.

**Architecture:** Single-page app with canvas starfield background, flexbox dock at bottom, and modal overlay for internal apps. External links navigate directly. Mobile-responsive with adapted layout.

**Tech Stack:** Vanilla JS (ES6 classes), CSS custom properties, Canvas API for starfield

---

## Task 1: Create ZittiOS HTML Structure

**Files:**
- Modify: `src/index.html` (replace entire content)

**Step 1: Replace index.html with ZittiOS structure**

Replace the entire content of `src/index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Andrei Zitti</title>
    <meta name="description" content="AI Engineer. Stargazer. Sailor.">
    <link rel="icon" type="image/svg+xml" href="public/favicon.svg">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="pages/home/css/zittios.css">
</head>
<body>
    <!-- Starfield Background -->
    <canvas id="starfield"></canvas>

    <!-- Desktop -->
    <div class="desktop">
        <!-- Top Bar -->
        <header class="top-bar">
            <div class="top-bar-left">
                <span class="logo">ANDREI ZITTI</span>
            </div>
            <div class="top-bar-right">
                <span class="clock" id="clock"></span>
            </div>
        </header>

        <!-- Dock -->
        <nav class="dock">
            <button class="dock-item" data-app="projects" data-external="https://projects.zitti.ro">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                </div>
                <span class="dock-label">Projects</span>
            </button>
            <button class="dock-item" data-app="stars" data-internal="pages/star-map/index.html">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <span class="dock-label">Stars</span>
            </button>
            <button class="dock-item" data-app="library" data-internal="pages/book-library/index.html">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
                <span class="dock-label">Library</span>
            </button>
            <button class="dock-item" data-app="games" data-external="https://games.zitti.ro">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <circle cx="8" cy="12" r="2"></circle>
                        <circle cx="16" cy="10" r="1"></circle>
                        <circle cx="16" cy="14" r="1"></circle>
                    </svg>
                </div>
                <span class="dock-label">Games</span>
            </button>
            <button class="dock-item" data-app="travel" data-external="https://travelling.zitti.ro">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                </div>
                <span class="dock-label">Travel</span>
            </button>
        </nav>
    </div>

    <!-- Modal Overlay -->
    <div class="modal-overlay" id="modal-overlay">
        <div class="modal-container" id="modal-container">
            <button class="modal-close" id="modal-close" aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <iframe id="modal-iframe" src="" title="App content"></iframe>
        </div>
    </div>

    <!-- JavaScript -->
    <script src="pages/home/js/zittios.js"></script>
</body>
</html>
```

**Step 2: Verify structure loads**

Run: `npm run dev`
Expected: Page loads (will be unstyled), no console errors about missing files yet

**Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: add ZittiOS HTML structure

- Desktop layout with top bar (logo + clock)
- Dock with 5 app icons (SVG line icons)
- Modal overlay for internal apps
- Prepared for starfield canvas background"
```

---

## Task 2: Create ZittiOS Base CSS

**Files:**
- Create: `src/pages/home/css/zittios.css`

**Step 1: Create the CSS file with base styles and CSS variables**

Create `src/pages/home/css/zittios.css`:

```css
/* ========================================
   ZittiOS - Desktop Launcher Styles
   ======================================== */

/* CSS Variables - Late Night Desktop Theme */
:root {
    --bg-deep: #05080f;
    --bg-surface: rgba(15, 23, 42, 0.8);
    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    --accent-glow: rgba(99, 102, 241, 0.3);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --border-subtle: rgba(148, 163, 184, 0.1);
    --border-hover: rgba(99, 102, 241, 0.3);
    --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.4);
    --shadow-glow: 0 0 40px var(--accent-glow);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'Monaco', monospace;
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 400ms ease;
}

/* Reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    overflow: hidden;
}

body {
    font-family: var(--font-sans);
    background-color: var(--bg-deep);
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}

/* Starfield Canvas */
#starfield {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

/* Desktop Container */
.desktop {
    position: relative;
    z-index: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ========================================
   Top Bar
   ======================================== */

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(180deg, rgba(5, 8, 15, 0.8) 0%, transparent 100%);
}

.top-bar-left,
.top-bar-right {
    display: flex;
    align-items: center;
}

.logo {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
}

.clock {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* ========================================
   Dock
   ======================================== */

.dock {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: var(--bg-surface);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
}

.dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
}

.dock-item:hover {
    background: rgba(99, 102, 241, 0.1);
    transform: translateY(-4px);
}

.dock-item:active {
    transform: translateY(-2px) scale(0.98);
}

.dock-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: color var(--transition-fast);
}

.dock-item:hover .dock-icon {
    color: var(--accent-primary);
}

.dock-icon svg {
    width: 24px;
    height: 24px;
}

.dock-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: color var(--transition-fast);
}

.dock-item:hover .dock-label {
    color: var(--text-secondary);
}

/* Dock item indicator dot (for active state) */
.dock-item.active::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--accent-primary);
    border-radius: 50%;
}

/* ========================================
   Modal
   ======================================== */

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(5, 8, 15, 0.7);
    backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal-container {
    position: relative;
    width: 90vw;
    height: 85vh;
    max-width: 1200px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glow), var(--shadow-soft);
    overflow: hidden;
    transform: scale(0.95) translateY(20px);
    transition: transform var(--transition-normal);
}

.modal-overlay.active .modal-container {
    transform: scale(1) translateY(0);
}

.modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 50%;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.modal-close:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
}

.modal-close svg {
    width: 16px;
    height: 16px;
}

#modal-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: var(--bg-deep);
}

/* ========================================
   Responsive - Mobile
   ======================================== */

@media (max-width: 640px) {
    .top-bar {
        padding: 12px 16px;
    }

    .logo {
        font-size: 0.75rem;
    }

    .dock {
        bottom: 16px;
        gap: 4px;
        padding: 8px 12px;
        border-radius: var(--radius-md);
    }

    .dock-item {
        padding: 8px;
    }

    .dock-icon {
        width: 32px;
        height: 32px;
    }

    .dock-icon svg {
        width: 20px;
        height: 20px;
    }

    .dock-label {
        font-size: 0.625rem;
    }

    .modal-container {
        width: 100vw;
        height: 100vh;
        max-width: none;
        border-radius: 0;
    }

    .modal-overlay.active .modal-container {
        transform: translateY(0);
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Step 2: Verify styles apply**

Run: `npm run dev` (if not running)
Expected:
- Dark background
- Top bar visible with logo and empty clock
- Dock visible at bottom with 5 icons
- Icons should highlight on hover

**Step 3: Commit**

```bash
git add src/pages/home/css/zittios.css
git commit -m "feat: add ZittiOS CSS styles

- Late Night Desktop theme (dark blues, purples)
- Top bar with logo and clock
- Bottom dock with hover effects
- Modal overlay with scale animation
- Mobile responsive breakpoints"
```

---

## Task 3: Create Starfield Animation

**Files:**
- Create: `src/pages/home/js/starfield.js`

**Step 1: Create the starfield module**

Create `src/pages/home/js/starfield.js`:

```javascript
/**
 * Starfield - Animated twinkling stars background
 */

class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 150;
        this.animationId = null;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Adjust star count based on screen size
        this.numStars = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        this.numStars = Math.max(50, Math.min(this.numStars, 200));

        // Recreate stars on resize
        if (this.stars.length > 0) {
            this.createStars();
        }
    }

    createStars() {
        this.stars = [];

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                baseOpacity: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                // Color variation: white to blue to purple
                hue: Math.random() > 0.7 ? 250 + Math.random() * 30 : 220 + Math.random() * 20,
                saturation: Math.random() * 30 + 10
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const star of this.stars) {
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
            const opacity = star.baseOpacity * twinkle;

            // Draw star with glow
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

            // Subtle color - mostly white with hint of blue/purple
            const lightness = 85 + Math.random() * 15;
            this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity})`;
            this.ctx.fill();

            // Add subtle glow for brighter stars
            if (star.radius > 1 && opacity > 0.4) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity * 0.2})`;
                this.ctx.fill();
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resize);
    }
}

// Export for module use or attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Starfield;
} else {
    window.Starfield = Starfield;
}
```

**Step 2: Verify file created**

Check file exists at `src/pages/home/js/starfield.js`

**Step 3: Commit**

```bash
git add src/pages/home/js/starfield.js
git commit -m "feat: add starfield canvas animation

- Twinkling stars with varied opacity
- Color variation (white to blue/purple)
- Glow effect on brighter stars
- Responsive star count based on screen size
- Reduced motion support"
```

---

## Task 4: Create Main ZittiOS JavaScript

**Files:**
- Create: `src/pages/home/js/zittios.js`

**Step 1: Create the main orchestration script**

Create `src/pages/home/js/zittios.js`:

```javascript
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
        document.body.style.overflow = 'hidden';

        // Update dock active state
        this.updateDockState(appName, true);
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Clear iframe after animation
        setTimeout(() => {
            if (!this.isOpen()) {
                this.iframe.src = '';
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
```

**Step 2: Update index.html to include starfield.js**

Modify `src/index.html` - add starfield.js before zittios.js:

Find:
```html
    <!-- JavaScript -->
    <script src="pages/home/js/zittios.js"></script>
```

Replace with:
```html
    <!-- JavaScript -->
    <script src="pages/home/js/starfield.js"></script>
    <script src="pages/home/js/zittios.js"></script>
```

**Step 3: Verify full functionality**

Run: `npm run dev`
Expected:
- Starfield animates in background
- Clock shows current time and updates
- Hovering dock items shows highlight effect
- Clicking Projects/Games/Travel navigates to external sites
- Clicking Stars/Library opens modal with iframe
- Modal closes via X button, clicking outside, or Escape key
- Dock shows active indicator when modal is open

**Step 4: Commit**

```bash
git add src/pages/home/js/zittios.js src/index.html
git commit -m "feat: add ZittiOS main JavaScript

- Clock component with live time
- Modal manager for internal apps (iframe)
- Dock controller for navigation
- External links navigate directly
- Internal apps open in center modal
- Escape/click-outside to close modal"
```

---

## Task 5: Polish and Accessibility

**Files:**
- Modify: `src/pages/home/css/zittios.css` (add additional styles)
- Modify: `src/index.html` (add accessibility attributes)

**Step 1: Add loading state and focus styles to CSS**

Add to the end of `src/pages/home/css/zittios.css`:

```css

/* ========================================
   Focus States (Accessibility)
   ======================================== */

.dock-item:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}

.modal-close:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}

/* ========================================
   Loading State
   ======================================== */

.modal-container.loading #modal-iframe {
    opacity: 0;
}

.modal-container.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 32px;
    height: 32px;
    margin: -16px 0 0 -16px;
    border: 2px solid var(--border-subtle);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ========================================
   Entrance Animation
   ======================================== */

.desktop {
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
    animation-delay: 0.2s;
}

.dock {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
    animation: slideUp 0.5s ease forwards;
    animation-delay: 0.4s;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

@keyframes slideUp {
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .desktop,
    .dock {
        opacity: 1;
        animation: none;
        transform: translateX(-50%);
    }
}
```

**Step 2: Add ARIA attributes to index.html**

In `src/index.html`, update the modal section:

Find:
```html
    <!-- Modal Overlay -->
    <div class="modal-overlay" id="modal-overlay">
```

Replace with:
```html
    <!-- Modal Overlay -->
    <div class="modal-overlay" id="modal-overlay" role="dialog" aria-modal="true" aria-hidden="true">
```

Find:
```html
            <iframe id="modal-iframe" src="" title="App content"></iframe>
```

Replace with:
```html
            <iframe id="modal-iframe" src="" title="App content" loading="lazy"></iframe>
```

**Step 3: Update ModalManager to handle aria-hidden**

In `src/pages/home/js/zittios.js`, update the ModalManager open/close methods:

Find the `open` method and replace:
```javascript
    open(url, appName) {
        this.iframe.src = url;
        this.activeApp = appName;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update dock active state
        this.updateDockState(appName, true);
    }
```

Replace with:
```javascript
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
```

Find the `close` method and update:
```javascript
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Clear iframe after animation
        setTimeout(() => {
            if (!this.isOpen()) {
                this.iframe.src = '';
            }
        }, 300);
```

Replace with:
```javascript
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
```

**Step 4: Verify polish features**

Run: `npm run dev`
Expected:
- Entrance animation: desktop fades in, dock slides up
- Focus visible outlines when tabbing through dock items
- Loading spinner appears when modal opens, disappears when iframe loads
- Screen readers announce modal as dialog

**Step 5: Commit**

```bash
git add src/pages/home/css/zittios.css src/pages/home/js/zittios.js src/index.html
git commit -m "feat: add polish and accessibility

- Entrance animations (fade in, slide up)
- Focus-visible outlines for keyboard nav
- Loading spinner for modal iframe
- ARIA attributes for screen readers
- Reduced motion support"
```

---

## Task 6: Cleanup Old Landing Page

**Files:**
- Delete: `src/pages/home/css/landing.css` (optional - keep for reference)
- Delete: `src/pages/home/js/landing.js` (optional - keep for reference)

**Step 1: Verify new page works completely**

Run: `npm run dev`
Test all functionality:
- [ ] Starfield animates
- [ ] Clock updates
- [ ] All 5 dock icons visible
- [ ] External links work (Projects, Games, Travel)
- [ ] Internal apps open in modal (Stars, Library)
- [ ] Modal closes correctly
- [ ] Mobile layout works (resize browser)

**Step 2: Keep old files for reference (rename)**

```bash
mv src/pages/home/css/landing.css src/pages/home/css/landing.css.bak
mv src/pages/home/js/landing.js src/pages/home/js/landing.js.bak
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: archive old landing page files

Renamed to .bak for reference during transition.
New ZittiOS launcher is now the main page."
```

---

## Summary

After completing all tasks, you will have:

1. **ZittiOS Desktop Launcher** - A minimal OS-style landing page
2. **Animated Starfield** - Canvas-based twinkling stars background
3. **Dock Navigation** - 5 app icons with hover effects
4. **Modal System** - Center floating panels for internal apps
5. **Mobile Support** - Adapted layout for small screens
6. **Accessibility** - Keyboard navigation, ARIA, reduced motion

**To run:** `npm run dev`

**Future enhancements (v2):**
- Draggable windows
- Desktop widgets
- Boot animation
- Sound effects
