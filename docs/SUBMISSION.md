# NASA Space Apps Challenge 2026 Submission Document
## TerraBeats — The Earth Information Jukebox

> **Language:** American English  
> **Challenge:** The Earth Information Jukebox  
> **Location:** Cajamarca, Peru  
> **Team:** Daniela Miranda, Liliam Gil, Diego Quiliche, Rodrigo Vargas, and José Rodriguez (Cajamarca).  
> **Live Demo:** https://terrabeats.vercel.app  
> **Repository:** https://github.com/DanielaM202/Proyecto-NASA-terrabeats  
> **Project Demo (30s Video):** https://youtu.be/YOUR_DEMO_VIDEO_ID  

---

## Field 1: Project Title
**TerraBeats — The Earth Information Jukebox**

---

## Field 2: High-Level Project Summary (50–200 Words)
NASA's Earth Information Center (EIC) showcases our changing planet through breathtaking satellite imagery, yet over 2.2 billion people worldwide living with visual impairments cannot access this visual data. TerraBeats is an accessible, bilingual (English/Spanish) web jukebox that transforms Earth Information Center visualizations into interactive, real-time soundscapes—turning silent Earth science into an immersive musical experience. 

Running entirely in the browser with zero pre-recorded audio tracks, TerraBeats analyzes video frames in real time using client-side computer vision (HTML5 Canvas) at 30 fps, extracting color signatures, spatial density, and motion. It translates physical Earth measurements—forest canopy height from GEDI, sea surface temperature, lightning activity, urban night lights, and atmospheric carbon dioxide—into dynamic musical synthesizers via Tone.js and the Web Audio API. 

TerraBeats integrates three complementary layers: intuitive auditory icons, musical data mapping, and synchronized spoken documentary chapters. Users can navigate the globe via keyboard, receive live spoken descriptions, answer interactive quizzes evaluated directly from on-screen data, and feel lightning strikes through mobile haptic vibration. TerraBeats bridges the gap between raw satellite data and human perception, allowing anyone—blind or sighted—to hear our planet breathe.

---

## Field 3: Project Details (Official Prompt Questions)

### Question 1: What does it do or how does it work?

TerraBeats translates silent video feeds of NASA Earth visualizations into real-time, mathematically calibrated musical soundscapes and spoken audio documentaries. Running 100% client-side in the browser, it processes every video frame every 33 ms (~30 fps) across an end-to-end pipeline:

1. **Downsampled Canvas Ingestion:** Active video frames are drawn onto an offscreen 160×90 HTML5 Canvas (`OffscreenCanvas` / 2D context). This limits computation to 14,400 RGBA evaluations per tick, ensuring an uninterrupted 60 Hz UI thread across laptops, tablets, and smartphones.
2. **Artifact Masking:** Dynamic bounding boxes mask out static graphic artifacts (dates, color bars, borders) so on-screen UI elements do not contaminate scientific measurements.
3. **Computer Vision & Calibrated Feature Extraction:** Pixels are evaluated through specialized mathematical classifiers calibrated against official NASA SVS color bars.

#### Calculation Table 1: GEDI Forest Canopy Height (LiDAR 0–50 m — SVS 4950)
*Problem:* Planetary hill-shading on the rotating 3D globe alters raw RGB values.  
*Solution:* Illumination-invariant Look-Up Table (LUT) matching across 26 nodes sampled every 2 meters:

| Variable / Parameter | Mathematical Formula | Code Implementation (`features.js`) | Function & Meaning |
|---|---|---|---|
| **Reference Node** | $\vec{e}_i = [r_i, g_i, b_i]^T, \quad m_i \in \{0, 2, \dots, 50\}$ | `GEDI_LUT = [{m: 0, r: 84, g: 72, b: 48}, ...]` | 26 color nodes from the embedded height scale. |
| **Photometric Scale ($k$)** | $k = \text{clamp}\left(\frac{\vec{c} \cdot \vec{e}_i}{\|\vec{e}_i\|^2}, 0.55, 1.35\right)$ | `let k = (r*e.r + g*e.g + b*e.b) / e.n2;` | Adjusts reference brightness to 3D sphere lighting. |
| **Distance Metric ($D_i$)** | $D_i = \sqrt{\sum (c_j - k e_{ij})^2} + 30 \cdot |1 - k|$ | `Math.sqrt(dr*dr + dg*dg + db*db) + 30 * Math.abs(1 - k)` | Euclidean color distance with scaling penalty. |
| **Canopy Height ($h_{\text{tree}}$)** | $h_{\text{tree}} = m_{\arg\min_i(D_i)} \quad [\text{meters}]$ | `return best; // m in meters [0 - 50]` | Calibrated physical canopy height in meters. |
| **Synthesizer Pitch** | $f_{\text{note}} = \text{Scale}\left[\left\lfloor \frac{h_{\text{tree}}}{50} \times 15 \right\rceil\right]$ | `pluck.triggerAttackRelease(note(f.colMean[i]*50))` | Quantized to D Major Pentatonic (`D3` to `D6`). |

