import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VISUALIZATIONS } from './data/visualizations.js';
import { LEGENDS } from './data/legends.js';
import { EXTRA_LINES, STORIES } from './data/stories.js';
import { analysisSize, COLUMNS, extractFeatures, pixelKind, pixelValue } from './analysis/features.js';
import { SonificationEngine } from './audio/engine.js';
import { STRINGS, describe, levelIndex, levelValue, liveRemark, regionName } from './i18n.js';

const SPEEDS = [0.5, 1, 1.5, 2];
const STORY_RATE = 0.6; // video speed during the guided story, so narration fits each region

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
  const langRef = useRef(lang);
  const playingRef = useRef(false);
  const hapticsRef = useRef(haptics);
  const exploreRef = useRef(explore);
  const stopStoryRef = useRef(() => {});
  const lastLineRef = useRef(null);
  const menuAudioRef = useRef(null);
  const voiceBusyRef = useRef(false); // one narrator at a time
  const lastSpokeRef = useRef(0);
  const quizRef = useRef(null); // resolver while a question waits for an answer
  const pendingVoiceRef = useRef(null); // resolves the line currently being spoken
  const hushRef = useRef(() => {});
  const startedOnceRef = useRef(false);
  const exploreSpeakTimer = useRef(null);
  const interactedRef = useRef(false);

  vizRef.current = viz;
  langRef.current = lang;
  playingRef.current = playing;
  hapticsRef.current = haptics;
  exploreRef.current = explore;

  if (!engineRef.current) engineRef.current = new SonificationEngine();

  // Stop every sound if this component goes away (also on hot reload in dev).
  useEffect(
    () => () => {
      stopStoryRef.current();
      hushRef.current();
      const e = engineRef.current;
      e.stop();
      e.stopSources();
      e.disposeVoices();
    },
    [],
  );

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

  // ONE narrator: every new line first silences whatever was speaking
  // (story clip, menu clip, synthetic voice) and releases whoever was waiting for it.
  const hush = useCallback(() => {
    const n = narrRef.current;
    if (n) {
      n.onended = null;
      n.onerror = null;
      n.pause();
      narrRef.current = null;
    }
    menuAudioRef.current?.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const pending = pendingVoiceRef.current;
    pendingVoiceRef.current = null;
    pending?.();
    voiceBusyRef.current = false;
    engineRef.current.setDucked(false);
  }, []);
  hushRef.current = hush;

  // Speaks a text (if the built-in voice is on) and resolves when finished.
  // The music is ducked while the narrator talks.
  const speak = useCallback(
    (text) =>
      new Promise((resolve) => {
        const engine = engineRef.current;
        hush();
        if (!voice || !('speechSynthesis' in window)) {
          setTimeout(resolve, Math.min(4000, 800 + text.length * 25));
          return;
        }
        voiceBusyRef.current = true;
        lastSpokeRef.current = performance.now();
        const u = new SpeechSynthesisUtterance(text);
        // Pick an installed voice for the language; if none exists, use the
        // default voice rather than staying silent.
        const match = window.speechSynthesis.getVoices().find((vo) => vo.lang.toLowerCase().startsWith(lang));
        if (match) {
          u.voice = match;
          u.lang = match.lang;
        }
        u.rate = 1.05;
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          if (pendingVoiceRef.current === finish) {
            pendingVoiceRef.current = null;
            voiceBusyRef.current = false;
            engine.setDucked(false);
          }
          lastSpokeRef.current = performance.now();
          resolve();
        };
        pendingVoiceRef.current = finish;
        u.onend = finish;
        u.onerror = finish;
        // Safety net: some browsers never fire onend.
        setTimeout(finish, 2500 + text.length * 90);
        engine.setDucked(true);
        window.speechSynthesis.speak(u);
      }),
    [voice, lang, hush],
  );

  // ---------- audio engine ----------
  // ---------- auditory legend ----------
  const [legendIdx, setLegendIdx] = useState(-1);
  const legendRunRef = useRef(0);

  const stopLegend = useCallback(() => {
    legendRunRef.current++;
    setLegendIdx(-1);
    hushRef.current();
  }, []);

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
    stopLegend();
    stopStoryRef.current();
    const engine = engineRef.current;
    if (engine.ready) engine.setViz(viz.id);
    // Audio menu (needs a previous user gesture so the browser allows sound).
    if (interactedRef.current) {
      // Audio menu: say which track was chosen and what question it answers.
      const menu = STORIES[viz.id]?.menu;
      if (menu) {
        hushRef.current();
        const a = new Audio(`/narration/${langRef.current}/${menu.id}.mp3`);
        menuAudioRef.current = a;
        lastLineRef.current = menu;
        a.play().catch(() => {});
      }
    }
    const { w, h } = analysisSize(viz);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    workRef.current = c.getContext('2d', { willReadFrequently: true });
  }, [viz, stopLegend]);

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
      const f = extractFeatures(img, vizRef.current.id, prevMaskRef.current, vizRef.current.masks);
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

  const playLegend = useCallback(async () => {
    const run = ++legendRunRef.current;
    const live = () => run === legendRunRef.current;
    if (playingRef.current) pause();
    const engine = await ensureEngine();
    const viz = vizRef.current;
    const items = LEGENDS[viz.id];
    const say = async (text) => {
      if (!live()) return;
      setAnnouncement(text);
      await speak(text);
    };
    setLegendIdx(-2); // intro
    await say(t.legendIntro(viz.title[lang]));
    for (let k = 0; k < items.length; k++) {
      if (!live()) return;
      setLegendIdx(k);
      await say(items[k][lang]);
      if (!live()) return;
      await engine.demo(items[k].key);
    }
    if (!live()) return;
    setLegendIdx(-1);
    await say(t.legendEnd);
  }, [ensureEngine, pause, speak, t, lang]);

  const toggleLegend = useCallback(() => (legendIdx !== -1 ? stopLegend() : playLegend()), [legendIdx, stopLegend, playLegend]);

  // ---------- guided sound story ----------
  // Pre-rendered narration (public/narration/<lang>/<id>.mp3) + engine demos +
  // cues synced to the video time. Falls back to speech synthesis if a file fails.
  const [storyPhase, setStoryPhase] = useState('idle'); // idle | intro | tour | outro
  const [storyPaused, setStoryPaused] = useState(false);
  const [caption, setCaption] = useState('');
  const [quiz, setQuiz] = useState(null); // active question (for the on-screen buttons)
  const [liveLine, setLiveLine] = useState('');
  const storyRunRef = useRef(0);
  const narrRef = useRef(null);
  const storyPausedRef = useRef(false);
  const storyPhaseRef = useRef('idle');
  storyPausedRef.current = storyPaused;
  storyPhaseRef.current = storyPhase;

  const playLine = useCallback(
    (line, run) =>
      new Promise((resolve) => {
        if (run !== storyRunRef.current) return resolve();
        const engine = engineRef.current;
        const text = line[lang];
        lastLineRef.current = line;
        setCaption(text);
        // Single narrator: cut anything still talking.
        hush();
        voiceBusyRef.current = true;
        const audio = new Audio(`/narration/${lang}/${line.id}.mp3`);
        narrRef.current = audio;
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          if (pendingVoiceRef.current === done) {
            pendingVoiceRef.current = null;
            voiceBusyRef.current = false;
            engine.setDucked(false);
          }
          lastSpokeRef.current = performance.now();
          if (narrRef.current === audio) narrRef.current = null;
          resolve();
        };
        pendingVoiceRef.current = done;
        audio.onended = done;
        // Fallback to the synthetic voice; detach first so speak() does not end this line early.
        let fellBack = false;
        const fallback = () => {
          if (fellBack) return;
          fellBack = true;
          if (pendingVoiceRef.current === done) pendingVoiceRef.current = null;
          speak(text).then(done);
        };
        audio.onerror = fallback;
        engine.setDucked(true);
        audio.play().catch(fallback);
      }),
    [lang, speak, hush],
  );

  const restoreVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.loop = true;
    v.playbackRate = speed;
  }, [speed]);

  const stopStory = useCallback(() => {
    storyRunRef.current++;
    quizRef.current?.(null);
    hush();
    quizRef.current = null;
    setQuiz(null);
    setStoryPhase('idle');
    setStoryPaused(false);
    setCaption('');
    restoreVideo();
  }, [restoreVideo, hush]);

  stopStoryRef.current = stopStory;

  const waitFor = (cond, run) =>
    new Promise((resolve) => {
      const id = setInterval(() => {
        if (run !== storyRunRef.current || cond()) {
          clearInterval(id);
          resolve();
        }
      }, 100);
    });

  const startStory = useCallback(async () => {
    const story = STORIES[vizRef.current.id];
    if (!story) return;
    stopLegend();
    stopStory();
    const run = ++storyRunRef.current;
    const live = () => run === storyRunRef.current;
    if (playingRef.current) pause();
    setExplore(false);
    cursorRef.current.visible = false;
    const engine = await ensureEngine();
    if (!live()) return;
    engine.setViz(vizRef.current.id); // fresh instruments: no leftover demo notes
    startedOnceRef.current = true;
    const v = videoRef.current;
    v.loop = false;
    v.currentTime = 0;
    prevMaskRef.current = null;

    // 1. Question + reference sounds (video paused on the first frame).
    setStoryPhase('intro');
    for (const step of story.intro) {
      if (!live()) return;
      await playLine(step, run);
      await waitFor(() => !storyPausedRef.current, run);
      if (step.demo && live()) await engine.demo(step.demo);
    }

    // 2. Tour: the video plays slowly and the narrator names each place.
    if (!live()) return;
    setStoryPhase('tour');
    v.playbackRate = story.rate ?? STORY_RATE;
    await play();

    // Live remarks: between scripted lines, say what the data shows right now.
    let nextCueT = story.cues[0]?.t ?? Infinity;
    let lastRemark = '';
    const remarkTimer = setInterval(() => {
      if (!live()) return clearInterval(remarkTimer);
      if (storyPausedRef.current || quizRef.current || voiceBusyRef.current) return;
      if (performance.now() - lastSpokeRef.current < 3000) return;
      const rate = v.playbackRate || 1;
      if ((nextCueT - v.currentTime) / rate < 3.2) return; // a scripted line is coming
      const r = liveRemark(lang, vizRef.current.id, featuresRef.current);
      if (!r || r.key === lastRemark) return;
      lastRemark = r.key;
      setLiveLine(r.text);
      speak(r.text);
    }, 700);

    for (let k = 0; k < story.cues.length; k++) {
      const cue = story.cues[k];
      nextCueT = cue.t;
      await waitFor(() => v.currentTime >= cue.t, run);
      if (!live()) break;
      nextCueT = story.cues[k + 1]?.t ?? Infinity;
      if (!cue.quiz) {
        await playLine(cue, run);
        continue;
      }
      // Interactive question: the image freezes but its sound keeps playing,
      // so the listener can hear left/right before answering.
      if (!cue.quiz.keepPlaying) v.pause();
      setQuiz(cue);
      await playLine(cue, run);
      if (!live()) break;
      setCaption(`${cue[lang]} — ${t.quizHint}`);
      const ans = await new Promise((resolve) => {
        quizRef.current = resolve;
        setTimeout(() => resolve(null), 12000);
      });
      quizRef.current = null;
      setQuiz(null);
      if (!live()) break;
      const f = featuresRef.current;
      const arr = cue.quiz.metric === 'high' ? f?.colHigh : f?.colSum;
      let L = 0;
      let R = 0;
      // split: where "left" ends on screen (e.g. the Atlantic on the flat night map).
      const split = cue.quiz.split ?? 0.5;
      if (arr) arr.forEach((val, i) => ((i + 0.5) / arr.length < split ? (L += val) : (R += val)));
      const sum = L + R;
      const side = L >= R ? 'left' : 'right';
      const pct = sum > 0.001 ? Math.round((Math.max(L, R) / sum) * 100) : null;
      const answer = t.quizAnswer(ans, side, pct, cue.quiz.measure[lang]);
      setCaption(answer);
      await speak(answer);
      if (!live()) break;
      if (!storyPausedRef.current && v.paused) v.play().catch(() => {});
    }
    clearInterval(remarkTimer);
    setLiveLine('');
    if (!live()) return;
    await waitFor(() => v.ended || v.currentTime >= v.duration - 0.25, run);
    if (!live()) return;

    // 3. What you heard + the NASA fact, then free exploration.
    pause();
    setStoryPhase('outro');
    v.currentTime = story.exploreAt;
    for (const step of story.outro) {
      if (!live()) return;
      await playLine(step, run);
      await waitFor(() => !storyPausedRef.current, run);
    }
    if (!live()) return;
    setStoryPhase('idle');
    setCaption('');
    restoreVideo();
    cursorRef.current = { x: 0.5, y: 0.5, visible: true };
    setExplore(true);
    setTimeout(() => overlayRef.current?.focus(), 50);
  }, [ensureEngine, pause, play, playLine, stopLegend, stopStory, restoreVideo, speak, lang, t]);

  const toggleStoryPause = useCallback(() => {
    const v = videoRef.current;
    if (!storyPausedRef.current) {
      setStoryPaused(true);
      narrRef.current?.pause();
      if (storyPhaseRef.current === 'tour') {
        v?.pause();
        engineRef.current.stop();
      }
    } else {
      setStoryPaused(false);
      narrRef.current?.play().catch(() => {});
      if (storyPhaseRef.current === 'tour') {
        v?.play().catch(() => {});
        engineRef.current.start();
      }
    }
  }, []);

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
      if (hapticsRef.current && navigator.vibrate && value > 0) navigator.vibrate(Math.round(10 + value * 50));
      const what = kind
        ? t.probe[kind]
        : value <= 0
          ? t.probe.none
          : id === 'forest-height'
            ? t.probe.forest(Math.round(value * 50))
            : `${t.probe.value} ${t.levels[levelIndex(value)]}`;
      const text = `${regionName(t, x, y)}: ${what}`;
      if (text !== lastProbeRef.current.text) {
        lastProbeRef.current.text = text;
        setProbeText(text);
        // Say it aloud once the cursor settles (works without a screen reader).
        clearTimeout(exploreSpeakTimer.current);
        exploreSpeakTimer.current = setTimeout(() => {
          if (exploreRef.current && storyPhaseRef.current === 'idle') speak(text);
        }, 650);
      }
    },
    [ensureEngine, t, speak],
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
      const nx = Math.min(0.999, Math.max(0, c.x + dx));
      const ny = Math.min(0.999, Math.max(0, c.y + dy));
      if (nx === c.x && ny === c.y) {
        engineRef.current.playEdge();
        setProbeText(t.edge);
        return;
      }
      probe(nx, ny, true);
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

  // Jump the explore cursor to the strongest value of the current frame.
  const findMax = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;
    const id = vizRef.current.id;
    const masks = vizRef.current.masks || [];
    let best = 0;
    let bx = 0.5;
    let by = 0.5;
    const val = (x, y) => {
      const i = (y * img.width + x) * 4;
      return pixelValue(id, img.data[i], img.data[i + 1], img.data[i + 2]);
    };
    // 2×2 average so a single bright glint does not win.
    for (let y = 0; y < img.height - 1; y++) {
      for (let x = 0; x < img.width - 1; x++) {
        const fx = x / img.width;
        const fy = y / img.height;
        if (masks.some((m) => fx >= m[0] && fy >= m[1] && fx <= m[2] && fy <= m[3])) continue;
        const v = (val(x, y) + val(x + 1, y) + val(x, y + 1) + val(x + 1, y + 1)) / 4;
        if (v > best) {
          best = v;
          bx = (x + 0.5) / img.width;
          by = (y + 0.5) / img.height;
        }
      }
    }
    if (!exploreRef.current) setExplore(true);
    await probe(bx, by, true);
    const what = id === 'forest-height' ? t.probe.forest(Math.round(best * 50)) : `${t.probe.value} ${t.levels[levelIndex(best)]}`;
    const text = `${t.foundMax(what)} (${regionName(t, bx, by)})`;
    setProbeText(text);
    setAnnouncement(text);
    clearTimeout(exploreSpeakTimer.current);
    speak(text);
    setTimeout(() => overlayRef.current?.focus(), 50);
  }, [probe, t, speak]);

  const repeatLast = useCallback(() => {
    const line = lastLineRef.current;
    if (!line) return;
    // If the story narrator is talking, restart that line instead of overlapping.
    if (narrRef.current) {
      narrRef.current.currentTime = 0;
      return;
    }
    hush();
    const a = new Audio(`/narration/${lang}/${line.id}.mp3`);
    menuAudioRef.current = a;
    a.play().catch(() => speak(line[lang]));
  }, [lang, speak, hush]);

  // Plays a stand-alone narration clip (welcome, help) on the single narrator.
  const playClip = useCallback(
    (id) => {
      const line = EXTRA_LINES.find((l) => l.id === id);
      if (!line) return;
      if (storyPhaseRef.current !== 'idle') {
        // During a story: pause it (Space resumes) instead of skipping its line.
        if (!storyPausedRef.current) toggleStoryPause();
        menuAudioRef.current?.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      } else {
        hush();
      }
      lastLineRef.current = line;
      setAnnouncement(line[langRef.current]);
      const a = new Audio(`/narration/${langRef.current}/${id}.mp3`);
      menuAudioRef.current = a;
      a.play().catch(() => speak(line[langRef.current]));
    },
    [hush, speak, toggleStoryPause],
  );

  useEffect(() => {
    const mark = () => {
      if (interactedRef.current) return;
      interactedRef.current = true;
      // First contact: welcome a person who may not see the screen, unless the
      // same key/click already started something.
      setTimeout(() => {
        if (storyPhaseRef.current === 'idle' && !playingRef.current && !voiceBusyRef.current && !menuPlaying()) playClip('welcome');
      }, 350);
    };
    const menuPlaying = () => menuAudioRef.current && !menuAudioRef.current.paused;
    window.addEventListener('pointerdown', mark, true);
    window.addEventListener('keydown', mark, true);
    return () => {
      window.removeEventListener('pointerdown', mark, true);
      window.removeEventListener('keydown', mark, true);
    };
  }, [playClip]);

  // ---------- keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (quizRef.current && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        quizRef.current(e.key === 'ArrowLeft' ? 'left' : 'right');
        return;
      }
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === ' ' || e.code === 'Space') {
        if (tag === 'BUTTON' || tag === 'A') return; // native activation
        e.preventDefault();
        if (storyPhaseRef.current !== 'idle') toggleStoryPause();
        else if (STORIES[vizRef.current.id] && !playingRef.current) startStory();
        else togglePlay();
      } else if (e.key === 'p' || e.key === 'P') {
        stopStory();
        togglePlay();
      } else if (/^[1-4]$/.test(e.key)) {
        setVizIndex(Number(e.key) - 1);
      } else if (e.key === 'e' || e.key === 'E') {
        toggleExplore();
      } else if (e.key === 'd' || e.key === 'D') {
        describeNow();
      } else if (e.key === 'h' || e.key === 'H') {
        playClip('help');
      } else if (e.key === 'f' || e.key === 'F') {
        findMax();
      } else if (e.key === 'r' || e.key === 'R') {
        repeatLast();
      } else if (e.key === 'g' || e.key === 'G') {
        toggleLegend();
      } else if (e.key === 'Escape') {
        stopLegend();
        stopStory();
      } else if (e.key === 'l' || e.key === 'L') {
        setLang((l) => (l === 'es' ? 'en' : 'es'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, toggleExplore, describeNow, toggleLegend, stopLegend, stopStory, startStory, toggleStoryPause, findMax, repeatLast, playClip]);

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

  const story = STORIES[viz.id];
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

          {story && (
            <div className="mb-4 rounded-xl border border-emerald-400/60 bg-emerald-950/40 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">🎧 {t.story}</p>
              <p className="mt-1 text-xl font-bold text-white">{story.question[lang]}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {storyPhase === 'idle' ? (
                  <button
                    type="button"
                    autoFocus={!startedOnceRef.current}
                    onClick={startStory}
                    aria-keyshortcuts="Space"
                    className="rounded-lg bg-emerald-400 px-5 py-3 text-lg font-extrabold text-slate-950 hover:bg-emerald-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
                  >
                    ▶ {t.storyPlay}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={toggleStoryPause}
                      aria-keyshortcuts="Space"
                      className="rounded-lg bg-emerald-400 px-5 py-3 font-extrabold text-slate-950 hover:bg-emerald-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
                    >
                      {storyPaused ? `▶ ${t.storyResume}` : `❚❚ ${t.storyPause}`}
                    </button>
                    <button
                      type="button"
                      onClick={stopStory}
                      aria-keyshortcuts="Escape"
                      className="rounded-lg border border-slate-500 bg-slate-800 px-4 py-3 font-semibold hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
                    >
                      ■ {t.storyStop}
                    </button>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-emerald-100/80">{t.storyHint}</p>
              {caption && (
                <p className="mt-3 rounded-lg bg-black/40 p-3 text-lg leading-snug text-white">
                  <span aria-hidden="true">🎙 </span>
                  {caption}
                </p>
              )}
              {quiz && (
                <div className="mt-3 flex gap-3" role="group" aria-label={t.quizHint}>
                  {['left', 'right'].map((sd) => (
                    <button
                      key={sd}
                      type="button"
                      onClick={() => quizRef.current?.(sd)}
                      className="flex-1 rounded-lg bg-yellow-300 px-4 py-3 text-lg font-extrabold text-slate-950 hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
                    >
                      {sd === 'left' ? `← ${t.left}` : `${t.right} →`}
                    </button>
                  ))}
                </div>
              )}
              {liveLine && storyPhase === 'tour' && (
                <p className="mt-2 text-sm text-sky-200">
                  <span aria-hidden="true">📡 </span>
                  {liveLine}
                </p>
              )}
            </div>
          )}

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
              onClick={() => {
                stopStory();
                togglePlay();
              }}
              aria-keyshortcuts={story ? 'P' : 'Space'}
              className="rounded-lg bg-yellow-300 px-6 py-3 text-lg font-extrabold text-slate-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
            >
              {playing ? `❚❚ ${t.pause}` : `▶ ${story ? t.freePlay : t.play}`}
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
            <button
              type="button"
              onClick={findMax}
              aria-keyshortcuts="F"
              className="rounded-lg border border-yellow-300/70 bg-yellow-300/10 px-3 py-2 text-sm font-medium text-yellow-100 hover:bg-yellow-300/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
            >
              ⌖ {t.findMax} (F)
            </button>
            <button
              type="button"
              onClick={repeatLast}
              aria-keyshortcuts="R"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
            >
              ↺ {t.repeat} (R)
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
            🎧 {t.legend}
          </h2>
          <p className="mb-3 text-slate-300">{t.legendHelp}</p>
          <button
            type="button"
            onClick={toggleLegend}
            aria-keyshortcuts="G"
            className={`mb-4 rounded-lg px-4 py-2 font-bold focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
              legendIdx !== -1 ? 'bg-red-500/30 text-red-100 border border-red-400' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {legendIdx !== -1 ? `■ ${t.legendStop} (Esc)` : `🎧 ${t.legendPlay} (G)`}
          </button>
          <ol className="space-y-2">
            {LEGENDS[viz.id].map((item, k) => (
              <li
                key={item.key}
                aria-current={legendIdx === k ? 'step' : undefined}
                className={`rounded-lg border p-3 transition ${
                  legendIdx === k ? 'border-yellow-300 bg-yellow-300/10 text-yellow-50' : 'border-slate-700 text-slate-200'
                }`}
              >
                <span className="mr-2 font-mono text-yellow-300">{k + 1}.</span>
                {item[lang]}
              </li>
            ))}
          </ol>
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
