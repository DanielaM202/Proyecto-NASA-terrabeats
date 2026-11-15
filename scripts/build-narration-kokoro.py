"""Generates the narration MP3 files with Kokoro, an open (Apache-2.0) neural voice
model that runs on your own computer: nothing is sent to any service.

Setup (once):
    python -m venv .venv
    .venv\\Scripts\\python -m pip install kokoro-onnx soundfile numpy
    # download kokoro-v1.0.onnx and voices-v1.0.bin (about 350 MB) from
    # https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    # into one folder, for example C:\\modelos\\kokoro

Run (from the project folder):
    .venv\\Scripts\\python scripts/build-narration-kokoro.py --ffmpeg C:\\ruta\\ffmpeg.exe --models C:\\modelos\\kokoro --es-voice ef_dora --en-voice af_heart

Options: --only <prefix> regenerates only the ids that start with it (for example forest-);
--speed and --pause tune the delivery. After generating, run
    node scripts/check-narration-timing.mjs C:\\ruta\\ffmpeg.exe
because the sentences are synchronized with the NASA videos, and then record the
playlist episodes again (docs/PLAYLIST.md).
"""
import argparse
import json
import os
import re
import subprocess
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ap = argparse.ArgumentParser()
ap.add_argument('--ffmpeg', required=True)
ap.add_argument('--models', required=True)
ap.add_argument('--es-voice', default='ef_dora')
ap.add_argument('--en-voice', default='af_heart')
ap.add_argument('--speed', type=float, default=0.96)
ap.add_argument('--pause', type=float, default=0.38, help='seconds of silence after each sentence')
ap.add_argument('--only', default='')
a = ap.parse_args()

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
manifest = json.loads(subprocess.run(['node', os.path.join('scripts', 'narration-manifest.mjs')], capture_output=True, text=True, cwd=root, check=True, encoding='utf-8').stdout)

kokoro = Kokoro(os.path.join(a.models, 'kokoro-v1.0.onnx'), os.path.join(a.models, 'voices-v1.0.bin'))
VOICE = {'es': a.es_voice, 'en': a.en_voice}
LANG = {'es': 'es', 'en': 'en-us'}
tmp = os.path.join(root, '.tmp-narration')
os.makedirs(tmp, exist_ok=True)

done = 0
for item in manifest:
    if a.only and not item['id'].startswith(a.only):
        continue
    lang = item['lang']
    sentences = re.split(r'(?<=[.!?:])\s+', item['text'].strip())
    chunks, sr = [], 24000
    for s in sentences:
        audio, sr = kokoro.create(s, voice=VOICE[lang], speed=a.speed, lang=LANG[lang])
        chunks += [audio, np.zeros(int(sr * a.pause), dtype=np.float32)]
    wav = os.path.join(tmp, f"{lang}-{item['id']}.wav")
    sf.write(wav, np.concatenate(chunks[:-1]), sr)
    out_dir = os.path.join(root, 'public', 'narration', lang)
    os.makedirs(out_dir, exist_ok=True)
    mp3 = os.path.join(out_dir, f"{item['id']}.mp3")
    subprocess.run([a.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ac', '1', '-ar', '44100', '-b:a', '96k', mp3], check=True)
    os.remove(wav)
    done += 1
    print(f'{lang}/{item["id"]}.mp3', flush=True)

print(f'{done} files generated', file=sys.stderr)
