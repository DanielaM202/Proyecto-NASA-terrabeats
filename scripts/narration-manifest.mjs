// Prints every narration line of the stories as JSON: [{ id, lang, text }]
// Used by build-narration.ps1 to generate the audio files.
import { EXTRA_LINES, STORIES, storyLines } from '../src/data/stories.js';

const out = [];
for (const line of EXTRA_LINES) {
  out.push({ id: line.id, lang: 'es', text: line.es });
  out.push({ id: line.id, lang: 'en', text: line.en });
}
for (const story of Object.values(STORIES)) {
  for (const line of storyLines(story)) {
    out.push({ id: line.id, lang: 'es', text: line.es });
    out.push({ id: line.id, lang: 'en', text: line.en });
  }
}
process.stdout.write(JSON.stringify(out));
