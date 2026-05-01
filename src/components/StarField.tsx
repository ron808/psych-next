'use client';
import { useEffect, useRef } from 'react';

/* ─── Cosmic background ──────────────────────────────────────────
   Three parallax star layers, slow nebula drift, occasional shooting
   stars, subtle mouse parallax. Pure canvas — no deps.            */

type Star = {
  x: number; y: number; r: number;
  baseA: number; a: number; da: number;
  layer: 0 | 1 | 2;
  hue: number;
};

type Shooter = {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; len: number;
};

const LAYER_DENSITY = [9000, 14000, 22000] as const; // px² per star
const LAYER_RADIUS  = [[0.3, 0.8], [0.5, 1.3], [0.9, 2.0]] as const;
const LAYER_PARALLAX = [0.2, 0.5, 1.0] as const; // mouse parallax weight

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let dpr = 1;
    let w = 0, h = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let lastShooter = 0;
    let t0 = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      stars = [];
      const area = w * h;
      for (let layer = 0; layer < 3; layer++) {
        const count = Math.floor(area / LAYER_DENSITY[layer]);
        const [rMin, rMax] = LAYER_RADIUS[layer];
        for (let i = 0; i < count; i++) {
          const baseA = 0.25 + Math.random() * 0.65;
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: rMin + Math.random() * (rMax - rMin),
            baseA,
            a: baseA,
            da: (Math.random() * 0.012 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
            layer: layer as 0 | 1 | 2,
            // subtle hue tint — purple-blue palette
            hue: 220 + Math.random() * 60,
          });
        }
      }
    }

    function spawnShooter() {
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -40 : w + 40;
      const startY = Math.random() * h * 0.55;
      const speed = 8 + Math.random() * 4;
      const angle = (fromLeft ? 0.18 : Math.PI - 0.18) + (Math.random() - 0.5) * 0.16;
      shooters.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 70 + Math.random() * 40,
        len: 80 + Math.random() * 80,
      });
    }

    function draw(now: number) {
      const dt = Math.min(now - t0, 50);
      t0 = now;
      ctx!.clearRect(0, 0, w, h);

      // ease mouse toward target
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // stars
      for (const s of stars) {
        s.a += s.da * (dt / 16);
        if (s.a <= 0.05) { s.a = 0.05; s.da *= -1; }
        else if (s.a >= 1) { s.a = 1; s.da *= -1; }

        const px = LAYER_PARALLAX[s.layer];
        const x = s.x + mouse.x * px * 18;
        const y = s.y + mouse.y * px * 18;

        // halo for the brightest layer
        if (s.layer === 2 && s.r > 1.4) {
          const grad = ctx!.createRadialGradient(x, y, 0, x, y, s.r * 4);
          grad.addColorStop(0, `hsla(${s.hue}, 70%, 85%, ${s.a * 0.55})`);
          grad.addColorStop(1, `hsla(${s.hue}, 70%, 85%, 0)`);
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(x, y, s.r * 4, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${s.hue}, 50%, 96%, ${s.a})`;
        ctx!.fill();
      }

      // shooters
      if (!reduce) {
        if (now - lastShooter > 4500 + Math.random() * 6000) {
          spawnShooter();
          lastShooter = now;
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.x += sh.vx;
          sh.y += sh.vy;
          sh.life++;
          const fade = 1 - sh.life / sh.max;
          if (fade <= 0 || sh.x < -120 || sh.x > w + 120) {
            shooters.splice(i, 1);
            continue;
          }
          const tailX = sh.x - sh.vx * (sh.len / 8);
          const tailY = sh.y - sh.vy * (sh.len / 8);
          const grad = ctx!.createLinearGradient(sh.x, sh.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 240, 220, ${0.85 * fade})`);
          grad.addColorStop(0.4, `rgba(192, 132, 252, ${0.4 * fade})`);
          grad.addColorStop(1, 'rgba(192, 132, 252, 0)');
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.6;
          ctx!.lineCap = 'round';
          ctx!.beginPath();
          ctx!.moveTo(sh.x, sh.y);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
          // bright head
          ctx!.beginPath();
          ctx!.arc(sh.x, sh.y, 1.6, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255,255,255,${fade})`;
          ctx!.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      // normalized -0.5 → 0.5
      mouse.tx = (e.clientX / w - 0.5);
      mouse.ty = (e.clientY / h - 0.5);
    }

    window.addEventListener('resize', resize);
    if (!reduce) window.addEventListener('mousemove', onMouseMove, { passive: true });
    resize();
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Deep space gradient */}
      <div className="cosmos-bg" aria-hidden />
      {/* Drifting nebulae */}
      <div className="cosmos-nebulae" aria-hidden>
        <span className="nebula nebula-purple" />
        <span className="nebula nebula-indigo" />
        <span className="nebula nebula-pink" />
        <span className="nebula nebula-teal" />
      </div>
      {/* Star canvas */}
      <canvas ref={canvasRef} className="cosmos-stars" aria-hidden />
      {/* Subtle vignette */}
      <div className="cosmos-vignette" aria-hidden />
    </>
  );
}
