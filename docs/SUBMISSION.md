# NASA Space Apps Challenge 2026 Submission Document
## TerraBeats — The Earth Information Jukebox

> **Submission Language:** American English  
> **Challenge:** The Earth Information Jukebox  
> **Location:** Cajamarca, Peru  
> **Team:** Daniela Miranda, Liliam Gil, Diego Quiliche, Rodrigo Vargas, and José Rodriguez (Cajamarca).  
> **License:** Apache License 2.0 (see `LICENSE` and `docs/CREDITOS.md`)  
> **Live Demo:** https://terrabeats.vercel.app  
> **Repository:** https://github.com/DanielaM202/Proyecto-NASA-terrabeats  
> **Project Demo Video (30s):** https://youtu.be/YOUR_DEMO_VIDEO_ID  

---

## Field 1: Project Title
**TerraBeats — The Earth Information Jukebox**

---

## Field 2: High-Level Project Summary (50–200 Words)
*(Character limit: 1500 chars. Word count: 184 words / 1,354 characters)*

NASA's Earth Information Center (EIC) showcases our changing planet through breathtaking satellite imagery, yet over 2.2 billion people worldwide living with visual impairments cannot access this visual data. TerraBeats is an accessible, bilingual (English/Spanish), and fully offline-capable web jukebox that transforms five EIC satellite visualizations into interactive real-time soundscapes and narrated documentaries—turning silent Earth science into music.

Running entirely in the browser without pre-rendered audio files, TerraBeats analyzes video frames at 30 fps using client-side computer vision (HTML5 Canvas). It translates physical Earth measurements—GEDI forest canopy height, sea surface temperature, lightning activity, urban night lights, and atmospheric carbon dioxide—into dynamic musical synthesizers via Tone.js and the Web Audio API.

TerraBeats integrates three complementary layers: intuitive auditory icons, musical data mapping, and synchronized educational narration generated with open-source neural voice synthesis (Kokoro, Apache 2.0). Listeners can explore the globe with full keyboard navigation, compare two moments in time to hear what changed, feel lightning bursts through mobile haptic vibration, and customize visual accessibility with a dedicated Low-Vision panel. TerraBeats enables anyone—blind or sighted—to hear our planet breathe.

---

## Field 3: Project Details (Official Prompt Questions)

### Question 1: What does it do or how does it work?

TerraBeats is an open-source, client-side web application that transforms silent NASA Earth Information Center (EIC) visualizations into interactive, real-time soundscapes and educational audio documentaries. Running 100% inside the browser, it processes video frames every 33 ms (~30 fps) across an end-to-end mathematical pipeline:

1. **Client-Side Frame Ingestion & CORS Resolution:** Video streams of NASA Scientific Visualization Studio (SVS) releases are hosted locally as web-optimized MP4 files to bypass browser cross-origin canvas security restrictions (`getImageData`).
2. **Canvas Downsampling & UI Masking:** Each frame is drawn to an offscreen 160×90 HTML5 Canvas (`OffscreenCanvas` / 2D context). This downscaling reduces computational overhead to 14,400 RGBA evaluations per tick, ensuring a smooth 60 Hz interface across laptops and smartphones. Dynamic bounding boxes mask out on-screen text overlays, timestamps, and static legends.
3. **Computer Vision & Calibrated Feature Extraction:** An extraction engine (`src/analysis/features.js`) scans every pixel and classifies it against official NASA scientific color ramps, computing global coverage, calibrated physical units, 16-column spatial density profiles, and inter-frame temporal deltas.
4. **Algorithmic Sound Synthesis (Tone.js / Web Audio API):** Extracted values modulate polyphonic synthesizers (Karplus-Strong plucks, dual-operator FM chimes, detuned sawtooth clusters, and membrane percussion). All notes are strictly clamped to pentatonic and modal scales to eliminate chaotic dissonance.
5. **Temporal Comparison & Regional Exploration:** Users can bookmark two points in time (Key `M`) to hear what changed between them (`src/analysis/compare.js`), jump directly to regional hotspots such as the Humboldt current or Amazon basin (Key `X`), or explore the globe freely with spatial ray-casting audio labels.

