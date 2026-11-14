// Curated playlist: one audio episode per story (narration + live sonification),
// recorded from the app in "episode mode". The challenge accepts "a curated
// collection of original, generated audio files accompanied by an explanation of
// the creative process" — this is that collection, inside the jukebox.
//
// files: languages with a pre-recorded MP3 in public/playlist/<id>-<lang>.mp3

export const PLAYLIST = {
  'forest-height': {
    files: [],
    process: {
      es: 'Leímos la barra de color "Height Above Ground" dibujada dentro del video de GEDI y convertimos cada píxel de vegetación en metros. La altura se vuelve altura musical en una escala pentatónica (siempre suena armónico). Los pájaros marcan el bosque de más de treinta metros y las olas el océano: sonidos que se entienden sin explicación.',
      en: 'We read the "Height Above Ground" colour bar drawn inside the GEDI video and turned each vegetation pixel into metres. Height becomes musical height on a pentatonic scale (it always sounds harmonious). Birds mark forest above thirty metres and waves mark the ocean: sounds that need no explanation.',
    },
  },
  ocean: {
    files: [],
    process: {
      es: 'Convertimos el color de cada corriente en grados Celsius con la barra oficial de la NASA (azul 0 °C, rojo 32 °C). Como el calor del mar depende de la latitud, el cabezal baja de polo a polo: el resultado es una forma que se oye, grave–aguda–grave. El hielo tintinea y el movimiento de las corrientes suena a agua que corre.',
      en: 'We turned the colour of each current into degrees Celsius with NASA’s official colour bar (blue 0 °C, red 32 °C). Because ocean heat depends on latitude, the playhead goes from pole to pole: the result is a shape you can hear, low–high–low. Ice tinkles and current motion sounds like running water.',
    },
  },
  'night-lights': {
    files: [],
    process: {
      es: 'Cada ciudad iluminada es una campanilla; más luz, más fuerte; más al norte, más aguda. En el mapa del cambio separamos el morado (luces nuevas) del naranja (luces apagadas): lo que crece sube, lo que se apaga cae. Usamos un solo mapa del video del EIC para que izquierda y derecha sean geografía real.',
      en: 'Each lit city is a chime; more light, louder; further north, higher. On the change map we separate purple (new lights) from orange (lights out): what grows rises, what goes out falls. We use a single map from the EIC video so that left and right are real geography.',
    },
  },
  lightning: {
    files: [],
    process: {
      es: 'Un rayo es un instante, así que es percusión. Comparamos cada fotograma con el anterior para detectar los rayos nuevos y los colocamos a izquierda o derecha según dónde aparecen. El trueno de fondo crece con la actividad total: con auriculares se oye moverse a las tormentas con las estaciones.',
      en: 'Lightning is an instant, so it is percussion. We compare each frame with the previous one to find new lightning and place it left or right where it appears. The background thunder grows with total activity: with headphones you can hear the storms move with the seasons.',
    },
  },
  co2: {
    files: [],
    process: {
      es: 'No quisimos una alarma: el dióxido de carbono alto se oye como tensión musical. Un acorde consonante se desafina y se oscurece a medida que crecen las zonas naranjas y rojas, y un latido se acelera. Así el mapa "late" con el día y la noche, como explica la NASA.',
      en: 'We did not want an alarm: high carbon dioxide is heard as musical tension. A consonant chord detunes and darkens as the orange and red areas grow, and a heartbeat speeds up. That way the map "pulses" with day and night, as NASA explains.',
    },
  },
};
