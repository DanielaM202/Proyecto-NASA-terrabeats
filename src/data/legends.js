// Auditory legend: before listening, each sound is played on its own and named,
// so a person who cannot see the image knows what every sound means.
// `key` is the demo the audio engine plays (engine.demo(key)).

export const LEGENDS = {
  'forest-height': [
    {
      key: 'ruler',
      es: 'Cada nota es la altura del bosque: de cero a cincuenta metros, de grave a agudo.',
      en: 'Each note is the height of the forest: from zero to fifty metres, from low to high.',
    },
    {
      key: 'low',
      es: 'Nota grave: vegetación baja, de unos dos metros.',
      en: 'Low note: short vegetation, about two metres.',
    },
    {
      key: 'high',
      es: 'Nota aguda: árboles de unos cuarenta y cinco metros.',
      en: 'High note: trees about forty-five metres tall.',
    },
    {
      key: 'birds',
      es: 'Pájaros: bosque de más de treinta metros en esa zona.',
      en: 'Birds: forest taller than thirty metres in that area.',
    },
    {
      key: 'waves',
      es: 'Olas: océano a la vista.',
      en: 'Waves: ocean in view.',
    },
  ],
  'night-lights': [
    {
      key: 'chimes',
      es: 'Campanillas: cada una es una región iluminada. Más luz, más fuerte. Más al norte, más aguda.',
      en: 'Chimes: each one is a lit region. More light, louder. Further north, higher pitch.',
    },
    {
      key: 'gain',
      es: 'Destellos que suben: lugares que ganaron luz entre 2012 y 2023.',
      en: 'Rising sparkles: places that gained light between 2012 and 2023.',
    },
    {
      key: 'loss',
      es: 'Notas graves que bajan: lugares que perdieron luz.',
      en: 'Falling low notes: places that lost light.',
    },
    {
      key: 'pad',
      es: 'Acorde de fondo: crece con la luz total del planeta.',
      en: 'Background chord: it grows with the planet’s total light.',
    },
  ],
  lightning: [
    {
      key: 'drops',
      es: 'Golpes cortos: rayos nuevos. Suenan a la izquierda o a la derecha según dónde caen; más agudos si caen más al norte.',
      en: 'Short hits: new lightning. They sound left or right depending on where they strike; higher if further north.',
    },
    {
      key: 'crack',
      es: 'Chasquido: una ráfaga de muchos rayos a la vez.',
      en: 'Crack: a burst of many flashes at once.',
    },
    {
      key: 'rumble',
      es: 'Trueno de fondo: crece con la actividad eléctrica total.',
      en: 'Background thunder: grows with total electrical activity.',
    },
  ],
  co2: [
    {
      key: 'calm',
      es: 'Atmósfera con poco dióxido de carbono: un acorde limpio y tranquilo.',
      en: 'Atmosphere with little carbon dioxide: a clean, calm chord.',
    },
    {
      key: 'tense',
      es: 'Con mucho dióxido de carbono, el acorde se desafina y se vuelve tenso.',
      en: 'With a lot of carbon dioxide, the chord detunes and becomes tense.',
    },
    {
      key: 'heart',
      es: 'Latido: se acelera cuando la concentración sube.',
      en: 'Heartbeat: it speeds up as concentration rises.',
    },
  ],
};
