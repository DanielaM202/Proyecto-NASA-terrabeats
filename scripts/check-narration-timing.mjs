// Checks that every narrated sentence of the tour fits in the time it has before the
// next one (the sentences are synchronized with the NASA videos).
//
//   node scripts/check-narration-timing.mjs C:\path\to\ffmpeg.exe
//
// Run it after changing the voice or the text. A line that is too long must be
// shortened, re-generated at a higher speed, or its cue time moved in src/data/stories.js.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { STORIES } from '../src/data/stories.js';

const ffmpeg = process.argv[2];
if (!ffmpeg) {
  console.error('Usage: node scripts/check-narration-timing.mjs <path-to-ffmpeg>');
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Length of each video in seconds (the tour ends with the video).
const VIDEO = { 'forest-height': 51.5, ocean: 66.7, 'night-lights': 43.3, lightning: 85.9, co2: 39.2 };

const duration = (file) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8' });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr);
  return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : NaN;
};

let problems = 0;
for (const [id, story] of Object.entries(STORIES)) {
  for (const lang of ['es', 'en']) {
    story.cues.forEach((cue, i) => {
      if (cue.quiz) return; // questions wait for the answer: no time limit
      const file = path.join(root, 'public', 'narration', lang, `${cue.id}.mp3`);
      if (!fs.existsSync(file)) return;
      const next = story.cues[i + 1]?.t ?? VIDEO[id];
      const room = (next - cue.t) / (story.rate ?? 0.6) - 0.4;
      const d = duration(file);
      if (d > room + 0.15) {
        problems++;
        console.log(`⚠ ${id} ${lang} ${cue.id}: dura ${d.toFixed(1)} s y solo hay ${room.toFixed(1)} s (${(d - room).toFixed(1)} s de más)`);
      }
    });
  }
}
console.log(problems ? `\n${problems} frase(s) no caben en su hueco.` : 'Todas las frases del recorrido caben en su hueco.');
process.exit(problems ? 1 : 0);
