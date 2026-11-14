// Catalog of NASA Earth Information Center (EIC) visualizations used by the jukebox.
// Videos were downloaded from NASA's Scientific Visualization Studio (SVS) and
// re-encoded at web resolution so the browser can read their pixels (same origin).

export const VISUALIZATIONS = [
  {
    id: 'night-lights',
    svsId: 5313,
    svsUrl: 'https://svs.gsfc.nasa.gov/5313/',
    video: '/media/night-lights.mp4',
    poster: '/media/night-lights.jpg',
    aspect: '32 / 9',
    flatMap: true,
    title: {
      es: 'Luces nocturnas 2012–2023',
      en: 'Night Lights 2012–2023',
    },
    short: {
      es: 'Ciudades que crecen y se apagan, vistas desde el espacio.',
      en: 'Cities growing and dimming, seen from space.',
    },
    description: {
      es: 'Mapa plano del mundo de noche. Primero muestra los promedios anuales de luz artificial de 2012 a 2023; luego revela el cambio: el morado indica zonas con más luz y el naranja zonas con menos luz. Termina con acercamientos a India, Ucrania, Europa Occidental y el Mediterráneo oriental.',
      en: 'A flat world map at night. It first shows yearly averages of artificial light from 2012 to 2023, then reveals the change: purple marks places with more light and orange places with less light. It ends with close-ups of India, Ukraine, Western Europe and the Eastern Mediterranean.',
    },
    legend: {
      es: [
        'Un cabezal recorre el mapa de oeste a este: lo oyes moverse de izquierda a derecha.',
        'Cada campanilla es una región iluminada; más luz = nota más fuerte.',
        'La altura de la nota sigue la latitud: norte = agudo, sur = grave.',
        'El acorde de fondo crece con la luz total del planeta.',
        'Brillos agudos ascendentes = más luz (morado). Notas graves descendentes = menos luz (naranja).',
      ],
      en: [
        'A playhead sweeps the map west to east: you hear it travel left to right.',
        'Each chime is a lit region; more light = louder note.',
        'Pitch follows latitude: north = high, south = low.',
        'The background chord swells with the planet’s total light.',
        'Rising high sparkles = more light (purple). Falling low notes = less light (orange).',
      ],
    },
  },
  {
    id: 'lightning',
    svsId: 5011,
    svsUrl: 'https://svs.gsfc.nasa.gov/5011/',
    video: '/media/lightning.mp4',
    poster: '/media/lightning.jpg',
    aspect: '16 / 9',
    title: {
      es: 'Rayos detectados desde la EEI 2017–2023',
      en: 'Lightning Seen from the ISS 2017–2023',
    },
    short: {
      es: 'Tormentas eléctricas convertidas en percusión.',
      en: 'Thunderstorms turned into percussion.',
    },
    description: {
      es: 'Globo terrestre con los rayos detectados por el sensor LIS de la Estación Espacial Internacional entre 2017 y 2023, en una ventana móvil de 10 días. Cada punto amarillo es un rayo. Se ve cómo las tormentas siguen a las estaciones: África central, Sudamérica, el sudeste asiático y Norteamérica en verano.',
      en: 'A globe showing lightning detected by the LIS sensor on the International Space Station from 2017 to 2023, in a 10‑day rolling window. Each yellow dot is a lightning flash. Storms follow the seasons: Central Africa, South America, Southeast Asia and North America in summer.',
    },
    legend: {
      es: [
        'Cada golpe de percusión corresponde a rayos nuevos que aparecen en la imagen.',
        'Posición izquierda/derecha del rayo = sonido a la izquierda/derecha.',
        'Rayos al norte suenan más agudos; al sur, más graves.',
        'El trueno grave de fondo crece con la cantidad total de rayos.',
      ],
      en: [
        'Each percussive hit corresponds to new lightning appearing in the image.',
        'Left/right position of the flash = sound on the left/right.',
        'Northern flashes sound higher; southern ones lower.',
        'The low thunder rumble grows with the total amount of lightning.',
      ],
    },
  },
  {
    id: 'co2',
    svsId: 5196,
    svsUrl: 'https://svs.gsfc.nasa.gov/5196/',
    video: '/media/co2.mp4',
    poster: '/media/co2.jpg',
    aspect: '16 / 9',
    title: {
      es: 'Dióxido de carbono global (DYAMOND)',
      en: 'Global Carbon Dioxide (DYAMOND)',
    },
    short: {
      es: 'El CO₂ se escucha como tensión creciente.',
      en: 'CO₂ heard as rising tension.',
    },
    description: {
      es: 'Modelo de alta resolución del CO₂ atmosférico de enero a marzo de 2020, con la cámara girando alrededor de la Tierra. Gris y beige indican concentración baja; naranja y rojo, concentración alta, por ejemplo por incendios y actividad industrial en Asia, África y Sudamérica.',
      en: 'A high‑resolution model of atmospheric CO₂ from January to March 2020, with the camera orbiting Earth. Grey and tan mean low concentration; orange and red mean high concentration, for example from fires and industry in Asia, Africa and South America.',
    },
    legend: {
      es: [
        'Un acorde sostenido representa la atmósfera: limpio y consonante con poco CO₂.',
        'Con más CO₂ (naranja/rojo) el acorde se desafina y se vuelve disonante.',
        'Un latido grave acelera cuando la concentración sube.',
        'Una melodía recorre el globo: las notas suenan donde hay emisiones altas.',
      ],
      en: [
        'A sustained chord stands for the atmosphere: clean and consonant with little CO₂.',
        'With more CO₂ (orange/red) the chord detunes and becomes dissonant.',
        'A low heartbeat speeds up as concentration rises.',
        'A melody sweeps the globe: notes play where emissions are high.',
      ],
    },
  },
  {
    id: 'forest-height',
    svsId: 4950,
    svsUrl: 'https://svs.gsfc.nasa.gov/4950/',
    video: '/media/forest-height.mp4',
    poster: '/media/forest-height.jpg',
    aspect: '16 / 9',
    title: {
      es: 'Altura de los bosques (GEDI)',
      en: 'Forest Height (GEDI)',
    },
    short: {
      es: 'Árboles más altos, notas más agudas.',
      en: 'Taller trees, higher notes.',
    },
    description: {
      es: 'Globo giratorio con la altura del dosel forestal medida por el láser GEDI de la Estación Espacial Internacional (abril 2019 – abril 2020). El marrón y verde oscuro son vegetación baja; el verde brillante y blanco, bosques altos como la Amazonía o el Congo. El océano es azul. La altura está exagerada.',
      en: 'A rotating globe of forest canopy height measured by the GEDI laser on the International Space Station (April 2019 – April 2020). Brown and dark green are short vegetation; bright green and white are tall forests such as the Amazon or the Congo. The ocean is blue. Height is exaggerated.',
    },
    legend: {
      es: [
        'Una cuerda pulsada recorre el globo de izquierda a derecha.',
        'Bosque más alto = nota más aguda; vegetación baja = nota grave.',
        'Más tierra con vegetación = acorde de fondo más lleno.',
        'El rumor de olas sube cuando el océano domina la vista.',
      ],
      en: [
        'A plucked string sweeps the globe from left to right.',
        'Taller forest = higher note; short vegetation = lower note.',
        'More vegetated land = fuller background chord.',
        'The sound of waves rises when the ocean fills the view.',
      ],
    },
  },
];
