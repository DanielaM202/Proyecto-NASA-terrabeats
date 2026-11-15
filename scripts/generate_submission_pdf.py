"""
Generate the official English submission PDF for TerraBeats (NASA Space Apps Challenge 2026).
Uses PyQt5 QTextDocument and QPrinter to produce a clean, publication-ready PDF.
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
    margin: 18mm 18mm 18mm 18mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.45;
    font-size: 10pt;
  }
  .header-box {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  .badge {
    background-color: #0369a1;
    color: #ffffff;
    font-size: 8pt;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .tagline {
    color: #64748b;
    font-size: 9pt;
    margin-top: 4px;
    margin-bottom: 0px;
  }
  h1 {
    color: #0f172a;
    font-size: 18pt;
    margin: 6px 0 2px 0;
    font-weight: 800;
  }
  h2 {
    color: #0369a1;
    font-size: 12pt;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  h3 {
    color: #0f172a;
    font-size: 10.5pt;
    margin-top: 12px;
    margin-bottom: 4px;
    font-weight: 600;
  }
  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }
  ul, ol {
    margin-top: 2px;
    margin-bottom: 8px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 4px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    margin-bottom: 12px;
    font-size: 8.5pt;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border: 1px solid #cbd5e1;
  }
  td {
    padding: 5px 8px;
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
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.5pt;
  }
  pre {
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 8px 10px;
    border-radius: 4px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 8pt;
    line-height: 1.35;
    margin-top: 4px;
    margin-bottom: 10px;
  }
  .callout {
    background-color: #f0f9ff;
    border-left: 3px solid #0284c7;
    padding: 8px 12px;
    margin: 8px 0;
    border-radius: 0 4px 4px 0;
  }
  .formula-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #64748b;
    padding: 6px 10px;
    margin: 6px 0;
    font-family: Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    color: #0f172a;
  }
  .meta-table td:first-child {
    font-weight: bold;
    width: 25%;
    background-color: #f1f5f9;
  }
</style>
</head>
<body>

<div class="header-box">
  <span class="badge">NASA Space Apps Challenge 2026</span>
  <h1>TerraBeats — The Earth Information Jukebox</h1>
  <p class="tagline"><b>Challenge:</b> The Earth Information Jukebox &nbsp;|&nbsp; <b>Location:</b> Cajamarca, Peru &nbsp;|&nbsp; <b>Team:</b> TerraBeats</p>
  <p class="tagline"><b>Official Submission Document & Detailed Scientific/Engineering Report (American English)</b></p>
</div>

<h2>Part 1: Submission Overview & Quick Reference</h2>

<table class="meta-table">
  <tr>
    <td>Project Title</td>
    <td><b>TerraBeats — The Earth Information Jukebox</b></td>
  </tr>
  <tr>
    <td>Team Members</td>
    <td>Daniela Miranda, Liliam Gil, Diego Quiliche, Rodrigo Vargas, José Rodriguez (Cajamarca, Peru)</td>
  </tr>
  <tr>
    <td>Live Application</td>
    <td><code>https://terrabeats.vercel.app</code></td>
  </tr>
  <tr>
    <td>Source Code Repo</td>
    <td><code>https://github.com/DanielaM202/Proyecto-NASA-terrabeats</code></td>
  </tr>
  <tr>
    <td>Project Demo (30s Video)</td>
    <td><code>https://youtu.be/YOUR_DEMO_VIDEO_ID</code></td>
  </tr>
</table>

<h3>High-Level Project Summary</h3>
<div class="callout">
<p>NASA's Earth Information Center (EIC) showcases our changing planet through breathtaking satellite imagery, yet over 2.2 billion people worldwide living with visual impairments cannot access this visual data. TerraBeats is an accessible, bilingual (English/Spanish) web jukebox that transforms Earth Information Center visualizations into interactive, real-time soundscapes—turning silent Earth science into an immersive musical experience.</p>
<p>Running entirely in the browser with zero pre-recorded audio tracks, TerraBeats analyzes video frames in real time using client-side computer vision (HTML5 Canvas) at 30 fps, extracting color signatures, spatial density, and motion. It translates physical Earth measurements—forest canopy height from GEDI, sea surface temperature, lightning activity, urban night lights, and atmospheric carbon dioxide—into dynamic musical synthesizers via Tone.js and the Web Audio API.</p>
<p>TerraBeats integrates three complementary layers: intuitive auditory icons, musical data mapping, and synchronized spoken documentary chapters. Users can navigate the globe via keyboard, receive live spoken descriptions, answer interactive quizzes evaluated directly from on-screen data, and feel lightning strikes through mobile haptic vibration. TerraBeats bridges the gap between raw satellite data and human perception, allowing anyone—blind or sighted—to hear our planet breathe.</p>
</div>

<h2>Part 2: Extended & Detailed Project Engineering</h2>

<h3>1. Problem Statement & Mission Objective</h3>
<p>NASA's Earth Information Center produces world-class scientific visualizations tracking climate, atmosphere, oceans, and biosphere. However, traditional satellite dissemination relies entirely on silent, visual media. For the more than 2.2 billion people globally with visual impairments (WHO, 2019), as well as auditory learners and non-specialist audiences, these visualizations remain inaccessible black boxes. Standard web accessibility alt-texts (e.g., <i>"A world map showing temperature changes"</i>) fail to communicate the essential dimensions of Earth science: <b>where</b>, <b>when</b>, and <b>by how much</b> planetary systems change.</p>
<p><b>Objective:</b> Develop an open-source, universal web application that reads silent NASA Scientific Visualization Studio (SVS) video feeds frame-by-frame at 30 fps. Using mathematical computer vision and real-time algorithmic sound synthesis (Web Audio API & Tone.js), TerraBeats translates raw pixel physics into multidimensional soundscapes. The platform pairs rigorous data sonification with synchronized educational audio description, interactive real-time quizzes, and bidirectional keyboard/haptic exploration.</p>

<h3>2. Technical Architecture & End-to-End Processing Pipeline</h3>
<p>TerraBeats operates completely on the client side without relying on pre-recorded audio files or server-side rendering pipelines. The architecture consists of four tightly synchronized subsystems:</p>

<pre>
[1] NASA SVS Video Stream (Optimized local MP4 / Same-Origin)
     │
     ▼
[2] Computer Vision & Ingestion (HTML5 Canvas 2D @ 30 fps)
     - Resolution downsampling to 160 x 90 matrix (14,400 pixels/tick)
     - Static overlay exclusion masks (timestamps, legends, borders)
     │
     ▼
[3] Feature Extraction Engine (src/analysis/features.js)
     - Photometric LUT color matching & HSV Hue spectral conversion
     - 16-column spatial profile, centroid coordinates (cx, cy), motion delta
     - Physical unit calibration: GEDI meters [0-50m], SST [0-32 C], flash count
     │
     ▼
[4] Audio DSP & Sonification Graph (src/audio/engine.js via Tone.js)
     - Musical scale quantization (Pentatonic and modal scale clamping)
     - Synthesizer array: PolySynth, FM Synth, Sawtooth clusters, Membrane
     - Dynamic Mixing Bus: Voice ducking (-9 dB), glue compressor, brickwall limiter
     │
     ▼
[5] Multimodal Universal Accessibility Interface
     - WAI-ARIA 1.2 screen-reader live regions (NVDA, JAWS, TalkBack)
     - Spatial Explore Mode: Ray-casting on Natural Earth 1:50m marine polygons
     - Mobile haptic pulses (Web Vibration API) & Speech readout (Web Speech API)
</pre>

<h3>3. Mathematical Foundations & Pixel Classification Algorithms</h3>
<p>Each NASA visualization employs distinct scientific color ramps. TerraBeats applies specialized mathematical classifiers to extract exact physical measurements:</p>

<h4>A. GEDI Forest Canopy Height (LiDAR 0–50 m — SVS 4950)</h4>
<p>The visual encodes canopy height above ground in meters on a rotating 3D globe. Planetary hill-shading introduces variable photometric illumination. To resolve this, TerraBeats implements an illumination-invariant Look-Up Table (LUT) matching algorithm across 26 calibration nodes sampled directly from the video's embedded color bar at 2-meter increments:</p>
<div class="formula-box">
Reference Node: e_i = [r_i, g_i, b_i]^T,  ||e_i||^2 = r_i^2 + g_i^2 + b_i^2,  m_i in {0, 2, 4, ..., 50}<br>
Photometric Scaling: k = clamp( (c . e_i) / ||e_i||^2, 0.55, 1.35 )<br>
Distance Metric: D_i = sqrt( (r - k*r_i)^2 + (g - k*g_i)^2 + (b - k*b_i)^2 ) + 30 * |1 - k|<br>
Calculated Height: h_tree = m_argmin(D_i)  [meters]
</div>

<h4>B. Ocean Currents & Sea Surface Temperature (ECCO2 Model — SVS 3912)</h4>
<p>The ECCO2 model visualizes ocean flow lines colored by Sea Surface Temperature (SST) ranging from 0 C to 32 C. Because current lines are separated by black voids, raw RGB brightness is noisy. Instead, TerraBeats computes the exact HSV Hue angle (H in [-6 deg, 300 deg]):</p>
<div class="formula-box">
M = max(r, g, b),  m = min(r, g, b),  Delta = M - m<br>
H = 60 * ((g - b) / Delta mod 6) [if M=r]  |  60 * ((b - r) / Delta + 2) [if M=g]  |  60 * ((r - g) / Delta + 4) [if M=b]<br>
If H > 300 deg ==> H = H - 360 deg<br>
Temperature (C) = T - (H - SST_HUES[T]) / (SST_HUES[T-1] - SST_HUES[T])<br>
Current Motion: Delta_motion = (1 / (W*H)) * sum(|L_t(x,y) - L_{t-1}(x,y)|),  where L = (r + g + b) / 3
</div>

<h4>C. Atmospheric Carbon Dioxide Simulation (GEOS DYAMOND — SVS 5196)</h4>
<p>Atmospheric CO2 concentration is depicted by warmth and redness over geography (tan/grey = background, orange/red = elevated concentrations):</p>
<div class="formula-box">
Warmth = (r - b) / 255,   Redness = (r - g) / 255<br>
v_raw = 0.15 + 0.90 * Warmth + 0.60 * Redness<br>
Tension Factor: d = clamp( v_raw * min(1, L / 90), 0.0, 1.0 )<br>
Detuning: Delta_f = (-1)^k * d * 45 cents  |  Filter Cutoff: f_c = 300 + 2800 * d Hz  |  BPM = 56 + 64 * d
</div>

<h4>D. Lightning Detection from the ISS (LIS Instrument — SVS 5011)</h4>
<p>Lightning events appear as instantaneous optical bursts. The classifier applies a chromatic threshold:</p>
<div class="formula-box">
IsLightning <==> (r > 110) and (g > 95) and (b < 0.6 * g) and (r - b > 60)<br>
Noise Filter: Flashes &lt; 22 ==> Silent  |  Clustered Hits: N_hits = min(6, ceil(sqrt(Count / 6)))<br>
Stereo Panning: Pan = 2*x - 1  in [-1.0 (Left), +1.0 (Right)]
</div>

<h3>4. Scientific Sonification Matrix & Audio DSP Mapping</h3>
<table>
  <thead>
    <tr>
      <th>Track & Dataset</th>
      <th>NASA SVS ID</th>
      <th>Input Metric</th>
      <th>Synth Architecture</th>
      <th>Musical Scale & Pitch</th>
      <th>Parameter & DSP Mappings</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Forest Canopy</b></td>
      <td>GEDI LiDAR<br>SVS 4950</td>
      <td>Canopy height: 0–50 m<br>Ocean fraction: 0–100%</td>
      <td>Triangle PolySynth (Karplus-Strong) + Brown Noise Swell</td>
      <td>D Major Pentatonic<br>D3 (146.8 Hz) to D6 (1174.7 Hz)</td>
      <td>Note index = round(h/50 * 15); Canopy &gt; 30 m triggers sine bird chirps (2.3–4 kHz); Ocean swell = LFO (0.12 Hz) modulating 600 Hz lowpass filter.</td>
    </tr>
    <tr>
      <td><b>Ocean Currents</b></td>
      <td>ECCO2 Model<br>SVS 3912</td>
      <td>SST: 0–32 °C<br>Current motion: Delta_motion</td>
      <td>FM Synth (Harmonicity: 2.0, Mod: 2.5) + Pink Noise Bandpass</td>
      <td>C Major Pentatonic<br>C3 (130.8 Hz) to C6 (1046.5 Hz)</td>
      <td>Note index = round(T/32 * 15); Polar water (&le; 5 °C) triggers ice chimes (E7, B6, G#7); Flowing water volume = -44 dB + 27 * Delta_motion.</td>
    </tr>
    <tr>
      <td><b>Night Lights</b></td>
      <td>Black Marble<br>SVS 5313</td>
      <td>Gain &gt; 0.03% (Purple)<br>Loss &gt; 0.01% (Orange)</td>
      <td>FM Chimes + FatSine Pad (3 voices, 18-cent spread)</td>
      <td>C Major Pentatonic<br>C4 (261.6 Hz) to E6 (1318.5 Hz)</td>
      <td>Pitch follows latitude (North = treble, South = bass); Luminous gain triggers rising arpeggios (C5-D5-E5); Grid loss triggers descending bass drop (A2-G2-E2-D2).</td>
    </tr>
    <tr>
      <td><b>Lightning Events</b></td>
      <td>LIS Sensor<br>SVS 5011</td>
      <td>Flash coordinates (x,y)<br>Flash count: 0–250+</td>
      <td>MembraneSynth (Kick) + White Noise Burst + Lowpass Rumble</td>
      <td>A Minor Pentatonic<br>A2 (110 Hz) to C5 (523.2 Hz)</td>
      <td>Pitch = 1 - y (Northern strikes = higher pitch); Pan = 2x - 1; Thunder rumble active when level &gt; 0.05; Flashes &gt; 25 trigger 2.5 kHz atmospheric crack.</td>
    </tr>
    <tr>
      <td><b>Atmospheric CO2</b></td>
      <td>GEOS DYAMOND<br>SVS 5196</td>
      <td>Tension factor: d in [0.0, 1.0]<br>Planetary breathing cycle</td>
      <td>4-Voice Sawtooth Array + Detuned Tritone Cluster</td>
      <td>A Minor / Altered Hexatonic<br>A3 to A5</td>
      <td>Detune = +/- 45 * d cents; Lowpass cutoff = 300 + 2800 * d Hz; Planetary heartbeat pulse = 56 + 64 * d BPM; 55 Hz sub-bass membrane transient.</td>
    </tr>
  </tbody>
</table>

<p><b>Dynamic Audio Bus Architecture:</b></p>
<ul>
  <li><b>Narration Ducking Bus:</b> Whenever audio description triggers, the entire music bus ramps down by -9 dB (Attack: 250 ms, Release: 800 ms), ensuring vocal clarity without abrupt audio cuts.</li>
  <li><b>Glue Compressor:</b> 2-stage dynamic control with a soft-knee compressor (Threshold: -26 dB, Ratio: 3:1, Attack: 20 ms, Release: 250 ms).</li>
  <li><b>Master Brickwall Limiter:</b> Zero-overshoot peak limiter pegged at -2.0 dBFS to prevent digital clipping across consumer headphones and laptop speakers.</li>
</ul>

<h3>5. Geospatial Exploration & Spatial Querying Mechanics</h3>
<p>In <b>Explore Mode</b> (Key <code>E</code>), users navigate the equirectangular Earth projection using keyboard arrows, mouse, or touch controls.</p>
<ul>
  <li><b>Equirectangular Coordinate Transform:</b> For any normalized viewport coordinate (x, y) in [0, 1]^2:
    <div class="formula-box">lon = x * 360 - 180 deg,   lat = 90 - y * 180 deg</div>
  </li>
  <li><b>Ray-Casting Polygon Spatial Classification:</b> Incorporates vector geometry from <b>Natural Earth 1:50m Marine Datasets</b> (0.1 deg precision). Rapid AABB pruning filters out non-candidate polygons, followed by an even-odd ray casting algorithm to identify enclosed seas, gulfs, and ocean basins (e.g., distinguishing the Black Sea from the Mediterranean).</li>
  <li><b>Autonomous Speech Readout:</b> Pausing over any region triggers the Web Speech API with contextualized physical data:
    <br><i>"North Pacific Ocean: Sea surface temperature 24.3 degrees Celsius, moderate easterly current."</i>
    <br><i>"Amazon Basin: Forest canopy height 42 meters, high biodiversity density."</i>
  </li>
</ul>

<h3>6. Universal Accessibility Matrix (WCAG 2.1 AAA Compliance)</h3>
<table>
  <thead>
    <tr>
      <th>Accessibility Feature</th>
      <th>Standard & Guideline</th>
      <th>Technical Implementation in TerraBeats</th>
      <th>User Impact & Benefit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Audio-First Orientation</b></td>
      <td>WCAG 2.1 (3.3.5, 1.3.1)</td>
      <td>Spoken welcome on initial interaction; Key <code>H</code> triggers auditory shortcut guide; Key <code>Esc</code> silences all audio.</td>
      <td>Eliminates disorientation; non-sighted users navigate immediately without visual assistance.</td>
    </tr>
    <tr>
      <td><b>Screen-Reader Native</b></td>
      <td>WAI-ARIA 1.2</td>
      <td>Semantic ARIA roles: <code>role="status"</code>, <code>aria-live="polite"</code>, <code>aria-pressed</code>. Tested with NVDA and JAWS.</td>
      <td>Screen readers announce live track changes and scientific limits without clashing with sonification audio.</td>
    </tr>
    <tr>
      <td><b>100% Keyboard Operable</b></td>
      <td>WCAG 2.1 (2.1.1, 2.1.2)</td>
      <td>Full tab index: <code>Space</code> (Play/Pause), <code>1–5</code> (Track Select), <code>E</code> (Explore), <code>D</code> (Describe), <code>F</code> (Max Peak), <code>L</code> (Language).</td>
      <td>Complete operational autonomy without mouse hardware or touchscreens.</td>
    </tr>
    <tr>
      <td><b>Tactile Directional Pad</b></td>
      <td>Mobile Accessibility (2.5.1)</td>
      <td>High-contrast on-screen D-Pad (Up, Down, Left, Right, Jump to Peak) rendered for mobile interfaces.</td>
      <td>Bypasses TalkBack/VoiceOver touch drag interception, enabling smooth thumb exploration on mobile.</td>
    </tr>
    <tr>
      <td><b>Haptic Sonification</b></td>
      <td>Physical Touch Feedback</td>
      <td>HTML5 Web Vibration API triggers physical hardware: <code>navigator.vibrate(min(100, flashCount * 2))</code>.</td>
      <td>Deaf-blind and mobile users physically feel lightning discharges and planetary pulses in their palms.</td>
    </tr>
    <tr>
      <td><b>Space Observatory UI</b></td>
      <td>WCAG 2.1 (1.4.3, 1.4.6)</td>
      <td>Slate-950 (<code>#020617</code>) background, Amber (<code>#f59e0b</code>) controls, Cyan (<code>#06b6d4</code>) telemetry. Contrast &gt; 11.5:1.</td>
      <td>Prevents optical fatigue and maximizes legibility for low-vision and color-blind users.</td>
    </tr>
  </tbody>
</table>

<h3>7. Educational Storytelling, Guided Episodes & Real-Time Quizzes</h3>
<p>TerraBeats structures every dataset into three semantic tiers:</p>
<ol>
  <li><b>Auditory Icons:</b> Real-world acoustic analogues immediately recognized without training (thunder for lightning, rustling canopies for forests, electric hum for urban lighting).</li>
  <li><b>Musical Data Layer:</b> Direct physical parameter modulation (pitch = height/temperature, volume = density, stereo pan = longitude).</li>
  <li><b>Narrative Tour:</b> Timed documentary commentary that ducks background audio.</li>
</ol>
<p><b>Interactive Evaluation Quizzes:</b> During narrative playback, the system pauses to quiz the listener: <i>"Listen closely to the Pacific Ocean: Is the warmest water concentrated North or South of the Equator?"</i> The engine queries active canvas columns [0..7] (Northern Hemisphere) versus [8..15] (Southern Hemisphere) for warm pixels (T &ge; 28 C), evaluating user responses via the Left/Right Arrow keys in real time.</p>

<h3>8. Agile Development Schedule & Project Timeline</h3>
<table>
  <thead>
    <tr>
      <th>Phase & Milestone</th>
      <th>Key Deliverables</th>
      <th>Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Phase 1: Science & Data Calibration</b></td>
      <td>SVS video ingestion, color palette sampling, and verification of physical units (GEDI meters, SST Celsius).</td>
      <td>00:00 – 08:00</td>
    </tr>
    <tr>
      <td><b>Phase 2: Core Sonification Engine</b></td>
      <td>Canvas extraction loop, 16-column spatial bins, and Web Audio/Tone.js modular synthesizer matrix.</td>
      <td>08:00 – 20:00</td>
    </tr>
    <tr>
      <td><b>Phase 3: Accessibility & UI/UX</b></td>
      <td>WAI-ARIA integration, NVDA screen-reader audit, bilingual narrative authoring, and Edge TTS voice cue generation.</td>
      <td>20:00 – 32:00</td>
    </tr>
    <tr>
      <td><b>Phase 4: Validation & Deployment</b></td>
      <td>Blindfold user testing, latency profiling, mobile haptics validation, and production deployment on Vercel Edge.</td>
      <td>32:00 – 40:00</td>
    </tr>
  </tbody>
</table>

<h3>9. Technical Tooling Stack</h3>
<ul>
  <li><b>Frontend Architecture:</b> React 19, Vite 8, Tailwind CSS 3, Lucide React (accessible vector icons).</li>
  <li><b>Audio & DSP Frameworks:</b> Tone.js v15 (Web Audio API), HTML5 Canvas 2D API, MediaRecorder API (.webm export).</li>
  <li><b>Browser Accessibility APIs:</b> Web Speech API (SpeechSynthesis), Web Vibration API (haptic feedback).</li>
  <li><b>Media & Data Processing:</b> FFmpeg (H.264 video compression and optimization), Python 3.11 (Edge TTS narration generator).</li>
  <li><b>Development Tools:</b> Visual Studio Code, Git, GitHub, Node.js v20, oxlint.</li>
  <li><b>Cloud Deployment:</b> Vercel Edge Network.</li>
</ul>

<h3>10. Team Roles & Technical Contributions (Cajamarca, Peru)</h3>
<ul>
  <li><b>Daniela Miranda (Project Lead & Frontend Engineer):</b> Architecture leadership, React 19 UI component development, state machine orchestration, and Vercel cloud deployment.</li>
  <li><b>Liliam Gil (Scientific Storytelling & Narrative Director):</b> NASA scientific fact-checking, bilingual educational scripts, audio legend design, and documentary chapter timing.</li>
  <li><b>Diego Quiliche (Audio Systems Architect & Sound Designer):</b> Tone.js synthesis graph design, DSP limiter/compressor calibration, harmonic scale quantization, and spatial panning logic.</li>
  <li><b>Rodrigo Vargas (Computer Vision & Algorithms Specialist):</b> Canvas pixel classification algorithms, GEDI photometric distance formulas, SST hue look-up table interpolation, and feature extraction profiling.</li>
  <li><b>José Rodriguez (Accessibility Engineer & QA Lead):</b> WAI-ARIA implementation, WCAG 2.1 compliance audit, blindfold testing coordination, and NVDA/JAWS/TalkBack screen-reader verification.</li>
</ul>

<h3>11. Scientific Integrity, Constraints & Strategic Roadmap</h3>
<p><b>Scientific Rigor:</b> All absolute physical units spoken by TerraBeats (canopy height in meters, SST in °C) derive strictly from official NASA SVS color bars. Relative datasets (atmospheric CO2 and lightning activity) are communicated through comparative acoustic indicators without inventing unverified numbers.</p>
<p><b>Known Constraints:</b> Sonification analyzes rendered video frames rather than raw multi-gigabyte HDF5/NetCDF files. Globe lighting introduces small variance margins (&plusmn;2 m in GEDI canopy estimates), which our algorithm mitigates via illumination scaling factors.</p>
<p><b>Future Roadmap:</b></p>
<ul>
  <li><b>Short Term (1–3 months):</b> WebGL shader acceleration for pixel extraction; custom MIDI output stream support for external digital audio workstations (DAWs).</li>
  <li><b>Medium Term (3–6 months):</b> Direct integration with NASA Worldview API and Earthdata for daily satellite feeds; additional EIC tracks (Stratospheric Ozone, Arctic Sea Ice Extent, Soil Moisture).</li>
  <li><b>Long Term (12+ months):</b> WebXR / Spatial Audio implementation for Apple Vision Pro and Meta Quest, providing 3D binaural acoustic orbital immersion.</li>
</ul>

<h2>Part 3: Use of Super Intelligence (SI) / Artificial Intelligence Declaration</h2>
<div class="callout">
<p><b>AI tools were utilized strictly in accordance with NASA Space Apps Challenge guidelines:</b></p>
<ol>
  <li><b>Code and Documentation:</b> We used large language model assistants (Claude by Anthropic) to assist in refactoring frontend React components, optimizing canvas pixel processing routines, and drafting bilingual technical documentation. All algorithmic logic, color calibration pipelines, and audio mappings were conceived, supervised, tested, and validated by our team.</li>
  <li><b>Audio / Voice Narration:</b> Static educational narration voiceovers were generated using neural text-to-speech models (Microsoft Edge TTS: es-PE Camila and en-US Jenny via the open-source edge-tts package). These files are hosted locally as pre-rendered, lightweight audio cues. Dynamic quiz evaluations, interactive values, and real-time live descriptions are synthesized natively by the user's browser via the native Web Speech API.</li>
  <li><b>Zero AI-Generated Images, Videos, or Music:</b> No generative AI tools were used for media creation. All visual assets are authentic scientific visualizations from NASA's Scientific Visualization Studio (SVS), and 100% of the music and sonification is generated live by our custom Tone.js algorithmic code directly from video pixels.</li>
</ol>
</div>

<h2>Part 4: NASA Data & Scientific Resources</h2>
<table>
  <thead>
    <tr>
      <th>Resource / Dataset Name</th>
      <th>Official NASA SVS URL</th>
      <th>Mission / Instrument</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>NASA Earth Information Center (EIC)</b></td>
      <td><code>https://svs.gsfc.nasa.gov/gallery/earth-information-center/</code></td>
      <td>NASA EIC Visual Data Repository</td>
    </tr>
    <tr>
      <td><b>GEDI Forest Canopy Height</b></td>
      <td><code>https://svs.gsfc.nasa.gov/4950/</code></td>
      <td>Global Ecosystem Dynamics Investigation (ISS LiDAR)</td>
    </tr>
    <tr>
      <td><b>Global Sea Surface Currents & Temperature</b></td>
      <td><code>https://svs.gsfc.nasa.gov/3912/</code></td>
      <td>ECCO2 Model (NASA JPL / MIT)</td>
    </tr>
    <tr>
      <td><b>Change in Night Lights 2012–2023</b></td>
      <td><code>https://svs.gsfc.nasa.gov/5313/</code></td>
      <td>Black Marble / Suomi NPP VIIRS</td>
    </tr>
    <tr>
      <td><b>Lightning Events Detected from ISS</b></td>
      <td><code>https://svs.gsfc.nasa.gov/5011/</code></td>
      <td>Lightning Imaging Sensor (LIS on ISS)</td>
    </tr>
    <tr>
      <td><b>DYAMOND Global Carbon Dioxide</b></td>
      <td><code>https://svs.gsfc.nasa.gov/5196/</code></td>
      <td>GEOS Model Atmospheric Simulation</td>
    </tr>
    <tr>
      <td><b>Data Sonification: Caldwell 73</b></td>
      <td><code>https://svs.gsfc.nasa.gov/13786/</code></td>
      <td>NASA SVS (Conceptual Inspiration)</td>
    </tr>
  </tbody>
</table>

<h2>Part 5: Space Agency Partners & Open-Source Libraries</h2>
<table>
  <thead>
    <tr>
      <th>Library / Platform</th>
      <th>Official URL</th>
      <th>Role in Project</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Tone.js Framework</b></td>
      <td><code>https://tonejs.github.io/</code></td>
      <td>Web Audio synthesizer matrix & DSP graph orchestration</td>
    </tr>
    <tr>
      <td><b>React 19 & Vite 8</b></td>
      <td><code>https://react.dev/</code></td>
      <td>Reactive user interface & rapid development build tool</td>
    </tr>
    <tr>
      <td><b>Tailwind CSS 3</b></td>
      <td><code>https://tailwindcss.com/</code></td>
      <td>High-contrast accessible dark observatory styling</td>
    </tr>
    <tr>
      <td><b>MDN Web APIs</b></td>
      <td><code>https://developer.mozilla.org/</code></td>
      <td>HTML5 Canvas 2D, Web Audio, Web Speech, Web Vibration</td>
    </tr>
    <tr>
      <td><b>Lucide Icons</b></td>
      <td><code>https://lucide.dev/</code></td>
      <td>Accessible SVG UI iconography</td>
    </tr>
    <tr>
      <td><b>Vercel Edge Platform</b></td>
      <td><code>https://vercel.com/</code></td>
      <td>Production cloud hosting & edge CDN delivery</td>
    </tr>
    <tr>
      <td><b>GitHub Repository</b></td>
      <td><code>https://github.com/DanielaM202/Proyecto-NASA-terrabeats</code></td>
      <td>Public open-source code hosting & documentation</td>
    </tr>
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
    print(f"PDF generated successfully at: {output_path}")

if __name__ == "__main__":
    out = os.path.abspath(r"C:\Users\LEGION\Proyecto-NASA-terrabeats\TerraBeats_NASA_Space_Apps_Submission_EN.pdf")
    generate_pdf(out)
