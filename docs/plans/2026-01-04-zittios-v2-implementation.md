# ZittiOS v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance ZittiOS with Mac-like dock (magnification, tooltips, bounce), centered hero, top bar with dropdown menu, and settings panel with background switcher.

**Architecture:** Extend existing vanilla JS classes with new DockMagnifier, MenuBar, and SettingsPanel classes. Add CSS for new visual effects. Store background preference in localStorage.

**Tech Stack:** Vanilla JS (ES6 classes), CSS transforms/animations, localStorage

---

## Task 1: Mac-like Dock - Icon-only with Tooltips

**Files:**
- Modify: `src/index.html` (update dock HTML)
- Modify: `src/pages/home/css/zittios.css` (add tooltip styles)

**Step 1: Update dock HTML - remove labels, add tooltips, add settings icon**

In `src/index.html`, replace the entire `<nav class="dock">` section with:

```html
        <!-- Dock -->
        <nav class="dock" id="dock">
            <button class="dock-item" data-app="projects" data-external="https://projects.zitti.ro" data-tooltip="Projects">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                </div>
            </button>
            <button class="dock-item" data-app="stars" data-internal="pages/star-map/index.html" data-tooltip="Stars">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
            </button>
            <button class="dock-item" data-app="library" data-internal="pages/book-library/index.html" data-tooltip="Library">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </div>
            </button>
            <button class="dock-item" data-app="games" data-external="https://games.zitti.ro" data-tooltip="Games">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <circle cx="8" cy="12" r="2"></circle>
                        <circle cx="16" cy="10" r="1"></circle>
                        <circle cx="16" cy="14" r="1"></circle>
                    </svg>
                </div>
            </button>
            <button class="dock-item" data-app="travel" data-external="https://travelling.zitti.ro" data-tooltip="Travel">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                </div>
            </button>
            <div class="dock-divider"></div>
            <button class="dock-item" data-app="settings" data-tooltip="Settings">
                <div class="dock-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </div>
            </button>
        </nav>
```

**Step 2: Update dock CSS - remove labels, add tooltips and divider**

In `src/pages/home/css/zittios.css`, find the Dock section and replace it with:

```css
/* ========================================
   Dock
   ======================================== */

.dock {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 8px 12px;
    background: var(--bg-surface);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
}

.dock-divider {
    width: 1px;
    height: 32px;
    background: var(--border-subtle);
    margin: 0 4px;
    align-self: center;
}

.dock-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: transform 0.15s ease-out;
    position: relative;
    transform-origin: bottom center;
}

.dock-item:hover {
    background: transparent;
}

.dock-item:active {
    transform: scale(0.95);
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
    transition: transform 0.15s ease-out;
}

/* Tooltip */
.dock-item::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    padding: 6px 12px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
    pointer-events: none;
    z-index: 10;
}

.dock-item:hover::before {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

/* Dock item indicator dot (for active state) */
.dock-item.active::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    background: var(--accent-primary);
    border-radius: 50%;
}

/* Bounce animation */
@keyframes dockBounce {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-12px); }
    50% { transform: translateY(-6px); }
    75% { transform: translateY(-10px); }
}

.dock-item.bouncing {
    animation: dockBounce 0.5s ease-in-out;
}
```

**Step 3: Remove old dock-label styles**

In `src/pages/home/css/zittios.css`, remove these lines (if they exist after the replacement):

```css
.dock-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: color var(--transition-fast);
}

.dock-item:hover .dock-label {
    color: var(--text-secondary);
}
```

**Step 4: Verify dock displays correctly**

Run: `npm run dev`
Expected: Dock shows icons only, tooltip appears on hover, settings gear icon visible

**Step 5: Commit**

```bash
git add src/index.html src/pages/home/css/zittios.css
git commit -m "feat: convert dock to icon-only with tooltips

- Remove text labels from dock items
- Add tooltip on hover (data-tooltip attribute)
- Add settings gear icon with divider
- Add bounce animation keyframes"
```

---

## Task 2: Dock Magnification Effect

**Files:**
- Modify: `src/pages/home/js/zittios.js` (add DockMagnifier class)