#### Calculation Table 1: GEDI Forest Canopy Height (LiDAR 0–50 m — SVS 4950)
*Problem:* 3D planetary globe hill-shading alters raw RGB illumination.  
*Solution:* Illumination-invariant Look-Up Table (LUT) matching across 26 nodes sampled every 2 meters:

| Variable / Parameter | Mathematical Formula | Code Implementation (`features.js`) | Function & Scientific Meaning |
|---|---|---|---|
| **Reference Node** | $\vec{e}_i = [r_i, g_i, b_i]^T, \quad m_i \in \{0, 2, \dots, 50\}$ | `GEDI_LUT = [{m: 0, r: 84, g: 72, b: 48}, ...]` | 26 color nodes from the embedded height scale. |
| **Photometric Scale ($k$)** | $k = \text{clamp}\left(\frac{\vec{c} \cdot \vec{e}_i}{\|\vec{e}_i\|^2}, 0.55, 1.35\right)$ | `let k = (r*e.r + g*e.g + b*e.b) / e.n2;` | Scales reference color to compensate for globe shading. |
| **Color Distance ($D_i$)** | $D_i = \sqrt{\sum (c_j - k e_{ij})^2} + 30 \cdot |1 - k|$ | `Math.sqrt(dr*dr + dg*dg + db*db) + 30 * Math.abs(1 - k)` | Euclidean color distance with penalty for extreme lighting. |
| **Canopy Height ($h_{\text{tree}}$)** | $h_{\text{tree}} = m_{\arg\min_i(D_i)} \quad [\text{meters}]$ | `return best; // m in meters [0 - 50]` | Best physical canopy height match in real-world meters. |
| **Synthesizer Pitch** | $f_{\text{note}} = \text{Scale}\left[\left\lfloor \frac{h_{\text{tree}}}{50} \times 15 \right\rceil\right]$ | `pluck.triggerAttackRelease(note(f.colMean[i]*50))` | Quantized to D Major Pentatonic (`D3` to `D6`, 146.8–1174.7 Hz). |

#### Calculation Table 2: Ocean Currents & Temperature (ECCO2 — SVS 3912)
*Problem:* Dynamic current flow lines are separated by black voids, making brightness unreliable.  
*Solution:* Trigonometric HSV Hue angle extraction ($H \in [-6^\circ, 300^\circ]$) interpolated across 33 calibration nodes:

| Parameter | Mathematical Formulation | Code Reference (`features.js`) | Scientific Meaning |
|---|---|---|---|
| **Hue Angle ($H$)** | $H = 60^\circ \times \begin{cases} \frac{G-B}{\Delta} \pmod 6 & \text{if } M=R \\ \frac{B-R}{\Delta} + 2 & \text{if } M=G \\ \frac{R-G}{\Delta} + 4 & \text{if } M=B \end{cases}$ | `if (max === r) hue = ((g - b) / d) % 6; ... hue *= 60;` | Converts pixel to spectral color angle. |
| **Red Hue Wrap** | $\text{If } H > 300^\circ \implies H = H - 360^\circ$ | `if (hue > 300) hue -= 360;` | Preserves continuity for warm deep reds below $0^\circ$. |
| **Interpolated SST** | $T = T_i - \frac{H - H_i}{H_{i-1} - H_i} \quad [^\circ\text{C}]$ | `return T - (hue - SST_HUES[T]) / span;` | Sea surface temperature in $^\circ\text{C}$ ($0^\circ\text{C}$ to $32^\circ\text{C}$). |
| **Current Motion** | $\Delta_{\text{motion}} = \frac{1}{WH} \sum |L_t(x,y) - L_{t-1}(x,y)|$ | `motion += Math.abs(l - prevLum[p]);` | Temporal frame difference driving fluid noise. |

#### Calculation Table 3: Atmospheric Carbon Dioxide Simulation (GEOS DYAMOND — SVS 5196)
*Problem:* Conveying gas accumulation and urgency without harsh alarms.  
*Solution:* Warmth/redness chromatic indices driving acoustic tension formulas:

