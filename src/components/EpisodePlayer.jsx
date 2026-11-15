import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTER_TITLES } from '../data/chapters.js';
import { storyLines } from '../data/stories.js';
import { getActiveEpisode, setActiveEpisode } from '../audio/episodes.js';
import Icon from './Icon.jsx';

// Accessible player for a recorded episode. Designed for people who cannot see:
//  - chapters = narrated sentences, so every jump lands at the start of a sentence
//  - the chapter list doubles as the transcript (text equivalent of the audio)
//  - everything is a labelled button; keyboard and Media Session (headphones, lock screen)
//  - speed up to 2× (screen-reader users are used to fast speech), remembered
//  - remembers where you stopped

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
const PHASES = ['intro', 'tour', 'outro'];

const mmss = (s) => {
  const v = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`;
};

const spoken = (s, lang) => {
  const v = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(v / 60);
  const r = v % 60;
  if (lang === 'es') return `${m} ${m === 1 ? 'minuto' : 'minutos'} ${r} ${r === 1 ? 'segundo' : 'segundos'}`;
  return `${m} ${m === 1 ? 'minute' : 'minutes'} ${r} ${r === 1 ? 'second' : 'seconds'}`;
};

const btn =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-3 text-lg font-semibold hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 disabled:opacity-40';

export default function EpisodePlayer({ id, story, title, poster, lang, t, src, fresh, rate, onRate, onBeforePlay, onEnded, onUserPause }) {
  const audioRef = useRef(null);
  const sliderRef = useRef(null);
  const [frozen, setFrozen] = useState(0); // slider value while it has focus
  const lastSavedRef = useRef(0);
  const actionsRef = useRef({});
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(null); // chapters read from /playlist/<id>-<lang>.json
  const storageKey = `terrabeats-pos-${id}-${lang}`;
  // The parent remounts this component when the language or the file changes (key), so the saved position is read once.
  const [saved, setSaved] = useState(() => {
    try {
      return Number(localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0;
    }
  });
  const [sliderFocus, setSliderFocus] = useState(false);
  const [rateNote, setRateNote] = useState('');
  const marks = fresh?.marks || null;

  // ---- chapters: from a fresh recording, or from the JSON next to the MP3
  useEffect(() => {
    if (marks) return undefined;
    let cancelled = false;
    fetch(`/playlist/${id}-${lang}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no chapters'))))
      .then((j) => !cancelled && setLoaded(Array.isArray(j.chapters) ? j.chapters : null))
      .catch(() => !cancelled && setLoaded(null));
    return () => {
      cancelled = true;
    };
  }, [id, lang, marks]);

  const lineById = useMemo(() => Object.fromEntries(storyLines(story).map((l) => [l.id, l])), [story]);
  const phaseOf = useMemo(() => {
    const m = {};
    story.intro.forEach((l) => (m[l.id] = 'intro'));
    story.cues.forEach((l) => (m[l.id] = 'tour'));
    story.outro.forEach((l) => (m[l.id] = 'outro'));
    return m;
  }, [story]);
  const chapters = useMemo(
    () =>
      (marks || loaded || [])
        .filter((c) => lineById[c.id])
        .map((c) => ({ ...c, phase: phaseOf[c.id], title: CHAPTER_TITLES[c.id]?.[lang] || c.id, text: lineById[c.id][lang] })),
    [marks, loaded, lineById, phaseOf, lang],
  );

  let cur = -1;
  chapters.forEach((c, i) => {
    if (c.t - 0.3 <= time) cur = i;
  });

  const applyRate = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
    a.preservesPitch = true;
  }, [rate]);
  useEffect(applyRate, [applyRate]);

  const seek = useCallback((tt) => {
    const a = audioRef.current;
    if (!a) return;
    const max = a.duration || tt;
    a.currentTime = Math.max(0, Math.min(max, tt));
    setFrozen(a.currentTime);
    setTime(a.currentTime);
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      onBeforePlay?.();
      const prev = getActiveEpisode();
      if (prev && prev !== a) prev.pause();
      setActiveEpisode(a);
      a.dataset.title = title;
      applyRate();
      a.play().catch(() => {});
    } else {
      a.pause();
      onUserPause?.(); // a manual pause ends "play the whole playlist"
    }
  }, [applyRate, onBeforePlay, onUserPause, title]);

  const goChapter = useCallback(
    (i) => {
      const c = chapters[i];
      if (!c) return;
      seek(Math.max(0, c.t - 0.25));
      if (audioRef.current?.paused) toggle();
    },
    [chapters, seek, toggle],
  );
  const prevChapter = () => goChapter(cur >= 0 && time - chapters[cur].t > 3 ? cur : Math.max(0, cur - 1));
  const nextChapter = () => goChapter(Math.min(chapters.length - 1, cur + 1));
  const seekBy = (d) => seek((audioRef.current?.currentTime || 0) + d);
  const changeRate = (dir) => {
    const i = RATES.indexOf(rate);
    const j = Math.max(0, Math.min(RATES.length - 1, (i < 0 ? RATES.indexOf(1) : i) + dir));
    onRate(RATES[j]);
    setRateNote(t.rateNote(RATES[j]));
  };
  useEffect(() => {
    actionsRef.current = { toggle, prevChapter, nextChapter, seekBy, seek };
  });

  // "Play the whole playlist" (and the automatic jump to the next episode) asks a player to start.
  useEffect(() => {
    const onRequest = (e) => {
      if (e.detail?.id !== id || !audioRef.current?.paused) return;
      if (e.detail.fromStart) seek(0);
      toggle();
    };
    window.addEventListener('terrabeats:episode', onRequest);
    return () => window.removeEventListener('terrabeats:episode', onRequest);
  }, [id, seek, toggle]);

  // ---- Media Session: headphone buttons and phone lock screen
  const registerMediaSession = () => {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: 'TerraBeats',
        album: 'NASA Earth Information Jukebox',
        artwork: poster ? [{ src: poster, sizes: '960x540', type: 'image/jpeg' }] : [],
      });
    } catch {
      /* metadata not supported */
    }
    const set = (name, fn) => {
      try {
        navigator.mediaSession.setActionHandler(name, fn);
      } catch {
        /* action not supported */
      }
    };
    const a = () => actionsRef.current;
    set('play', () => a().toggle());
    set('pause', () => a().toggle());
    set('previoustrack', () => a().prevChapter());
    set('nexttrack', () => a().nextChapter());
    set('seekbackward', () => a().seekBy(-10));
    set('seekforward', () => a().seekBy(10));
    set('seekto', (d) => d.seekTime != null && a().seek(d.seekTime));
  };

  // ---- keyboard (only inside the player)
  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = e.target.tagName;
    const handled = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onSlider = e.target === sliderRef.current;
    if (e.key === 'k' || e.key === 'K' || (e.key === ' ' && tag !== 'BUTTON' && tag !== 'SELECT' && tag !== 'SUMMARY' && tag !== 'A')) {
      if (tag === 'SELECT') return;
      handled();
      toggle();
    } else if (onSlider && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      handled();
      seekBy(e.key === 'ArrowLeft' ? -5 : 5);
    } else if (onSlider && e.key === 'PageUp') {
      handled();
      prevChapter();
    } else if (onSlider && e.key === 'PageDown') {
      handled();
      nextChapter();
    } else if (e.key === '<') {
      handled();
      changeRate(-1);
    } else if (e.key === '>') {
      handled();
      changeRate(1);
    }
  };

  const shown = sliderFocus ? frozen : time; // no chatter for screen readers while the slider is focused
  const valueText = `${spoken(shown, lang)} ${t.of} ${spoken(duration, lang)}${
    cur >= 0 ? `. ${t.chapterOf(cur + 1, chapters.length, chapters[cur].title)}` : ''
  }`;
  const showResume = saved > 5 && duration && saved < duration - 5 && time < 1 && !playing;
  const chaptersHref = useMemo(() => {
    if (!marks) return null;
    return URL.createObjectURL(new Blob([JSON.stringify({ duration: fresh.duration, chapters: marks }, null, 2)], { type: 'application/json' }));
  }, [marks, fresh]);

  return (
    <div data-episode-player onKeyDown={onKeyDown} className="mt-3 space-y-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          applyRate();
        }}
        onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const c = e.currentTarget.currentTime;
          setTime(c);
          if (Math.abs(c - lastSavedRef.current) > 5) {
            lastSavedRef.current = c;
            try {
              localStorage.setItem(storageKey, String(Math.floor(c)));
            } catch {
              /* storage unavailable */
            }
          }
        }}
        onPlay={() => {
          setPlaying(true);
          registerMediaSession();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEnded?.(id);
          try {
            localStorage.removeItem(storageKey);
          } catch {
            /* storage unavailable */
          }
          setSaved(0);
        }}
      />

      {showResume && (
        <button
          type="button"
          onClick={() => {
            seek(saved);
            toggle();
          }}
          className="w-full rounded-lg border border-emerald-400 bg-emerald-500/20 px-3 py-2 text-left text-sm font-semibold text-emerald-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
        >
          {t.resumeFrom(mmss(saved))}
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.episodeControls(title)}>
        <button type="button" className={btn} onClick={prevChapter} disabled={!chapters.length} aria-label={t.prevChapter}>
          <Icon name="prev" />
        </button>
        <button type="button" className={btn} onClick={() => seekBy(-10)} aria-label={t.back10}>
          <Icon name="back" />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t.pauseEpisode : t.playEpisode}
          className="inline-flex h-11 min-w-24 items-center justify-center rounded-lg bg-yellow-300 px-4 text-lg font-extrabold text-slate-950 hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
        >
          <Icon name={playing ? 'pause' : 'play'} className="h-6 w-6" />
        </button>
        <button type="button" className={btn} onClick={() => seekBy(10)} aria-label={t.fwd10}>
          <Icon name="fwd" />
        </button>
        <button type="button" className={btn} onClick={nextChapter} disabled={!chapters.length} aria-label={t.nextChapter}>
          <Icon name="next" />
        </button>
      </div>

      <div>
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={Math.max(1, Math.floor(duration))}
          step={1}
          value={Math.floor(shown)}
          aria-label={t.seek}
          aria-valuetext={valueText}
          onChange={(e) => seek(Number(e.target.value))}
          onFocus={() => {
            setFrozen(time);
            setSliderFocus(true);
          }}
          onBlur={() => setSliderFocus(false)}
          className="h-6 w-full accent-yellow-300"
        />
        <div className="relative h-3" aria-hidden="true">
          {duration > 0 &&
            chapters.map((c) => (
              <span
                key={c.id}
                title={c.title}
                className={`absolute top-0 h-3 w-0.5 rounded ${c.phase === 'intro' ? 'bg-slate-400' : c.phase === 'outro' ? 'bg-emerald-400' : 'bg-white/80'}`}
                style={{ left: `${Math.min(99.5, (c.t / duration) * 100)}%` }}
              />
            ))}
        </div>
        <p className="mt-1 flex justify-between gap-2 text-sm text-slate-300">
          <span>{cur >= 0 ? t.chapterOf(cur + 1, chapters.length, chapters[cur].title) : chapters.length ? t.chapterNone : ''}</span>
          <span className="font-mono text-slate-400" aria-hidden="true">
            {mmss(time)} / {mmss(duration)}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span>{t.speed}</span>
          <select
            value={rate}
            onChange={(e) => onRate(Number(e.target.value))}
            className="rounded border border-slate-600 bg-slate-800 px-2 py-2"
          >
            {RATES.map((r) => (
              <option key={r} value={r}>
                {r}×
              </option>
            ))}
          </select>
        </label>
        <a
          href={src}
          download={`terrabeats-${id}-${lang}.${fresh ? 'webm' : 'mp3'}`}
          className="text-sky-300 underline hover:text-sky-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
        >
          {t.downloadEpisode}
        </a>
        {chaptersHref && (
          <a
            href={chaptersHref}
            download={`terrabeats-${id}-${lang}.json`}
            className="text-sky-300 underline hover:text-sky-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
          >
            {t.downloadChapters}
          </a>
        )}
      </div>
      <p className="text-xs text-slate-400">{t.playerKeys}</p>
      <span role="status" aria-live="polite" className="sr-only">
        {rateNote}
      </span>

      {chapters.length > 0 && (
        <details className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300">
            {t.chapters} ({chapters.length})
          </summary>
          <p className="mt-2 text-sm text-slate-400">{t.chaptersHelp}</p>
          <div className="mt-3 space-y-4">
            {PHASES.map((ph) => {
              const items = chapters.map((c, i) => ({ c, i })).filter((x) => x.c.phase === ph);
              if (!items.length) return null;
              return (
                <div key={ph}>
                  <h4 className="mb-1 text-sm font-bold text-emerald-300">{t.phaseNames[ph]}</h4>
                  <ol className="space-y-2">
                    {items.map(({ c, i }) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => goChapter(i)}
                          aria-current={i === cur ? 'true' : undefined}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
                            i === cur ? 'border-yellow-300 bg-yellow-300/10' : 'border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-mono text-yellow-300">{mmss(c.t)}</span> <span className="font-semibold">{c.title}</span>
                          <span className="mt-1 block text-slate-400">{c.text}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
