"""
Generate the fully coherent official English submission PDF for TerraBeats (NASA Space Apps Challenge 2026).
Structured strictly under the 6 official prompt questions with updated features:
- Kokoro (Apache 2.0 open weights) local neural voice synthesis
- PWA & Offline Pack (52 MB, Service Worker)
- "See Better" Low-Vision accessibility panel
- "Compare Two Moments" (Key M) & "My Region" (Key X)
- Self-hosted SIL OFL typography (Inter, Fraunces, JetBrains Mono)
- Full calculation tables & DSP parameters
"""
import sys
import os
from PyQt5.QtWidgets import QApplication
from PyQt5.QtGui import QTextDocument
from PyQt5.QtPrintSupport import QPrinter

def build_html():
    return """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {
    size: letter;
    margin: 15mm 15mm 15mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.4;
    font-size: 9pt;
  }
  .header-box {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }
  .badge {
    background-color: #0369a1;
    color: #ffffff;
    font-size: 7.5pt;
    font-weight: bold;
    padding: 2px 7px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .tagline {
    color: #64748b;
    font-size: 8pt;
    margin-top: 2px;
    margin-bottom: 0px;
  }
  h1 {
    color: #0f172a;
    font-size: 15pt;
    margin: 3px 0 2px 0;
    font-weight: 800;
  }
  h2 {
    color: #0369a1;
    font-size: 11pt;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 2px;
    margin-top: 12px;
    margin-bottom: 5px;
    font-weight: 700;
  }
  h3 {
    color: #0f172a;
    font-size: 9.5pt;
    margin-top: 8px;
    margin-bottom: 3px;
    font-weight: 600;
  }
  p {
    margin-top: 0;
    margin-bottom: 5px;
    text-align: justify;
  }
  ul, ol {
    margin-top: 2px;
    margin-bottom: 5px;
    padding-left: 16px;
  }
  li {
    margin-bottom: 2px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
    margin-bottom: 8px;
    font-size: 7.8pt;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    border: 1px solid #cbd5e1;
  }
  td {
    padding: 3px 6px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  code {
    font-family: Consolas, "Courier New", monospace;
    background-color: #f1f5f9;
    color: #0369a1;
    padding: 1px 3px;
    border-radius: 3px;
    font-size: 7.8pt;
  }
  pre {
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 5px 8px;
    border-radius: 4px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 7.2pt;
    line-height: 1.25;
    margin-top: 3px;
    margin-bottom: 6px;
  }
  .callout {
    background-color: #f0f9ff;
    border-left: 3px solid #0284c7;
    padding: 5px 8px;
    margin: 5px 0;
    border-radius: 0 4px 4px 0;
  }
</style>
</head>
<body>

<div class="header-box">
  <span class="badge">NASA Space Apps Challenge 2026</span>
  <h1>TerraBeats — The Earth Information Jukebox</h1>
  <p class="tagline"><b>Challenge:</b> The Earth Information Jukebox &nbsp;|&nbsp; <b>Location:</b> Cajamarca, Peru &nbsp;|&nbsp; <b>Team:</b> TerraBeats</p>
  <p class="tagline"><b>Official Submission Document & Comprehensive Scientific/Engineering Report (American English)</b></p>
</div>

<h2>Project Overview & Quick Links</h2>
<table>
  <tr><td style="width:25%; font-weight:bold; background:#f1f5f9;">Project Title</td><td><b>TerraBeats — The Earth Information Jukebox</b></td></tr>
  <tr><td style="font-weight:bold; background:#f1f5f9;">Team Members</td><td>Daniela Miranda, Liliam Gil, Diego Quiliche, Rodrigo Vargas, José Rodriguez (Cajamarca, Peru)</td></tr>
  <tr><td style="font-weight:bold; background:#f1f5f9;">Project License</td><td><b>Apache License 2.0</b> (Open Source OSI-compliant; see <code>LICENSE</code> and <code>docs/CREDITOS.md</code>)</td></tr>
  <tr><td style="font-weight:bold; background:#f1f5f9;">Live Application</td><td><code>https://terrabeats.vercel.app</code></td></tr>
  <tr><td style="font-weight:bold; background:#f1f5f9;">Source Code Repo</td><td><code>https://github.com/DanielaM202/Proyecto-NASA-terrabeats</code></td></tr>
  <tr><td style="font-weight:bold; background:#f1f5f9;">Project Demo Video</td><td><code>https://youtu.be/YOUR_DEMO_VIDEO_ID</code> (30-second accessible demonstration)</td></tr>
</table>

<h3>High-Level Project Summary (50–200 Words)</h3>
<div class="callout">
<p>NASA's Earth Information Center (EIC) showcases our changing planet through breathtaking satellite imagery, yet over 2.2 billion people worldwide living with visual impairments cannot access this visual data. TerraBeats is an accessible, bilingual (English/Spanish), and fully offline-capable web jukebox that transforms five EIC satellite visualizations into interactive real-time soundscapes and narrated documentaries—turning silent Earth science into music.</p>
<p>Running entirely in the browser without pre-rendered audio files, TerraBeats analyzes video frames at 30 fps using client-side computer vision (HTML5 Canvas). It translates physical Earth measurements—GEDI forest canopy height, sea surface temperature, lightning activity, urban night lights, and atmospheric carbon dioxide—into dynamic musical synthesizers via Tone.js and the Web Audio API.</p>
<p>TerraBeats integrates three complementary layers: intuitive auditory icons, musical data mapping, and synchronized educational narration generated with open-source neural voice synthesis (Kokoro, Apache 2.0). Listeners can explore the globe with full keyboard navigation, compare two moments in time to hear what changed, feel lightning bursts through mobile haptic vibration, and customize visual accessibility with a dedicated Low-Vision panel. TerraBeats enables anyone—blind or sighted—to hear our planet breathe.</p>
</div>

<h2>Question 1: What does it do or how does it work?</h2>
<p>TerraBeats is an open-source, client-side web application that transforms silent NASA Earth Information Center (EIC) visualizations into interactive real-time soundscapes and educational audio documentaries. Running 100% inside the browser, it processes video frames every 33 ms (~30 fps) across an end-to-end mathematical pipeline:</p>

<pre>
[1] NASA Video Feed (SVS MP4)  -->  [2] Offscreen Canvas Downsampling (160x90 px) + UI Masking
       -->  [3] Feature Extraction & Computer Vision (LUT matching, Hue angle, 16-col density)
       -->  [4] Audio DSP Graph (Tone.js synthesizers, scales, ducking bus at -9 dB, limiter)
       -->  [5] Multimodal Universal Interaction (WAI-ARIA 1.2, Natural Earth ray-casting, haptics)
</pre>

<h3>Calculation Table 1: GEDI Forest Canopy Height (LiDAR 0–50 m — SVS 4950)</h3>
<p><i>Problem:</i> 3D globe hill-shading alters raw RGB illumination. <i>Solution:</i> Illumination-invariant Look-Up Table (LUT) matching across 26 nodes sampled every 2 meters:</p>
<table>
  <thead>
    <tr><th>Variable / Parameter</th><th>Mathematical Formula</th><th>Code Implementation (<code>features.js</code>)</th><th>Function & Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Reference Node</b></td><td>e_i = [r_i, g_i, b_i]^T, m_i in {0, 2, ..., 50}</td><td><code>GEDI_LUT = [{m: 0, r: 84, g: 72, b: 48}, ...]</code></td><td>26 color nodes from the embedded height scale.</td></tr>
    <tr><td><b>Photometric Scale (k)</b></td><td>k = clamp( (c . e_i) / ||e_i||^2, 0.55, 1.35 )</td><td><code>let k = (r*e.r + g*e.g + b*e.b) / e.n2;</code></td><td>Adjusts reference brightness to 3D sphere lighting.</td></tr>
    <tr><td><b>Distance Metric (D_i)</b></td><td>D_i = sqrt(sum (c_j - k*e_ij)^2) + 30*|1 - k|</td><td><code>Math.sqrt(dr*dr + dg*dg + db*db) + 30*Math.abs(1-k)</code></td><td>Euclidean color distance with scaling penalty.</td></tr>
    <tr><td><b>Canopy Height</b></td><td>h_tree = m_argmin(D_i) [meters]</td><td><code>return best; // height in meters [0 - 50]</code></td><td>Calibrated physical canopy height in meters.</td></tr>
    <tr><td><b>Synthesizer Pitch</b></td><td>f_note = Scale[ round( (h/50) * 15 ) ]</td><td><code>pluck.triggerAttackRelease(note(f.colMean[i]*50))</code></td><td>Quantized to D Major Pentatonic (D3 to D6).</td></tr>
  </tbody>
</table>

<h3>Calculation Table 2: Ocean Currents & Temperature (ECCO2 — SVS 3912)</h3>
<p><i>Problem:</i> Flow lines are separated by black voids, making brightness unreliable. <i>Solution:</i> HSV Hue extraction (H in [-6 deg, 300 deg]) interpolated across 33 calibration nodes:</p>
<table>
  <thead>
    <tr><th>Parameter</th><th>Mathematical Formulation</th><th>Code Reference (<code>features.js</code>)</th><th>Scientific Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Hue Angle (H)</b></td><td>H = 60 * ((G - B)/Delta mod 6) [if max=R]</td><td><code>if (max === r) hue = ((g - b) / d) % 6; hue *= 60;</code></td><td>Calculates spectral color angle from RGB.</td></tr>
    <tr><td><b>Red Wrap</b></td><td>If H &gt; 300 deg ==&gt; H = H - 360 deg</td><td><code>if (hue > 300) hue -= 360;</code></td><td>Maintains continuous scale for warm reds.</td></tr>
    <tr><td><b>Interpolated SST</b></td><td>T = T_i - (H - H_i) / (H_{i-1} - H_i) [deg C]</td><td><code>return T - (hue - SST_HUES[T]) / span;</code></td><td>Sea surface temperature in deg C (0 to 32 C).</td></tr>
    <tr><td><b>Current Motion</b></td><td>Delta_motion = (1/WH) * sum |L_t - L_{t-1}|</td><td><code>motion += Math.abs(l - prevLum[p]);</code></td><td>Temporal frame difference driving fluid noise.</td></tr>
  </tbody>
</table>

<h3>Calculation Table 3: Atmospheric Carbon Dioxide Simulation (GEOS DYAMOND — SVS 5196)</h3>
<p><i>Problem:</i> Communicating gas buildup without abrasive alarms. <i>Solution:</i> Warmth/redness indices driving musical tension formulas:</p>
<table>
  <thead>
    <tr><th>Parameter</th><th>Mathematical Equation</th><th>Audio DSP Implementation</th><th>Acoustic Effect</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Tension Factor (d)</b></td><td>d = clamp( (0.15 + 0.9*W + 0.6*R) * min(1, L/90), 0, 1 )</td><td><code>const v = 0.15 + warmth*0.9 + redness*0.6;</code></td><td>Normalized continuous index d in [0.0, 1.0].</td></tr>
    <tr><td><b>Detuning</b></td><td>Delta_f = (-1)^k * (d * 45 cents)</td><td><code>o.detune.rampTo((k%2 ? 1 : -1) * d * 45, secs)</code></td><td>Detuning across 4 sawtooth oscillators.</td></tr>
    <tr><td><b>Tritone Cluster</b></td><td>Vol_{F#3} = -60 dBFS + 40*d dB</td><td><code>cluster.volume.rampTo(dbFrom(d, -60, -20))</code></td><td>Injection of the musical interval of tension.</td></tr>
    <tr><td><b>Filter Cutoff</b></td><td>f_c = 300 + 2800*d Hz</td><td><code>filter.frequency.rampTo(300 + d * 2800)</code></td><td>Lowpass opens up as CO2 accumulates.</td></tr>
    <tr><td><b>Heartbeat Pace</b></td><td>BPM = 56 + 64*d</td><td><code>this.transport.bpm.rampTo(56 + f.level * 64)</code></td><td>Speeds up planetary pulse from 56 to 120 BPM.</td></tr>
  </tbody>
</table>

<h3>Calculation Table 4: Lightning Optical Bursts & Spatial Audio (LIS Sensor — SVS 5011)</h3>
<table>
  <thead>
    <tr><th>Step</th><th>Mathematical Condition</th><th>Code Implementation</th><th>Acoustic / Physical Action</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Classifier</b></td><td>(r &gt; 110) and (g &gt; 95) and (b &lt; 0.6*g) and (r-b &gt; 60)</td><td><code>r > 110 && g > 95 && b < 0.6 * g && r - b > 60</code></td><td>Detects yellow optical flash pixels.</td></tr>
    <tr><td><b>Noise Gate</b></td><td>Count &lt; 22 pixels ==&gt; Silent</td><td><code>if (flashes.length < FLASH_MIN) return;</code></td><td>Eliminates sensor noise in dark scenes.</td></tr>
    <tr><td><b>Clustering</b></td><td>N_hits = min(6, ceil(sqrt(Count / 6)))</td><td><code>Math.min(6, Math.ceil(Math.sqrt(flashes.length / 6)))</code></td><td>Clusters hundreds of pixels into 1 to 6 hits.</td></tr>
    <tr><td><b>Stereo Pan</b></td><td>Pan = 2*x - 1 in [-1.0, +1.0]</td><td><code>drops.pan.pan.setValueAtTime(fl.x * 2 - 1, t)</code></td><td>Positions strikes in binaural stereo field.</td></tr>
    <tr><td><b>Haptic Pulse</b></td><td>tau_vib = min(100, floor(Count / 2)) ms</td><td><code>navigator.vibrate(Math.min(100, count / 2))</code></td><td>Triggers phone hardware vibration.</td></tr>
  </tbody>
</table>

<h2>Question 2: What benefits does it have?</h2>
<ol>
  <li><b>Dual Accessibility (Blind & Low-Vision):</b> Complete non-sighted navigation via keyboard and screen readers, paired with a dedicated "See Better" panel (high contrast, scalable typography, reduced motion, audio-only mode).</li>
  <li><b>Dual-Coding Science Comprehension:</b> Sighted students and educators benefit from simultaneous visual and auditory processing, identifying subtle patterns (e.g., equatorial warming currents or urban growth) faster than with sight alone.</li>
  <li><b>Temporal Change Perception ("Compare Two Moments"):</b> Users can bookmark moment A and moment B with Key <code>M</code>; the system computes the exact scientific difference between the two frames and speaks/sonifies the delta.</li>
  <li><b>100% Offline Capability (PWA):</b> Built-in offline package (52 MB, 186 files cached via Service Worker <code>sw.js</code>) ensures full operation without an active internet connection.</li>
  <li><b>Zero Infrastructure Cost & Client-Side Privacy:</b> All calculations run locally in the browser with zero cloud server costs, and no user data or audio ever leaves the visitor's device.</li>
  <li><b>Replicable Open-Science Standard:</b> Researchers, planetariums, and museums can sonify any NASA SVS visualization simply by providing an MP4 video, color bar LUT, and JSON narrative cue sheet.</li>
</ol>

<h2>Question 3: What is the intended impact of the project?</h2>
<p><b>Measurable Educational Comprehension Benchmark:</b> We developed an impact verification protocol. After listening to a 2-minute sonified track, a blindfolded or blind participant is evaluated on four core scientific questions:</p>
<ul>
  <li><i>Q1 (Forests):</i> Where are the tallest forests concentrated? (Target: Amazon, Congo Basin, Southeast Asia)</li>
  <li><i>Q2 (Oceans):</i> Does the warmest water stay near the Equator or move to the poles? (Target: Concentrated near the Equator, oscillating with seasons)</li>
  <li><i>Q3 (Lights):</i> Which major nation showed the largest luminous expansion from 2012 to 2023? (Target: India)</li>
  <li><i>Q4 (CO2):</i> What rhythm does carbon dioxide follow throughout the day? (Target: Pulses—absorbed by day, released by night)</li>
</ul>
<p><b>Benchmark Target:</b> &ge; 75% comprehension accuracy (3 of 4 correct answers) without visual access.</p>
<p><b>Institutional & Societal Scalability:</b> Drop-in audio guide for interactive museum kiosks (Smithsonian, planetariums, NASA EIC) and accessible tool for inclusive STEM classrooms in regional Peru and worldwide.</p>

<h2>Question 4: What tools, coding languages, hardware, or software did you use?</h2>
<table>
  <thead>
    <tr><th>Category</th><th>Technology</th><th>Version & License</th><th>Exact Function in Project</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Core Languages</b></td><td>JavaScript (ES2023+), HTML5, CSS3</td><td>Standard</td><td>Application logic, DOM manipulation, asynchronous state control.</td></tr>
    <tr><td><b>Frontend UI</b></td><td>React & React DOM</td><td>v19.3.1 (MIT)</td><td>Component tree, track selection state, user settings.</td></tr>
    <tr><td><b>Build Tool</b></td><td>Vite</td><td>v8.3.6 (MIT)</td><td>Fast HMR local server, modern bundling, asset pipeline.</td></tr>
    <tr><td><b>Styling</b></td><td>Tailwind CSS</td><td>v3.4.19 (MIT)</td><td>High-contrast accessible theme (Slate-950, Amber-500, Cyan-500).</td></tr>
    <tr><td><b>Audio DSP</b></td><td>Tone.js</td><td>v15.1.22 (MIT)</td><td>Web Audio graph, synths, filters, LFOs, limiter, ducking bus (-9 dB).</td></tr>
    <tr><td><b>Computer Vision</b></td><td>HTML5 Canvas 2D API</td><td>Native</td><td>Frame downsampling (160x90 px), pixel classification, RGB/HSV LUT.</td></tr>
    <tr><td><b>Speech & Voice</b></td><td>Web Speech API</td><td>Native</td><td>Client-side dynamic speech synthesis for quiz feedback and spatial labels.</td></tr>
    <tr><td><b>Haptics</b></td><td>Web Vibration API</td><td>Native</td><td>Physical vibration pulses on mobile lightning strikes.</td></tr>
    <tr><td><b>Iconography</b></td><td>Lucide React</td><td>v1.73.0 (ISC)</td><td>Accessible SVG UI icons with semantic ARIA labels.</td></tr>
    <tr><td><b>Typography</b></td><td>Inter, Fraunces, JetBrains Mono</td><td>SIL OFL 1.1</td><td>Self-hosted variable fonts via Fontsource; zero external CDN calls or IP tracking.</td></tr>
    <tr><td><b>Offline PWA</b></td><td>Service Worker (<code>sw.js</code>), Manifest</td><td>Native</td><td>Complete offline PWA caching (52 MB, 186 files) for zero-connectivity environments.</td></tr>
    <tr><td><b>Speech Models</b></td><td>Kokoro TTS (82M)</td><td>Apache 2.0</td><td>Open-source neural speech model run locally via <code>kokoro-onnx</code> and <code>espeak-ng</code>.</td></tr>
    <tr><td><b>Video Prep</b></td><td>FFmpeg</td><td>v6.0+ (GPL/LGPL)</td><td>Video transcoding to web-optimized MP4 (H.264) and audio normalization.</td></tr>
    <tr><td><b>Geo Data</b></td><td>Natural Earth</td><td>1:50m Polygons</td><td>Vector GeoJSON for ray-casting marine basin identification.</td></tr>
    <tr><td><b>IDE & QA</b></td><td>Visual Studio Code, Oxlint</td><td>v1.92.0 (MIT)</td><td>Code authoring, linting, memory and latency profiling.</td></tr>
    <tr><td><b>Hosting & CI/CD</b></td><td>Git, GitHub, Vercel Edge</td><td>Cloud</td><td>Public version control and automated continuous deployment.</td></tr>
    <tr><td><b>Hardware</b></td><td>PC, smartphones, stereo headphones</td><td>Win11/Android/iOS</td><td>Development, mobile touch/vibration tests, binaural audio validation.</td></tr>
  </tbody>
</table>

<h2>Question 5: How is your project creative?</h2>
<ul>
  <li><b>Live Algorithmic Sonification vs. Background Songs:</b> Every sound wave is synthesized from scratch in real time based on pixel mathematics. If a cloud dims or a light turns off, the music changes within 33 ms.</li>
  <li><b>Three Tiers of Semantic Audio:</b> Combines Auditory Icons (natural cues like thunder or waves), Musical Data Mapping (pitch = height/temperature, volume = density), and Narrative Tour (spoken ducked voiceover).</li>
  <li><b>Spoken Auditory Legend & Sonified Ruler:</b> Listeners can audition each sound in isolation and hear the artistic rationale behind it before starting.</li>
  <li><b>Temporal Delta Comparison (Key <code>M</code>):</b> Allows users to compare two moments in time, listening to acoustic and spoken summaries of how global conditions evolved between them.</li>
  <li><b>Regional Discovery Mode ("My Region", Key <code>X</code>):</b> Provides instant navigation to regional observation zones (such as the Humboldt current off Peru or the Amazon rainforest), grounding global data in local relevance.</li>
  <li><b>Space Observatory Aesthetic:</b> Sleek dark-mode mission control UI with dynamic CSS starfields adhering to <code>prefers-reduced-motion</code>.</li>
</ul>

<h2>Question 6: What factors did your team consider?</h2>
<ol>
  <li><b>100% Open Source Compliance (NASA Terms & Conditions):</b> Adopted <b>Kokoro (Apache 2.0 open weights)</b> run locally on team hardware, ensuring all non-NASA materials are free or open source without transmitting text to proprietary cloud APIs.</li>
  <li><b>Self-Hosted Privacy & Zero External CDN Calls:</b> Packaged all fonts directly into the repository under the SIL Open Font License 1.1, eliminating external Google Fonts requests and preventing visitor IP tracking.</li>
  <li><b>Scientific Integrity & Transparent Limits:</b> Sonifies rendered SVS video pixels rather than raw multi-gigabyte HDF5/NetCDF files; only meters (GEDI) and degrees Celsius (ECCO2) are vocalized from official color bars, while relative datasets use comparative acoustic terms.</li>
  <li><b>Universal Accessibility & Screen Reader Quirks:</b> Full keyboard navigation (Space, 1–5, E, D, F, H, L, Esc); dedicated on-screen mobile D-Pad to avoid TalkBack/VoiceOver finger drag interception; strict single-voice rule preventing audio overlapping.</li>
  <li><b>Musicality vs. Auditory Fatigue:</b> Constrained all frequencies to pentatonic/modal scales, added spatial stereo depth, and placed a brickwall limiter at -2 dBFS with soft-knee glue compression to guarantee pleasant listening through consumer headphones.</li>
  <li><b>Low Bandwidth & Digital Inclusion:</b> Engineered in Cajamarca, Peru; compressed videos to 0.4–4.6 MB, implemented a 52 MB offline caching pack (PWA), and kept sound synthesis 100% client-side for offline readiness.</li>
  <li><b>Bilingual Parity:</b> English and Spanish interfaces, narrations, legends, and help systems were authored with equal scientific rigor and cultural nuance.</li>
</ol>

<h2>Part 3: Use of Super Intelligence (SI) Declaration</h2>
<div class="callout">
<p><b>AI tools were utilized strictly in accordance with NASA Space Apps Challenge guidelines:</b></p>
<ol>
  <li><b>Code and Documentation:</b> We used LLM assistants (Claude by Anthropic) to assist in refactoring React components, optimizing canvas pixel processing routines, and drafting bilingual technical documentation. All algorithmic logic, color calibration pipelines, and audio mappings were supervised, tested, and validated by our team.</li>
  <li><b>Narrator Voice:</b> Scripted narration was generated locally using <b>Kokoro</b> (an open model with Apache 2.0 weights: voices <code>ef_dora</code> for Spanish and <code>af_heart</code> for English). The speech was synthesized on our own computer using <code>kokoro-onnx</code> and <code>espeak-ng</code>. No text, prompts, or personal data were sent to any commercial speech service. The generated audio files are stored locally as static MP3 clips. Dynamic quiz feedback and coordinate readouts use the native browser Web Speech API.</li>
  <li><b>Zero AI-Generated Images, Videos, or Music:</b> No generative AI tools were used for media creation. All visual assets are authentic scientific visualizations from NASA SVS, and 100% of the sonification is generated live by custom Tone.js algorithmic code directly from video pixels.</li>
</ol>
</div>

<h2>Part 4: NASA Data & Scientific Resources</h2>
<table>
  <thead><tr><th>Resource / Dataset Name</th><th>Official NASA SVS URL</th><th>Mission / Instrument</th></tr></thead>
  <tbody>
    <tr><td><b>NASA Earth Information Center (EIC)</b></td><td><code>https://svs.gsfc.nasa.gov/gallery/earth-information-center/</code></td><td>NASA EIC Visual Data Repository</td></tr>
    <tr><td><b>GEDI Forest Canopy Height</b></td><td><code>https://svs.gsfc.nasa.gov/4950/</code></td><td>Global Ecosystem Dynamics Investigation (ISS LiDAR)</td></tr>
    <tr><td><b>Global Sea Surface Currents & Temperature</b></td><td><code>https://svs.gsfc.nasa.gov/3912/</code></td><td>ECCO2 Model (NASA JPL / MIT)</td></tr>
    <tr><td><b>Change in Night Lights 2012–2023</b></td><td><code>https://svs.gsfc.nasa.gov/5313/</code></td><td>Black Marble / Suomi NPP VIIRS</td></tr>
    <tr><td><b>Lightning Events Detected from ISS</b></td><td><code>https://svs.gsfc.nasa.gov/5011/</code></td><td>Lightning Imaging Sensor (LIS on ISS)</td></tr>
    <tr><td><b>DYAMOND Global Carbon Dioxide</b></td><td><code>https://svs.gsfc.nasa.gov/5196/</code></td><td>GEOS Model Atmospheric Simulation</td></tr>
    <tr><td><b>Data Sonification: Caldwell 73</b></td><td><code>https://svs.gsfc.nasa.gov/13786/</code></td><td>NASA SVS (Conceptual Inspiration)</td></tr>
  </tbody>
</table>

<h2>Part 5: Space Agency Partners & Open-Source Libraries</h2>
<table>
  <thead><tr><th>Library / Resource</th><th>Official URL</th><th>License</th><th>Exact Role in Project</th></tr></thead>
  <tbody>
    <tr><td><b>Tone.js Framework</b></td><td><code>https://tonejs.github.io/</code></td><td>MIT</td><td>Web Audio synthesizer matrix & DSP graph orchestration</td></tr>
    <tr><td><b>React & React DOM</b></td><td><code>https://react.dev/</code></td><td>MIT</td><td>Reactive UI component tree & application state machine</td></tr>
    <tr><td><b>Vite</b></td><td><code>https://vitejs.dev/</code></td><td>MIT</td><td>Modern build tooling, fast HMR development server</td></tr>
    <tr><td><b>Tailwind CSS</b></td><td><code>https://tailwindcss.com/</code></td><td>MIT</td><td>High-contrast accessible dark observatory styling</td></tr>
    <tr><td><b>MDN Web APIs</b></td><td><code>https://developer.mozilla.org/</code></td><td>Public Standard</td><td>HTML5 Canvas 2D, Web Audio, Web Speech, Web Vibration, Service Worker</td></tr>
    <tr><td><b>Lucide Icons</b></td><td><code>https://lucide.dev/</code></td><td>ISC</td><td>Accessible SVG vector iconography</td></tr>
    <tr><td><b>Fontsource Variable Fonts</b></td><td><code>https://fontsource.org/</code></td><td>SIL OFL 1.1</td><td>Self-hosted Inter, Fraunces, and JetBrains Mono typography</td></tr>
    <tr><td><b>Natural Earth Marine Data</b></td><td><code>https://www.naturalearthdata.com/</code></td><td>Public Domain</td><td>1:50m simplified marine vector polygons for spatial identification</td></tr>
    <tr><td><b>Kokoro-82M TTS Model</b></td><td><code>https://huggingface.co/hexgrad/Kokoro-82M</code></td><td>Apache 2.0</td><td>Local neural voice synthesis for narration audio clips</td></tr>
    <tr><td><b>Vercel Edge Platform</b></td><td><code>https://vercel.com/</code></td><td>Commercial / Free Tier</td><td>Production cloud hosting and edge CDN distribution</td></tr>
    <tr><td><b>GitHub Repository</b></td><td><code>https://github.com/DanielaM202/Proyecto-NASA-terrabeats</code></td><td>Apache 2.0</td><td>Public open-source code repository and documentation</td></tr>
  </tbody>
</table>

</body>
</html>
"""

def generate_pdf(output_path):
    app = QApplication(sys.argv)
    doc = QTextDocument()
    html_content = build_html()
    doc.setHtml(html_content)
    
    printer = QPrinter()
    printer.setOutputFormat(QPrinter.PdfFormat)
    printer.setPageSize(QPrinter.Letter)
    printer.setPageMargins(15, 15, 15, 15, QPrinter.Millimeter)
    printer.setOutputFileName(output_path)
    
    doc.print_(printer)
    print(f"Updated coherent PDF generated successfully at: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"C:\Users\LEGION\Proyecto-NASA-terrabeats\TerraBeats_NASA_Space_Apps_Submission_EN.pdf")
    generate_pdf(out)
