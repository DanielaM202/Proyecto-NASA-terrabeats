import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';

const KEY = 'terrabeats-view';
const DEFAULTS = { contrast: false, text: 'normal', motion: false };

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return DEFAULTS;
  }
}

// Visual preferences for low-vision users. They are written as data attributes on <html>
// (styles live in src/index.css) and remembered on this device.
export default function ViewOptions({ t }) {
  const [view, setView] = useState(load);
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const btn = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (view.contrast) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;
    if (view.text !== 'normal') root.dataset.text = view.text;
    else delete root.dataset.text;
    if (view.motion) root.dataset.motion = 'off';
    else delete root.dataset.motion;
    try {
      localStorage.setItem(KEY, JSON.stringify(view));
    } catch {
      /* storage unavailable: the choice lasts for this visit only */
    }
    window.dispatchEvent(new Event('terrabeats:view'));
  }, [view]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (!box.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const v = t.view;
  const set = (patch) => setView((cur) => ({ ...cur, ...patch }));
  const toggle = 'rounded-lg border px-3 py-2 text-sm font-semibold transition';
  const on = 'border-yellow-300 bg-yellow-300 text-slate-950';
  const off = 'border-slate-600 bg-slate-900/70 text-slate-100 hover:bg-slate-800';

  return (
    <div ref={box} className="relative">
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls="view-options"
        onClick={() => setOpen((o) => !o)}
        className="btn-lift inline-flex items-center gap-2 rounded-lg border border-slate-600/80 bg-slate-900/70 px-3.5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800"
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        {v.button}
      </button>
      {open && (
        <div
          id="view-options"
          role="group"
          aria-label={v.title}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false);
              btn.current?.focus();
            }
          }}
          className="absolute left-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] space-y-4 sm:left-auto sm:right-0 rounded-2xl border border-slate-600 bg-slate-900 p-4 text-left shadow-xl"
        >
          <p className="font-display text-lg font-semibold">{v.title}</p>
          <button type="button" aria-pressed={view.contrast} onClick={() => set({ contrast: !view.contrast })} className={`${toggle} w-full text-left ${view.contrast ? on : off}`}>
            {v.contrast}
          </button>
          <div role="group" aria-label={v.text}>
            <p className="mb-2 text-sm text-slate-300">{v.text}</p>
            <div className="flex gap-2">
              {[
                ['normal', v.textNormal],
                ['large', v.textLarge],
                ['xlarge', v.textXlarge],
              ].map(([val, label]) => (
                <button key={val} type="button" aria-pressed={view.text === val} onClick={() => set({ text: val })} className={`${toggle} flex-1 ${view.text === val ? on : off}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" aria-pressed={view.motion} onClick={() => set({ motion: !view.motion })} className={`${toggle} w-full text-left ${view.motion ? on : off}`}>
            {v.motion}
          </button>
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => setView(DEFAULTS)} className="text-sm text-sky-300 underline hover:text-sky-200">
              {v.reset}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                btn.current?.focus();
              }}
              className="text-sm text-slate-300 underline hover:text-white"
            >
              {v.close}
            </button>
          </div>
          <p className="text-xs text-slate-400">{v.hint}</p>
        </div>
      )}
    </div>
  );
}