**Step 1: Add DockMagnifier class**

In `src/pages/home/js/zittios.js`, add this class before the DockController class:

```javascript
// ========================================
// Dock Magnifier
// ========================================

class DockMagnifier {
    constructor() {
        this.dock = document.getElementById('dock');
        if (!this.dock) return;

        this.items = Array.from(this.dock.querySelectorAll('.dock-item'));
        this.maxScale = 1.5;
        this.effectRadius = 80;
        this.isActive = true;

        this.bindEvents();
    }

    bindEvents() {
        this.dock.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.dock.addEventListener('mouseleave', () => this.resetScales());

        // Disable magnification on mobile
        if ('ontouchstart' in window) {
            this.isActive = false;
        }
    }

    handleMouseMove(e) {
        if (!this.isActive) return;

        const dockRect = this.dock.getBoundingClientRect();
        const mouseX = e.clientX;

        this.items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);

            let scale = 1;
            if (distance < this.effectRadius) {
                scale = 1 + (this.maxScale - 1) * (1 - distance / this.effectRadius);
            }

            item.style.transform = `scale(${scale})`;
        });
    }

    resetScales() {
        this.items.forEach(item => {
            item.style.transform = 'scale(1)';
        });
    }
}
```

**Step 2: Update DockController to add bounce effect**

In `src/pages/home/js/zittios.js`, update the DockController bindEvents method:

```javascript
    bindEvents() {
        this.dock.addEventListener('click', (e) => {
            const dockItem = e.target.closest('.dock-item');
            if (!dockItem) return;

            const appName = dockItem.dataset.app;
            const externalUrl = dockItem.dataset.external;
            const internalUrl = dockItem.dataset.internal;

            // Bounce animation
            dockItem.classList.add('bouncing');
            setTimeout(() => dockItem.classList.remove('bouncing'), 500);

            if (externalUrl) {
                // External link - navigate after bounce starts
                setTimeout(() => {
                    window.location.href = externalUrl;
                }, 150);
            } else if (internalUrl) {
                // Internal app - open modal
                this.modalManager.open(internalUrl, appName);
            } else if (appName === 'settings') {
                // Settings - will be handled in Task 4
                window.dispatchEvent(new CustomEvent('openSettings'));
            }
        });
    }
```

**Step 3: Initialize DockMagnifier in DOMContentLoaded**

In `src/pages/home/js/zittios.js`, update the initialization:

```javascript
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
    new DockMagnifier();

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});
```

**Step 4: Verify magnification works**

Run: `npm run dev`
Expected: Icons scale up when mouse approaches, smooth animation, bounce on click

**Step 5: Commit**

```bash
git add src/pages/home/js/zittios.js
git commit -m "feat: add dock magnification and bounce effects

- DockMagnifier class for macOS-style magnification
- Icons scale up to 1.5x based on mouse distance
- Bounce animation on click
- Disabled on touch devices"
```

---

## Task 3: Centered Hero Text

**Files:**
- Modify: `src/index.html` (add hero section)
- Modify: `src/pages/home/css/zittios.css` (add hero styles)

**Step 1: Add hero section to HTML**

In `src/index.html`, add this inside the `.desktop` div, after the `</header>` closing tag:

```html
        <!-- Hero -->
        <div class="hero">
            <h1 class="hero-name">ANDREI ZITTI</h1>
            <p class="hero-tagline">AI Engineer. Stargazer. Sailor.</p>
        </div>
```

**Step 2: Add hero CSS**

In `src/pages/home/css/zittios.css`, add after the Top Bar section:

```css
/* ========================================
   Hero
   ======================================== */

.hero {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;
    z-index: 0;
}

.hero-name {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 600;
    letter-spacing: 0.15em;
    color: var(--text-primary);
    opacity: 0.9;
    margin-bottom: 8px;
    text-shadow: 0 0 40px rgba(99, 102, 241, 0.3);
}

.hero-tagline {
    font-size: clamp(0.875rem, 2vw, 1.125rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    opacity: 0.8;
}

/* Hero entrance animation */
.hero {
    opacity: 0;
    animation: heroFadeIn 1s ease forwards;
    animation-delay: 0.6s;
}

@keyframes heroFadeIn {
    to {
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero {
        opacity: 1;
        animation: none;
    }
}
```

