# Main Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make ZittiHub main page responsive for mobile, add enhanced hover effects, and provide a layout toggle option.

**Architecture:** Mobile-first responsive design using Tailwind breakpoints. Desktop icons switch between organic "constellation" positions and grid layout via localStorage preference. Enhanced hover states use CSS transforms and box-shadows.

**Tech Stack:** Next.js 14, React, Tailwind CSS, localStorage for persistence

---

## Task 1: Add CSS Variables and Hover Keyframes

**Files:**
- Modify: `nextjs/src/app/globals.css`

**Step 1: Add hover glow animation**

Add after line 98 (after `@keyframes iconReveal`):

```css
@keyframes iconGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5); }
}
```

**Step 2: Add mobile tap animation**

Add after the new iconGlow keyframe:

```css
@keyframes tapPulse {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(0.95); }
  100% { transform: translate(-50%, -50%) scale(1); }
}
```

**Step 3: Test visually**

Run: `cd nextjs && npm run dev`
Open: http://localhost:3000
Expected: Page loads without CSS errors

**Step 4: Commit**

```bash
git add nextjs/src/app/globals.css
git commit -m "style: add hover glow and tap pulse animations"
```

---

## Task 2: Update DesktopIcons with Enhanced Hover States

**Files:**
- Modify: `nextjs/src/components/DesktopIcons.tsx`

**Step 1: Update the button hover classes**

Replace the button className (line 184) from:
```tsx
className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-md cursor-pointer transition-all duration-fast w-[100px] pointer-events-auto opacity-0 hover:bg-white/5 active:scale-95"
```

To:
```tsx
className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 w-[100px] pointer-events-auto opacity-0 hover:scale-[1.08] hover:bg-[rgba(99,102,241,0.1)] hover:[box-shadow:0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
```

**Step 2: Update the icon container classes**

Replace the icon container div className (line 198) from:
```tsx
className="w-14 h-14 flex items-center justify-center bg-transparent border-none rounded-lg text-text-secondary transition-all duration-fast group-hover:bg-white/[0.08] group-hover:text-accent-primary"
```

To:
```tsx
className="w-14 h-14 flex items-center justify-center bg-transparent border-none rounded-lg text-text-secondary transition-all duration-200"
```

**Step 3: Add hover color to parent button**

Add to button className after `active:scale-95`:
```
hover:text-accent-primary
```

Full button className becomes:
```tsx
className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 w-[100px] pointer-events-auto opacity-0 hover:scale-[1.08] hover:bg-[rgba(99,102,241,0.1)] hover:[box-shadow:0_0_20px_rgba(99,102,241,0.4)] hover:text-accent-primary active:scale-95"
```

**Step 4: Test hover effect**

Run: `cd nextjs && npm run dev`
Hover over icons on desktop
Expected: Icons scale up with indigo glow, color changes to accent

**Step 5: Commit**

```bash
git add nextjs/src/components/DesktopIcons.tsx
git commit -m "style: add scale + glow hover effect to desktop icons"
```

---

## Task 3: Make WelcomePanel Responsive

**Files:**
- Modify: `nextjs/src/components/WelcomePanel.tsx`

**Step 1: Update the container positioning**

Replace line 16-21 (the outer div with className and style):
```tsx
    <div
      className="absolute top-1/2 left-12 -translate-y-1/2 max-w-[320px] z-[1] opacity-0"
      style={{
        animation: `welcomeFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        animationDelay: isBooted ? '0.1s' : '1.15s',
      }}
    >
