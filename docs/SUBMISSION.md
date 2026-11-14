# Space Apps submission text (English, ready to paste)

> Copy each section into the matching field of the project page. Replace the `<…>` links.
> Field names can differ slightly in this year's form; match them by meaning.
> Before submitting, fill in the two `TODO` items: the user-test result and the voice tool actually used.

---

## Project Name

**TerraBeats — The Earth Information Jukebox**

## High-Level Project Summary

NASA's Earth Information Center tells the story of our changing planet through images, so people who are blind or have low vision are left out. TerraBeats is an accessible, bilingual (English/Spanish) web jukebox that turns four EIC visualizations into **interactive sound documentaries**. As the NASA video plays, TerraBeats reads every frame with computer vision and generates the sound live: a note for forest height, percussion for lightning, a chord that tightens with carbon dioxide, chimes for city lights. A narrator gives each sound a meaning, a place and a time, asks the listener a question, and answers it from the data on screen at that moment. Then the listener explores the image alone with the keyboard. It is audio description for Earth science data.

## Links

- **Live demo:** `<https://terrabeats.vercel.app>`
- **Repository:** https://github.com/DanielaM202/Proyecto-NASA-terrabeats
- **30-second video:** `<https://youtu.be/…>`

## Project Details

### What it does

Each of the four tracks is a guided **sound story** built on one question:

| Track | NASA visualization | Question | What you hear |
|---|---|---|---|
| Forests | GEDI Forest Height (SVS 4950) | Where are the tallest forests NASA measured? | A note per slice of the globe: pitch = canopy height (0–50 m). Birds = tall forest. Waves = ocean |
| Night lights | Change in Night Lights 2012–2023 (SVS 5313) | How did humanity's light change? | Chimes for lit regions; rising sparkles = new lights; falling notes = lights out |
| Lightning | Lightning Events Detected from the ISS (SVS 5011) | Where and when does lightning strike? | A percussive hit for new lightning, placed left/right where it appears; thunder grows with activity |
| CO₂ | DYAMOND Global Carbon Dioxide (SVS 5196) | Where does CO₂ come from and how does it move? | A chord that goes from calm to tense and a heartbeat that speeds up |

Every story follows the same structure:

1. **The question**, spoken.
2. **An audio legend:** each sound is played alone and named ("this is a two-metre shrub… this is a forty-five-metre tree").
3. **A narrated tour** synchronized with the video: the narrator says where and when we are at the exact moment it appears, and the music lowers while the voice speaks.
4. **An interactive question** (Forests, Lightning, CO₂): the listener answers with the left/right arrow keys, and the answer is computed from the frame on screen.
5. **Live remarks** generated from the current data ("A burst of new lightning on your right!").
6. **A closing fact from NASA**, then **free exploration**: the arrow keys move a cursor, each point sounds and its value is spoken.

### Designed for people who cannot see

- Everything works with the keyboard: Space, Esc, 1–4, arrows, H (spoken help), F (jump to the highest value), R (repeat the last sentence), D (describe now), L (language).
- A spoken welcome on first contact and a spoken menu when changing track.
- One narrator at a time: voices never overlap, and the music ducks under the voice.
- Explore mode speaks each value aloud, so it works without a screen reader; it is also compatible with screen readers. A low bump marks the edge of the image, and the phone vibrates with the value.
- Switching language changes the voice immediately, mid-story.

### How it works

