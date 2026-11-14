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

// ===========================================================================
// OCEAN (SVS 3912, ECCO2): flow lines coloured by sea surface temperature.
// The official colour bar goes from blue (0 °C) to red (32 °C). Because the
// lines are drawn over a dark background, brightness is unreliable but HUE is
// not: we convert each pixel to a hue and look it up in the bar.
// HUES[T] = hue (degrees) of the colour bar at T °C, sampled from sst_ecco2_cbar.png.
const SST_HUES = [228, 222, 215, 208, 199, 191, 180, 169, 161, 153, 147, 142, 137, 133, 130, 124, 117, 108, 99, 90, 81, 73, 67, 62, 59, 53, 46, 38, 30, 20, 9, -4, -6];

/** Sea surface temperature in °C for a pixel, or -1 for land / empty. */
export function seaTemp(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 22) return -1; // dark gap between flow lines / no data
  const d = max - min;
  if (d / max < 0.35) return -1; // grey land
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue *= 60;
  if (hue > 300) hue -= 360; // reds just below 360° continue the scale
  if (hue < -6) hue = -6;
  if (hue >= SST_HUES[0]) return 0;
  for (let T = 1; T < SST_HUES.length; T++) {
    if (hue >= SST_HUES[T]) {
      const span = SST_HUES[T - 1] - SST_HUES[T] || 1;
      return T - (hue - SST_HUES[T]) / span;
    }
  }
  return 32;
}

/**
 * Ocean features. The map is equirectangular, so rows are latitudes: the sound
 * sweeps from the North Pole to the South Pole. To reuse the same engine,
 * `columns` / `colMean` hold the 16 LATITUDE bands (north → south).
 */
function extractOcean(img, prevLum) {
  const { data, width: w, height: h } = img;
  const N = COLUMNS;
  const rowSum = new Float32Array(N), rowCnt = new Uint32Array(N), rowPx = new Uint32Array(N);
  const rowWarmX = new Float32Array(N), rowWarmW = new Float32Array(N);
  const warmCols = new Float32Array(N); // warm water (≥ 27 °C) by longitude band
  const hotCols = new Float32Array(N); // hottest water (≥ 29 °C) by longitude band, for the quiz
  const rowHotX = new Float32Array(N), rowHotW = new Float32Array(N);
  const lum = new Uint8Array(w * h);
  let sum = 0, cnt = 0, warm = 0, cold = 0, wx = 0, wy = 0, motion = 0;
  for (let y = 0; y < h; y++) {
    const row = Math.min(N - 1, Math.floor((y / h) * N));
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const p = y * w + x;
      const l = (r + g + b) / 3;
      lum[p] = l;
      rowPx[row]++;
      const T = seaTemp(r, g, b);
      if (T < 0) continue;
      if (prevLum) motion += Math.abs(l - prevLum[p]);
      rowSum[row] += T;
      rowCnt[row]++;
      sum += T;
      cnt++;
      if (T >= 27) {
        warm++;
        wx += x;
        wy += y;
        rowWarmX[row] += x;
        rowWarmW[row]++;
        warmCols[Math.min(N - 1, Math.floor((x / w) * N))]++;
        if (T >= 29) {
          hotCols[Math.min(N - 1, Math.floor((x / w) * N))]++;
          rowHotX[row] += x;
          rowHotW[row]++;
        }
      } else if (T <= 5) cold++;
    }
  }
  const columns = new Float32Array(N), colMean = new Float32Array(N), colHigh = new Float32Array(N), peaks = new Float32Array(N);
  let warmRow = 0;
  for (let k = 0; k < N; k++) {
    const mean = rowCnt[k] ? rowSum[k] / rowCnt[k] : 0;
    colMean[k] = mean / 32; // 0..1 = 0..32 °C
    columns[k] = Math.min(1, (rowCnt[k] / Math.max(1, rowPx[k])) * 2.2); // how much ocean is in this band
    colHigh[k] = rowWarmW[k] / Math.max(1, rowPx[k]);
    // Where the hottest water of this band is, west → east (falls back to warm water, then centre).
    peaks[k] = rowHotW[k] > 3 ? rowHotX[k] / rowHotW[k] / w : rowWarmW[k] ? rowWarmX[k] / rowWarmW[k] / w : 0.5;
    if (rowCnt[k] > rowPx[k] * 0.1 && colMean[k] > colMean[warmRow]) warmRow = k;
  }
  const total = w * h;
  const meanTemp = cnt ? sum / cnt : 0;
  return {
    level: Math.min(1, warm / Math.max(1, cnt) / 0.4), // share of warm water, scaled
    coverage: cnt / total,
    intensity: meanTemp / 32,
    energy: Math.min(1, cnt / total),
    high: cnt ? warm / cnt : 0,
    highCover: warm / total,
    hcx: warm ? wx / warm / w : null,
    hcy: warm ? wy / warm / h : null,
    cx: warm ? wx / warm / w : 0.5,
    cy: warm ? wy / warm / h : 0.5,
    columns,
    colMean,
    colHigh,
    colSum: warmCols,
    warmCols,
    hotCols,
    peaks,
    ocean: cnt / total,
    gain: 0,
    loss: 0,
    flashes: [],
    mask: lum, // reused as "previous frame" for the motion estimate
    meanTemp,
    coldShare: cnt ? cold / cnt : 0,
    // Latitude (degrees, + north) of the warmest band: it moves with the seasons.
    warmLat: 90 - ((warmRow + 0.5) / N) * 180,
    // Average change between frames inside the ocean = how much the currents are moving.
    motion: prevLum && cnt ? Math.min(1, motion / cnt / 14) : 0,
  };
}

/** Ocean and hemisphere name for a point of the equirectangular map (x, y in 0..1). */
export function oceanRegion(x, y) {
  const lon = x * 360 - 180;
  const lat = 90 - y * 180;
  let ocean;
  if (lat > 66) ocean = 'arctic';
  else if (lat < -55) ocean = 'southern';
  else if ((lon >= 20 && lon < 120 && lat < 30) || (lon >= 120 && lon < 147 && lat < -10)) ocean = 'indian';
  else if ((lon >= -70 && lon < 20) || (lon >= -100 && lon < -70 && lat > 8 && lat < 32)) ocean = 'atlantic';
  else ocean = 'pacific';
  const band = ocean === 'arctic' || ocean === 'southern' ? '' : Math.abs(lat) < 10 ? 'equatorial' : lat > 0 ? 'north' : 'south';
  return { ocean, band, lat, lon };
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
  if (vizId === 'ocean') return extractOcean(img, prevMask);
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
  if (vizId === 'ocean') return Math.max(0, seaTemp(r, g, b)) / 32;
  return CLASSIFIERS[vizId](r, g, b);
}

export function pixelKind(vizId, r, g, b) {
  if (vizId === 'ocean') return seaTemp(r, g, b) < 0 ? 'land' : null;
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
  if (viz.id === 'ocean') return { w: 160, h: 80 }; // 2:1 equirectangular map
  return viz.id === 'night-lights' ? { w: 320, h: 180 } : { w: 160, h: 90 };
}
