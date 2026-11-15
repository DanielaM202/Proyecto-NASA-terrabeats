import { useEffect, useState } from 'react';
import Glyph from './Glyph.jsx';

// "Mission control" strip under the hero: UTC clock, active track and its NASA source.
// The clock owns its own state so only this small component re-renders each second.
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now.toISOString().slice(11, 19)}</span>;
}

export default function Telemetry({ viz, index, total, lang, tag, accent }) {
  const es = lang === 'es';
  return (
    <div className="border-t border-white/10 bg-slate-950/40 backdrop-blur-sm">
      <dl
        aria-label={es ? 'Datos de la pista activa' : 'Active track data'}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 font-mono text-xs sm:grid-cols-4"
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <Glyph name="orbit" className="h-4 w-4 text-sky-300" />
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">UTC</dt>
            <dd className="text-slate-200">
              <Clock />
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Glyph name={viz.id} className="h-4 w-4" style={{ color: accent }} />
          <div className="min-w-0">
            <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{es ? 'Pista' : 'Track'}</dt>
            <dd className="truncate text-slate-200">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {viz.title[lang]}
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Glyph name="tracks" className="h-4 w-4 text-sky-300" />
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{es ? 'Instrumento' : 'Instrument'}</dt>
            <dd className="text-slate-200">{tag}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Glyph name="player" className="h-4 w-4 text-sky-300" />
          <div>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{es ? 'Fuente' : 'Source'}</dt>
            <dd>
              <a
                href={viz.svsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-300 underline decoration-yellow-300/40 underline-offset-2 hover:decoration-yellow-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
              >
                NASA SVS {viz.svsId}
                <span className="sr-only">{es ? ' (se abre en una pestaña nueva)' : ' (opens in a new tab)'}</span>
              </a>
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