**Step 3: Verify hero displays**

Run: `npm run dev`
Expected: Name and tagline centered on screen, semi-transparent, doesn't block interactions

**Step 4: Commit**

```bash
git add src/index.html src/pages/home/css/zittios.css
git commit -m "feat: add centered hero text

- Name and tagline centered on desktop
- Semi-transparent to show starfield
- Pointer-events: none for click-through
- Fade-in entrance animation"
```

---

## Task 4: Mac-like Top Bar with Dropdown

**Files:**
- Modify: `src/index.html` (update top bar HTML)
- Modify: `src/pages/home/css/zittios.css` (update top bar styles)
- Modify: `src/pages/home/js/zittios.js` (add MenuBar class)

**Step 1: Update top bar HTML**

In `src/index.html`, replace the entire `<header class="top-bar">` section:

```html
        <!-- Top Bar -->
        <header class="top-bar">
            <div class="top-bar-left">
                <div class="menu-item" id="menu-zittios">
                    <span class="menu-logo">✦</span>
                    <span class="menu-title">ZittiOS</span>
                    <svg class="menu-arrow" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M3 5l3 3 3-3"/>
                    </svg>
                    <div class="menu-dropdown">
                        <button class="menu-dropdown-item" data-action="about">About ZittiOS</button>
                        <div class="menu-dropdown-divider"></div>
                        <button class="menu-dropdown-item" data-action="settings">Settings...</button>
                    </div>
                </div>
            </div>
            <div class="top-bar-right">
                <span class="clock" id="clock"></span>
            </div>
        </header>
```

**Step 2: Update top bar CSS**

In `src/pages/home/css/zittios.css`, replace the Top Bar section:

```css
/* ========================================
   Top Bar
   ======================================== */

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    padding: 0 16px;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-subtle);
    position: relative;
    z-index: 50;
}

.top-bar-left,
.top-bar-right {
    display: flex;
    align-items: center;
    height: 100%;
}

/* Menu Item */
.menu-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    height: 100%;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    transition: background var(--transition-fast);
}

.menu-item:hover,
.menu-item.active {
    background: rgba(255, 255, 255, 0.1);
}

.menu-logo {
    font-size: 14px;
    color: var(--accent-primary);
}

.menu-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.menu-arrow {
    width: 10px;
    height: 10px;
    color: var(--text-muted);
    transition: transform var(--transition-fast);
}

.menu-item.active .menu-arrow {
    transform: rotate(180deg);
}

/* Dropdown */
.menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    margin-top: 4px;
    padding: 4px 0;
    background: var(--bg-surface);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-soft);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity var(--transition-fast), transform var(--transition-fast), visibility var(--transition-fast);
    z-index: 100;
}

.menu-item.active .menu-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.menu-dropdown-item {
    display: block;
    width: 100%;
    padding: 8px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    transition: background var(--transition-fast);
}

.menu-dropdown-item:hover {
    background: rgba(99, 102, 241, 0.2);
}

.menu-dropdown-divider {
    height: 1px;
    background: var(--border-subtle);
    margin: 4px 0;
}

/* Clock */
.clock {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
}
```

**Step 3: Add MenuBar class to JavaScript**

In `src/pages/home/js/zittios.js`, add this class before the Initialization section:

```javascript
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
        // Simple alert for now, could be a modal later
        alert('ZittiOS v2.0\\n\\nA desktop-style personal website.\\n\\nBuilt with vanilla JS, CSS, and love.');
    }
}
```

**Step 4: Initialize MenuBar**