| Parameter | Mathematical Equation | Audio DSP Implementation | Acoustic Effect |
|---|---|---|---|
| **Tension Factor ($d$)** | $d = \text{clamp}\left((0.15 + 0.9W + 0.6R)\frac{L}{90}, 0, 1\right)$ | `const v = 0.15 + warmth*0.9 + redness*0.6;` | Normalized continuous index $d \in [0.0, 1.0]$. |
| **Detuning** | $\Delta f_k = (-1)^k \cdot (d \times 45\text{ cents})$ | `o.detune.rampTo((k%2 ? 1 : -1) * d * 45, secs)` | Dissonant chorus detuning on 4 sawtooth oscillators. |
| **Tritone Cluster** | $\text{Vol}_{F^\sharp_3} = -60\text{ dBFS} + 40d\text{ dB}$ | `cluster.volume.rampTo(dbFrom(d, -60, -20))` | Progressive injection of the musical interval of tension. |
| **Filter Cutoff** | $f_c = 300 + 2800d\text{ Hz}$ | `filter.frequency.rampTo(300 + d * 2800)` | Lowpass opens up as $\text{CO}_2$ concentrates. |
| **Heartbeat Pace** | $\text{BPM} = 56 + 64d$ | `this.transport.bpm.rampTo(56 + f.level * 64)` | Speeds up planetary pulse from 56 to 120 BPM. |

#### Calculation Table 4: Lightning Optical Bursts & Spatial Audio (LIS Sensor — SVS 5011)
| Step | Mathematical Condition | Code Implementation | Acoustic / Physical Action |
|---|---|---|---|
| **Classifier** | $(r > 110) \land (g > 95) \land (b < 0.6g) \land (r - b > 60)$ | `r > 110 && g > 95 && b < 0.6 * g && r - b > 60` | Distinguishes yellow lightning from clouds/land. |
| **Noise Gate** | $\text{Count} < 22\text{ pixels} \implies \text{Silent}$ | `if (flashes.length < FLASH_MIN) return;` | Eliminates optical sensor noise in quiet ocean scenes. |
| **Clustering** | $N_{\text{hits}} = \min\left(6, \left\lceil \sqrt{\frac{\text{Count}}{6}} \right\rceil\right)$ | `Math.min(6, Math.ceil(Math.sqrt(flashes.length / 6)))` | Clusters hundreds of pixels into 1 to 6 hits. |
| **Stereo Pan** | $\text{Pan} = 2x - 1 \in [-1.0, +1.0]$ | `drops.pan.pan.setValueAtTime(fl.x * 2 - 1, t)` | Positions strikes in binaural stereo field. |
| **Haptic Pulse** | $\tau_{\text{vib}} = \min(100, \lfloor \text{Count} / 2 \rfloor)\text{ ms}$ | `navigator.vibrate(Math.min(100, count / 2))` | Triggers phone hardware vibration. |

---

### Question 2: What benefits does it have?

1. **Dual Accessibility (Blind & Low-Vision):**
   - *For Non-Sighted Users:* 100% keyboard operability, ARIA 1.2 screen-reader regions, single-voice priority rules (no overlapping voices), and tactile mobile crosshairs.
   - *For Low-Vision Users:* A dedicated "See Better" (`Ver mejor`) accessibility panel with high-contrast modes, large and extra-large scalable typography, an animations toggle (`prefers-reduced-motion`), and an audio-only mode.
2. **Dual-Coding Science Comprehension:** Combining visual satellite data with intuitive auditory cues reinforces learning, helping sighted students and educators recognize complex thermal and atmospheric dynamics faster than through visual inspection alone.
3. **Temporal Change Perception ("Compare Two Moments"):** Users can mark moment A and moment B with Key `M`; the system computes the exact scientific difference between the two frames and speaks/sonifies the delta, revealing the planet's change over time.
4. **100% Offline Capability (PWA):** A built-in offline package (52 MB, 186 files cached via Service Worker `sw.js`) ensures that TerraBeats functions seamlessly as an installable application without an active internet connection.
5. **Zero Infrastructure Cost & Client-Side Privacy:** No external cloud processing or GPU servers are required. No user data, keystrokes, or audio queries leave the visitor's device.
6. **Replicable Open-Science Standard:** Researchers, planetariums, and museums can sonify any NASA SVS dataset simply by providing an MP4 video, a calibrated color LUT, and a JSON narrative cue sheet.

---

### Question 3: What is the intended impact of the project?