```

With:
```tsx
    <div
      className="relative px-6 py-8 max-w-[320px] z-[1] opacity-0 mx-auto text-center lg:absolute lg:top-1/2 lg:left-12 lg:-translate-y-1/2 lg:mx-0 lg:text-left lg:px-0 lg:py-0"
      style={{
        animation: `welcomeFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        animationDelay: isBooted ? '0.1s' : '1.15s',
      }}
    >
```

**Step 2: Center social links on mobile**

Replace line 49 (social links container):
```tsx
      <div className="flex gap-3 mt-6">
```

With:
```tsx
      <div className="flex gap-3 mt-6 justify-center lg:justify-start">
```

**Step 3: Test mobile layout**

Run: `cd nextjs && npm run dev`
Open DevTools, toggle device toolbar to mobile size
Expected: Welcome panel centered at top, text centered

**Step 4: Commit**

```bash
git add nextjs/src/components/WelcomePanel.tsx
git commit -m "style: make WelcomePanel responsive for mobile"
```

---

## Task 4: Make DesktopIcons Responsive with Mobile Grid

**Files:**
- Modify: `nextjs/src/components/DesktopIcons.tsx`

**Step 1: Add layout prop and state**

Replace lines 17-20:
```tsx
interface DesktopIconsProps {
  onOpenModal: (url: string) => void;
  onOpenProfile: () => void;
}
```

With:
```tsx
interface DesktopIconsProps {
  onOpenModal: (url: string) => void;
  onOpenProfile: () => void;
  layout?: 'constellation' | 'grid';
}
```

**Step 2: Add isMobile state and detection**

After line 149 (after the showHint state), add:
```tsx
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
```

**Step 3: Update the outer container for responsive layout**

Replace line 180:
```tsx
      <div className="absolute inset-0 pointer-events-none z-[1]">
```

With:
```tsx
      <div className={`z-[1] ${isMobile ? 'relative grid grid-cols-2 gap-4 px-6 pb-8 pt-4' : 'absolute inset-0 pointer-events-none'}`}>
```

**Step 4: Update button positioning for mobile**

Replace the button element (lines 182-205) with:
```tsx
          <button
            key={icon.id}
            className={`flex flex-col items-center gap-2 p-3.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 opacity-0 hover:scale-[1.08] hover:bg-[rgba(99,102,241,0.1)] hover:[box-shadow:0_0_20px_rgba(99,102,241,0.4)] hover:text-accent-primary active:scale-95 ${
              isMobile
                ? 'relative w-full min-h-[100px] border border-[rgba(148,163,184,0.1)]'
                : 'absolute -translate-x-1/2 -translate-y-1/2 w-[100px] pointer-events-auto'
            }`}
            style={isMobile ? {
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${0.1 + index * 0.05}s`,
            } : {
              left: icon.x,
              top: icon.y,
              animation: `iconReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: getAnimationDelay(index),
            }}
            onClick={() => handleClick(icon)}
            onMouseEnter={() => {
              if (!isMobile) {
                setHintText(icon.hint);
                setShowHint(true);
              }
            }}
            onMouseLeave={() => setShowHint(false)}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-transparent border-none rounded-lg text-text-secondary transition-all duration-200">
              <div className="w-8 h-8">{icon.icon}</div>
            </div>
            <span className="text-xs font-medium text-text-secondary shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {icon.label}
            </span>
            {isMobile && (
              <span className="text-[10px] text-text-muted mt-1 line-clamp-2">
                {icon.hint}
              </span>
            )}
          </button>
```

**Step 5: Hide tooltip on mobile**

Replace the tooltip div (lines 209-217):
```tsx
      {/* Icon Hint Tooltip */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-[rgba(15,23,42,0.9)] backdrop-blur-[12px] border border-[var(--border-subtle)] rounded-md z-50 pointer-events-none transition-all duration-200 ${
          showHint ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
```

With:
```tsx
      {/* Icon Hint Tooltip - Desktop only */}
      {!isMobile && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-[rgba(15,23,42,0.9)] backdrop-blur-[12px] border border-[var(--border-subtle)] rounded-md z-50 pointer-events-none transition-all duration-200 ${
            showHint ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <span className="text-[0.9375rem] text-text-secondary whitespace-nowrap">
            {hintText}
          </span>
        </div>
      )}
```

**Step 6: Test mobile grid**

Run: `cd nextjs && npm run dev`
Toggle to mobile view in DevTools
Expected: Icons in 2-column grid with hints visible, scrollable page

**Step 7: Commit**

```bash
git add nextjs/src/components/DesktopIcons.tsx
git commit -m "feat: add responsive mobile grid layout for icons"
```

---

## Task 5: Update Page Container for Mobile Scrolling

**Files:**
- Modify: `nextjs/src/app/page.tsx`

**Step 1: Update desktop container classes**

Replace lines 48-54:
```tsx
      <div
        className="relative z-[1] h-screen flex flex-col opacity-0"
        style={{
          animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: isBooted ? '0s' : '1s',
        }}
      >
```

With:
```tsx
      <div
        className="relative z-[1] min-h-screen flex flex-col opacity-0 lg:h-screen lg:overflow-hidden"
        style={{
          animation: `fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: isBooted ? '0s' : '1s',
        }}
      >
```

**Step 2: Add overflow wrapper for content**

Replace lines 55-66:
```tsx
        {/* Top Bar */}
        <TopBar />

        {/* Welcome Panel */}
        <WelcomePanel />

        {/* Desktop Icons */}
        <DesktopIcons
          onOpenModal={handleOpenModal}
          onOpenProfile={() => setProfileOpen(true)}
        />
```

With:
```tsx
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
          />
        </div>
```

**Step 3: Test full responsive flow**

Run: `cd nextjs && npm run dev`
Test at: mobile (375px), tablet (768px), desktop (1024px+)
Expected: Scrollable on mobile/tablet, fixed on desktop

**Step 4: Commit**

```bash
git add nextjs/src/app/page.tsx
git commit -m "feat: enable mobile scrolling with responsive container"
```

---

## Task 6: Add Layout Toggle to ProfilePanel

**Files:**
- Modify: `nextjs/src/components/ProfilePanel.tsx`

**Step 1: Add layout state**

After line 13 (after selectedBackground state), add:
```tsx
  const [selectedLayout, setSelectedLayout] = useState<'constellation' | 'grid'>('constellation');
```

**Step 2: Load layout preference in useEffect**

Replace lines 18-22:
```tsx
  useEffect(() => {
    // Load saved background preference
    const saved = localStorage.getItem('zittihub-background') || 'starfield';
    setSelectedBackground(saved);
    applyBackground(saved);
  }, []);