Update the DOMContentLoaded handler:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    if (window.Starfield) {
        new Starfield('starfield');
    }

    // Initialize clock
    new Clock('clock');

    // Initialize menu bar
    new MenuBar();

    // Initialize modal and dock
    const modalManager = new ModalManager();
    new DockController(modalManager);
    new DockMagnifier();

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});
```

**Step 5: Verify menu bar works**

Run: `npm run dev`
Expected: Top bar thinner, click ZittiOS opens dropdown, About shows alert

**Step 6: Commit**

```bash
git add src/index.html src/pages/home/css/zittios.css src/pages/home/js/zittios.js
git commit -m "feat: add Mac-like top bar with dropdown menu

- Thinner frosted glass top bar
- Star logo + ZittiOS title with dropdown
- About ZittiOS and Settings menu items
- Click outside or Escape to close"
```

---

## Task 5: Settings Panel with Background Switcher

**Files:**
- Modify: `src/index.html` (add settings panel HTML)
- Modify: `src/pages/home/css/zittios.css` (add settings panel styles)
- Modify: `src/pages/home/js/zittios.js` (add SettingsPanel class)
- Modify: `src/pages/home/js/starfield.js` (add show/hide methods)

**Step 1: Add settings panel HTML**

In `src/index.html`, add this before the `<!-- JavaScript -->` comment:

```html
    <!-- Settings Panel -->
    <div class="settings-overlay" id="settings-overlay">
        <div class="settings-panel">
            <div class="settings-header">
                <h2 class="settings-title">Settings</h2>
                <button class="settings-close" id="settings-close" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="settings-content">
                <div class="settings-section">
                    <h3 class="settings-section-title">Desktop Background</h3>
                    <div class="background-options">
                        <button class="background-option active" data-bg="starfield">
                            <div class="background-preview bg-starfield"></div>
                            <span class="background-label">Starfield</span>
                        </button>
                        <button class="background-option" data-bg="gradient">
                            <div class="background-preview bg-gradient"></div>
                            <span class="background-label">Aurora</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
```

**Step 2: Add settings panel CSS**

In `src/pages/home/css/zittios.css`, add after the Modal section:

```css
/* ========================================
   Settings Panel
   ======================================== */

.settings-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(5, 8, 15, 0.7);
    backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

.settings-overlay.active {
    opacity: 1;
    visibility: visible;
}

.settings-panel {
    width: 90vw;
    max-width: 480px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glow), var(--shadow-soft);
    transform: scale(0.95) translateY(20px);
    transition: transform var(--transition-normal);
}

.settings-overlay.active .settings-panel {
    transform: scale(1) translateY(0);
}

.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-subtle);
}

.settings-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.settings-close {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.settings-close:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.settings-close svg {
    width: 14px;
    height: 14px;
}

.settings-content {
    padding: 20px;
}

.settings-section-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 12px;
}

.background-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.background-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: transparent;
    border: 2px solid var(--border-subtle);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.background-option:hover {
    border-color: var(--border-hover);
}

.background-option.active {
    border-color: var(--accent-primary);
    background: rgba(99, 102, 241, 0.1);
}