#### Measurable Educational Comprehension Benchmark:
We developed a standardized acoustic testing framework to verify that non-sighted users can acquire genuine scientific knowledge solely through listening. After a 2-minute sonified story, a participant is evaluated on four core questions:
- *Q1 (Forests):* Where are the tallest forests concentrated? *(Target: Amazon, Congo Basin, Southeast Asia)*
- *Q2 (Oceans):* Does the warmest water stay near the Equator or move toward the poles? *(Target: Concentrated near the Equator, oscillating with seasons)*
- *Q3 (Lights):* Which major country showed the greatest luminous expansion from 2012 to 2023? *(Target: India)*
- *Q4 (CO₂):* What cycle does carbon dioxide follow throughout the day? *(Target: It pulses—absorbed by day, released by night)*

**Benchmark Target:** $\ge 75\%$ accuracy (at least 3 of 4 correct answers) without visual assistance.

#### Societal & Institutional Reach:
- **Interactive Science Kiosks:** Drop-in accessible software for exhibits at the Smithsonian, planetariums, and NASA Earth Information Center installations.
- **Inclusive STEM Classrooms:** Empowers teachers to integrate blind students directly into climate and Earth observation curricula.
- **Regional Scalability from Cajamarca, Peru:** Demonstrates that high-impact, universally accessible space technology can be engineered in regional Latin America and deployed globally.

---

### Question 4: What tools, coding languages, hardware, or software did you use?

| Category | Technology | Version / License | Exact Function in Project |
|---|---|---|---|
| **Core Languages** | JavaScript (ES2023+), HTML5, CSS3 | Standard | Application logic, DOM management, asynchronous engine state. |
| **Frontend Framework** | React & React DOM | v19.3.1 (MIT) | Reactive UI hierarchy, state management, track routing. |
| **Build & Tooling** | Vite | v8.3.6 (MIT) | Fast HMR development server, ES module bundling, tree-shaking. |
| **Styling & Design** | Tailwind CSS | v3.4.19 (MIT) | High-contrast accessible observatory palette (`Slate-950`, `Amber-500`, `Cyan-500`). |
| **Audio DSP Framework** | Tone.js | v15.1.22 (MIT) | Web Audio graph, polyphonic synthesizers, filters, LFOs, limiter, ducking bus (-9 dB). |
| **Computer Vision** | HTML5 Canvas 2D API | Native Browser API | Frame downsampling (160×90 px), pixel classification, LUT color matching. |
| **Speech & Readout** | Web Speech API | Native Browser API | Client-side dynamic speech synthesis for quiz evaluations and coordinate labels. |
| **Physical Feedback** | Web Vibration API | Native Browser API | Hardware haptic pulses on mobile devices during lightning strikes. |
| **Iconography** | Lucide React | v1.73.0 (ISC) | Accessible SVG vector icons with explicit ARIA labels. |
| **Self-Hosted Typography** | Inter, Fraunces, JetBrains Mono | SIL OFL 1.1 | Self-hosted variable fonts via Fontsource; zero external CDN calls or IP tracking. |
| **Offline Architecture** | Service Worker (`sw.js`), Web App Manifest | Native Browser API | Complete offline PWA caching (52 MB, 186 files) for zero-connectivity environments. |
| **Speech Generation** | Kokoro TTS (82M) | Apache 2.0 | Open-source neural speech model run locally via `kokoro-onnx` and `espeak-ng`. |
| **Video Preprocessing** | FFmpeg | v6.0+ (GPL/LGPL) | Video transcoding, H.264 web compression, and audio normalization. |
| **Geospatial Boundaries** | Natural Earth Marine Vectors | Public Domain | 1:50m simplified marine polygons for ray-casting ocean identification. |
| **IDE & Code Quality** | Visual Studio Code, Oxlint | v1.92.0 (MIT) | Code authoring, static linting, performance and memory profiling. |
| **Hosting & CI/CD** | Git, GitHub, Vercel Edge | Cloud Deployment | Version control, collaborative workflows, and edge CDN deployment. |
| **Hardware Used** | PC workstations, mobile phones, headphones | Win11, Android, iOS | Local compilation, mobile touch/vibration tests, binaural stereo tuning. |

---

### Question 5: How is your project creative?