1. **Frames:** web-sized copies of the SVS videos are hosted with the app (NASA's servers do not allow cross-origin pixel reading). Every 80 ms the current frame is drawn onto a 160×90 canvas.
2. **Computer vision:** each pixel is classified using the visualization's own colour scale. For GEDI we sampled the "Height Above Ground 0–50 m" colour bar drawn inside the video and match each vegetation pixel to it, tolerating the globe's shading. On-screen labels, dates and colour bars are masked out.
3. **Features per frame:** coverage, intensity, a calibrated level, centroid, a 16-column profile, tall-forest share, ocean share, light gained/lost, and what changed since the previous frame.
4. **Sound (Tone.js / Web Audio):** the features drive synthesizers in real time. Notes are quantized to musical scales, and each track uses only a few sounds, each with one meaning.
5. **Narration:** a script with cue times per track; scripted lines are pre-rendered audio files, while quiz answers and live remarks are generated at runtime from the data.

### Scientific integrity

- **Every narrated fact comes from NASA's SVS page of that visualization or from what the frame itself shows.** Examples: LIS detects lightning in tropical and mid-latitude regions; CO₂ emissions over China and South Asia come mostly from power plants, industry and vehicles, and from fires in Africa and South America; the map pulses with the day-night cycle of fires and photosynthesis; night lights data is Black Marble from Suomi NPP VIIRS.
- **We do not invent numbers.** The only physical unit we speak is GEDI height in metres, read from the official colour bar and always stated as approximate. CO₂ and lightning are described in relative terms ("high", "more on the left"), because the SVS colour bar for CO₂ has no numeric labels.
- **Limits:** values come from the colours of the visualization, not from the original science data; globe lighting adds error to height estimates; quiz percentages are shares of what is visible in the frame. The EIC night-lights video shows the world map twice, so we use one map so that left/right is true geography. The lightning animation is trimmed and played at 2× speed.

### Benefits and intended impact

- **Accessibility:** it opens NASA's visual Earth science to blind and low-vision people, who can listen, answer and explore on their own.
- **Learning you can check:** after one story, a listener should be able to answer "Where are the tallest forests?" or "Which country gained light and where did lights go out?" without seeing the screen.
  - `TODO: add the result of our test (N people, blindfolded or blind; X of 4 questions answered correctly) and one quote.`
- **Reusable:** adding another EIC visualization needs only a video, its colour bar and a script with cue times.
- **Reach:** runs in any browser with no installation, in English and Spanish, from Cajamarca, Peru.

### Tools, languages and software

JavaScript, React 19, Vite, Tailwind CSS, Tone.js (Web Audio), HTML Canvas, Web Speech API, Vibration API, MediaRecorder, ffmpeg (video preparation), Git/GitHub, Vercel.

## Use of Artificial Intelligence

- **Code and documentation:** we used an AI coding assistant (Anthropic's Claude) to help write and debug code and documents. The team directed the design, tested by ear and reviewed the result.
- **Narrator voice:** the scripted narration is synthetic speech. `TODO: state the tool actually used in the submitted version — "AI text-to-speech (ElevenLabs)" or "Microsoft Windows text-to-speech voices".` The script itself was written and fact-checked by the team against NASA's SVS pages. Quiz answers, live remarks and explore values use the browser's built-in speech synthesis.
- **No AI-generated images, video or music.** All visuals are NASA SVS visualizations and all sonification is synthesized live by our code from the pixels.

## NASA Data

- Earth Information Center (EIC) Content Database — https://svs.gsfc.nasa.gov/gallery/earth-information-center/
- GEDI Forest Height — https://svs.gsfc.nasa.gov/4950/
- Change in Night Lights between 2012 and 2023 – EIC Version (Black Marble, Suomi NPP VIIRS) — https://svs.gsfc.nasa.gov/5313/
- Lightning Events Detected from the ISS 2017–2023 (LIS) — https://svs.gsfc.nasa.gov/5011/
- DYAMOND Global Carbon Dioxide (GEOS model) — https://svs.gsfc.nasa.gov/5196/
- Data Sonification: Caldwell 73 (conceptual reference) — https://svs.gsfc.nasa.gov/13786/

## References

- Tone.js — https://tonejs.github.io/
- MDN Web Audio API, Canvas API, Web Speech API, Vibration API — https://developer.mozilla.org/
- NASA/Goddard Space Flight Center Scientific Visualization Studio