.background-preview {
    width: 100%;
    height: 60px;
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.bg-starfield {
    background: linear-gradient(180deg, #05080f 0%, #0f172a 100%);
    position: relative;
}

.bg-starfield::before {
    content: '✦ · ✦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
    letter-spacing: 8px;
}

.bg-gradient {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
}

.background-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.background-option.active .background-label {
    color: var(--accent-primary);
}
```

**Step 3: Add gradient background CSS**

In `src/pages/home/css/zittios.css`, add after the body styles:

```css
/* Background Options */
body.bg-gradient {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
}

body.bg-gradient #starfield {
    display: none;
}
```

**Step 4: Add SettingsPanel class**

In `src/pages/home/js/zittios.js`, add before the Initialization section:

```javascript
// ========================================
// Settings Panel
// ========================================

class SettingsPanel {
    constructor() {
        this.overlay = document.getElementById('settings-overlay');
        this.closeBtn = document.getElementById('settings-close');
        this.options = document.querySelectorAll('.background-option');

        if (!this.overlay) return;

        this.loadSavedBackground();
        this.bindEvents();
    }

    bindEvents() {
        // Open settings
        window.addEventListener('openSettings', () => this.open());

        // Close button
        this.closeBtn?.addEventListener('click', () => this.close());

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });

        // Background options
        this.options.forEach(option => {
            option.addEventListener('click', () => {
                this.selectBackground(option.dataset.bg);
            });
        });
    }

    open() {
        this.overlay.classList.add('active');
    }

    close() {
        this.overlay.classList.remove('active');
    }

    isOpen() {
        return this.overlay.classList.contains('active');
    }

    selectBackground(bg) {
        // Update active state
        this.options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.bg === bg);
        });

        // Apply background
        document.body.classList.remove('bg-gradient', 'bg-starfield');
        if (bg !== 'starfield') {
            document.body.classList.add(`bg-${bg}`);
        }

        // Save preference
        localStorage.setItem('zittios-background', bg);
    }

    loadSavedBackground() {
        const saved = localStorage.getItem('zittios-background') || 'starfield';
        this.selectBackground(saved);
    }
}
```

**Step 5: Initialize SettingsPanel**

Update the DOMContentLoaded handler:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize starfield
    if (window.Starfield) {
        new Starfield('starfield');
    }

    // Initialize clock
    new Clock('clock');

    // Initialize menu bar
    new MenuBar();

    // Initialize settings
    new SettingsPanel();

    // Initialize modal and dock
    const modalManager = new ModalManager();
    new DockController(modalManager);
    new DockMagnifier();

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
});
```

**Step 6: Verify settings panel works**

Run: `npm run dev`
Expected: Click settings icon or menu → panel opens → can switch backgrounds → persists on reload

**Step 7: Commit**

```bash
git add src/index.html src/pages/home/css/zittios.css src/pages/home/js/zittios.js
git commit -m "feat: add settings panel with background switcher

- Settings panel opens from dock or menu
- Two background options: Starfield and Aurora gradient
- Preference saved to localStorage
- Smooth open/close animations"
```

---

## Task 6: Mobile Responsive Updates

**Files:**
- Modify: `src/pages/home/css/zittios.css` (update mobile styles)

**Step 1: Update mobile responsive styles**

In `src/pages/home/css/zittios.css`, replace the Responsive section:

```css
/* ========================================
   Responsive - Mobile
   ======================================== */

@media (max-width: 640px) {
    .top-bar {
        height: 32px;
        padding: 0 12px;
    }

    .menu-title {
        display: none;
    }

    .menu-arrow {
        display: none;
    }

    .clock {
        font-size: 11px;
    }

    .hero-name {
        font-size: 1.75rem;
        letter-spacing: 0.1em;
    }

    .hero-tagline {
        font-size: 0.8rem;
    }

    .dock {
        bottom: 12px;
        gap: 2px;
        padding: 6px 10px;
        border-radius: var(--radius-md);
    }

    .dock-divider {
        height: 24px;
        margin: 0 2px;
    }

    .dock-item {
        padding: 6px;
    }

    .dock-icon {
        width: 32px;
        height: 32px;
    }

    .dock-icon svg {
        width: 20px;
        height: 20px;
    }

    /* Disable magnification on mobile */
    .dock-item {
        transform: none !important;
    }

    .dock-item::before {
        display: none;
    }

    .settings-panel {
        width: 95vw;
        max-width: none;
        margin: 16px;
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
```

**Step 2: Verify mobile layout**

Run: `npm run dev`
Resize browser to mobile width
Expected: Dock compacts, hero text scales, menu shows only logo

**Step 3: Commit**

```bash
git add src/pages/home/css/zittios.css
git commit -m "feat: update mobile responsive styles for v2

- Compact dock for smaller screens
- Hide menu title on mobile (logo only)
- Disable magnification on touch
- Scale hero text appropriately"
```

---

## Summary

After completing all tasks, ZittiOS v2 will have:

1. **Mac-like dock** - Icon-only, tooltips, magnification, bounce
2. **Centered hero** - Name + tagline floating on desktop
3. **Mac-like top bar** - Logo + dropdown menu
4. **Settings panel** - Background switcher (starfield/aurora)
5. **Mobile optimized** - Responsive across all components

**To test:** `npm run dev`
