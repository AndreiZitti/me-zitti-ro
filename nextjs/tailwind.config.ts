import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-deep': 'var(--bg-deep)',
        'bg-surface': 'var(--bg-surface)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      animation: {
        'boot-dot-to-line': 'dotToLine 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'boot-line-expand': 'lineExpand 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards',
        'boot-fade-out': 'bootFadeOut 0.3s ease-out 1.2s forwards',
        'welcome-fade-in': 'welcomeFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'icon-reveal': 'iconReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'spin': 'spin 0.8s linear infinite',
        'aurora-shift': 'auroraShift 20s ease infinite',
      },
      keyframes: {
        dotToLine: {
          '0%': { width: '4px', height: '4px', borderRadius: '50%' },
          '100%': { width: '100vw', height: '2px', borderRadius: '0' },
        },
        lineExpand: {
          '0%': { height: '2px', opacity: '1' },
          '100%': { height: '100vh', opacity: '0' },
        },
        bootFadeOut: {
          to: { visibility: 'hidden', pointerEvents: 'none' },
        },
        welcomeFadeIn: {
          from: { opacity: '0', transform: 'translateY(-50%) translateX(-20px)' },
          to: { opacity: '1', transform: 'translateY(-50%) translateX(0)' },
        },
        iconReveal: {
          from: { opacity: '0', transform: 'translate(-50%, -50%) translateY(20px) scale(0.9)', filter: 'blur(4px)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) translateY(0) scale(1)', filter: 'blur(0)' },
        },
        fadeIn: {
          to: { opacity: '1' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        auroraShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
