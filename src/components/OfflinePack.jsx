import { useCallback, useEffect, useState } from 'react';
import { EXTRA_LINES, STORIES, storyLines } from '../data/stories.js';
import { PLAYLIST } from '../data/playlist.js';
import { VISUALIZATIONS } from '../data/visualizations.js';
import { PACK_CACHE } from '../data/packVersion.js';

const CACHE = PACK_CACHE;

// Every file the page needs to work without a connection: the page itself, the built files
// it has already loaded (script, styles, fonts), and the audio, video and images.
function packUrls() {
  const urls = new Set(['/', '/favicon.svg', '/manifest.webmanifest']);
  performance
    .getEntriesByType('resource')
    .map((r) => new URL(r.name))
    .filter((u) => u.origin === location.origin && u.pathname.startsWith('/assets/'))
    .forEach((u) => urls.add(u.pathname));
  const ids = new Set(EXTRA_LINES.map((l) => l.id));
  Object.values(STORIES).forEach((s) => storyLines(s).forEach((l) => ids.add(l.id)));
  ['es', 'en'].forEach((lang) => ids.forEach((id) => urls.add(`/narration/${lang}/${id}.mp3`)));
  VISUALIZATIONS.forEach((v) => {
    urls.add(v.video);
    urls.add(v.poster);
  });
  Object.entries(PLAYLIST).forEach(([id, p]) =>
    p.files.forEach((lang) => {
      urls.add(`/playlist/${id}-${lang}.mp3`);
      urls.add(`/playlist/${id}-${lang}.json`);
    }),
  );
  return [...urls];
}

// One file, with up to three tries: a single dropped connection should not stop the whole pack.
async function saveOne(cache, url) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await cache.put(url, res);
      return;
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }
  }
  throw last;
}

// Button that saves the audio, video and images on the device so the page works offline.
export default function OfflinePack({ t }) {
  const o = t.offline;
  const supported = typeof caches !== 'undefined' && 'serviceWorker' in navigator;
  const [state, setState] = useState('idle'); // idle | saving | ready | error
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState('');

  useEffect(() => {
    if (!supported) return;
    (async () => {
      const cache = await caches.open(CACHE);
      const urls = packUrls();
      const have = await Promise.all(urls.map((u) => cache.match(u)));
      if (have.every(Boolean)) setState('ready');
    })();
  }, [supported]);

  const save = useCallback(async () => {
    const urls = packUrls();
    setTotal(urls.length);
    setDone(0);
    setFailed('');
    setState('saving');
    let current = '';
    try {
      const cache = await caches.open(CACHE);
      let n = 0;
      for (const u of urls) {
        current = u;
        if (!(await cache.match(u))) await saveOne(cache, u);
        setDone(++n);
      }
      setState('ready');
    } catch (err) {
      console.error('Offline pack:', current, err);
      setFailed(`${current} (${err?.name || 'error'})`);
      setState('error');
    }
  }, []);

  const clear = useCallback(async () => {
    await caches.delete(CACHE);
    setState('idle');
  }, []);

  if (!supported) return null;
  return (
    <section aria-labelledby="offline" className="panel lg:col-span-3">
      <h2 id="offline" className="mb-2 text-xl font-bold">
        {o.title}
      </h2>
      <p className="mb-3 text-slate-300">{o.text}</p>
      <div className="flex flex-wrap items-center gap-3">
        {state !== 'ready' && (
          <button
            type="button"
            onClick={save}
            disabled={state === 'saving'}
            className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-200 disabled:opacity-60"
          >
            {state === 'saving' ? o.saving(done, total) : state === 'error' ? o.retry : o.save}
          </button>
        )}
        {state === 'ready' && (
          <button type="button" onClick={clear} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-800">
            {o.clear}
          </button>
        )}
        <span role="status" aria-live="polite" className="text-sm text-slate-300">
          {state === 'ready' ? o.ready : state === 'error' ? o.error(failed) : ''}
        </span>
      </div>
    </section>
  );
}
