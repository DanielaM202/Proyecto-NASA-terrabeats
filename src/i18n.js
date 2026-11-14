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
    quizHint: 'Responde con la flecha izquierda o derecha (o los botones).',
    left: 'Izquierda',
    right: 'Derecha',
    quizAnswer: (ans, side, pct, measure) => {
      const s = side === 'left' ? 'izquierda' : 'derecha';
      if (pct == null) return 'En este momento casi no hay señal en la imagen.';
      if (pct < 56) return 'Muy parejo: está repartido casi por igual entre los dos lados.';
      if (!ans) return `Te lo digo: el ${pct} % ${measure} está a la ${s}.`;
      return ans === side
        ? `¡Correcto! El ${pct} % ${measure} está a la ${s}.`
        : `Casi. Escucha otra vez: el ${pct} % ${measure} está a la ${s}.`;
    },
    help: 'Ayuda hablada',
    moreOptions: 'Más opciones (volumen, velocidad, voz, grabar)',
    phases: ['Leyenda', 'Recorrido', 'Cierre', 'Explora tú'],
    findMax: 'Buscar el valor más alto',
    foundMax: (what) => `Valor más alto en esta imagen: ${what}`,
    repeat: 'Repetir la última frase',
    edge: 'Borde de la imagen',
    story: 'Historia sonora',
    storyPlay: 'Escuchar la historia',
    storyStop: 'Detener historia',
    storyPause: 'Pausar historia',
    storyResume: 'Continuar historia',
    freePlay: 'Modo libre',
    storyHint: 'Recomendado: escucha la historia guiada con auriculares. Espacio = pausa, Esc = detener.',
    legend: 'Leyenda auditiva',
    legendPlay: 'Escuchar la leyenda',
    legendStop: 'Detener leyenda',
    legendHelp: 'Antes de escuchar, conoce cada sonido: se reproduce aislado y con su nombre.',
    legendIntro: (title) => `Leyenda auditiva de ${title}. Escucharás cada sonido por separado.`,
    legendEnd: 'Fin de la leyenda. Pulsa espacio para escuchar la pista completa.',
    autoNarrate: 'Narración automática',
    voice: 'Voz integrada (apágala si usas lector de pantalla)',
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
      'Accesibilidad: historia narrada, preguntas, modo explorar con teclado y voz, atajos, vibración y textos para lectores de pantalla.',
      'Honestidad con los datos: los valores salen de los colores de la visualización, no de los datos científicos originales. Son aproximados y relativos; los hechos narrados provienen de las páginas de la NASA de cada visualización.',
    ],
    shortcuts: 'Atajos de teclado',
    shortcutList: [
      ['Espacio', 'Escuchar la historia / pausar'],
      ['P', 'Modo libre (sin narración)'],
      ['Esc', 'Detener historia o leyenda'],
      ['1 – 4', 'Cambiar de pista'],
      ['G', 'Escuchar / detener la leyenda auditiva'],
      ['E', 'Activar / desactivar modo explorar'],
      ['Flechas', 'Mover el cursor en modo explorar'],
      ['F', 'Ir al valor más alto de la imagen'],
      ['R', 'Repetir la última frase del narrador'],
      ['H', 'Escuchar la ayuda'],
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
      lightning: (l, where) => `Actividad de rayos ${l} en la imagen, concentrada hacia ${where}.`,
      co2: (l, where) => `Concentración de CO₂ ${l}; las zonas más altas están hacia ${where}.`,
      'forest-height': (l, where, f, whereHigh) =>
        `Vegetación en el ${Math.round(f.coverage * 100)}% de la vista, con una altura media aproximada de ${Math.round(f.meanMeters)} metros según la escala de color. ` +
        (whereHigh ? `Los bosques de más de 30 metros están hacia ${whereHigh}.` : 'No se ven bosques de más de 30 metros.') +
        ` Océano: ${Math.round(f.ocean * 100)}% de la vista.`,
    },
    probe: {
      forest: (m) => `bosque de unos ${m} metros`,
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
    quizHint: 'Answer with the left or right arrow key (or the buttons).',
    left: 'Left',
    right: 'Right',
    quizAnswer: (ans, side, pct, measure) => {
      if (pct == null) return 'Right now there is almost no signal in the image.';
      if (pct < 56) return 'Very even: it is split almost equally between both sides.';
      if (!ans) return `Here is the answer: ${pct}% of ${measure} is on the ${side}.`;
      return ans === side
        ? `Correct! ${pct}% of ${measure} is on the ${side}.`
        : `Close. Listen again: ${pct}% of ${measure} is on the ${side}.`;
    },
    help: 'Spoken help',
    moreOptions: 'More options (volume, speed, voice, record)',
    phases: ['Legend', 'Tour', 'Wrap-up', 'Your turn'],
    findMax: 'Find the highest value',
    foundMax: (what) => `Highest value in this image: ${what}`,
    repeat: 'Repeat the last sentence',
    edge: 'Edge of the image',
    story: 'Sound story',
    storyPlay: 'Listen to the story',
    storyStop: 'Stop story',
    storyPause: 'Pause story',
    storyResume: 'Resume story',
    freePlay: 'Free mode',
    storyHint: 'Recommended: listen to the guided story with headphones. Space = pause, Esc = stop.',
    legend: 'Audio legend',
    legendPlay: 'Play the legend',
    legendStop: 'Stop legend',
    legendHelp: 'Before listening, meet each sound: it plays on its own, with its name.',
    legendIntro: (title) => `Audio legend for ${title}. You will hear each sound on its own.`,
    legendEnd: 'End of the legend. Press space to listen to the full track.',
    autoNarrate: 'Auto narration',
    voice: 'Built-in voice (turn off with a screen reader)',
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
      'Accessibility: narrated story, questions, keyboard and voice explore mode, shortcuts, vibration and screen-reader text.',
      'Data honesty: values come from the colours of the visualization, not from the original science data. They are approximate and relative; the narrated facts come from NASA’s page for each visualization.',
    ],
    shortcuts: 'Keyboard shortcuts',
    shortcutList: [
      ['Space', 'Listen to the story / pause'],
      ['P', 'Free mode (no narration)'],
      ['Esc', 'Stop story or legend'],
      ['1 – 4', 'Switch track'],
      ['G', 'Play / stop the audio legend'],
      ['E', 'Toggle explore mode'],
      ['Arrows', 'Move the cursor in explore mode'],
      ['F', 'Jump to the highest value in the image'],
      ['R', 'Repeat the narrator’s last sentence'],
      ['H', 'Hear the help'],
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
      lightning: (l, where) => `Lightning activity in the image is ${l}, concentrated toward ${where}.`,
      co2: (l, where) => `CO₂ concentration ${l}; the highest areas are toward ${where}.`,
      'forest-height': (l, where, f, whereHigh) =>
        `Vegetation covers ${Math.round(f.coverage * 100)}% of the view, with an approximate average height of ${Math.round(f.meanMeters)} metres from the colour scale. ` +
        (whereHigh ? `Forests taller than 30 metres are toward ${whereHigh}.` : 'No forests taller than 30 metres are in view.') +
        ` Ocean: ${Math.round(f.ocean * 100)}% of the view.`,
    },
    probe: {
      forest: (m) => `forest about ${m} metres tall`,
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
  const place = (x, y) => {
    const a = third(x);
    const b = third(y);
    return b === 1 ? h[a] : a === 1 ? v[b] : `${v[b]} / ${h[a]}`;
  };
  const whereHigh = f.hcx != null && f.highCover > 0.002 ? place(f.hcx, f.hcy) : null;
  return t.narr[viz.id](l, place(f.cx, f.cy), f, whereHigh);
}