#### Calculation Table 2: Ocean Currents & Temperature (ECCO2 — SVS 3912)
*Problem:* Current lines are separated by black voids, making brightness unreliable.  
*Solution:* HSV Hue extraction ($H \in [-6^\circ, 300^\circ]$) interpolated across 33 calibration nodes:

| Parameter | Mathematical Formulation | Code Reference (`features.js`) | Scientific Meaning |
|---|---|---|---|
| **Hue Angle ($H$)** | $H = 60^\circ \times \begin{cases} \frac{G-B}{\Delta} \pmod 6 & \text{if } M=R \\ \frac{B-R}{\Delta} + 2 & \text{if } M=G \\ \frac{R-G}{\Delta} + 4 & \text{if } M=B \end{cases}$ | `if (max === r) hue = ((g - b) / d) % 6; ... hue *= 60;` | Calculates spectral color angle from RGB. |
| **Red Wrap** | $\text{If } H > 300^\circ \implies H = H - 360^\circ$ | `if (hue > 300) hue -= 360;` | Maintains continuous scale for warm reds. |
| **Interpolated SST** | $T = T_i - \frac{H - H_i}{H_{i-1} - H_i} \quad [^\circ\text{C}]$ | `return T - (hue - SST_HUES[T]) / span;` | Sea surface temperature in $^\circ\text{C}$ ($0^\circ\text{C}$ to $32^\circ\text{C}$). |
| **Current Motion** | $\Delta_{\text{motion}} = \frac{1}{WH} \sum |L_t(x,y) - L_{t-1}(x,y)|$ | `motion += Math.abs(l - prevLum[p]);` | Temporal frame difference driving fluid noise. |

#### Calculation Table 3: Atmospheric Carbon Dioxide Simulation (GEOS DYAMOND — SVS 5196)
*Problem:* Communicating gas buildup without abrasive alarms.  
*Solution:* Warmth/redness indices driving musical tension formulas:

| Parameter | Mathematical Equation | Audio DSP Implementation | Acoustic Effect |
|---|---|---|---|
| **Tension Factor ($d$)** | $d = \text{clamp}\left((0.15 + 0.9W + 0.6R)\frac{L}{90}, 0, 1\right)$ | `const v = 0.15 + warmth*0.9 + redness*0.6;` | Normalized continuous index $d \in [0.0, 1.0]$. |
| **Detuning** | $\Delta f_k = (-1)^k \cdot (d \times 45\text{ cents})$ | `o.detune.rampTo((k%2 ? 1 : -1) * d * 45, secs)` | Detuning across 4 sawtooth oscillators. |
| **Tritone Cluster** | $\text{Vol}_{F^\sharp_3} = -60\text{ dBFS} + 40d\text{ dB}$ | `cluster.volume.rampTo(dbFrom(d, -60, -20))` | Injection of the musical interval of tension. |
| **Filter Cutoff** | $f_c = 300 + 2800d\text{ Hz}$ | `filter.frequency.rampTo(300 + d * 2800)` | Lowpass opens up as $\text{CO}_2$ accumulates. |
| **Heartbeat Pace** | $\text{BPM} = 56 + 64d$ | `this.transport.bpm.rampTo(56 + f.level * 64)` | Speeds up planetary pulse from 56 to 120 BPM. |

#### Calculation Table 4: Lightning Optical Bursts & Spatial Audio (LIS Sensor — SVS 5011)
| Step | Mathematical Condition | Code Implementation | Acoustic / Physical Action |
|---|---|---|---|
| **Classifier** | $(r > 110) \land (g > 95) \land (b < 0.6g) \land (r - b > 60)$ | `r > 110 && g > 95 && b < 0.6 * g && r - b > 60` | Detects yellow optical flash pixels. |
| **Noise Gate** | $\text{Count} < 22\text{ pixels} \implies \text{Silent}$ | `if (flashes.length < FLASH_MIN) return;` | Eliminates sensor noise in dark scenes. |
| **Clustering** | $N_{\text{hits}} = \min\left(6, \left\lceil \sqrt{\frac{\text{Count}}{6}} \right\rceil\right)$ | `Math.min(6, Math.ceil(Math.sqrt(flashes.length / 6)))` | Clusters hundreds of pixels into 1 to 6 hits. |
| **Stereo Pan** | $\text{Pan} = 2x - 1 \in [-1.0, +1.0]$ | `drops.pan.pan.setValueAtTime(fl.x * 2 - 1, t)` | Positions strikes in binaural stereo field. |
| **Haptic Pulse** | $\tau_{\text{vib}} = \min(100, \lfloor \text{Count} / 2 \rfloor)\text{ ms}$ | `navigator.vibrate(Math.min(100, count / 2))` | Triggers phone hardware vibration. |