- **Real-Time Generative Synthesis vs. Static Soundtracks:** Conventional projects place pre-recorded background music over science videos. TerraBeats computes audio from scratch every 33 ms directly from visual pixels. If a city lights up or a storm clears, the sound changes immediately.
- **Three Tiers of Semantic Audio:**
  1. *Auditory Icons:* Natural acoustic phenomena recognized instinctively (thunder, waves, forest birds, electrical hum).
  2. *Data-Driven Musical Layer:* Strict scalar mappings (pitch = canopy height or sea temperature, volume = density, stereo pan = longitude) constrained to pentatonic scales to prevent dissonant noise.
  3. *Synchronized Narrative Ducking:* Spoken documentary voiceover that automatically ducks background music by $-9\text{ dB}$.
- **Auditory Legend & Sonified Ruler:** Before playback begins, users can audition each instrument in isolation and hear the artistic rationale behind its acoustic design (*"A lightning flash is instantaneous, which is why it is rendered as percussive staccato"*).
- **Temporal Delta Comparison (Key `M`):** Allows users to compare two moments in time, listening to acoustic and spoken summaries of how global conditions evolved between them.
- **Regional Discovery Mode ("My Region", Key `X`):** Provides instant navigation to regional observation zones (such as the Humboldt current off Peru or the Amazon rainforest), grounding global data in local relevance.
- **Space Observatory Aesthetic:** A sleek mission control interface featuring CSS-animated starfields and planetary orbits that automatically adjust for users with `prefers-reduced-motion`.

---

### Question 6: What factors did your team consider?

1. **100% Open Source Compliance (NASA Terms & Conditions):** To strictly adhere to NASA Space Apps 2026 rules requiring all non-NASA project assets to be free or open-source (OSI-approved), we eliminated proprietary speech services and adopted **Kokoro** (Apache 2.0 open-weights neural TTS). All 148 narration clips and 10 episodes were synthesized locally on our own machines without transmitting text or data to commercial third-party cloud APIs.
2. **Self-Hosted Privacy & Zero External CDN Calls:** We packaged the fonts (`Inter`, `Fraunces`, `JetBrains Mono`) directly into the project repository under the SIL Open Font License 1.1, eliminating external Google Fonts requests and preventing visitor IP tracking.
3. **Scientific Integrity & Transparent Limits:** We honestly acknowledge that TerraBeats sonifies rendered SVS video pixels rather than raw multi-gigabyte HDF5/NetCDF files. We never invent unverified numbers; the only absolute units vocalized are meters (GEDI) and degrees Celsius (ECCO2), calibrated strictly from official color bars. Relative datasets ($\text{CO}_2$ and lightning) are communicated through comparative acoustic indicators.
4. **Assistive Technology Nuances & Low-Vision Needs:**
   - *Screen-Reader Harmony:* All controls operate via keyboard without mouse hover dependencies; mobile TalkBack/VoiceOver touch drag interception was resolved by providing an on-screen tactile D-Pad.
   - *Dedicated Low-Vision Controls:* A "See Better" panel allows users to enlarge text, toggle high contrast, and disable animations.
   - *Single-Voice Hierarchy:* Help audio, welcome speech, documentary narration, and quizzes never overlap; opening help pauses the active story.
5. **Acoustic Aesthetics vs. Auditory Fatigue:** Raw sonification often sounds abrasive. We constrained frequencies to pentatonic/modal scales, added spatial stereo depth, and applied a soft-knee glue compressor with a brickwall limiter at $-2\text{ dBFS}$ to ensure pleasant listening over consumer headphones.
6. **Digital Inclusion in Regional Peru:** Developed in Cajamarca, Peru, where internet access can be slow or intermittent, video sizes were kept between 0.4 and 4.6 MB, and a 52 MB offline caching pack (PWA) was implemented so the application runs completely offline in remote classrooms.

---

## Field 4: Use of Super Intelligence (SI) Declaration

AI tools were utilized strictly in accordance with NASA Space Apps Challenge guidelines:

1. **Code and Documentation:**
   We used large language model assistants (Claude by Anthropic) to assist in refactoring React components, optimizing canvas pixel processing routines, and drafting bilingual technical documentation. All algorithmic logic, color calibration pipelines, and audio mappings were conceived, supervised, tested, and validated by our team.

