import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

// Page-level polish, all decorative and independent from the audio:
//  - a thin reading-progress bar at the top,
//  - a soft light that follows the pointer over panels and cards,
//  - panels that fade in as they enter the viewport,
//  - a "back to top" button after scrolling down.
// With prefers-reduced-motion the light and the fade-ins are not used.
export default function ScrollFx({ label }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        root.style.setProperty('--progress', p.toFixed(4));
        root.style.setProperty('--scroll', String(Math.min(window.scrollY, 800)));
        setShowTop(window.scrollY > 700);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let move = null;
    let io = null;
    if (!reduce) {
      move = (e) => {
        const el = e.target.closest?.('.panel, .glow');
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      window.addEventListener('pointermove', move, { passive: true });

      // Reveal below-the-fold panels as they enter the viewport.
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) {
              en.target.classList.add('is-in');
              io.unobserve(en.target);
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );
      document.querySelectorAll('main > section').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
          el.classList.add('reveal');
          io.observe(el);
        }
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (move) window.removeEventListener('pointermove', move);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="progress-bar" />
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        tabIndex={showTop ? 0 : -1}
        aria-hidden={showTop ? undefined : 'true'}
        className={`to-top ${showTop ? 'is-visible' : ''}`}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </button>
    </>
  );
}