---

### Question 2: What benefits does it have?

1. **Universal Accessibility (WCAG 2.1 AAA):** Opens NASA Earth science to ~2.2 billion people globally with visual impairments, enabling autonomous exploration of satellite data through acoustic cues.
2. **Dual-Coding Science Learning:** Sighted users benefit from simultaneous visual and auditory processing, identifying subtle patterns (e.g., equatorial warming currents or urban growth) faster than with sight alone.
3. **Active Engagement & Cognitive Agency:** Listeners test their comprehension via interactive quizzes evaluated in real time from video pixels, explore coordinates with the keyboard, and consult audio legends.
4. **Zero-Friction Client-Side Execution:** Runs in modern browsers without software installation, high-end GPUs, account registration, or cloud server costs.
5. **Replicable Open-Science Framework:** Researchers and science museums can sonify any new NASA SVS visualization simply by providing a video, color bar LUT, and JSON cue sheet.
6. **Downloadable Curated Playlist & Offline Support:** Each story exists as a downloadable 2-minute audio episode in English and Spanish with chapter navigation, transcripts, and offline PWA caching.

---

### Question 3: What is the intended impact of the project?

#### Measurable Comprehension Benchmark:
We developed an impact verification protocol. After listening to a 2-minute sonified track, a blindfolded or blind participant is evaluated on four core scientific questions:
- *Q1 (Forests):* Where are the tallest forests concentrated? *(Target: Amazon, Congo Basin, Southeast Asia)*
- *Q2 (Oceans):* Does the warmest water stay near the Equator or move to the poles? *(Target: Equator, oscillating with seasons)*
- *Q3 (Lights):* Which major nation showed the largest luminous expansion from 2012 to 2023? *(Target: India)*
- *Q4 (CO₂):* What rhythm does carbon dioxide follow throughout the day? *(Target: Pulses—absorbed by day, released by night)*

**Benchmark Target:** $\ge 75\%$ comprehension accuracy (3 of 4 correct answers) without visual access.

#### Institutional Scalability:
- **Museums & Science Exhibitions:** Drop-in audio guide for interactive museum kiosks (Smithsonian, planetariums, NASA EIC).
- **Inclusive Classrooms:** Accessible tool for STEM educators to integrate blind and low-vision students directly into climate coursework.
- **Global Innovation from Peru:** Engineered by a team in Cajamarca, Peru, demonstrating how accessible space technology can originate from emerging regions and work offline under low-bandwidth constraints.

---

### Question 4: What tools, coding languages, hardware, or software did you use?

| Category | Technology | Version | Exact Function in Project |
|---|---|---|---|
| **Core Languages** | JavaScript (ES2023+), HTML5, CSS3 | Standard | Application logic, DOM manipulation, asynchronous state control. |
| **Frontend UI** | React | v19.3.1 | Component tree, track selection state, user settings. |
| **Build Tool** | Vite | v8.3.6 | HMR local server, modern bundling, asset pipeline. |
| **Styling** | Tailwind CSS | v3.4.19 | High-contrast accessible theme (`Slate-950`, `Amber-500`, `Cyan-500`). |
| **Audio DSP** | Tone.js | v15.1.22 | Web Audio graph, synths, filters, LFOs, limiter, ducking bus (-9 dB). |
| **Computer Vision** | HTML5 Canvas 2D API | Native | Frame downsampling (160×90 px), pixel classification, RGB/HSV LUT. |
| **Speech & Voice** | Web Speech API | Native | Client-side speech synthesis for quiz feedback and spatial labels. |
| **Haptics** | Web Vibration API | Native | Physical vibration pulses on mobile lightning strikes. |
| **Iconography** | Lucide React | v1.73.0 | Accessible SVG UI icons with semantic ARIA labels. |
| **Fonts** | Inter, Fraunces, JetBrains Mono | SIL OFL 1.1 | Self-hosted typography for readability and offline capability. |
| **Video Prep** | FFmpeg | v6.0+ | Video transcoding to web-optimized MP4 (H.264). |
| **Speech Models** | Kokoro TTS & Edge TTS | Open weights | Local generation of neural voice cues without third-party data transmission. |
| **Geo Data** | Natural Earth | 1:50m Polygons | Vector GeoJSON for ray-casting marine basin identification. |
| **IDE & QA** | Visual Studio Code, Oxlint | v1.92.0 | Code authoring, linting, memory and latency profiling. |
| **Hosting & CI/CD** | Git, GitHub, Vercel Edge | Cloud | Public version control and automated continuous deployment. |
| **Hardware** | PC, smartphones, stereo headphones | Win11/Android/iOS | Development, mobile touch/vibration tests, binaural audio validation. |

