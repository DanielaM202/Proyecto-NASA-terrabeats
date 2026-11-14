# TerraBeats — The Earth Information Jukebox

**EN** · An accessible, bilingual web jukebox that turns NASA Earth Information Center visualizations into music in real time. Built for the **2026 NASA Space Apps Challenge** (challenge: *The Earth Information Jukebox*, Cajamarca).

**ES** · Una rocola web accesible y bilingüe que convierte en música, en tiempo real, visualizaciones del Earth Information Center de la NASA. Hecha para el **NASA Space Apps Challenge 2026**, reto *The Earth Information Jukebox*, sede Cajamarca.

- Product definition (ES): [`docs/PRODUCTO.md`](docs/PRODUCTO.md)
- Submission text (EN): [`docs/SUBMISSION.md`](docs/SUBMISSION.md)

## Tracks

| # | Visualization | Sound |
|---|---|---|
| 1 | [Night Lights 2012–2023](https://svs.gsfc.nasa.gov/5313/) | Chimes follow lit cities; pitch = latitude |
| 2 | [Lightning from the ISS 2017–2023](https://svs.gsfc.nasa.gov/5011/) | Each new flash is a percussive hit |
| 3 | [DYAMOND Global CO₂](https://svs.gsfc.nasa.gov/5196/) | Chord turns dissonant, heartbeat speeds up |
| 4 | [GEDI Forest Height](https://svs.gsfc.nasa.gov/4950/) | Taller forest = higher plucked note; ocean waves |

## Accessibility

- Keyboard shortcuts: **Space** play/pause · **1–4** tracks · **E** explore mode · **Arrows** move the explore cursor · **D** describe now · **L** language.
- Explore mode lets you hear any point of the image, with text announcements.
- Spoken descriptions (Web Speech), auto-narration, `aria-live` regions and phone vibration on lightning.

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
  analysis/features.js     computer vision: pixel classifiers → features
  audio/engine.js          Tone.js sonification engine per track
  i18n.js                  ES/EN strings and narration
  App.jsx                  UI, analysis loop, explore mode, shortcuts
public/media/              web-sized NASA SVS videos + posters
```

## Credits

Visualizations: NASA/Goddard Space Flight Center Scientific Visualization Studio. NASA does not endorse this project.
