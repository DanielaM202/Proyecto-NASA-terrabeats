"""NOT USED FOR THE SUBMISSION: the project narration is made with Kokoro (scripts/build-narration-kokoro.py)
because the challenge terms require non-NASA materials to be free or open source.

Generates the narration MP3 files with Microsoft Edge neural voices (package edge-tts).

These are the most natural free voices we found. Read this before using it:
  * It is NOT an official API: it uses the service behind Edge's "Read aloud". There are
    no clear terms for this use, so state it in the submission (docs/SUBMISSION.md).
  * The text of each line is SENT to Microsoft's servers. The narration is public content
    and nothing else is sent. Do not use it for anything private.
  * The result is a set of static MP3 files: the app does not depend on the service.
The offline alternative that sends nothing anywhere is scripts/build-narration-kokoro.py.

Setup (once):  python -m venv .venv  and  .venv\\Scripts\\python -m pip install edge-tts
Run (from the project folder):
    .venv\\Scripts\\python scripts/build-narration-edge.py --ffmpeg C:\\ruta\\ffmpeg.exe
Options:
    --es-voice es-PE-CamilaNeural   --en-voice en-US-JennyNeural   (list: edge-tts --list-voices)
    --rate -4%  --pitch +0Hz        delivery for every line
    --only <prefix>                 regenerate only the ids that start with it
    --override <id>=<rate>          faster/slower for one line, e.g. forest-cue-sahara=+10%
Afterwards: node scripts/check-narration-timing.mjs <ffmpeg>  and record the episodes again.

What makes it sound less robotic besides the voice itself:
  * pronunciation of acronyms (GEDI, ECCO2, VIIRS...) so the voice does not spell or mangle them
  * a gentle compressor and loudness normalisation, so every sentence has the same presence
"""
import argparse
import asyncio
import json
import os
import re
import subprocess
import sys

import edge_tts

# Written for the ear: how each acronym must be said (only used for synthesis, never shown).
PRON = {
    'es': [
        (r'\bGEDI\b', 'Yédi'),
        (r'\bECCO2\b', 'Eco dos'),
        (r'\bMIT\b', 'eme i te'),
        (r'\bVIIRS\b', 'Víirs'),
        (r'Suomi NPP', 'Suomi ene pe pe'),
        (r'\bLIS\b', 'Lis'),
        (r'\bNVDA\b', 'ene ve de a'),
    ],
    'en': [
        (r'\bGEDI\b', 'Jeddy'),
        (r'\bECCO2\b', 'Ecco two'),
        (r'\bVIIRS\b', 'veers'),
        (r'Suomi NPP', 'Suomi N P P'),
        (r'\bLIS\b', 'Liss'),
        (r'\bNVDA\b', 'N V D A'),
    ],
}

ap = argparse.ArgumentParser()
ap.add_argument('--ffmpeg', required=True)
ap.add_argument('--es-voice', default='es-PE-CamilaNeural')
ap.add_argument('--en-voice', default='en-US-JennyNeural')
ap.add_argument('--rate', default='-4%')
ap.add_argument('--pitch', default='+0Hz')
ap.add_argument('--only', default='')
ap.add_argument('--override', action='append', default=[])
ap.add_argument('--parallel', type=int, default=3)
a = ap.parse_args()

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
manifest = json.loads(subprocess.run(['node', os.path.join('scripts', 'narration-manifest.mjs')], capture_output=True, text=True, cwd=root, check=True, encoding='utf-8').stdout)
VOICE = {'es': a.es_voice, 'en': a.en_voice}
OVERRIDE = dict(o.split('=', 1) for o in a.override)
tmp = os.path.join(root, '.tmp-narration')
os.makedirs(tmp, exist_ok=True)
FILTER = 'highpass=f=70,acompressor=threshold=-21dB:ratio=2:attack=20:release=250:makeup=2,loudnorm=I=-16:TP=-1.5:LRA=11'


def for_the_ear(text, lang):
    for pat, rep in PRON[lang]:
        text = re.sub(pat, rep, text)
    return text


async def one(item, sem):
    async with sem:
        lang, lid = item['lang'], item['id']
        raw = os.path.join(tmp, f'{lang}-{lid}.mp3')
        out_dir = os.path.join(root, 'public', 'narration', lang)
        os.makedirs(out_dir, exist_ok=True)
        mp3 = os.path.join(out_dir, f'{lid}.mp3')
        rate = OVERRIDE.get(lid, a.rate)
        for attempt in range(4):
            try:
                await edge_tts.Communicate(for_the_ear(item['text'], lang), VOICE[lang], rate=rate, pitch=a.pitch).save(raw)
                break
            except Exception as e:  # network hiccup: try again
                if attempt == 3:
                    print(f'FAILED {lang}/{lid}: {type(e).__name__}', file=sys.stderr)
                    return False
                await asyncio.sleep(2 * (attempt + 1))
        subprocess.run([a.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-af', FILTER, '-ac', '1', '-ar', '44100', '-b:a', '96k', mp3], check=True)
        os.remove(raw)
        print(f'{lang}/{lid}.mp3  ({rate})', flush=True)
        return True


async def main():
    sem = asyncio.Semaphore(a.parallel)
    items = [m for m in manifest if not a.only or m['id'].startswith(a.only)]
    results = await asyncio.gather(*(one(m, sem) for m in items))
    print(f'{sum(results)} of {len(items)} files generated', file=sys.stderr)


asyncio.run(main())
