// Bilingual UI (Spanish / English). Judges evaluate in English, so every
// visible or spoken string exists in both languages.

export const STRINGS = {
  es: {
    appName: 'TerraBeats',
    tagline: 'La rocola de información de la Tierra',
    intro:
      'Escucha cómo cambia nuestro planeta. TerraBeats analiza en tiempo real cada fotograma de visualizaciones de la NASA y lo convierte en música, para que cualquier persona —también quien no puede ver— pueda explorar la ciencia de la Tierra.',
    skip: 'Saltar al reproductor',
    langLabel: 'Idioma',
    chooseTrack: 'Elige una pista',
    nowPlaying: 'Sonando',
    play: 'Reproducir',
    pause: 'Pausar',
    restart: 'Volver al inicio',
    volume: 'Volumen',
    speed: 'Velocidad',
    explore: 'Modo explorar',
    exploreOn: 'Explorar: activado',
    exploreHelp:
      'Modo explorar: pasa el puntero o usa las flechas sobre la imagen. Cada punto suena según su valor. Mayús + flechas = pasos grandes.',
    describe: 'Describir ahora',
    autoNarrate: 'Narración automática',
    voice: 'Voz integrada',
    haptics: 'Vibración (móvil)',
    record: 'Grabar audio',
    stopRecord: 'Detener grabación',
    download: 'Descargar grabación',
    recording: 'Grabando…',
    liveData: 'Datos en vivo',
    whatYouHear: 'Qué estás escuchando',
    aboutViz: 'Sobre esta visualización',
    source: 'Fuente: NASA Scientific Visualization Studio',
    howItWorks: 'Cómo funciona',
    howSteps: [
      'Fotogramas: el video de la NASA se reproduce y cada ~80 ms se copia un fotograma reducido a un lienzo (canvas).',
      'Visión por computadora: cada píxel se clasifica según la escala de colores oficial de la visualización (luz, rayo, CO₂, altura del bosque).',
      'Rasgos: se calculan cobertura, intensidad, posición (centroide), un perfil de 16 columnas y los cambios entre fotogramas.',
      'Sonido: los rasgos controlan sintetizadores en tiempo real (Tone.js). Las notas se ajustan a escalas musicales para que el resultado sea agradable.',
      'Accesibilidad: descripciones habladas, modo explorar con teclado, atajos, vibración y textos para lectores de pantalla.',
    ],
    shortcuts: 'Atajos de teclado',
    shortcutList: [
      ['Espacio', 'Reproducir / pausar'],
      ['1 – 4', 'Cambiar de pista'],
      ['E', 'Activar / desactivar modo explorar'],
      ['Flechas', 'Mover el cursor en modo explorar'],
      ['D', 'Describir lo que suena ahora'],
      ['L', 'Cambiar idioma'],
    ],
    meters: {
      coverage: 'Cobertura',
      intensity: 'Intensidad',
      energy: 'Energía total',
      position: 'Centro de actividad',
    },
    startHint: 'Pulsa Reproducir (o Espacio) para escuchar. Usa auriculares para oír el movimiento izquierda/derecha.',
    footer: 'Hecho para el NASA Space Apps Challenge 2026 · Reto “The Earth Information Jukebox” · Sede Cajamarca',
    credits: 'Visualizaciones: NASA/Goddard Space Flight Center Scientific Visualization Studio. NASA no respalda este proyecto.',
    levels: ['muy baja', 'baja', 'media', 'alta', 'muy alta'],
    flatH: ['el oeste', 'el centro', 'el este'],
    flatV: ['el norte', 'la franja central', 'el sur'],
    globeH: ['la izquierda', 'el centro', 'la derecha'],
    globeV: ['arriba', 'en medio', 'abajo'],
    nothing: 'Casi no hay señal en este fotograma.',
    narr: {
      'night-lights': (l, where, f) =>
        `Luz nocturna ${l}, más brillante hacia ${where}.` +
        (f.gain + f.loss > 0.0006
          ? f.gain > f.loss
            ? ' Predominan zonas que ganaron luz (morado).'
            : ' Predominan zonas que perdieron luz (naranja).'
          : ''),
      lightning: (l, where, f) => `Actividad de rayos ${l}: ${f.flashes.length} rayos nuevos, concentrados hacia ${where}.`,
      co2: (l, where) => `Concentración de CO₂ ${l}; las zonas más altas están hacia ${where}.`,
      'forest-height': (l, where, f) =>
        `Vegetación en el ${Math.round(f.coverage * 100)}% de la vista, altura media ${l}, más alta hacia ${where}. Océano: ${Math.round(f.ocean * 100)}%.`,
    },
    probe: {
      none: 'sin señal',
      ocean: 'océano',
      gain: 'ganó luz',
      loss: 'perdió luz',
      value: 'valor',
    },
    regions: [
      ['arriba a la izquierda', 'arriba al centro', 'arriba a la derecha'],
      ['al centro a la izquierda', 'al centro', 'al centro a la derecha'],
      ['abajo a la izquierda', 'abajo al centro', 'abajo a la derecha'],
    ],
  },
  en: {
    appName: 'TerraBeats',
    tagline: 'The Earth Information Jukebox',
    intro:
      'Hear our planet change. TerraBeats analyzes every frame of NASA visualizations in real time and turns it into music, so anyone — including people who cannot see — can explore Earth science.',
    skip: 'Skip to player',
    langLabel: 'Language',
    chooseTrack: 'Choose a track',
    nowPlaying: 'Now playing',
    play: 'Play',
    pause: 'Pause',
    restart: 'Restart',
    volume: 'Volume',
    speed: 'Speed',
    explore: 'Explore mode',
    exploreOn: 'Explore: on',
    exploreHelp:
      'Explore mode: move the pointer or use the arrow keys over the image. Each point sounds according to its value. Shift + arrows = big steps.',
    describe: 'Describe now',
    autoNarrate: 'Auto narration',
    voice: 'Built-in voice',
    haptics: 'Vibration (mobile)',
    record: 'Record audio',
    stopRecord: 'Stop recording',
    download: 'Download recording',
    recording: 'Recording…',
    liveData: 'Live data',
    whatYouHear: 'What you are hearing',
    aboutViz: 'About this visualization',
    source: 'Source: NASA Scientific Visualization Studio',
    howItWorks: 'How it works',
    howSteps: [
      'Frames: the NASA video plays and every ~80 ms a downsampled frame is copied to a canvas.',
      'Computer vision: each pixel is classified using the official colour scale of the visualization (light, lightning, CO₂, forest height).',
      'Features: coverage, intensity, position (centroid), a 16‑column profile and frame-to-frame changes are computed.',
      'Sound: the features drive synthesizers in real time (Tone.js). Notes are snapped to musical scales so the result stays pleasant.',
      'Accessibility: spoken descriptions, keyboard explore mode, shortcuts, vibration and screen-reader text.',
    ],
    shortcuts: 'Keyboard shortcuts',
    shortcutList: [
      ['Space', 'Play / pause'],
      ['1 – 4', 'Switch track'],
      ['E', 'Toggle explore mode'],
      ['Arrows', 'Move the cursor in explore mode'],
      ['D', 'Describe what is playing now'],
      ['L', 'Switch language'],
    ],
    meters: {
      coverage: 'Coverage',
      intensity: 'Intensity',
      energy: 'Total energy',
      position: 'Center of activity',
    },
    startHint: 'Press Play (or Space) to listen. Use headphones to hear left/right movement.',
    footer: 'Made for the 2026 NASA Space Apps Challenge · “The Earth Information Jukebox” challenge · Cajamarca',
    credits: 'Visualizations: NASA/Goddard Space Flight Center Scientific Visualization Studio. NASA does not endorse this project.',
    levels: ['very low', 'low', 'medium', 'high', 'very high'],
    flatH: ['the west', 'the center', 'the east'],
    flatV: ['the north', 'the middle latitudes', 'the south'],
    globeH: ['the left', 'the center', 'the right'],
    globeV: ['the top', 'the middle', 'the bottom'],
    nothing: 'There is almost no signal in this frame.',
    narr: {
      'night-lights': (l, where, f) =>
        `Night light ${l}, brightest toward ${where}.` +
        (f.gain + f.loss > 0.0006
          ? f.gain > f.loss
            ? ' Most changing areas gained light (purple).'
            : ' Most changing areas lost light (orange).'
          : ''),
      lightning: (l, where, f) => `Lightning activity ${l}: ${f.flashes.length} new flashes, concentrated toward ${where}.`,
      co2: (l, where) => `CO₂ concentration ${l}; the highest areas are toward ${where}.`,
      'forest-height': (l, where, f) =>
        `Vegetation covers ${Math.round(f.coverage * 100)}% of the view, average height ${l}, tallest toward ${where}. Ocean: ${Math.round(f.ocean * 100)}%.`,
    },
    probe: {
      none: 'no signal',
      ocean: 'ocean',
      gain: 'gained light',
      loss: 'lost light',
      value: 'value',
    },
    regions: [
      ['top left', 'top center', 'top right'],
      ['middle left', 'center', 'middle right'],
      ['bottom left', 'bottom center', 'bottom right'],
    ],
  },
};

const third = (v) => (v < 0.36 ? 0 : v < 0.64 ? 1 : 2);

/** A single scalar 0..1 summarising "how much" for each visualization. */
export function levelValue(_vizId, f) {
  return f.level;
}

export function levelIndex(v) {
  return v < 0.15 ? 0 : v < 0.35 ? 1 : v < 0.55 ? 2 : v < 0.8 ? 3 : 4;
}

export function describe(t, viz, f) {
  if (!f || f.coverage < 0.0005) return t.nothing;
  const l = t.levels[levelIndex(levelValue(viz.id, f))];
  const h = viz.flatMap ? t.flatH : t.globeH;
  const v = viz.flatMap ? t.flatV : t.globeV;
  const hx = third(f.cx);
  const vy = third(f.cy);
  const where = vy === 1 ? h[hx] : hx === 1 ? v[vy] : `${v[vy]} / ${h[hx]}`;
  return t.narr[viz.id](l, where, f);
}

export function regionName(t, x, y) {
  return t.regions[third(y)][third(x)];
}
