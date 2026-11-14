import * as Tone from 'tone';
import { COLUMNS } from '../analysis/features.js';

// Three layers of meaning per track:
//  1. auditory icons  – sounds recognisable without explanation (wind, birds, waves, thunder…)
//  2. data layer      – musical parameters driven by the measurement (pitch = metres, etc.)
//  3. narration       – handled by the UI (speech), see App.jsx
// Every note is snapped to a musical scale so the result stays pleasant.

const SCALES = {
  'night-lights': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6'],
  lightning: ['A2', 'C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  co2: ['A3', 'B3', 'C4', 'E4', 'F4', 'A4', 'B4', 'C5', 'E5', 'F5', 'A5'],
  // D major pentatonic over 3 octaves: index = height / 50 m.
  'forest-height': ['D3', 'E3', 'F#3', 'A3', 'B3', 'D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'B5', 'D6'],
};

const BPM = { 'night-lights': 96, lightning: 84, co2: 60, 'forest-height': 84 };

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pick = (scale, v) => scale[Math.round(clamp01(v) * (scale.length - 1))];
const dbFrom = (v, min = -48, max = -10) => min + clamp01(v) * (max - min);
const SILENT = -70;

export class SonificationEngine {
  constructor() {
    this.ready = false;
    this.playing = false;
    this.vizId = null;
    this.features = null;
    this.nodes = [];
    this.sources = []; // continuous generators (noise, oscillators, LFOs) started with the track
    this.sourcesOn = false;
    this.voices = {};
    this.demos = {};
    this.timers = [];
    this.step = 0;
    this.onFlash = null; // haptics callback (number of new flashes)
    this.onStep = null; // UI callback (current playhead column)
  }

  async init() {
    if (this.ready) return;
    await Tone.start();
    this.transport = Tone.getTransport();
    this.limiter = new Tone.Limiter(-2).toDestination();
    this.master = new Tone.Volume(-4).connect(this.limiter);
    // Ducking bus: music goes down while the narrator speaks.
    this.duck = new Tone.Volume(0).connect(this.master);
    this.reverb = new Tone.Reverb({ decay: 5, wet: 0.32 }).connect(this.duck);
    this.dry = new Tone.Volume(0).connect(this.duck);
    this.recorder = new Tone.Recorder();
    this.limiter.connect(this.recorder);
    this.probe = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 },
      volume: -8,
    });
    this.probePan = new Tone.Panner(0);
    this.probe.chain(this.probePan, this.master);
    this.ready = true;
  }

  setVolume(v) {
    if (this.master) this.master.volume.rampTo(v <= 0 ? -Infinity : dbFrom(v, -40, 0), 0.1);
  }

  /** Lower the music while the voice speaks. */
  setDucked(on) {
    if (this.duck) this.duck.volume.rampTo(on ? -14 : 0, on ? 0.25 : 0.8);
  }

  /** Builds the instruments of one visualization. */
  setViz(id) {
    const wasPlaying = this.playing;
    if (wasPlaying) this.stop();
    this.stopSources();
    this.disposeVoices();
    this.vizId = id;
    this.features = null;
    this.step = 0;
    const builders = {
      'night-lights': () => this.buildNightLights(),
      lightning: () => this.buildLightning(),
      co2: () => this.buildCO2(),
      'forest-height': () => this.buildForest(),
    };
    builders[id]();
    this.transport.bpm.value = BPM[id];
    if (wasPlaying) this.start();
  }

  /** Timers owned by the current track (cleared when the track changes). */
  later(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  }

  track(...nodes) {
    this.nodes.push(...nodes);
    return nodes[0];
  }

  source(node) {
    this.track(node);
    this.sources.push(node);
    return node;
  }

  panned(instrument, pan = 0, out = this.reverb) {
    const p = this.track(new Tone.Panner(pan));
    instrument.chain(p, out);
    this.track(instrument);
    return { inst: instrument, pan: p };
  }

  // =====================================================================
  // FOREST HEIGHT (GEDI) — three sounds only, each with one meaning:
  //   plucked note = canopy height in metres (0–50 m, low → high)
  //   birds        = forest taller than 30 m in that slice
  //   waves        = ocean in view
  // =====================================================================
  buildForest() {
    const scale = SCALES['forest-height'];
    const note = (m) => pick(scale, m / 50);

    const pluck = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.003, decay: 0.8, sustain: 0.04, release: 1 },
        volume: -8,
      }),
    );

    // Birds: short frequency-swept chirps.
    const birdPan = this.track(new Tone.Panner(0).connect(this.reverb));
    const bird = this.track(
      new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.004, decay: 0.05, sustain: 0.35, release: 0.04 },
        volume: -15,
      }).connect(birdPan),
    );
    let birdBusyUntil = 0;
    const birdPhrase = (time, pan, strength = 0.6) => {
      const t0 = Math.max(time, birdBusyUntil + 0.05);
      const base = 2300 + Math.random() * 1700;
      const n = 2 + Math.floor(Math.random() * 3);
      birdPan.pan.setValueAtTime(pan, t0);
      for (let k = 0; k < n; k++) {
        const t = t0 + k * 0.12;
        const f = base * (k % 2 ? 1.12 : 1);
        bird.triggerAttackRelease(f, 0.07, t, 0.3 + strength * 0.5);
        bird.frequency.exponentialRampToValueAtTime(f * 1.4, t + 0.06);
      }
      birdBusyUntil = t0 + n * 0.12;
    };

    // Ocean swell: brown noise with a slow rise and fall.
    const waveVol = this.track(new Tone.Volume(SILENT).connect(this.dry));
    const waveGain = this.track(new Tone.Gain(0.4).connect(waveVol));
    const waveFilter = this.track(new Tone.Filter({ type: 'lowpass', frequency: 600 }).connect(waveGain));
    this.source(new Tone.Noise('brown')).connect(waveFilter);
    this.source(new Tone.LFO({ frequency: 0.12, min: 0.08, max: 1 })).connect(waveGain.gain);
    this.source(new Tone.LFO({ frequency: 0.12, min: 250, max: 1100 })).connect(waveFilter.frequency);

    this.voices = {};
    this.levels = (f) => waveVol.volume.rampTo(dbFrom((f.ocean - 0.12) * 3, -48, -20), 0.8);
    this.silence = () => waveVol.volume.rampTo(SILENT, 0.6);

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      const v = f.columns[i];
      const pan = (i / (COLUMNS - 1)) * 2 - 1;
      if (v > 0.15) {
        pluck.pan.pan.setValueAtTime(pan, time);
        pluck.inst.triggerAttackRelease(note(f.colMean[i] * 50), '8n', time, 0.3 + v * 0.7);
      }
      if (f.colHigh[i] > 0.004 && Math.random() < Math.min(0.6, f.colHigh[i] * 25)) birdPhrase(time + 0.05, pan, v);
    }, '16n');

    // ---- demos for the legend / story intro (return duration in seconds) ----
    const hold = (vol, db, secs) => {
      vol.volume.cancelScheduledValues(Tone.now());
      vol.volume.rampTo(db, 0.4);
      this.later(() => vol.volume.rampTo(SILENT, 0.8), secs * 1000);
    };
    const repeat = (m, t) => [0, 0.5, 1].forEach((d) => pluck.inst.triggerAttackRelease(note(m), '8n', t + 0.15 + d, 0.85));
    this.demos = {
      low: (t) => (repeat(2, t), 1.9),
      high: (t) => (repeat(45, t), 1.9),
      birds: (t) => (birdPhrase(t + 0.2, -0.5), birdPhrase(t + 1.2, 0.5), 2.3),
      waves: () => (hold(waveVol, -18, 3.5), 4),
      ruler: (t) => {
        [0, 10, 20, 30, 40, 50].forEach((m, k) => pluck.inst.triggerAttackRelease(note(m), '8n', t + 0.2 + k * 0.5, 0.8));
        return 3.5;
      },
    };
  }

  // =====================================================================
  // NIGHT LIGHTS: chimes along the map, chord with total light
  // =====================================================================
  buildNightLights() {
    const scale = SCALES['night-lights'];
    const chimes = this.panned(
      new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 6,
        envelope: { attack: 0.004, decay: 0.9, sustain: 0, release: 1.2 },
        modulationEnvelope: { attack: 0.002, decay: 0.3, sustain: 0, release: 0.4 },
        volume: -12,
      }),
    );
    const pad = this.track(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsine', count: 3, spread: 18 },
        envelope: { attack: 2, decay: 1, sustain: 0.9, release: 3 },
        volume: SILENT,
      }).connect(this.reverb),
    );
    const sparkle = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.3 },
        volume: -16,
      }),
    );
    const sink = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.8, sustain: 0.1, release: 1 },
        volume: -12,
      }),
    );
    const padChord = ['C3', 'G3', 'E4', 'B4', 'D5'];
    this.voices = { pad, padChord };
    this.levels = (f) => pad.volume.rampTo(dbFrom(f.level, -40, -16), 0.5);
    this.silence = () => pad.volume.rampTo(SILENT, 0.6);

    const rise = (time, pan) => {
      sparkle.pan.pan.setValueAtTime(pan, time);
      [8, 9, 10].forEach((n, k) => sparkle.inst.triggerAttackRelease(scale[n], '32n', time + k * 0.07, 0.5));
    };
    const fall = (time, pan, k = 0) => {
      sink.pan.pan.setValueAtTime(pan, time);
      sink.inst.triggerAttackRelease(['A2', 'G2', 'E2', 'D2'][k % 4], '4n', time, 0.6);
    };

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      const v = f.columns[i];
      const pan = (i / (COLUMNS - 1)) * 2 - 1;
      if (v > 0.15) {
        chimes.pan.pan.setValueAtTime(pan, time);
        chimes.inst.triggerAttackRelease(pick(scale, 1 - f.peaks[i]), '8n', time, 0.25 + v * 0.75);
      }
      if (f.gain > 0.0003 && i % 2 === 0) rise(time, pan);
      if (f.loss > 0.0001 && i % 4 === 2) fall(time, pan, (i / 4) | 0);
    }, '16n');

    this.demos = {
      chimes: (t) => {
        [
          [0.2, -0.8],
          [0.9, -0.2],
          [0.5, 0.3],
          [0.75, 0.8],
        ].forEach(([p, pan], k) => {
          chimes.pan.pan.setValueAtTime(pan, t + 0.2 + k * 0.5);
          chimes.inst.triggerAttackRelease(pick(scale, p), '8n', t + 0.2 + k * 0.5, 0.8);
        });
        return 3;
      },
      gain: (t) => (rise(t + 0.2, -0.5), rise(t + 1, 0.5), 2.2),
      loss: (t) => (fall(t + 0.2, -0.4, 0), fall(t + 1, 0.4, 2), 2.6),
      pad: (t) => {
        pad.volume.rampTo(-18, 0.3);
        pad.triggerAttackRelease(padChord, 3, t + 0.1);
        this.later(() => pad.volume.rampTo(SILENT, 1), 4000);
        return 4.5;
      },
    };
  }

  // =====================================================================
  // LIGHTNING: each new flash is a percussive hit
  // =====================================================================
  buildLightning() {
    const drops = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.12 },
        volume: -10,
      }),
    );
    drops.inst.maxPolyphony = 24;
    const crackFilter = this.track(new Tone.Filter(2500, 'bandpass'));
    const crack = this.panned(
      new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.09, sustain: 0 },
        volume: -20,
      }),
    );
    crack.inst.disconnect();
    crack.inst.chain(crackFilter, crack.pan);
    const rumbleVol = this.track(new Tone.Volume(SILENT).connect(this.dry));
    const rumbleFilter = this.track(new Tone.Filter(180, 'lowpass').connect(rumbleVol));
    this.source(new Tone.Noise('brown')).connect(rumbleFilter);
    const kick = this.track(new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 4, volume: -12 }).connect(this.reverb));
    this.voices = { drops, crack };
    this.lastCrack = 0;
    this.levels = (f) => rumbleVol.volume.rampTo(dbFrom(f.level, -50, -16), 0.3);
    this.silence = () => rumbleVol.volume.rampTo(SILENT, 0.6);

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      if (i % 4 === 0 && f.level > 0.05) kick.triggerAttackRelease('A1', '8n', time, 0.3 + f.level * 0.7);
    }, '8n');

    this.demos = {
      drops: (t) => {
        for (let k = 0; k < 6; k++) {
          const tt = t + 0.2 + k * 0.3;
          drops.pan.pan.setValueAtTime((k / 5) * 2 - 1, tt);
          drops.inst.triggerAttackRelease(pick(SCALES.lightning, 0.3 + (k % 3) * 0.25), '32n', tt, 0.8);
        }
        return 2.4;
      },
      crack: (t) => {
        [0.2, 0.7, 1.0].forEach((d) => crack.inst.triggerAttackRelease('16n', t + d, 0.8));
        return 1.8;
      },
      rumble: () => {
        rumbleVol.volume.rampTo(-16, 0.4);
        this.later(() => rumbleVol.volume.rampTo(SILENT, 1), 3000);
        return 4;
      },
    };
  }

  /** Called on every analysed frame for event-based sounds (lightning). */
  frameEvents(f) {
    if (this.vizId !== 'lightning' || !this.playing) return;
    const { drops, crack } = this.voices;
    const flashes = f.flashes;
    if (!flashes.length) return;
    // Cluster the flashes so many dots become a few musical hits.
    const n = Math.min(6, Math.ceil(Math.sqrt(flashes.length)));
    const now = Tone.now();
    for (let k = 0; k < n; k++) {
      const fl = flashes[Math.floor((k / n) * flashes.length)];
      const t = now + 0.02 + k * 0.035 + Math.random() * 0.02;
      drops.pan.pan.setValueAtTime(fl.x * 2 - 1, t);
      drops.inst.triggerAttackRelease(pick(SCALES.lightning, 1 - fl.y), '32n', t, 0.35 + fl.v * 0.5);
    }
    if (flashes.length > 25 && now - this.lastCrack > 0.15) {
      this.lastCrack = now;
      crack.pan.pan.setValueAtTime(flashes[0].x * 2 - 1, now);
      crack.inst.triggerAttackRelease('16n', now + 0.01, clamp01(flashes.length / 200));
    }
    this.onFlash?.(flashes.length);
  }

  // =====================================================================
  // CO2: consonant chord that becomes dissonant, heartbeat tempo
  // =====================================================================
  buildCO2() {
    const scale = SCALES.co2;
    const filter = this.track(new Tone.Filter(400, 'lowpass').connect(this.reverb));
    const droneVol = this.track(new Tone.Volume(SILENT).connect(filter));
    const freqs = ['C2', 'G2', 'E3', 'B3'].map((n) => Tone.Frequency(n).toFrequency());
    const oscs = freqs.map((fr) =>
      this.source(new Tone.FatOscillator({ frequency: fr, type: 'sawtooth', count: 2, spread: 8, volume: -8 })).connect(droneVol),
    );
    const cluster = this.source(
      new Tone.Oscillator({ frequency: Tone.Frequency('F#3').toFrequency(), type: 'sawtooth', volume: -60 }),
    ).connect(filter);
    const heart = this.track(new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 3, volume: -6 }).connect(this.dry));
    const melody = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fmsine', modulationType: 'sine', harmonicity: 2 },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.1, release: 0.8 },
        volume: -14,
      }),
    );
    const setTension = (d, secs = 0.8) => {
      oscs.forEach((o, k) => o.detune.rampTo((k % 2 ? 1 : -1) * d * 45, secs));
      cluster.volume.rampTo(dbFrom(d, -60, -20), secs);
      filter.frequency.rampTo(300 + d * 2800, secs);
    };
    this.voices = {};
    this.levels = (f) => {
      setTension(f.level);
      droneVol.volume.rampTo(-30 + f.level * 10, 0.8);
      this.transport.bpm.rampTo(56 + f.level * 64, 1.5);
    };
    this.silence = () => droneVol.volume.rampTo(SILENT, 0.6);
    const beat = (time, strength) => {
      heart.triggerAttackRelease('C1', '16n', time, 0.4 + strength * 0.6);
      heart.triggerAttackRelease('C1', '16n', time + 0.16, 0.25 + strength * 0.4);
    };

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      if (i % 2 === 0) beat(time, f.level);
      const v = f.columns[i];
      if (v > 0.2) {
        melody.pan.pan.setValueAtTime((i / (COLUMNS - 1)) * 2 - 1, time);
        melody.inst.triggerAttackRelease(pick(scale, f.colMean[i] * 1.6), '8n', time + 0.08, 0.3 + v * 0.6);
      }
    }, '8n');

    this.demos = {
      calm: () => {
        setTension(0, 0.1);
        droneVol.volume.rampTo(-28, 0.5);
        this.later(() => droneVol.volume.rampTo(SILENT, 1), 3500);
        return 4.5;
      },
      tense: () => {
        setTension(0, 0.1);
        droneVol.volume.rampTo(-24, 0.5);
        this.later(() => setTension(1, 2.5), 300);
        this.later(() => droneVol.volume.rampTo(SILENT, 1), 4000);
        return 5;
      },
      heart: (t) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => beat(t + 0.2 + k * (1 - k * 0.07) * 0.9, k / 7));
        return 6;
      },
    };
  }

  advance(time) {
    const i = this.step % COLUMNS;
    this.step++;
    if (this.onStep) Tone.getDraw().schedule(() => this.onStep(i), time);
    return i;
  }

  /** Continuous parameters follow the latest analysed frame. */
  update(f) {
    this.features = f;
    if (this.playing && this.levels) this.levels(f);
  }

  startSources() {
    if (this.sourcesOn) return;
    this.sourcesOn = true;
    this.sources.forEach((s) => s.start());
  }

  stopSources() {
    if (!this.sourcesOn) return;
    this.sourcesOn = false;
    this.sources.forEach((s) => s.stop());
  }

  start() {
    if (!this.ready || this.playing) return;
    clearTimeout(this.demoTimer);
    this.playing = true;
    this.startSources();
    const v = this.voices;
    if (v.pad) v.pad.triggerAttack(v.padChord);
    if (this.features && this.levels) this.levels(this.features);
    this.transport.start('+0.05');
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    this.transport.pause();
    const v = this.voices;
    if (v.pad) v.pad.releaseAll();
    this.silence?.();
    clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => !this.playing && this.stopSources(), 800);
  }

  /** Auditory legend: plays one isolated sound. Resolves after its duration. */
  async demo(key) {
    if (!this.ready || !this.demos[key]) return 0;
    clearTimeout(this.demoTimer);
    clearTimeout(this.stopTimer);
    this.startSources();
    const secs = this.demos[key](Tone.now());
    this.demoTimer = setTimeout(() => {
      if (!this.playing) this.stopSources();
    }, (secs + 1.5) * 1000);
    await new Promise((r) => setTimeout(r, secs * 1000));
    return secs;
  }

  /** Explore mode: one note for one pixel. */
  playProbe(value, pan, kind) {
    if (!this.ready) return;
    const scale = SCALES[this.vizId] || SCALES['night-lights'];
    this.probePan.pan.rampTo(Math.max(-1, Math.min(1, pan)), 0.02);
    if (kind === 'ocean') {
      this.probe.triggerAttackRelease('D2', '16n', undefined, 0.25);
    } else if (value <= 0) {
      this.probe.triggerAttackRelease('C2', '32n', undefined, 0.08);
    } else {
      this.probe.triggerAttackRelease(pick(scale, value), '8n', undefined, 0.4 + value * 0.6);
    }
  }

  /** Explore mode: soft low bump when the cursor reaches the edge of the image. */
  playEdge() {
    if (!this.ready) return;
    this.probePan.pan.rampTo(0, 0.02);
    this.probe.triggerAttackRelease('G1', '32n', undefined, 0.5);
  }

  startRecording() {
    if (this.recorder && this.recorder.state !== 'started') this.recorder.start();
  }

  async stopRecording() {
    if (!this.recorder || this.recorder.state !== 'started') return null;
    return this.recorder.stop();
  }

  disposeVoices() {
    if (this.transport) this.transport.cancel(0);
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.nodes.forEach((n) => {
      try {
        n.dispose();
      } catch {
        /* already disposed */
      }
    });
    this.nodes = [];
    this.sources = [];
    this.sourcesOn = false;
    this.voices = {};
    this.demos = {};
    this.levels = null;
    this.silence = null;
  }
}