export function regionName(t, x, y) {
  return t.regions[third(y)][third(x)];
}

// ---------------------------------------------------------------------------
// Live remarks: short sentences generated from the data of the current frame,
// spoken between the scripted lines so the story reacts to what is on screen.
const SIDES = {
  es: { left: 'a tu izquierda', right: 'a tu derecha', center: 'al centro' },
  en: { left: 'on your left', right: 'on your right', center: 'in the middle' },
};
const sideOf = (x) => (x == null ? 'center' : x < 0.4 ? 'left' : x > 0.6 ? 'right' : 'center');

export function liveRemark(lang, vizId, f) {
  if (!f) return null;
  const es = lang === 'es';
  const S = SIDES[lang];
  switch (vizId) {
    case 'forest-height': {
      if (f.highCover > 0.012 && f.hcx != null) {
        const sd = sideOf(f.hcx);
        return { key: `tall-${sd}`, text: es ? `Ahora: bosque de más de treinta metros ${S[sd]}. Escucha los pájaros.` : `Now: forest over thirty metres ${S[sd]}. Listen to the birds.` };
      }
      if (f.ocean > 0.5) return { key: 'ocean', text: es ? 'Ahora casi todo es océano.' : 'Now it is almost all ocean.' };
      if (f.coverage > 0.08 && f.meanMeters < 9) {
        const sd = sideOf(f.cx);
        return { key: `low-${sd}`, text: es ? `Vegetación baja ${S[sd]}: notas graves, unos ${Math.round(f.meanMeters)} metros.` : `Short vegetation ${S[sd]}: low notes, about ${Math.round(f.meanMeters)} metres.` };
      }
      return null;
    }
    case 'night-lights': {
      if (f.gain > 0.0008 && f.gain >= f.loss) return { key: 'gain', text: es ? 'Ahora suenan más zonas que ganaron luz.' : 'More areas that gained light are sounding now.' };
      if (f.loss > 0.0008) return { key: 'loss', text: es ? 'Ahora suenan zonas que perdieron luz.' : 'Areas that lost light are sounding now.' };
      if (f.level > 0.5) {
        const sd = sideOf(f.cx);
        return { key: `bright-${sd}`, text: es ? `Mucha luz ${S[sd]}.` : `A lot of light ${S[sd]}.` };
      }
      return null;
    }
    case 'lightning': {
      const n = f.flashes.length;
      if (n >= 40) {
        const x = f.flashes.reduce((a, b) => a + b.x, 0) / n;
        const sd = sideOf(x);
        return { key: `burst-${sd}`, text: es ? `¡Ráfaga de rayos nuevos ${S[sd]}!` : `A burst of new lightning ${S[sd]}!` };
      }
      if (f.level < 0.04) return { key: 'quiet', text: es ? 'Casi no hay rayos en esta zona.' : 'Almost no lightning in this area.' };
      return null;
    }
    case 'co2': {
      if (f.level > 0.55) {
        const sd = sideOf(f.hcx ?? f.cx);
        return { key: `high-${sd}`, text: es ? `Concentración alta ${S[sd]}: el latido se acelera.` : `High concentration ${S[sd]}: the heartbeat speeds up.` };
      }
      if (f.level < 0.2) return { key: 'low', text: es ? 'La atmósfera se calma: el acorde se relaja.' : 'The atmosphere calms down: the chord relaxes.' };
      return null;
    }
    default:
      return null;
  }
}
