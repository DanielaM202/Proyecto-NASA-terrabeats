import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VISUALIZATIONS } from './data/visualizations.js';
import { analysisSize, COLUMNS, extractFeatures, pixelKind, pixelValue } from './analysis/features.js';
import { SonificationEngine } from './audio/engine.js';
import { STRINGS, describe, levelIndex, levelValue, regionName } from './i18n.js';

const SPEEDS = [0.5, 1, 1.5, 2];

function initialLang() {
  try {
    const saved = localStorage.getItem('terrabeats-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function Toggle({ checked, onChange, children }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
        checked ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100' : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-3 w-3 rounded-full ${checked ? 'bg-emerald-400' : 'bg-slate-500'}`}
      />
      {children}
    </button>
  );
}

function Meter({ label, value, text }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-slate-100">{text}</span>
      </div>
      <div
        className="mt-1 h-2 rounded bg-slate-700"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
      >
        <div className="h-2 rounded bg-gradient-to-r from-sky-400 to-yellow-300" style={{ width: `${Math.min(100, value * 100)}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(initialLang);
  const [vizIndex, setVizIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1);
  const [explore, setExplore] = useState(false);
  const [autoNarrate, setAutoNarrate] = useState(false);
  const [voice, setVoice] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState(null);
  const [ui, setUi] = useState(null); // throttled features for the UI
  const [announcement, setAnnouncement] = useState('');
  const [probeText, setProbeText] = useState('');

  const t = STRINGS[lang];
  const viz = VISUALIZATIONS[vizIndex];

  const engineRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const workRef = useRef(null);
  const featuresRef = useRef(null);
  const imgRef = useRef(null);
  const prevMaskRef = useRef(null);
  const stepRef = useRef(-1);
  const cursorRef = useRef({ x: 0.5, y: 0.5, visible: false });
  const lastProbeRef = useRef({ t: 0, text: '' });
  const vizRef = useRef(viz);
  const playingRef = useRef(false);
  const hapticsRef = useRef(haptics);
  const exploreRef = useRef(explore);

  vizRef.current = viz;
  playingRef.current = playing;
  hapticsRef.current = haptics;
  exploreRef.current = explore;

  if (!engineRef.current) engineRef.current = new SonificationEngine();

  // ---------- language ----------
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t.appName} — ${t.tagline}`;
    try {
      localStorage.setItem('terrabeats-lang', lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang, t]);

  const speak = useCallback(
    (text) => {
      if (!voice || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'es' ? 'es-ES' : 'en-US';
      u.rate = 1.05;
      window.speechSynthesis.speak(u);
    },
    [voice, lang],
  );

  // ---------- audio engine ----------
  const ensureEngine = useCallback(async () => {
    const engine = engineRef.current;
    await engine.init();
    if (engine.vizId !== vizRef.current.id) engine.setViz(vizRef.current.id);
    engine.setVolume(volume);
    engine.onStep = (i) => (stepRef.current = i);
    engine.onFlash = (n) => {
      if (hapticsRef.current && navigator.vibrate) navigator.vibrate(Math.min(60, 8 + n));
    };
    return engine;
  }, [volume]);

  useEffect(() => {
    if (engineRef.current.ready) engineRef.current.setVolume(volume);
  }, [volume]);

  const play = useCallback(async () => {
    const engine = await ensureEngine();
    try {
      await videoRef.current?.play();
    } catch {
      /* video will start when loaded */
    }
    engine.start();
    setPlaying(true);
  }, [ensureEngine]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    engineRef.current.stop();
    stepRef.current = -1;
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => (playingRef.current ? pause() : play()), [play, pause]);

  const restart = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    prevMaskRef.current = null;
  };

  // Track change: rebuild instruments, keep playing if we were.
  useEffect(() => {
    prevMaskRef.current = null;
    featuresRef.current = null;
    imgRef.current = null;
    setUi(null);
    const engine = engineRef.current;
    if (engine.ready) engine.setViz(viz.id);
    const { w, h } = analysisSize(viz);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    workRef.current = c.getContext('2d', { willReadFrequently: true });
  }, [viz]);

  const onLoadedData = () => {
    const v = videoRef.current;
    v.playbackRate = speed;
    if (playingRef.current) v.play().catch(() => {});
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  // ---------- analysis loop (computer vision → features → sound) ----------
  useEffect(() => {
    let raf;
    let lastUi = 0;
    const analyze = () => {
      const v = videoRef.current;
      const ctx = workRef.current;
      if (!v || !ctx || v.readyState < 2) return;
      const { width: w, height: h } = ctx.canvas;
      ctx.drawImage(v, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      imgRef.current = img;
      const f = extractFeatures(img, vizRef.current.id, prevMaskRef.current);
      // When the video loops, the first frame would look like a burst of "new" pixels.
      if (v.currentTime < 0.15) f.flashes = [];
      prevMaskRef.current = f.mask;
      featuresRef.current = f;
      const engine = engineRef.current;
      engine.update(f);
      engine.frameEvents(f);
    };
    const draw = () => {
      const canvas = overlayRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth * dpr;
      const ch = canvas.clientHeight * dpr;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const g = canvas.getContext('2d');
      g.clearRect(0, 0, cw, ch);
      const step = stepRef.current;
      if (playingRef.current && step >= 0 && vizRef.current.id !== 'lightning') {
        const x = (step / COLUMNS) * cw;
        g.fillStyle = 'rgba(250, 204, 21, 0.10)';
        g.fillRect(x, 0, cw / COLUMNS, ch);
        g.fillStyle = 'rgba(250, 204, 21, 0.85)';
        g.fillRect(x + cw / COLUMNS / 2 - dpr, 0, 2 * dpr, ch);
      }
      const cur = cursorRef.current;
      if (exploreRef.current && cur.visible) {
        const x = cur.x * cw;
        const y = cur.y * ch;
        g.strokeStyle = '#facc15';
        g.lineWidth = 2 * dpr;
        g.beginPath();
        g.arc(x, y, 14 * dpr, 0, Math.PI * 2);
        g.moveTo(x - 24 * dpr, y);
        g.lineTo(x + 24 * dpr, y);
        g.moveTo(x, y - 24 * dpr);
        g.lineTo(x, y + 24 * dpr);
        g.stroke();
      }
    };
    // Analysis runs on a timer (keeps working when the tab is in background,
    // so the sound keeps following the data); drawing uses animation frames.
    const timer = setInterval(() => {
      analyze();
      const now = performance.now();
      if (now - lastUi > 250 && featuresRef.current) {
        lastUi = now;
        setUi(featuresRef.current);
      }
    }, 80);
    const tick = () => {
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ---------- narration ----------
  const describeNow = useCallback(() => {
    const text = describe(t, vizRef.current, featuresRef.current);
    setAnnouncement(text);
    speak(text);
  }, [t, speak]);

  useEffect(() => {
    if (!autoNarrate || !playing) return;
    const id = setInterval(describeNow, 9000);
    return () => clearInterval(id);
  }, [autoNarrate, playing, describeNow]);

  // ---------- explore mode ----------
  const probe = useCallback(
    async (x, y, force = false) => {
      cursorRef.current = { x, y, visible: true };
      const img = imgRef.current;
      if (!img) return;
      const now = performance.now();
      if (!force && now - lastProbeRef.current.t < 70) return;
      lastProbeRef.current.t = now;
      const px = Math.min(img.width - 1, Math.floor(x * img.width));
      const py = Math.min(img.height - 1, Math.floor(y * img.height));
      const i = (py * img.width + px) * 4;
      const [r, g, b] = [img.data[i], img.data[i + 1], img.data[i + 2]];
      const id = vizRef.current.id;
      const value = pixelValue(id, r, g, b);
      const kind = pixelKind(id, r, g, b);
      const engine = await ensureEngine();
      engine.playProbe(value, x * 2 - 1, kind);
      const what = kind ? t.probe[kind] : value > 0 ? `${t.probe.value} ${t.levels[levelIndex(value)]}` : t.probe.none;
      const text = `${regionName(t, x, y)}: ${what}`;
      if (text !== lastProbeRef.current.text) {
        lastProbeRef.current.text = text;
        setProbeText(text);
      }
    },
    [ensureEngine, t],
  );

  const onPointer = (e) => {
    if (!explore) return;
    const rect = e.currentTarget.getBoundingClientRect();
    probe((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  };

  const onExploreKey = (e) => {
    if (!explore) return;
    const d = e.shiftKey ? 0.1 : 0.03;
    const c = cursorRef.current;
    const moves = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] };
    if (moves[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      const [dx, dy] = moves[e.key];
      probe(Math.min(0.999, Math.max(0, c.x + dx)), Math.min(0.999, Math.max(0, c.y + dy)), true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      probe(c.x, c.y, true);
    }
  };

  const toggleExplore = useCallback(async () => {
    const next = !exploreRef.current;
    setExplore(next);
    if (next) {
      await ensureEngine();
      setAnnouncement(t.exploreHelp);
      setTimeout(() => overlayRef.current?.focus(), 50);
    } else {
      cursorRef.current.visible = false;
    }
  }, [ensureEngine, t]);

  // ---------- recording ----------
  const toggleRecord = async () => {
    const engine = await ensureEngine();
    if (!recording) {
      if (recordUrl) URL.revokeObjectURL(recordUrl);
      setRecordUrl(null);
      engine.startRecording();
      setRecording(true);
      if (!playingRef.current) play();
    } else {
      const blob = await engine.stopRecording();
      setRecording(false);
      if (blob) setRecordUrl(URL.createObjectURL(blob));
    }
  };

  // ---------- keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.code === 'Space') {
        if (tag === 'BUTTON' || tag === 'A') return; // native activation
        e.preventDefault();
        togglePlay();
      } else if (/^[1-4]$/.test(e.key)) {
        setVizIndex(Number(e.key) - 1);
      } else if (e.key === 'e' || e.key === 'E') {
        toggleExplore();
      } else if (e.key === 'd' || e.key === 'D') {
        describeNow();
      } else if (e.key === 'l' || e.key === 'L') {
        setLang((l) => (l === 'es' ? 'en' : 'es'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, toggleExplore, describeNow]);

  // Announce track changes for screen readers.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setAnnouncement(`${t.nowPlaying}: ${viz.title[lang]}. ${viz.short[lang]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vizIndex]);

  const level = ui ? levelValue(viz.id, ui) : 0;
  const position = useMemo(() => (ui && ui.coverage > 0.0005 ? regionName(t, ui.cx, ui.cy) : '—'), [ui, t]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a
        href="#player"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-yellow-300 focus:px-4 focus:py-2 focus:text-slate-900"
      >
        {t.skip}
      </a>

      <header className="border-b border-slate-800 bg-gradient-to-r from-blue-950 via-slate-950 to-slate-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{t.appName}</h1>
              <p className="text-sm text-sky-200">{t.tagline}</p>
            </div>
          </div>
          <div role="group" aria-label={t.langLabel} className="flex overflow-hidden rounded-lg border border-slate-600">
            {['es', 'en'].map((l) => (
              <button
                key={l}
                type="button"
                lang={l}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 text-sm font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                  lang === l ? 'bg-yellow-300 text-slate-900' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {l === 'es' ? 'Español' : 'English'}
              </button>
            ))}
          </div>
        </div>
        <p className="mx-auto max-w-7xl px-4 pb-5 text-slate-300">{t.intro}</p>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-3">
        {/* ---------- Player ---------- */}
        <section id="player" aria-labelledby="now-playing" className="lg:col-span-2" tabIndex={-1}>
          <h2 id="now-playing" className="mb-3 text-xl font-bold">
            <span className="text-slate-400">{t.nowPlaying}: </span>
            {viz.title[lang]}
          </h2>

          <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-black" style={{ aspectRatio: viz.aspect }}>
            <video
              ref={videoRef}
              key={viz.id}
              src={viz.video}
              poster={viz.poster}
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={onLoadedData}
              aria-describedby="viz-description"
              aria-label={viz.title[lang]}
              className="absolute inset-0 h-full w-full"
            />
            <canvas
              ref={overlayRef}
              tabIndex={explore ? 0 : -1}
              role={explore ? 'application' : undefined}
              aria-roledescription={explore ? t.explore : undefined}
              aria-label={explore ? t.exploreHelp : undefined}
              aria-hidden={explore ? undefined : true}
              onPointerMove={onPointer}
              onPointerDown={onPointer}
              onPointerLeave={() => (cursorRef.current.visible = explore && cursorRef.current.visible)}
              onKeyDown={onExploreKey}
              className={`absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-yellow-300 ${
                explore ? 'cursor-crosshair' : ''
              }`}
            />
            {!playing && !explore && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-slate-200">
                {t.startHint}
              </div>
            )}
          </div>

          {/* Column profile: what the playhead is reading */}
          <div className="mt-2 flex h-10 items-end gap-0.5" aria-hidden="true">
            {Array.from({ length: COLUMNS }, (_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${playing && stepRef.current === i ? 'bg-yellow-300' : 'bg-sky-500/70'}`}
                style={{ height: `${Math.max(4, (ui ? ui.columns[i] : 0) * 100)}%` }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-keyshortcuts="Space"
              className="rounded-lg bg-yellow-300 px-6 py-3 text-lg font-extrabold text-slate-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
            >
              {playing ? `❚❚ ${t.pause}` : `▶ ${t.play}`}
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 font-semibold hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
            >
              ⟲ {t.restart}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span>{t.volume}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-28 accent-yellow-300"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span>{t.speed}</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded border border-slate-600 bg-slate-800 px-2 py-1"
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {s}×
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Toggle checked={explore} onChange={toggleExplore}>
              {t.explore} (E)
            </Toggle>
            <button
              type="button"
              onClick={describeNow}
              aria-keyshortcuts="D"
              className="rounded-lg border border-sky-500 bg-sky-500/20 px-3 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
            >
              🗣 {t.describe} (D)
            </button>
            <Toggle checked={autoNarrate} onChange={setAutoNarrate}>
              {t.autoNarrate}
            </Toggle>
            <Toggle checked={voice} onChange={setVoice}>
              {t.voice}
            </Toggle>
            <Toggle checked={haptics} onChange={setHaptics}>
              {t.haptics}
            </Toggle>
            <button
              type="button"
              onClick={toggleRecord}
              className={`rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                recording ? 'border-red-400 bg-red-500/30 text-red-100' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {recording ? `■ ${t.stopRecord}` : `● ${t.record}`}
            </button>
            {recordUrl && (
              <a
                href={recordUrl}
                download={`terrabeats-${viz.id}.webm`}
                className="rounded-lg border border-emerald-400 bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-100 underline focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
              >
                ⬇ {t.download}
              </a>
            )}
          </div>

          {/* Live text: visible and announced to screen readers */}
          <div className="mt-4 space-y-2">
            <p role="status" aria-live="polite" className="min-h-[1.5rem] rounded-lg bg-slate-900 p-3 text-slate-100">
              {recording && <span className="mr-2 text-red-300">{t.recording}</span>}
              {announcement}
            </p>
            {explore && (
              <p aria-live="assertive" className="rounded-lg border border-yellow-300/50 bg-slate-900 p-3 text-yellow-100">
                {probeText || t.exploreHelp}
              </p>
            )}
          </div>
        </section>

        {/* ---------- Track list + live data ---------- */}
        <aside className="space-y-6">
          <section aria-labelledby="tracks">
            <h2 id="tracks" className="mb-3 text-xl font-bold">
              {t.chooseTrack}
            </h2>
            <ul className="space-y-2">
              {VISUALIZATIONS.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setVizIndex(i)}
                    aria-pressed={i === vizIndex}
                    aria-keyshortcuts={String(i + 1)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                      i === vizIndex ? 'border-yellow-300 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <img src={v.poster} alt="" className="h-14 w-24 flex-none rounded object-cover" loading="lazy" />
                    <span>
                      <span className="block font-semibold">
                        <span className="mr-1 font-mono text-yellow-300">{i + 1}.</span>
                        {v.title[lang]}
                      </span>
                      <span className="block text-sm text-slate-400">{v.short[lang]}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="live" className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 id="live" className="mb-3 text-lg font-bold">
              {t.liveData}
            </h2>
            <div className="space-y-3">
              <Meter label={t.meters.energy} value={level} text={t.levels[levelIndex(level)]} />
              <Meter
                label={t.meters.coverage}
                value={ui ? Math.min(1, ui.coverage * 2) : 0}
                text={ui ? `${(ui.coverage * 100).toFixed(1)}%` : '—'}
              />
              <Meter
                label={t.meters.intensity}
                value={ui ? ui.intensity : 0}
                text={ui ? `${Math.round(ui.intensity * 100)}%` : '—'}
              />
              <p className="text-sm text-slate-300">
                {t.meters.position}: <span className="font-semibold text-slate-100">{position}</span>
              </p>
            </div>
          </section>
        </aside>

        {/* ---------- Explanations ---------- */}
        <section aria-labelledby="hear" className="rounded-xl border border-slate-700 bg-slate-900 p-5 lg:col-span-2">
          <h2 id="hear" className="mb-3 text-xl font-bold">
            🎧 {t.whatYouHear}
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-slate-200">
            {viz.legend[lang].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3 className="mb-2 mt-5 text-lg font-bold">{t.aboutViz}</h3>
          <p id="viz-description" className="text-slate-300">
            {viz.description[lang]}
          </p>
          <p className="mt-2 text-sm">
            <a href={viz.svsUrl} target="_blank" rel="noreferrer" className="text-sky-300 underline hover:text-sky-200">
              {t.source} #{viz.svsId}
            </a>
          </p>
        </section>

        <section aria-labelledby="shortcuts" className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 id="shortcuts" className="mb-3 text-xl font-bold">
            ⌨ {t.shortcuts}
          </h2>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
            {t.shortcutList.map(([k, d]) => (
              <div key={k} className="contents">
                <dt>
                  <kbd className="rounded border border-slate-500 bg-slate-800 px-1.5 py-0.5 font-mono">{k}</kbd>
                </dt>
                <dd className="text-slate-300">{d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="how" className="rounded-xl border border-slate-700 bg-slate-900 p-5 lg:col-span-3">
          <h2 id="how" className="mb-3 text-xl font-bold">
            ⚙ {t.howItWorks}
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-slate-300">
            {t.howSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-400">
        <p>{t.footer}</p>
        <p className="mt-1">{t.credits}</p>
      </footer>
    </div>
  );
}
