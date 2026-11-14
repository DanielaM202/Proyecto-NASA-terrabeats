# Space Apps submission text (English, ready to paste)

> Copy each section into the matching field of the project page. Replace the `<…>` links.
> Field names can differ slightly in this year's form; match them by meaning.

---

## Project Name

**TerraBeats — The Earth Information Jukebox**

## High-Level Project Summary

TerraBeats is a bilingual (English/Spanish), accessible web jukebox that turns NASA Earth Information Center visualizations into music in real time. Users choose one of four EIC visuals: night lights, lightning from the ISS, global CO₂ or GEDI forest height. As the NASA video plays, TerraBeats reads every frame with computer vision. It classifies pixels using each visualization's own colour scale and maps what it finds to pitch, volume, stereo position, tempo and instrument, always snapped to musical scales. Blind and low-vision users can explore any point of the image with the keyboard and hear it. They can also listen to spoken descriptions of what is happening and feel lightning through phone vibration. Earth science becomes something you can hear, not only see.

## Links

- **Live demo:** `<https://terrabeats.vercel.app>`
- **Repository:** `<https://github.com/…/terrabeats>`
- **Demo video:** `<https://youtu.be/…>`

## Project Details

### What it does

- **Jukebox with four tracks**, each one an EIC visualization from NASA's Scientific Visualization Studio:
  1. *Change in Night Lights 2012–2023* (SVS 5313)
  2. *Lightning Events Detected from the ISS 2017–2023* (SVS 5011)
  3. *DYAMOND Global Carbon Dioxide* (SVS 5196)
  4. *GEDI Forest Height* (SVS 4950)
- **Real-time sonification:** the sound is generated live from the frame on screen. It is not a pre-recorded soundtrack, so pausing, seeking or changing the speed changes the music.
- **Explore mode:** a cursor driven by the arrow keys or the pointer plays the value of the pixel under it and announces it as text, for example *"top left: value high"*.
- **Spoken descriptions** on demand (key D) or automatic narration. Example: *"Lightning activity high: 40 new flashes, concentrated toward the bottom / the right."*
- **Haptic feedback:** the phone vibrates with lightning.
- **Record audio:** download the generated soundscape of any track, which lets the tool also produce a curated playlist.
- **Fully bilingual interface** (English/Spanish), switched with the L key or a button.

### How it works

1. **Frames:** the original SVS videos were re-encoded at web resolution and hosted with the app, so the browser can read their pixels. Every 80 ms the current frame is drawn onto a small canvas (256×72 or 160×90).
2. **Computer vision:** each pixel is classified with a rule calibrated on the official colour scale of its visualization:
   - Night lights: warm light; in the change phase, purple = more light and orange = less light.
   - Lightning: yellow flashes.
   - CO₂: grey/tan = low, orange/red = high.
   - Forest height: brown/dark green = short, bright green/white = tall; blue = ocean.
3. **Features per frame:**
   - coverage, intensity and a calibrated activity level;
   - centroid (where the activity is);
   - a 16-column profile with each column's mean value and peak row;
   - ocean share and light gain/loss;
   - lightning flashes that appeared since the previous frame.
4. **Sound (Tone.js / Web Audio):**
   - **Night lights:** a playhead sweeps west → east; FM chimes play where cities shine. Pitch = latitude (north = high), loudness = brightness and stereo = longitude. Rising sparkles mark gained light and falling tones mark lost light.
   - **Lightning:** every cluster of new flashes is a percussive hit, panned to its position, with higher pitch further north. A thunder rumble and kick drum follow total activity.
   - **CO₂:** a sustained chord moves from consonant to dissonant (detuning, a tritone, an opening filter) as high-CO₂ areas grow. A heartbeat speeds up from 56 to 120 beats per minute.
   - **Forest height:** plucked strings sweep the globe, with taller forest = higher note. A pad grows with vegetated land and a wave sound grows with the ocean.
   - All notes are quantized to pentatonic or modal scales, and a reverb and limiter keep the result musical, not noisy.

### Benefits and intended impact

- **Accessibility:** it opens NASA's visual Earth science to blind and low-vision people, through sound, speech, keyboard exploration and touch.
- **Engagement:** sound reveals patterns that are easy to miss visually, such as the rhythm of storm seasons or how fast a region lights up. It also creates an emotional connection: rising CO₂ literally sounds like tension.
- **Education:** in classrooms and museums, students hear the data while seeing it. The bilingual interface reaches Spanish-speaking communities such as ours in Cajamarca, Peru.
- **Open and extensible:** adding a new EIC visualization only needs a video, a colour classifier and a sound profile.

### Tools, languages and software

JavaScript, React 19, Vite, Tailwind CSS, Tone.js (Web Audio), HTML Canvas, Web Speech API, Vibration API, MediaRecorder, ffmpeg (video preparation), Git/GitHub, Vercel.

### Creativity

Instead of a direct pixel-to-frequency translation, each dataset gets its own musical character that matches its meaning:

- city lights are chimes;
- lightning is percussion;
- CO₂ is tension and a heartbeat;
- forests are plucked strings and ocean waves.

Data controls the music, while the scales and instruments keep it pleasant to listen to.

### Factors we considered

- **CORS:** NASA servers do not allow cross-origin pixel reading, so we host web-sized copies of the videos with the app.
- **Performance:** frames are analysed at low resolution 12 times per second.
- **Browser audio policies:** sound starts only after the user presses Play.
- **Honesty about data:** the mapping uses the visualization's colours, so values are relative (low → high), not absolute physical units.
- **Two languages**, so local users and international judges can both use it.

## Use of Artificial Intelligence

We used an AI coding assistant (Anthropic's Claude) to help write and debug code and documentation. All sonification design decisions, testing and the final review were done by our team. No AI-generated images, video or audio are used. All visuals are NASA SVS visualizations, and all sound is synthesized live by our code.

## NASA Data

- Earth Information Center (EIC) Content Database — https://svs.gsfc.nasa.gov/gallery/earth-information-center/
- Change in Night Lights between 2012 and 2023 – EIC Version — https://svs.gsfc.nasa.gov/5313/
- Lightning Events Detected from the ISS 2017–2023 — https://svs.gsfc.nasa.gov/5011/
- DYAMOND Global Carbon Dioxide — https://svs.gsfc.nasa.gov/5196/
- GEDI Forest Height — https://svs.gsfc.nasa.gov/4950/
- Data Sonification: Caldwell 73 (conceptual reference) — https://svs.gsfc.nasa.gov/13786/

## References

- Tone.js — https://tonejs.github.io/
- MDN Web Audio API, Canvas API, Web Speech API, Vibration API — https://developer.mozilla.org/
- NASA/Goddard Space Flight Center Scientific Visualization Studio
