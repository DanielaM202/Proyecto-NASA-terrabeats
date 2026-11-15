// Real geography for the ocean map: which sea or ocean is at a longitude/latitude.
// Data: Natural Earth 1:50m marine polygons (public domain), simplified to 0.1°.
// Seas, bays and gulfs come before the big oceans, so a point in the Black Sea is
// "Black Sea" and not "Pacific Ocean" (the previous version used rough boxes).
import MARINE from '../data/marine.json';

const BOXES = MARINE.map((f) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of f.r) {
    for (let i = 0; i < r.length; i += 2) {
      if (r[i] < x0) x0 = r[i];
      if (r[i] > x1) x1 = r[i];
      if (r[i + 1] < y0) y0 = r[i + 1];
      if (r[i + 1] > y1) y1 = r[i + 1];
    }
  }
  return [x0, y0, x1, y1];
});

// Ray casting on a flat ring [x0, y0, x1, y1, ...].
function inRing(r, x, y) {
  let inside = false;
  for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
    const xi = r[i], yi = r[i + 1], xj = r[j], yj = r[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** The smallest named water body containing the point, or null. */
export function placeAt(lon, lat) {
  for (let i = 0; i < MARINE.length; i++) {
    const b = BOXES[i];
    if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
    let inside = false;
    for (const r of MARINE[i].r) if (inRing(r, lon, lat)) inside = !inside; // outer rings and holes
    if (inside) return { es: MARINE[i].n[0], en: MARINE[i].n[1], cls: MARINE[i].c, lat, lon };
  }
  return null;
}

/** Longitude / latitude of a point of the equirectangular ocean map (x, y in 0..1). */
export const lonLat = (x, y) => ({ lon: x * 360 - 180, lat: 90 - y * 180 });

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Spoken name of the place. Oceans get a band (north / equatorial / south) because
 * the question "where in the ocean" matters for temperature; seas and bays use their name.
 */
export function placeLabel(p, lang, bands) {
  if (!p) return lang === 'es' ? 'Agua' : 'Water';
  if (p.cls !== 'ocean') return cap(p[lang]);
  const polar = /Ártico|Antártico|Arctic|Southern/i.test(p[lang]);
  if (polar) return cap(p[lang]);
  const band = Math.abs(p.lat) < 10 ? 'equatorial' : p.lat > 0 ? 'north' : 'south';
  if (lang === 'es') return `${cap(p.es)} ${bands[band]}`;
  const base = p.en.replace(/^(North|South) /, '');
  return `${bands[band]} ${base}`;
}
