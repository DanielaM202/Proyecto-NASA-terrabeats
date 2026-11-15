import { useEffect, useRef } from 'react';

// Decorative night-sky background: slowly drifting, twinkling stars and an occasional
// shooting star. It is purely visual (aria-hidden), costs little (about 140 points), pauses
// when the tab is hidden and draws a single still frame when the user prefers reduced motion.
// It never touches the audio engine.
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let w = 0;
    let h = 0;
    let raf = 0;
    let stars = [];
    let shooting = null;
    let nextShot = performance.now() + 6000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(240, (w * h) / 6500));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.55,
        depth: Math.random() * 0.8 + 0.2, // parallax: nearer stars drift faster
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        warm: Math.random() < 0.15,
      }));
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, w, h);
      const still = reduce.matches;
      for (const s of stars) {
        if (!still) {
          s.x -= 0.012 * s.depth * 16 * 0.06;
          s.y += 0.004 * s.depth;
          if (s.x < -2) s.x = w + 2;
          if (s.y > h + 2) s.y = -2;
        }
        const tw = still ? 0.7 : 0.55 + 0.45 * Math.sin(now / 1000 * s.speed + s.phase);
        ctx.globalAlpha = (0.45 + 0.55 * s.depth) * tw;
        ctx.fillStyle = s.warm ? '#ffe1a8' : '#cfe0ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) {
        if (!shooting && now > nextShot) {
          shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.35, life: 0 };
          nextShot = now + 9000 + Math.random() * 9000;
        }
        if (shooting) {
          shooting.life += 1;
          const k = shooting.life / 38;
          const x = shooting.x - k * 160;
          const y = shooting.y + k * 70;
          const g = ctx.createLinearGradient(x, y, x + 70, y - 30);
          g.addColorStop(0, 'rgba(207,224,255,0.9)');
          g.addColorStop(1, 'rgba(207,224,255,0)');
          ctx.globalAlpha = 1 - k * 0.6;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 70, y - 30);
          ctx.stroke();
          if (k >= 1) shooting = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches || document.hidden) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    };

    resize();
    start();
    window.addEventListener('resize', () => {
      resize();
      start();
    });
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener?.('change', start);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
