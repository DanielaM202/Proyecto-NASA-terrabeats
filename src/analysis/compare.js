import { STRINGS, levelIndex } from '../i18n.js';

// Compare two moments of the same track. A moment is the average of the last ~2 s of
// analysed frames, so one noisy frame does not decide the result.
export const WINDOW = 25;

/** The few numbers of one frame that are worth comparing. */
export function summarize(f) {
  return {
    level: f.level,
    cover: f.coverage,
    tall: f.highCover,
    meters: f.meanMeters || 0,
    temp: f.meanTemp || 0,
    lat: f.warmLat ?? 0,
    gain: f.gain || 0,
    loss: f.loss || 0,
  };
}

export function average(list) {
  const out = {};
  for (const k of Object.keys(list[0])) out[k] = list.reduce((s, x) => s + x[k], 0) / list.length;
  return out;
}

const pct = (v) => Math.round(v * 100);
const pct1 = (v) => (v * 100).toFixed(1).replace(/\.0$/, '');

// Sentences per language. a / b = averaged summaries of moment A and B.
const TEXT = {
  es: {
    head: (tA, tB) => `Momento A, segundo ${tA}, y momento B, segundo ${tB}.`,
    nothing: 'En uno de los dos momentos casi no hay señal en la imagen, así que no se pueden comparar.',
    more: 'más',
    less: 'menos',
    same: (what) => `${what}: casi igual.`,
    lat: (v) => `${Math.round(Math.abs(v))} grados ${v >= 0 ? 'norte' : 'sur'}`,
    'forest-height': (a, b, T) =>
      [
        Math.abs(a.tall - b.tall) >= 0.01
          ? `El bosque de más de treinta metros ocupa aproximadamente el ${pct(a.tall)} % de la imagen en A y el ${pct(b.tall)} % en B: hay ${b.tall > a.tall ? 'más' : 'menos'} bosque alto.`
          : T.same('Bosque alto'),
        a.meters > 0 && b.meters > 0 && Math.abs(a.meters - b.meters) >= 2 ? `La altura media de la vegetación pasa de unos ${Math.round(a.meters)} a unos ${Math.round(b.meters)} metros.` : '',
      ],
    ocean: (a, b, T) =>
      [
        Math.abs(a.temp - b.temp) >= 0.8
          ? `El agua visible pasa de unos ${Math.round(a.temp)} grados de media a unos ${Math.round(b.temp)}.`
          : `La temperatura media del agua es casi la misma, unos ${Math.round(b.temp)} grados.`,
        Math.abs(a.lat - b.lat) >= 3 ? `La franja más caliente se mueve de ${T.lat(a.lat)} a ${T.lat(b.lat)}.` : '',
      ],
    'night-lights': (a, b, T) =>
      [
        Math.abs(a.cover - b.cover) >= 0.005
          ? `La luz visible pasa del ${pct1(a.cover)} % al ${pct1(b.cover)} % de la imagen: ${b.cover > a.cover ? 'hay más luz' : 'hay menos luz'}.`
          : T.same('Luz visible'),
        b.gain - a.gain >= 0.002 ? 'Aparecen más lugares con luz nueva.' : '',
        b.loss - a.loss >= 0.002 ? 'Aparecen más lugares donde la luz se apagó.' : '',
      ],
    lightning: (a, b, T, L) => [
      levelIndex(a.level) === levelIndex(b.level)
        ? `La actividad de rayos es parecida en los dos momentos: ${L[levelIndex(b.level)]}.`
        : `La actividad de rayos pasa de ${L[levelIndex(a.level)]} a ${L[levelIndex(b.level)]}.`,
    ],
    co2: (a, b, T, L) => [
      levelIndex(a.level) === levelIndex(b.level)
        ? `La concentración de dióxido de carbono en la imagen es parecida: ${L[levelIndex(b.level)]}.`
        : `La concentración de dióxido de carbono en la imagen pasa de ${L[levelIndex(a.level)]} a ${L[levelIndex(b.level)]}.`,
    ],
    needFree: 'Para comparar, pon la pista en modo libre y pulsa M en el momento que quieras marcar.',
    markedA: (t) => `Momento A marcado en el segundo ${t}. Avanza y pulsa M otra vez para marcar el B y compararlos.`,
    cleared: 'Marcas borradas.',
    goto: (n, t) => `Vuelves al momento ${n}, segundo ${t}.`,
  },
  en: {
    head: (tA, tB) => `Moment A, second ${tA}, and moment B, second ${tB}.`,
    nothing: 'In one of the two moments there is almost no signal in the image, so they cannot be compared.',
    more: 'more',
    less: 'less',
    same: (what) => `${what}: almost the same.`,
    lat: (v) => `${Math.round(Math.abs(v))} degrees ${v >= 0 ? 'north' : 'south'}`,
    'forest-height': (a, b, T) =>
      [
        Math.abs(a.tall - b.tall) >= 0.01
          ? `Forest taller than thirty metres takes up roughly ${pct(a.tall)}% of the image in A and ${pct(b.tall)}% in B: there is ${b.tall > a.tall ? 'more' : 'less'} tall forest.`
          : T.same('Tall forest'),
        a.meters > 0 && b.meters > 0 && Math.abs(a.meters - b.meters) >= 2 ? `The average height of the vegetation goes from about ${Math.round(a.meters)} to about ${Math.round(b.meters)} metres.` : '',
      ],
    ocean: (a, b, T) =>
      [
        Math.abs(a.temp - b.temp) >= 0.8
          ? `The visible water goes from an average of about ${Math.round(a.temp)} degrees to about ${Math.round(b.temp)}.`
          : `The average water temperature is almost the same, about ${Math.round(b.temp)} degrees.`,
        Math.abs(a.lat - b.lat) >= 3 ? `The warmest band moves from ${T.lat(a.lat)} to ${T.lat(b.lat)}.` : '',
      ],
    'night-lights': (a, b, T) =>
      [
        Math.abs(a.cover - b.cover) >= 0.005
          ? `Visible light goes from ${pct1(a.cover)}% to ${pct1(b.cover)}% of the image: there is ${b.cover > a.cover ? 'more' : 'less'} light.`
          : T.same('Visible light'),
        b.gain - a.gain >= 0.002 ? 'More places with new light appear.' : '',
        b.loss - a.loss >= 0.002 ? 'More places where the light went out appear.' : '',
      ],
    lightning: (a, b, T, L) => [
      levelIndex(a.level) === levelIndex(b.level)
        ? `Lightning activity is similar in both moments: ${L[levelIndex(b.level)]}.`
        : `Lightning activity goes from ${L[levelIndex(a.level)]} to ${L[levelIndex(b.level)]}.`,
    ],
    co2: (a, b, T, L) => [
      levelIndex(a.level) === levelIndex(b.level)
        ? `The carbon dioxide concentration in the image is similar: ${L[levelIndex(b.level)]}.`
        : `The carbon dioxide concentration in the image goes from ${L[levelIndex(a.level)]} to ${L[levelIndex(b.level)]}.`,
    ],
    needFree: 'To compare, put the track in free mode and press M at the moment you want to mark.',
    markedA: (t) => `Moment A marked at second ${t}. Move on and press M again to mark B and compare them.`,
    cleared: 'Marks cleared.',
    goto: (n, t) => `Back to moment ${n}, second ${t}.`,
  },
};

export const compareStrings = (lang) => TEXT[lang];

/** The spoken comparison of two marked moments of one track. */
export function compareText(lang, vizId, A, B) {
  const T = TEXT[lang];
  if (A.sum.cover < 0.0005 || B.sum.cover < 0.0005) return `${T.head(A.t, B.t)} ${T.nothing}`;
  const levels = STRINGS[lang].levels;
  const parts = T[vizId](A.sum, B.sum, T, levels).filter(Boolean);
  return [T.head(A.t, B.t), ...parts].join(' ');
}