2. **Narrator Voice:**
   The scripted narration voiceover was generated locally using **Kokoro** (an open model with Apache 2.0 weights, version 82M: voices `ef_dora` for Spanish and `af_heart` for English). The speech was synthesized on our own computer using `kokoro-onnx` and `espeak-ng`. No text, prompts, or personal data were sent to any commercial speech service. The generated audio files are stored locally as static MP3 clips. Interactive quiz feedback, live remarks, and coordinate labels are synthesized in real time by the visitor's browser via the native Web Speech API.

3. **Zero AI-Generated Images, Videos, or Music:**
   No generative AI tools were used for media creation. All visual assets are authentic scientific visualizations from NASA's Scientific Visualization Studio (SVS), and 100% of the music and sonification is generated live by our custom Tone.js algorithmic code directly from video pixels.

---

## Field 5: NASA Data & Scientific Resources

| Resource / Dataset Name | Official NASA SVS URL | Mission / Instrument |
|---|---|---|
| **NASA Earth Information Center (EIC)** | `https://svs.gsfc.nasa.gov/gallery/earth-information-center/` | NASA EIC Visual Data Repository |
| **GEDI Forest Canopy Height** | `https://svs.gsfc.nasa.gov/4950/` | Global Ecosystem Dynamics Investigation (ISS LiDAR) |
| **Global Sea Surface Currents & Temperature** | `https://svs.gsfc.nasa.gov/3912/` | ECCO2 Model (NASA JPL / MIT) |
| **Change in Night Lights 2012–2023** | `https://svs.gsfc.nasa.gov/5313/` | Black Marble / Suomi NPP VIIRS |
| **Lightning Events Detected from ISS** | `https://svs.gsfc.nasa.gov/5011/` | Lightning Imaging Sensor (LIS on ISS) |
| **DYAMOND Global Carbon Dioxide** | `https://svs.gsfc.nasa.gov/5196/` | GEOS Model Atmospheric Simulation |
| **Data Sonification: Caldwell 73** | `https://svs.gsfc.nasa.gov/13786/` | NASA SVS (Conceptual Inspiration) |

---

## Field 6: Space Agency Partners & Open-Source Libraries

| Library / Resource | Official URL | License | Exact Role in Project |
|---|---|---|---|
| **Tone.js Framework** | `https://tonejs.github.io/` | MIT | Web Audio synthesizer matrix & DSP graph orchestration |
| **React & React DOM** | `https://react.dev/` | MIT | Reactive UI component tree & application state machine |
| **Vite** | `https://vitejs.dev/` | MIT | Modern build tooling, fast HMR development server |
| **Tailwind CSS** | `https://tailwindcss.com/` | MIT | High-contrast accessible dark observatory styling |
| **MDN Web APIs** | `https://developer.mozilla.org/` | Public Standard | HTML5 Canvas 2D, Web Audio, Web Speech, Web Vibration, Service Worker |
| **Lucide Icons** | `https://lucide.dev/` | ISC | Accessible SVG vector iconography |
| **Fontsource Variable Fonts** | `https://fontsource.org/` | SIL OFL 1.1 | Self-hosted Inter, Fraunces, and JetBrains Mono typography |
| **Natural Earth Marine Data** | `https://www.naturalearthdata.com/` | Public Domain | 1:50m simplified marine vector polygons for spatial identification |
| **Kokoro-82M TTS Model** | `https://huggingface.co/hexgrad/Kokoro-82M` | Apache 2.0 | Local neural voice synthesis for narration audio clips |
| **Vercel Edge Platform** | `https://vercel.com/` | Commercial / Free Tier | Production cloud hosting and edge CDN distribution |
| **GitHub Repository** | `https://github.com/DanielaM202/Proyecto-NASA-terrabeats` | Apache 2.0 | Public open-source code repository and documentation |

---

## License and Credits
Our original code and documentation are released under the **Apache License 2.0** (`LICENSE`). Every third-party resource, along with its specific license, is documented in `docs/CREDITOS.md`. NASA scientific visualizations are credited to NASA/Goddard Space Flight Center Scientific Visualization Studio and the Earth Information Center (credited and not relicensed; NASA does not endorse this project).