---

### Question 5: How is your project creative?

- **Live Algorithmic Sonification vs. Background Songs:** Every sound wave is synthesized from scratch in real time based on pixel mathematics. If a cloud dims or a light turns off, the music changes within 33 ms.
- **Three Tiers of Semantic Audio:** Combines Auditory Icons (natural cues like thunder or waves), Musical Data Mapping (pitch = height/temperature, volume = density), and Narrative Tour (spoken ducked voiceover).
- **Spoken Auditory Legend & Sonified Ruler:** Listeners can audition each sound in isolation and hear the artistic rationale behind it before starting.
- **Live-Evaluated Auditory Quizzes:** The system challenges the listener and validates their keyboard answer live against active video pixels.
- **Space Observatory Aesthetic:** Sleek dark-mode mission control UI with dynamic CSS starfields adhering to `prefers-reduced-motion`.

---

### Question 6: What factors did your team consider?

1. **Scientific Integrity vs. Raw Data:** We honestly acknowledge reading rendered video pixels rather than raw NetCDF/HDF5 sensor data. We never invent arbitrary numbers; the only units vocalized are meters (GEDI) and degrees Celsius (ECCO2), derived strictly from official SVS color bars. Relative datasets ($\text{CO}_2$ and lightning) use comparative acoustic indicators ("higher on the right").
2. **Universal Accessibility & Screen Reader Quirks:** Full keyboard navigation (`Space`, `1–5`, `E`, `D`, `F`, `H`, `L`, `Esc`); dedicated on-screen mobile D-Pad to avoid TalkBack/VoiceOver finger drag interception; strict single-voice rule preventing audio overlapping.
3. **Musicality vs. Auditory Fatigue:** Constrained all frequencies to pentatonic/modal scales, added spatial stereo depth, and placed a brickwall limiter at $-2\text{ dBFS}$ with soft-knee glue compression to guarantee pleasant listening through consumer headphones.
4. **Low Bandwidth & Digital Inclusion:** Engineered in Cajamarca, Peru, where internet can be intermittent; compressed videos to 0.4–4.6 MB, self-hosted all fonts and assets, added Service Worker caching, and kept sound synthesis 100% client-side for offline readiness.
5. **Bilingual Parity:** English and Spanish interfaces, narrations, legends, and help systems were authored with equal scientific rigor and cultural nuance.

---

## Field 4: Use of Super Intelligence (SI) Declaration
AI tools were utilized strictly in accordance with NASA Space Apps Challenge guidelines:
1. **Code and Documentation:** We used LLM assistants (Claude by Anthropic) to assist in refactoring React components, optimizing canvas pixel processing routines, and drafting bilingual technical documentation. All algorithmic logic, color calibration pipelines, and audio mappings were supervised, tested, and validated by our team.
2. **Narrator Voice:** Scripted narration is AI text-to-speech generated with **Kokoro** (open model, Apache 2.0 weights run locally) and **Edge TTS**. No sensitive text or user data was sent to third-party services. The narration files are static MP3s: the app does not call any cloud speech service at runtime. Quiz answers, live remarks, and coordinate readouts use the native browser Web Speech API.
3. **Zero AI-Generated Images, Videos, or Music:** No generative AI tools were used for media creation. All visual assets are authentic scientific visualizations from NASA SVS, and 100% of the sonification is generated live by custom Tone.js algorithmic code directly from video pixels.

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

| Library / Platform | Official URL | Role in Project |
|---|---|---|
| **Tone.js Framework** | `https://tonejs.github.io/` | Web Audio synthesizer matrix & DSP graph orchestration |
| **React 19 & Vite 8** | `https://react.dev/` | Reactive user interface & rapid development build tool |
| **Tailwind CSS 3** | `https://tailwindcss.com/` | High-contrast accessible dark observatory styling |
| **MDN Web APIs** | `https://developer.mozilla.org/` | HTML5 Canvas 2D, Web Audio, Web Speech, Web Vibration |
| **Lucide Icons** | `https://lucide.dev/` | Accessible SVG UI iconography |
| **Vercel Edge Platform** | `https://vercel.com/` | Production cloud hosting & edge CDN delivery |
| **GitHub Repository** | `https://github.com/DanielaM202/Proyecto-NASA-terrabeats` | Public open-source code hosting & documentation |

---

## License and Credits
Our code and documentation are released under the **Apache License 2.0** (`LICENSE`). Every third-party resource, with its license, is listed in `docs/CREDITOS.md`: React, Tone.js, and Vite (MIT), Lucide (ISC), Inter, Fraunces, and JetBrains Mono (SIL OFL 1.1, self-hosted), Natural Earth marine polygons (public domain), and the NASA SVS visualizations (credited, not relicensed).