```

With:
```tsx
  useEffect(() => {
    // Load saved preferences
    const savedBg = localStorage.getItem('zittihub-background') || 'starfield';
    setSelectedBackground(savedBg);
    applyBackground(savedBg);

    const savedLayout = localStorage.getItem('zittihub-layout') as 'constellation' | 'grid' || 'constellation';
    setSelectedLayout(savedLayout);
  }, []);
```

**Step 3: Add layout change handler**

After handleBackgroundChange function (after line 59), add:
```tsx
  const handleLayoutChange = (layout: 'constellation' | 'grid') => {
    setSelectedLayout(layout);
    localStorage.setItem('zittihub-layout', layout);
    window.dispatchEvent(new CustomEvent('layout-change', { detail: layout }));
  };
```

**Step 4: Add Layout section UI**

After the Desktop Background section closing div (after line 226, before the final `</div>`), add:
```tsx

          {/* Desktop Layout Section */}
          <div className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
              Desktop Layout
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
```

**Step 5: Test Profile panel**

Run: `cd nextjs && npm run dev`
Click Profile icon, check new Layout section appears
Expected: Two layout options with visual previews

**Step 6: Commit**

```bash
git add nextjs/src/components/ProfilePanel.tsx
git commit -m "feat: add desktop layout toggle to Profile panel"
```

---

## Task 7: Connect Layout Toggle to DesktopIcons

**Files:**
- Modify: `nextjs/src/app/page.tsx`
- Modify: `nextjs/src/components/DesktopIcons.tsx`

**Step 1: Add layout state to page.tsx**

After line 16 (after profileOpen state), add:
```tsx
  const [layout, setLayout] = useState<'constellation' | 'grid'>('constellation');
```

**Step 2: Load layout preference and listen for changes**

Replace lines 18-27:
```tsx
  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }
  }, []);
```

With:
```tsx
  useEffect(() => {
    const today = new Date().toDateString();
    const lastBoot = localStorage.getItem('zittihub-last-boot');
    setIsBooted(lastBoot === today);

    // Load layout preference
    const savedLayout = localStorage.getItem('zittihub-layout') as 'constellation' | 'grid' || 'constellation';
    setLayout(savedLayout);

    // Listen for layout changes from ProfilePanel
    const handleLayoutChange = (e: CustomEvent) => setLayout(e.detail);
    window.addEventListener('layout-change', handleLayoutChange as EventListener);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }

    return () => window.removeEventListener('layout-change', handleLayoutChange as EventListener);
  }, []);
```

**Step 3: Pass layout prop to DesktopIcons**

Replace the DesktopIcons call:
```tsx
          <DesktopIcons
            onOpenModal={handleOpenModal}
            onOpenProfile={() => setProfileOpen(true)}
          />
```

With:
```tsx
          <DesktopIcons
            onOpenModal={handleOpenModal}
            onOpenProfile={() => setProfileOpen(true)}
            layout={layout}
          />
```

**Step 4: Update DesktopIcons to use layout prop**

In DesktopIcons.tsx, update the component signature (line 146):
```tsx
export default function DesktopIcons({ onOpenModal, onOpenProfile }: DesktopIconsProps) {
```

To:
```tsx
export default function DesktopIcons({ onOpenModal, onOpenProfile, layout = 'constellation' }: DesktopIconsProps) {
```

**Step 5: Add grid position calculation**

After the icons array (after line 141), add:
```tsx
// Grid positions for 2x4 layout
const getGridPosition = (index: number) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return {
    x: col === 0 ? '75%' : '90%',
    y: `${18 + row * 20}%`,
  };
};
```

**Step 6: Update button positioning to use layout**

In the button style prop, replace:
```tsx
            style={isMobile ? {
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${0.1 + index * 0.05}s`,
            } : {
              left: icon.x,
              top: icon.y,
              animation: `iconReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: getAnimationDelay(index),
            }}
```

With:
```tsx
            style={isMobile ? {
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${0.1 + index * 0.05}s`,
            } : {
              left: layout === 'grid' ? getGridPosition(index).x : icon.x,
              top: layout === 'grid' ? getGridPosition(index).y : icon.y,
              animation: `iconReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: getAnimationDelay(index),
            }}
```

**Step 7: Test layout toggle**

Run: `cd nextjs && npm run dev`
1. Open Profile panel
2. Toggle between Constellation and Grid
Expected: Icons immediately reposition on desktop

**Step 8: Commit**

```bash
git add nextjs/src/app/page.tsx nextjs/src/components/DesktopIcons.tsx
git commit -m "feat: wire up layout toggle to dynamically switch icon positions"
```

---

## Task 8: Final Testing and Polish

**Step 1: Full responsive test**

Test at these breakpoints:
- Mobile: 375px width (iPhone SE)
- Mobile large: 428px (iPhone 14 Pro Max)
- Tablet: 768px
- Desktop: 1024px, 1440px

**Step 2: Test all interactions**

- [ ] Hover glow on desktop icons
- [ ] Tap feedback on mobile
- [ ] Layout toggle persists after refresh
- [ ] Background toggle still works
- [ ] Boot animation respects all layouts
- [ ] Reduced motion preference honored

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete main page responsive redesign"
```
