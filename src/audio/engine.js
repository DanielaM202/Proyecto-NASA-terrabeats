import * as Tone from 'tone';
import { COLUMNS } from '../analysis/features.js';

// Musical scales keep the sonification pleasant: every data value is snapped
// to a note of a scale instead of producing raw frequencies (noise).
const SCALES = {
  'night-lights': ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6'],
  lightning: ['A2', 'C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  co2: ['A3', 'B3', 'C4', 'E4', 'F4', 'A4', 'B4', 'C5', 'E5', 'F5', 'A5'],
  'forest-height': ['D3', 'E3', 'F#3', 'A3', 'B3', 'D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5'],
};

const BPM = { 'night-lights': 96, lightning: 84, co2: 60, 'forest-height': 88 };

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pick = (scale, v) => scale[Math.round(clamp01(v) * (scale.length - 1))];
const dbFrom = (v, min = -48, max = -10) => min + clamp01(v) * (max - min);

export class SonificationEngine {
  constructor() {
    this.ready = false;
    this.playing = false;
    this.vizId = null;
    this.features = null;
    this.nodes = [];
    this.voices = {};
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
    this.reverb = new Tone.Reverb({ decay: 5, wet: 0.32 }).connect(this.master);
    this.recorder = new Tone.Recorder();
    this.limiter.connect(this.recorder);
    this.probe = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 },
      volume: -8,
    });
    this.probePan = new Tone.Panner(0);
    this.probe.chain(this.probePan, this.reverb);
    this.ready = true;
  }

  setVolume(v) {
    if (this.master) this.master.volume.rampTo(v <= 0 ? -Infinity : dbFrom(v, -40, 0), 0.1);
  }

  /** Builds the instruments of one visualization. */
  setViz(id) {
    const wasPlaying = this.playing;
    if (wasPlaying) this.stop();
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

  track(...nodes) {
    this.nodes.push(...nodes);
    return nodes[0];
  }

  panned(instrument, pan = 0) {
    const p = this.track(new Tone.Panner(pan));
    instrument.chain(p, this.reverb);
    this.track(instrument);
    return { inst: instrument, pan: p };
  }

  // ---------- Night lights: chimes along the map, chord with total light ----------
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
        volume: -40,
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
    this.voices = { pad, padChord: ['C3', 'G3', 'E4', 'B4', 'D5'] };

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
      // Change phase: purple = more light (rising), orange = less light (falling).
      if (f.gain > 0.0003 && i % 2 === 0) {
        sparkle.pan.pan.setValueAtTime(pan, time);
        const n = Math.min(3, 1 + Math.floor(f.gain * 2000));
        for (let k = 0; k < n; k++) {
          sparkle.inst.triggerAttackRelease(scale[8 + ((i / 2 + k) % 5)], '32n', time + k * 0.06, 0.5);
        }
      }
      if (f.loss > 0.0003 && i % 4 === 2) {
        sink.pan.pan.setValueAtTime(pan, time);
        sink.inst.triggerAttackRelease(['A2', 'G2', 'E2', 'D2'][(i / 4) | 0], '4n', time, clamp01(0.3 + f.loss * 800));
      }
    }, '16n');
  }

  // ---------- Lightning: each new flash is a percussive hit ----------
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
    const rumbleVol = this.track(new Tone.Volume(-60).connect(this.master));
    const rumbleFilter = this.track(new Tone.Filter(180, 'lowpass').connect(rumbleVol));
    const rumble = this.track(new Tone.Noise('brown').connect(rumbleFilter));
    const kick = this.track(
      new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 4, volume: -12 }).connect(this.reverb),
    );
    this.voices = { rumble, rumbleVol, drops, crack };
    this.lastCrack = 0;

    // Slow low pulse that reflects total lightning activity.
    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      if (i % 4 === 0 && f.level > 0.05) kick.triggerAttackRelease('A1', '8n', time, 0.3 + f.level * 0.7);
    }, '8n');
  }

  /** Called on every analysed frame for event-based sounds (lightning). */
  frameEvents(f) {
    if (this.vizId !== 'lightning' || !this.playing) return;
    const { drops, crack } = this.voices;
    const flashes = f.flashes;
    if (!flashes.length) return;
    // Cluster the flashes horizontally so many dots become a few musical hits.
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

  // ---------- CO2: consonant chord that becomes dissonant, heartbeat tempo ----------
  buildCO2() {
    const scale = SCALES.co2;
    const filter = this.track(new Tone.Filter(400, 'lowpass').connect(this.reverb));
    const droneVol = this.track(new Tone.Volume(-30).connect(filter));
    const freqs = ['C2', 'G2', 'E3', 'B3'].map((n) => Tone.Frequency(n).toFrequency());
    const oscs = freqs.map((fr) =>
      this.track(new Tone.FatOscillator({ frequency: fr, type: 'sawtooth', count: 2, spread: 8, volume: -8 }).connect(droneVol)),
    );
    const cluster = this.track(
      new Tone.Oscillator({ frequency: Tone.Frequency('F#3').toFrequency(), type: 'sawtooth', volume: -60 }).connect(filter),
    );
    const heart = this.track(new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 3, volume: -6 }).connect(this.master));
    const melody = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fmsine', modulationType: 'sine', harmonicity: 2 },
        envelope: { attack: 0.02, decay: 0.4, sustain: 0.1, release: 0.8 },
        volume: -14,
      }),
    );
    this.voices = { oscs, cluster, filter, droneVol };

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      // Heartbeat: "lub-dub" every beat.
      if (i % 2 === 0) {
        heart.triggerAttackRelease('C1', '16n', time, 0.4 + f.level * 0.6);
        heart.triggerAttackRelease('C1', '16n', time + 0.16, 0.25 + f.level * 0.4);
      }
      const v = f.columns[i];
      if (v > 0.2) {
        melody.pan.pan.setValueAtTime((i / (COLUMNS - 1)) * 2 - 1, time);
        melody.inst.triggerAttackRelease(pick(scale, f.colMean[i] * 1.6), '8n', time + 0.08, 0.3 + v * 0.6);
      }
    }, '8n');
  }

  // ---------- Forest height: plucked strings, taller forest = higher pitch ----------
  buildForest() {
    const scale = SCALES['forest-height'];
    const pluck = this.panned(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.003, decay: 0.7, sustain: 0.05, release: 0.9 },
        volume: -10,
      }),
    );
    const pad = this.track(
      new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fatsine', count: 3, spread: 12 },
        envelope: { attack: 2.5, decay: 1, sustain: 0.9, release: 3 },
        volume: -40,
      }).connect(this.reverb),
    );
    const waveVol = this.track(new Tone.Volume(-60).connect(this.master));
    const waveFilter = this.track(new Tone.AutoFilter({ frequency: 0.12, baseFrequency: 250, octaves: 3 }).connect(waveVol));
    const waves = this.track(new Tone.Noise('pink').connect(waveFilter));
    this.voices = { pad, padChord: ['D3', 'A3', 'F#4', 'E5'], waves, waveFilter, waveVol };

    this.transport.scheduleRepeat((time) => {
      const f = this.features;
      const i = this.advance(time);
      if (!f) return;
      const v = f.columns[i];
      if (v > 0.15) {
        pluck.pan.pan.setValueAtTime((i / (COLUMNS - 1)) * 2 - 1, time);
        pluck.inst.triggerAttackRelease(pick(scale, (f.colMean[i] - 0.15) * 1.8), '8n', time, 0.3 + v * 0.7);
      }
    }, '16n');
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
    if (!this.playing) return;
    const v = this.voices;
    switch (this.vizId) {
      case 'night-lights':
        v.pad.volume.rampTo(dbFrom(f.level, -40, -16), 0.5);
        break;
      case 'lightning':
        v.rumbleVol.volume.rampTo(dbFrom(f.level, -50, -16), 0.3);
        break;
      case 'co2': {
        // Dissonance grows with the share of high-CO2 (orange/red) pixels.
        const d = f.level;
        v.oscs.forEach((o, k) => o.detune.rampTo((k % 2 ? 1 : -1) * d * 45, 0.8));
        v.cluster.volume.rampTo(dbFrom(d, -60, -20), 0.8);
        v.filter.frequency.rampTo(300 + d * 2800, 0.8);
        v.droneVol.volume.rampTo(-30 + d * 10, 0.8);
        this.transport.bpm.rampTo(56 + d * 64, 1.5);
        break;
      }
      case 'forest-height':
        v.pad.volume.rampTo(dbFrom(f.coverage * 4, -42, -20), 0.6);
        v.waveVol.volume.rampTo(dbFrom(f.ocean * 2.2, -50, -22), 0.6);
        break;
    }
  }

  start() {
    if (!this.ready || this.playing) return;
    this.playing = true;
    const v = this.voices;
    if (v.pad) v.pad.triggerAttack(v.padChord);
    if (v.rumble) v.rumble.start();
    if (v.waves) {
      v.waves.start();
      v.waveFilter.start();
    }
    if (v.oscs) {
      v.oscs.forEach((o) => o.start());
      v.cluster.start();
    }
    this.transport.start('+0.05');
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    this.transport.pause();
    const v = this.voices;
    if (v.pad) v.pad.releaseAll();
    if (v.rumble) v.rumble.stop();
    if (v.waves) {
      v.waves.stop();
      v.waveFilter.stop();
    }
    if (v.oscs) {
      v.oscs.forEach((o) => o.stop());
      v.cluster.stop();
    }
  }

  /** Explore mode: one note for one pixel. */
  playProbe(value, pan, kind) {
    if (!this.ready) return;
    const scale = SCALES[this.vizId] || SCALES['night-lights'];
    this.probePan.pan.rampTo(pan, 0.02);
    if (kind === 'ocean') {
      this.probe.triggerAttackRelease('D2', '16n', undefined, 0.25);
    } else if (value <= 0) {
      this.probe.triggerAttackRelease('C2', '32n', undefined, 0.08);
    } else {
      this.probe.triggerAttackRelease(pick(scale, value), '8n', undefined, 0.4 + value * 0.6);
    }
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
    this.nodes.forEach((n) => {
      try {
        n.dispose();
      } catch {
        /* already disposed */
      }
    });
    this.nodes = [];
    this.voices = {};
  }
}
