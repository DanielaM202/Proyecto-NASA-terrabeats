// Saves the playlist episodes recorded in the browser into public/playlist/:
//   <id>-<lang>.mp3   (converted from the WebM recording with ffmpeg)
//   <id>-<lang>.json  (chapter marks: when each narrated sentence starts)
//
// Usage (from the project folder, while `npm run dev` is running):
//   node scripts/episode-receiver.mjs C:\path\to\ffmpeg.exe
// then paste scripts/record-episodes.js in the browser console (see that file).
//
// It listens on 127.0.0.1 only and only accepts requests from http://localhost:5173 or http://localhost:4173.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ffmpeg = process.argv[2];
if (!ffmpeg) {
  console.error('Usage: node scripts/episode-receiver.mjs <path-to-ffmpeg>');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'playlist');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'terrabeats-'));
const PORT = 5197;
fs.mkdirSync(outDir, { recursive: true });

http
  .createServer((req, res) => {
    // The dev server (5173) or the production preview (4173), only on this computer.
    const origin = req.headers.origin;
    if (origin === 'http://localhost:5173' || origin === 'http://localhost:4173') res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    if (req.method === 'OPTIONS') return res.end();
    const q = new URL(req.url, 'http://x').searchParams;
    const name = q.get('name') || '';
    const kind = q.get('kind') || 'audio';
    if (req.method !== 'POST' || !/^[a-z0-9-]+-(es|en)$/.test(name) || !['audio', 'chapters'].includes(kind)) {
      res.statusCode = 400;
      return res.end('bad request');
    }
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      if (kind === 'chapters') {
        fs.writeFileSync(path.join(outDir, `${name}.json`), body);
        console.log(`saved ${name}.json`);
        return res.end('ok');
      }
      const webm = path.join(tmpDir, `${name}.webm`);
      const mp3 = path.join(outDir, `${name}.mp3`);
      fs.writeFileSync(webm, body);
      const r = spawnSync(ffmpeg, ['-hide_banner', '-y', '-i', webm, '-ac', '2', '-ar', '44100', '-b:a', '96k', mp3], { encoding: 'utf8' });
      if (r.status !== 0) {
        res.statusCode = 500;
        return res.end(r.stderr);
      }
      const m = /time=(\d+):(\d+):([\d.]+)/g;
      let last;
      for (const x of r.stderr.matchAll(m)) last = x;
      const secs = last ? +last[1] * 3600 + +last[2] * 60 + +last[3] : 0;
      console.log(`saved ${name}.mp3 ${fs.statSync(mp3).size} bytes, ${secs.toFixed(1)} s`);
      res.end(`ok ${secs.toFixed(1)}`);
    });
  })
  .listen(PORT, '127.0.0.1', () => console.log(`episode receiver on 127.0.0.1:${PORT} -> ${outDir}`));
