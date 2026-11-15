// Records the playlist episodes of the app and sends them to scripts/episode-receiver.mjs.
//
// 1. Terminal A:  npm run dev  (or npm run build && npm run preview, then use ?equipo)
// 2. Terminal B:  node scripts/episode-receiver.mjs C:\path\to\ffmpeg.exe
// 3. Open http://localhost:5173 in Chrome or Edge and leave the tab in view
//    (use one tab per language to record both at the same time).
// 4. In that tab's console, set the language and paste this whole file:
//        window.RECORD_LANG = 'es'   // or 'en'
//        window.RECORD_ONLY = null   // or e.g. ['ocean'] to record only some tracks
//    (the page must be the dev server, or any address with ?equipo: the recording
//    hook is not available in the public build)
//    Every episode plays its full story (2-3 min). Progress: window.__recorder.log
//
// Re-run it whenever the narration audio or the script changes: the episodes must be re-recorded.
(() => {
  const LANG = window.RECORD_LANG || 'es';
  const ONLY = window.RECORD_ONLY || null;
  const IDS = ['forest-height', 'ocean', 'night-lights', 'lightning', 'co2'];
  const RECEIVER = 'http://127.0.0.1:5197/';
  const state = (window.__recorder = { log: [], done: false });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const post = (name, kind, body) => fetch(`${RECEIVER}?name=${name}&kind=${kind}`, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' } }).then((r) => r.text());

  (async () => {
    await wait(1000);
    const label = LANG === 'es' ? 'Español' : 'English';
    [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === label).click();
    await wait(800);
    for (let k = 0; k < IDS.length; k++) {
      const id = IDS[k];
      if (ONLY && !ONLY.includes(id)) continue;
      const t0 = Date.now();
      window.__terrabeatsRecordEpisode(id);
      let a = null;
      while (!a && Date.now() - t0 < 8 * 60 * 1000) {
        await wait(2000);
        a = document.querySelector(`a[download="terrabeats-${id}-${LANG}.webm"]`);
      }
      if (!a) {
        state.log.push(`${id}: TIMEOUT`);
        continue;
      }
      const name = `${id}-${LANG}`;
      const data = window.__terrabeatsEpisodes[name];
      const blob = new Blob([await (await fetch(a.href)).arrayBuffer()]);
      const audio = await post(name, 'audio', blob);
      await post(name, 'chapters', JSON.stringify({ duration: data.duration, chapters: data.marks }));
      state.log.push(`${id}: ${Math.round((Date.now() - t0) / 1000)}s, ${data.marks.length} chapters, mp3 ${audio}`);
      await wait(1500);
    }
    state.done = true;
  })().catch((e) => {
    state.log.push(`ERROR ${e}`);
    state.done = true;
  });
})();
