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
  // Vegetation: matched against the official GEDI colour bar → metres / 50.
  'forest-height': (r, g, b) => {
    const lum = (r + g + b) / 3;
    if (lum < 22) return 0;
    if (b > r + 25 && b >= g - 10) return 0; // ocean
    if (g >= b && r < g * 1.45) return Math.max(0.02, gediMeters(r, g, b) / 50);
    return 0;
  },
};

// GEDI "Height Above Ground" colour bar (0–50 m), sampled every 2 m from the
// bar drawn inside the SVS 4950 video itself: [metres, r, g, b].
const GEDI_LUT = [
  [0, 84, 72, 48], [2, 84, 75, 49], [4, 84, 80, 50], [6, 84, 89, 54], [8, 84, 94, 56],
  [10, 86, 105, 59], [12, 91, 114, 63], [14, 94, 118, 64], [16, 101, 125, 66], [18, 104, 128, 67],
  [20, 112, 135, 68], [22, 122, 143, 70], [24, 126, 146, 72], [26, 136, 153, 75], [28, 142, 157, 77],
  [30, 152, 164, 83], [32, 162, 172, 91], [34, 168, 177, 98], [36, 181, 187, 114], [38, 188, 192, 124],
  [40, 203, 203, 147], [42, 217, 214, 170], [44, 224, 220, 182], [46, 238, 229, 204], [48, 244, 234, 214],
  [50, 248, 237, 221],
].map(([m, r, g, b]) => ({ m, r, g, b, n2: r * r + g * g + b * b }));

/**
 * Nearest colour of the bar, tolerating the globe's lighting: each bar colour may
 * be scaled (k) to match a shaded pixel, with a small penalty for large scaling.
 */
export function gediMeters(r, g, b) {
  let best = 0;
  let bestD = Infinity;
  for (const e of GEDI_LUT) {
    let k = (r * e.r + g * e.g + b * e.b) / e.n2;
    k = k < 0.55 ? 0.55 : k > 1.35 ? 1.35 : k;
    const dr = r - k * e.r, dg = g - k * e.g, db = b - k * e.b;
    const d = Math.sqrt(dr * dr + dg * dg + db * db) + 30 * Math.abs(1 - k);
    if (d < bestD) {
      bestD = d;
      best = e.m;
    }
  }
  return best;
}

const inMask = (masks, x, y) => masks.some((m) => x >= m[0] && y >= m[1] && x <= m[2] && y <= m[3]);

const isOcean = (r, g, b) => b > r + 25 && b >= g - 10 && b > 50;
const isGain = (r, g, b) => b > 50 && b - g > 20 && r - g > 3; // purple: new lights
const isLoss = (r, g, b) => r > 60 && r - b > 35 && r - g > 18 && g > b + 6; // orange: lights out

/**
 * @param {ImageData} img
 * @param {string} vizId
 * @param {Uint8Array|null} prevMask mask from the previous frame (lightning flashes)
 * @param {number[][]} masks rectangles [x0,y0,x1,y1] (0..1) with on-screen text to ignore
 */
export function extractFeatures(img, vizId, prevMask, masks = []) {
  const { data, width: w, height: h } = img;
  const classify = CLASSIFIERS[vizId];
  const columns = new Float32Array(COLUMNS);
  const colCount = new Uint16Array(COLUMNS);
  const colSig = new Uint16Array(COLUMNS);
  const colHighCount = new Uint16Array(COLUMNS);
  const peaks = new Float32Array(COLUMNS).fill(0.5);
  const peakVal = new Float32Array(COLUMNS);
  const mask = new Uint8Array(w * h);
  let signal = 0, sum = 0, sx = 0, sy = 0, ocean = 0, gain = 0, loss = 0, high = 0, hx = 0, hy = 0;
  const flashes = [];
  // Precompute masked pixels (labels, dates, colour bars drawn over the data).
  const skip = masks.length ? new Uint8Array(w * h) : null;
  if (skip) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (inMask(masks, x / w, y / h)) skip[y * w + x] = 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (skip && skip[y * w + x]) continue;
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
      if (v >= 0.6) {
        high++;
        colHighCount[col]++;
        hx += x;
        hy += y;
      }
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
  const colSum = Float32Array.from(columns); // raw amount of signal per slice
  const colMean = new Float32Array(COLUMNS);
  const colHigh = new Float32Array(COLUMNS); // share of very strong pixels per slice
  for (let c = 0; c < COLUMNS; c++) {
    colHigh[c] = colHighCount[c] / Math.max(1, colCount[c]);
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
            : (signal ? sum / signal : 0) * 2.2,
    ),
    // Forest: average and tallest-column height in metres (GEDI colour bar).
    meanMeters: vizId === 'forest-height' && signal ? (sum / signal) * 50 : 0,
    // Where the strongest values (≥ 60 % of the scale, e.g. ≥ 30 m of forest) are.
    hcx: high ? hx / high / w : null,
    hcy: high ? hy / high / h : null,
    coverage: signal / total, // fraction of the frame with signal
    intensity: signal ? sum / signal : 0, // mean strength of the signal pixels
    energy: clamp01((sum / total) * 5), // overall amount (coverage × strength), boosted
    high: signal ? high / signal : 0, // share of very strong pixels (e.g. forest ≥ 30 m)
    highCover: high / total, // same, as a share of the whole frame
    cx: sum ? sx / sum / w : 0.5,
    cy: sum ? sy / sum / h : 0.5,
    columns,
    colMean,
    colHigh,
    colSum,
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
  // Night lights are tiny points: analyse at higher resolution so they are not blurred away.
  return viz.id === 'night-lights' ? { w: 320, h: 180 } : { w: 160, h: 90 };
}
