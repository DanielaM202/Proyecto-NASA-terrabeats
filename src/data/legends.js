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
  ocean: [
    {
      key: 'sweep',
      es: 'El cabezal baja del polo norte al polo sur. Cada nota es la temperatura del agua en esa franja: fría y grave en los polos, cálida y aguda en el ecuador.',
      en: 'The playhead goes down from the North Pole to the South Pole. Each note is the water temperature of that band: cold and low at the poles, warm and high at the equator.',
    },
    {
      key: 'cold',
      es: 'Nota grave: agua a un grado, casi congelada.',
      en: 'Low note: water at one degree, almost frozen.',
    },
    {
      key: 'warm',
      es: 'Nota aguda: agua a treinta grados.',
      en: 'High note: water at thirty degrees.',
    },
    {
      key: 'ice',
      es: 'Cristales de hielo: agua polar, a cinco grados o menos.',
      en: 'Ice crystals: polar water, at five degrees or less.',
    },
    {
      key: 'flow',
      es: 'Agua que corre: cuanto más se mueven las corrientes, más fuerte suena.',
      en: 'Running water: the more the currents move, the louder it sounds.',
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

// The "why" behind each artistic choice (the challenge asks teams to share it).
// Shown under each legend item.
export const WHY = {
  'forest-height': {
    ruler: {
      es: 'Altura real se vuelve altura musical: es la relación más directa que existe entre un dato y un sonido.',
      en: 'Real height becomes musical height: the most direct link there is between a number and a sound.',
    },
    low: { es: 'Lo bajo suena grave, como lo esperamos de forma natural.', en: 'Short sounds low, as we naturally expect.' },
    high: { es: 'Lo alto suena agudo: el oído "mira hacia arriba".', en: 'Tall sounds high: the ear "looks up".' },
    birds: {
      es: 'Un sonido que cualquiera reconoce sin explicación: donde el dosel es alto, hay vida.',
      en: 'A sound anyone recognises without explanation: where the canopy is tall, there is life.',
    },
    waves: { es: 'El océano no tiene bosque: en vez de silencio, le dimos su propio sonido.', en: 'The ocean has no forest: instead of silence, we gave it its own sound.' },
  },
  ocean: {
    sweep: {
      es: 'El calor del mar depende de la latitud, por eso recorremos de polo a polo y no de oeste a este.',
      en: 'Ocean heat depends on latitude, so we sweep from pole to pole and not from west to east.',
    },
    cold: { es: 'Frío = grave y oscuro.', en: 'Cold = low and dark.' },
    warm: { es: 'Cálido = agudo y brillante.', en: 'Warm = high and bright.' },
    ice: { es: 'El hielo tintinea: un icono sonoro del agua polar.', en: 'Ice tinkles: a sound icon for polar water.' },
    flow: { es: 'El movimiento de las corrientes se oye como agua que corre, sin traducción.', en: 'The motion of the currents is heard as running water, no translation needed.' },
  },
  'night-lights': {
    chimes: {
      es: 'Cada ciudad es un punto de luz; una campanilla es un punto de sonido.',
      en: 'Each city is a point of light; a chime is a point of sound.',
    },
    gain: { es: 'Lo que crece, sube.', en: 'What grows, rises.' },
    loss: { es: 'Lo que se apaga, cae.', en: 'What goes out, falls.' },
    pad: { es: 'Un fondo que se llena como se llena de luz el planeta.', en: 'A background that fills up as the planet fills with light.' },
  },
  lightning: {
    drops: { es: 'Un rayo es un instante: por eso es percusión y no una nota larga.', en: 'Lightning is an instant: that is why it is percussion and not a long note.' },
    crack: { es: 'Muchos rayos juntos suenan como el chasquido de una descarga.', en: 'Many flashes together sound like the crack of a discharge.' },
    rumble: { es: 'El trueno acompaña a la tormenta: crece con ella.', en: 'Thunder follows the storm: it grows with it.' },
  },
  co2: {
    calm: { es: 'Una atmósfera en equilibrio suena en armonía.', en: 'An atmosphere in balance sounds in harmony.' },
    tense: {
      es: 'No usamos una alarma: la tensión musical transmite la urgencia sin asustar.',
      en: 'We do not use an alarm: musical tension conveys urgency without scaring.',
    },
    heart: { es: 'El planeta como un cuerpo vivo: su pulso se acelera con el dióxido de carbono.', en: 'The planet as a living body: its pulse speeds up with carbon dioxide.' },
  },
};
