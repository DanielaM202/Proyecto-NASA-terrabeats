// Computer-vision layer: turns one downsampled video frame (ImageData) into
// numeric features that drive the sound. Each visualization has its own pixel
// classifier, calibrated against the colour scale of the original NASA SVS visual.

export const COLUMNS = 16;

// Per-dataset gain for the column profile (calibrated by sampling each video).
const COLUMN_GAIN = { 'night-lights': 40, lightning: 16, co2: 8, 'forest-height': 6 };

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

// Returns 0 when the pixel is not "signal", otherwise a value in (0, 1].
const CLASSIFIERS = {
  // Warm city lights on a dark map. Grey land/ocean are ignored (no warm tint).
  'night-lights': (r, g, b) => {
    const lum = (r + g + b) / 3;
    const warm = r - b;
    if (lum < 38) return 0;
    if (warm > 12 || b - g > 25) return clamp01((lum - 38) / 150);
    return 0;
  },
  // Yellow lightning dots.
  lightning: (r, g, b) => {
    if (r > 110 && g > 95 && b < 0.6 * g && r - b > 60) return clamp01((r + g) / 2 / 230);
    return 0;
  },
  // CO2 colour bar: grey/tan = low, orange → red = high.
  co2: (r, g, b) => {
    const lum = (r + g + b) / 3;
    if (lum < 30) return 0;
    const warmth = (r - b) / 255; // tan ≈ 0.15, orange ≈ 0.6, red ≈ 0.8
    const redness = (r - g) / 255;
    const v = 0.15 + warmth * 0.9 + redness * 0.6;
    return r > 70 ? clamp01(v * Math.min(1, lum / 90)) : 0;
  },
  // Vegetation: brown/dark green = short, bright green/white = tall. Blue ocean excluded.
  'forest-height': (r, g, b) => {
    const lum = (r + g + b) / 3;
    if (lum < 22) return 0;
    if (b > r + 25 && b >= g - 10) return 0; // ocean
    if (g >= b && r < g * 1.45) return clamp01((lum - 22) / 170);
    return 0;
  },
};

const isOcean = (r, g, b) => b > r + 25 && b >= g - 10 && b > 50;
const isGain = (r, g, b) => b > 70 && b - g > 30 && r - g > 5; // purple: more light
const isLoss = (r, g, b) => r > 100 && r - b > 60 && r - g > 30; // orange: less light

/**
 * @param {ImageData} img
 * @param {string} vizId
 * @param {Uint8Array|null} prevMask mask from the previous frame (lightning flashes)
 */
export function extractFeatures(img, vizId, prevMask) {
  const { data, width: w, height: h } = img;
  const classify = CLASSIFIERS[vizId];
  const columns = new Float32Array(COLUMNS);
  const colCount = new Uint16Array(COLUMNS);
  const colSig = new Uint16Array(COLUMNS);
  const peaks = new Float32Array(COLUMNS).fill(0.5);
  const peakVal = new Float32Array(COLUMNS);
  const mask = new Uint8Array(w * h);
  let signal = 0, sum = 0, sx = 0, sy = 0, ocean = 0, gain = 0, loss = 0, high = 0;
  const flashes = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const v = classify(r, g, b);
      const col = Math.min(COLUMNS - 1, Math.floor((x / w) * COLUMNS));
      colCount[col]++;
      if (vizId === 'forest-height' && isOcean(r, g, b)) ocean++;
      if (vizId === 'night-lights') {
        if (isGain(r, g, b)) gain++;
        else if (isLoss(r, g, b)) loss++;
      }
      if (v <= 0) continue;
      const p = y * w + x;
      mask[p] = 1;
      signal++;
      sum += v;
      sx += x * v;
      sy += y * v;
      if (v > 0.6) high++;
      columns[col] += v;
      colSig[col]++;
      if (v > peakVal[col]) {
        peakVal[col] = v;
        peaks[col] = y / (h - 1);
      }
      if (prevMask && !prevMask[p] && flashes.length < 400) flashes.push({ x: x / w, y: y / h, v });
    }
  }

  // colMean: average strength of the signal in each slice (e.g. forest height).
  // columns: "how much signal is in this slice" (0..1).
  const colMean = new Float32Array(COLUMNS);
  for (let c = 0; c < COLUMNS; c++) {
    colMean[c] = colSig[c] ? columns[c] / colSig[c] : 0;
    // sqrt compresses the range so faint regions are still audible.
    columns[c] = clamp01(Math.sqrt((columns[c] / Math.max(1, colCount[c])) * COLUMN_GAIN[vizId]));
  }

  const total = w * h;
  const energy = sum / total;
  const highShare = signal ? high / signal : 0;
  return {
    // One 0..1 "how much" value per dataset, calibrated on the NASA videos.
    level: clamp01(
      vizId === 'night-lights'
        ? energy * 25
        : vizId === 'lightning'
          ? energy * 14
          : vizId === 'co2'
            ? energy * 7 + highShare * 2
            : ((signal ? sum / signal : 0) - 0.15) * 2.5,
    ),
    coverage: signal / total, // fraction of the frame with signal
    intensity: signal ? sum / signal : 0, // mean strength of the signal pixels
    energy: clamp01((sum / total) * 5), // overall amount (coverage × strength), boosted
    high: signal ? high / signal : 0, // share of very strong pixels
    cx: sum ? sx / sum / w : 0.5,
    cy: sum ? sy / sum / h : 0.5,
    columns,
    colMean,
    peaks,
    ocean: ocean / total,
    gain: gain / total,
    loss: loss / total,
    flashes,
    mask,
  };
}

/** Value of a single pixel for the explore mode. */
export function pixelValue(vizId, r, g, b) {
  return CLASSIFIERS[vizId](r, g, b);
}

export function pixelKind(vizId, r, g, b) {
  if (vizId === 'night-lights') {
    if (isGain(r, g, b)) return 'gain';
    if (isLoss(r, g, b)) return 'loss';
  }
  if (vizId === 'forest-height' && isOcean(r, g, b)) return 'ocean';
  return null;
}

/** Downsampled analysis size for each aspect ratio. */
export function analysisSize(viz) {
  return viz.flatMap ? { w: 256, h: 72 } : { w: 160, h: 90 };
}
