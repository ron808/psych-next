'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* Custom cursor: a glowing 4-point star that follows the mouse with
   spring lag, scales on interactive hovers, and falls back to the
   system cursor on touch / reduced-motion devices. */

export default function CursorStar() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  // raw pointer
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // springy follower for the body
  const sx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 38, mass: 0.4 });
  // slower follower for the trailing halo
  const tx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.7 });
  const ty = useSpring(y, { stiffness: 180, damping: 22, mass: 0.7 });

  const scale = hovering ? 1.6 : pressed ? 0.7 : 1;

  // center the SVG on the pointer
  const ox = useTransform(sx, v => v - 14);
  const oy = useTransform(sy, v => v - 14);
  const haloX = useTransform(tx, v => v - 22);
  const haloY = useTransform(ty, v => v - 22);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add('cursor-star-on');

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a, button, [role="button"], input, textarea, select, label, .module-card, .scale-btn');
      setHovering(interactive);
    }
    function down() { setPressed(true); }
    function up()   { setPressed(false); }
    function leave() { x.set(-100); y.set(-100); }

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mouseleave', leave);
    return () => {
      document.documentElement.classList.remove('cursor-star-on');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mouseleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* trailing halo */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: haloX,
          y: haloY,
          width: 44,
          height: 44,
          pointerEvents: 'none',
          zIndex: 9998,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.35) 0%, rgba(244,114,182,0.18) 40%, transparent 70%)',
          filter: 'blur(6px)',
          opacity: hovering ? 0.9 : 0.55,
          transition: 'opacity 200ms ease',
        }}
      />
      {/* the star itself */}
      <motion.div
        aria-hidden
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: ox,
          y: oy,
          width: 28,
          height: 28,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
        animate={{ scale, rotate: hovering ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id="cursor-star-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#FFFFFF" />
              <stop offset="55%"  stopColor="#F472B6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <radialGradient id="cursor-star-glow" cx="14" cy="14" r="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="14" cy="14" r="13" fill="url(#cursor-star-glow)" />
          {/* 4-point sparkle */}
          <path
            d="M14 2 L15.6 12.4 L26 14 L15.6 15.6 L14 26 L12.4 15.6 L2 14 L12.4 12.4 Z"
            fill="url(#cursor-star-grad)"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </>
  );
}
