# TerraBeats — The Earth Information Jukebox

**EN** · An accessible, bilingual web jukebox that turns NASA Earth Information Center visualizations into music in real time. Built for the **2026 NASA Space Apps Challenge** (challenge: *The Earth Information Jukebox*, Cajamarca).

**ES** · Una rocola web accesible y bilingüe que convierte en música, en tiempo real, visualizaciones del Earth Information Center de la NASA. Hecha para el **NASA Space Apps Challenge 2026**, reto *The Earth Information Jukebox*, sede Cajamarca.

- Value and impact (ES): [`docs/VALOR.md`](docs/VALOR.md)
- Submission text (EN): [`docs/SUBMISSION.md`](docs/SUBMISSION.md)

## What it is

Audio description for Earth science data. Each track is a guided **sound story**: a question, an audio legend, narration synchronized with the NASA video, an interactive question answered from the live data, and free exploration with the keyboard. The sound is generated in real time from the pixels of each frame.

| # | Visualization | Question | Sound |
|---|---|---|---|
| 1 | [GEDI Forest Height](https://svs.gsfc.nasa.gov/4950/) | Where are the tallest forests NASA measured? | Note pitch = canopy height (0–50 m); birds = tall forest; waves = ocean |
| 2 | [Night Lights 2012–2023](https://svs.gsfc.nasa.gov/5313/) | How did humanity's light change? | Chimes for lit regions; sparkles = new lights; falling notes = lights out |
| 3 | [Lightning from the ISS 2017–2023](https://svs.gsfc.nasa.gov/5011/) | Where and when does lightning strike? | A hit for new lightning, panned to where it appears |
| 4 | [DYAMOND Global CO₂](https://svs.gsfc.nasa.gov/5196/) | Where does CO₂ come from and how does it move? | Chord from calm to tense; heartbeat speeds up |

## Accessibility

- Keyboard: **Space** story / pause · **Esc** stop · **1–4** tracks · **← →** answer questions · **H** spoken help · **E** explore · **Arrows** move the explore cursor · **F** highest value · **R** repeat · **D** describe now · **G** audio legend · **P** free mode · **L** language.
- Spoken welcome, spoken track menu, one narrator at a time, music ducking under the voice.
- Explore mode speaks each value, bumps at the image edge and vibrates on phones.
- English and Spanish, switchable mid-story.

## Data honesty

Narrated facts come from NASA's SVS page of each visualization. Values are derived from the **colours** of the visualization, not from the original science data: heights are approximate, CO₂ and lightning are relative. See [`docs/SUBMISSION.md`](docs/SUBMISSION.md) → *Scientific integrity*.

## Narration

The script lives in [`src/data/stories.js`](src/data/stories.js). Audio files are in `public/narration/<lang>/<id>.mp3` and can be replaced one by one (see [`docs/GRABACION.md`](docs/GRABACION.md)). To regenerate them with Windows voices:

```
powershell -ExecutionPolicy Bypass -File scripts/build-narration.ps1 -Ffmpeg C:\ruta\a\ffmpeg.exe
utafmpeg.exe
```

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Deploys to Vercel as a standard Vite app (build `npm run build`, output `dist`).

## Structure

```
src/
  data/visualizations.js   catalog + bilingual texts
  data/stories.js          narration script and cue times per track
  data/legends.js          audio legend items
  analysis/features.js     computer vision: pixel classifiers → features
  audio/engine.js          Tone.js sonification engine per track
  i18n.js                  ES/EN strings and narration
  App.jsx                  UI, analysis loop, explore mode, shortcuts
public/media/              web-sized NASA SVS videos + posters
```

## Credits

Visualizations: NASA/Goddard Space Flight Center Scientific Visualization Studio. NASA does not endorse this project.
