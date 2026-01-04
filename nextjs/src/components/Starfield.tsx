'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
  saturation: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createStars = () => {
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      const clampedNumStars = Math.max(50, Math.min(numStars, 200));

      starsRef.current = [];
      for (let i = 0; i < clampedNumStars; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          baseOpacity: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.7 ? 250 + Math.random() * 30 : 220 + Math.random() * 20,
          saturation: Math.random() * 30 + 10,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
        const opacity = star.baseOpacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        const lightness = 85 + Math.random() * 15;
        ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity})`;
        ctx.fill();

        if (star.radius > 1 && opacity > 0.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity * 0.2})`;
          ctx.fill();
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield"
      className="fixed top-0 left-0 w-full h-full z-0"
    />
  );
}
