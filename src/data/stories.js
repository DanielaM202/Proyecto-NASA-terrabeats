// Guided sound stories: a question, an audio legend, narration synced to the NASA video,
// a contrast you can hear and a closing fact. Every line has an audio file at
// /narration/<lang>/<id>.mp3 (see scripts/build-narration-kokoro.py).
//
// intro / outro steps: { id, es, en, demo? }  demo = engine sound played after the line
// cues:                { id, t, es, en }      t = video time (s) when the line starts

export const STORIES = {
  'forest-height': {
    // Spoken when the track is selected, for people who cannot see the menu.
    menu: {
      id: 'forest-menu',
      es: 'Bosques. ¿Dónde están los bosques más altos que midió la NASA? Pulsa espacio para escuchar la historia.',
      en: 'Forests. Where are the tallest forests NASA measured? Press space to hear the story.',
    },
    question: {
      es: '¿Dónde están los bosques más altos que midió la NASA?',
      en: 'Where are the tallest forests NASA measured?',
    },
    intro: [
      {
        id: 'forest-intro-1',
        es: '¿Dónde están los bosques más altos que midió la NASA? Vamos a escucharlo dando una vuelta completa a la Tierra.',
        en: 'Where are the tallest forests NASA measured? Let’s listen as we travel once around the Earth.',
      },
      {
        id: 'forest-intro-2',
        es: 'Cada nota es la altura del bosque: cuanto más aguda, más alto el árbol. Así suena un arbusto de dos metros.',
        en: 'Each note is the height of the forest: the higher the note, the taller the tree. This is a two‑metre shrub.',
        demo: 'low',
      },
      {
        id: 'forest-intro-3',
        es: 'Y así suena un árbol de cuarenta y cinco metros.',
        en: 'And this is a forty‑five‑metre tree.',
        demo: 'high',
      },
      {
        id: 'forest-intro-4',
        es: 'Los pájaros significan bosque muy alto: solo cantan donde supera los treinta metros. Si no los oyes, el bosque es más bajo.',
        en: 'Birds mean very tall forest: they only sing where it is taller than thirty metres. If you do not hear them, the forest is shorter.',
        demo: 'birds',
      },
      {
        id: 'forest-intro-5',
        es: 'Y las olas significan océano: donde no hay tierra. Empezamos.',
        en: 'And waves mean ocean: where there is no land. Let’s begin.',
        demo: 'waves',
      },
    ],
    cues: [
      {
        id: 'forest-cue-asia',
        t: 0.3,
        es: 'Sudeste asiático y Australia. Las islas de Indonesia suenan agudas; Australia, grave: matorral y desierto.',
        en: 'Southeast Asia and Australia. The islands of Indonesia sound high; Australia sounds low: shrubland and desert.',
      },
      {
        id: 'forest-cue-india',
        t: 8.5,
        es: 'Ahora la India y el océano Índico.',
        en: 'Now India and the Indian Ocean.',
      },
      {
        id: 'forest-cue-sahara',
        t: 13.5,
        es: 'Llega África. Arriba, el Sahara: pocas notas y graves, porque casi no hay vegetación.',
        en: 'Here comes Africa. At the top, the Sahara: few, low notes, because there is almost no vegetation.',
      },
      {
        id: 'forest-cue-congo',
        t: 19.3,
        es: 'En el centro, la selva del Congo: muchas más notas, porque hay más vegetación. Los pájaros marcan el bosque más alto.',
        en: 'In the middle, the Congo rainforest: many more notes, because there is more vegetation. Birds mark the tallest forest.',
      },
      {
        id: 'forest-quiz',
        t: 24.6,
        quiz: { metric: 'high', measure: { es: 'del bosque alto visible', en: 'the tall forest in view' } },
        es: 'Pregunta. Escucha los pájaros. ¿Se ve más bosque alto a la izquierda, en Sudamérica, o a la derecha, en África? Responde con la flecha izquierda o la flecha derecha.',
        en: 'Question. Listen to the birds. Is there more tall forest in view on the left, in South America, or on the right, in Africa? Answer with the left arrow or the right arrow.',
      },
      {
        id: 'forest-cue-amazon',
        t: 25.5,
        es: 'Cruzamos el Atlántico. Sudamérica: la Amazonía, el bosque tropical más grande del mundo.',
        en: 'We cross the Atlantic. South America: the Amazon, the largest tropical forest in the world.',
      },
      {
        id: 'forest-cue-namerica',
        t: 33,
        es: 'Centroamérica y Norteamérica.',
        en: 'Central and North America.',
      },
      {
        id: 'forest-cue-pacific',
        t: 38.5,
        es: 'Y el océano Pacífico: suenan las olas y casi ninguna nota, porque casi no hay tierra.',
        en: 'And the Pacific Ocean: you hear waves and almost no notes, because there is almost no land.',
      },
      {
        id: 'forest-cue-back',
        t: 46,
        es: 'Volvemos a Asia. Vuelta completa.',
        en: 'Back to Asia. Full circle.',
      },
    ],
    outro: [
      {
        id: 'forest-outro-1',
        es: 'Lo que escuchaste: en esta vuelta, los bosques más altos sonaron en la Amazonía, el Congo y el sudeste asiático. Los desiertos sonaron graves y los océanos solo trajeron olas.',
        en: 'What you heard: on this trip, the tallest forests sounded in the Amazon, the Congo and Southeast Asia. Deserts sounded low and oceans only brought waves.',
      },
      {
        id: 'forest-outro-2',
        es: 'Estas alturas las midió GEDI, un láser de la NASA en la Estación Espacial Internacional, entre 2019 y 2020. Conocer la estructura de los bosques ayuda a entender el ciclo del carbono, la biodiversidad y los hábitats.',
        en: 'These heights were measured by GEDI, a NASA laser on the International Space Station, between 2019 and 2020. Knowing the structure of forests helps us understand the carbon cycle, biodiversity and habitats.',
      },
      {
        id: 'forest-outro-3',
        es: 'Ahora explora tú. Te dejamos sobre Sudamérica: usa las flechas y escucha la altura de cada lugar.',
        en: 'Now explore on your own. We leave you over South America: use the arrow keys and listen to the height of each place.',
      },
    ],
    // Frame left on screen for free exploration after the story (Amazon in view).
    exploreAt: 29,
    rate: 0.6,
  },

  // SVS 3912, ECCO2 model (NASA/JPL + MIT), March 2007 to March 2008.
  ocean: {
    menu: {
      id: 'ocean-menu',
      es: 'Océanos. ¿Dónde guarda el mar su calor y cómo lo mueven las corrientes? Pulsa espacio para escuchar la historia.',
      en: 'Oceans. Where does the sea keep its heat, and how do the currents move it? Press space to hear the story.',
    },
    question: {
      es: '¿Dónde guarda el mar su calor y cómo lo mueven las corrientes?',
      en: 'Where does the sea keep its heat, and how do the currents move it?',
    },
    intro: [
      {
        id: 'ocean-intro-1',
        es: '¿Dónde guarda el mar su calor y cómo lo mueven las corrientes? Vamos a escuchar un año entero del océano, de marzo de 2007 a marzo de 2008.',
        en: 'Where does the sea keep its heat, and how do the currents move it? Let’s listen to a whole year of the ocean, from March 2007 to March 2008.',
      },
      {
        id: 'ocean-intro-2',
        es: 'Cada nota es la temperatura del agua: cuanto más aguda, más caliente. Así suena el agua a un grado, casi congelada.',
        en: 'Each note is the temperature of the water: the higher the note, the warmer. This is water at one degree, almost frozen.',
        demo: 'cold',
      },
      {
        id: 'ocean-intro-3',
        es: 'Y así suena el agua a treinta grados.',
        en: 'And this is water at thirty degrees.',
        demo: 'warm',
      },
      {
        id: 'ocean-intro-4',
        es: 'Estos cristales significan agua polar, a cinco grados o menos. Si no los oyes, el agua está más caliente.',
        en: 'These crystals mean polar water, at five degrees or less. If you do not hear them, the water is warmer.',
        demo: 'ice',
      },
      {
        id: 'ocean-intro-5',
        es: 'Y el agua que corre son las corrientes en movimiento: cuanto más fuerte, más se mueve el mar. Empezamos.',
        en: 'And the running water is the currents in motion: the louder it is, the more the sea moves. Let’s begin.',
        demo: 'flow',
      },
    ],
    cues: [
      {
        id: 'ocean-cue-sweep',
        t: 0.3,
        es: 'El cabezal baja del polo norte al polo sur, una y otra vez. Escucha la forma: grave en el Ártico, aguda en el ecuador, y grave otra vez en la Antártida.',
        en: 'The playhead goes down from the North Pole to the South Pole, again and again. Listen to the shape: low in the Arctic, high at the equator, and low again in Antarctica.',
      },
      {
        id: 'ocean-cue-warm',
        t: 12.5,
        es: 'Una franja de agua cálida rodea el ecuador. La más caliente de todas, de más de veintinueve grados, suena a tu derecha: océano Índico y oeste del Pacífico.',
        en: 'A band of warm water circles the equator. The hottest of all, above twenty-nine degrees, sounds on your right: the Indian Ocean and the western Pacific.',
      },
      {
        id: 'ocean-quiz',
        t: 23,
        quiz: { metric: 'hotCols', measure: { es: 'del agua de más de veintinueve grados', en: 'the water above twenty-nine degrees' } },
        es: 'Pregunta. ¿Dónde está el agua más caliente: a la izquierda, del Pacífico central al Atlántico, o a la derecha, de África al oeste del Pacífico? Responde con la flecha izquierda o la flecha derecha.',
        en: 'Question. Where is the hottest water: on the left, from the central Pacific to the Atlantic, or on the right, from Africa to the western Pacific? Answer with the left arrow or the right arrow.',
      },
      {
        id: 'ocean-cue-currents',
        t: 31,
        es: 'Las líneas que se mueven son corrientes y remolinos. Según la NASA, transportan calor y carbono por todo el océano.',
        en: 'The moving lines are currents and eddies. According to NASA, they transport heat and carbon throughout the ocean.',
      },
      {
        id: 'ocean-cue-seasons',
        t: 43,
        es: 'Pasa el año, y la franja más caliente se desplaza con las estaciones.',
        en: 'The year goes by, and the warmest band shifts with the seasons.',
      },
      {
        id: 'ocean-cue-south',
        t: 54,
        es: 'Abajo, alrededor de la Antártida, el agua está cerca de cero grados. Escucha los cristales.',
        en: 'At the bottom, around Antarctica, the water is close to zero degrees. Listen to the crystals.',
      },
    ],
    outro: [
      {
        id: 'ocean-outro-1',
        es: 'Lo que escuchaste: el mar guarda su calor cerca del ecuador, sobre todo en el Índico y el oeste del Pacífico, y es casi hielo en los polos. Las corrientes reparten ese calor.',
        en: 'What you heard: the sea keeps its heat near the equator, especially in the Indian Ocean and the western Pacific, and it is almost ice at the poles. The currents spread that heat around.',
      },
      {
        id: 'ocean-outro-2',
        es: 'Es el modelo ECCO2, de la NASA y el MIT, que combina datos de satélites y mediciones en el mar. Ahora explora tú: la voz te dirá el océano y la temperatura de cada punto.',
        en: 'This is the ECCO2 model, by NASA and MIT, which combines satellite data and measurements at sea. Now explore on your own: the voice will tell you the ocean and the temperature of each point.',
      },
    ],
    exploreAt: 30,
    rate: 0.7,
  },

  'night-lights': {
    // Spoken when the track is selected, for people who cannot see the menu.
    menu: {
      id: 'night-menu',
      es: 'Luces nocturnas. ¿Cómo cambió la luz de la humanidad entre 2012 y 2023? Pulsa espacio para escuchar la historia.',
      en: 'Night lights. How did humanity’s light change between 2012 and 2023? Press space to hear the story.',
    },
    question: {
      es: '¿Cómo cambió la luz de la humanidad entre 2012 y 2023?',
      en: 'How did humanity’s light change between 2012 and 2023?',
    },
    intro: [
      {
        id: 'night-intro-1',
        es: '¿Cómo cambió la luz de la humanidad entre 2012 y 2023? Vamos a escuchar el planeta de noche, visto desde el espacio.',
        en: 'How did humanity’s light change between 2012 and 2023? Let’s listen to the planet at night, seen from space.',
      },
      {
        id: 'night-intro-2',
        es: 'Un cabezal recorre el mapa de oeste a este. Cada campanilla es una región iluminada: más luz, más fuerte; más al norte, más aguda. Donde no suena nada, no hay luz.',
        en: 'A playhead sweeps the map from west to east. Each chime is a lit region: more light, louder; further north, higher. Where nothing sounds, there is no light.',
        demo: 'chimes',
      },
      {
        id: 'night-intro-3',
        es: 'Este brillo que sube significa: aquí hay más luz que antes.',
        en: 'This rising sparkle means: there is more light here than before.',
        demo: 'gain',
      },
      {
        id: 'night-intro-4',
        es: 'Y esta nota que cae significa: aquí la luz se apagó. Empezamos.',
        en: 'And this falling note means: the light went out here. Let’s begin.',
        demo: 'loss',
      },
    ],
    cues: [
      {
        id: 'night-cue-years',
        t: 0.2,
        es: 'Año por año, de 2012 a 2023. A la izquierda América, en el centro Europa y África, a la derecha Asia.',
        en: 'Year by year, from 2012 to 2023. On the left the Americas, in the middle Europe and Africa, on the right Asia.',
      },
      {
        id: 'night-cue-change',
        t: 9.5,
        es: 'Ahora el mapa del cambio. Morado: lugares que ganaron luz. Naranja: lugares que la perdieron.',
        en: 'Now the map of change. Purple: places that gained light. Orange: places that lost it.',
      },
      {
        id: 'night-cue-asia',
        t: 17,
        es: 'Escucha dónde suenan los brillos que suben: son los lugares con luces nuevas.',
        en: 'Listen to where the rising sparkles play: those are the places with new lights.',
      },
      {
        id: 'night-cue-zoom',
        t: 26,
        es: 'Ahora, dos lugares de cerca: Ucrania, arriba a la izquierda, y la India, abajo a la derecha.',
        en: 'Now, two places up close: Ukraine, at the top left, and India, at the bottom right.',
      },
      {
        id: 'night-cue-india',
        t: 31.5,
        es: 'Año tras año, de 2012 a 2023. Escucha cómo cambian las campanillas de la India.',
        en: 'Year after year, from 2012 to 2023. Listen to how India’s chimes change.',
      },
    ],
    outro: [
      {
        id: 'night-cue-result',
        es: 'El resultado. La India aparece casi toda en morado: luces nuevas. En Ucrania hay manchas naranjas: luces que se apagaron, sobre todo en el este y el sur.',
        en: 'The result. India appears almost entirely purple: new lights. In Ukraine there are orange patches: lights that went out, mostly in the east and south.',
      },
      {
        id: 'night-outro-1',
        es: 'Lo que escuchaste: según la NASA, las luces nocturnas muestran el crecimiento de las ciudades, el desarrollo de la infraestructura y los cambios en la vida de las comunidades.',
        en: 'What you heard: according to NASA, night lights show urban growth, infrastructure development and changes in the life of communities.',
      },
      {
        id: 'night-outro-2',
        es: 'Estos datos son de Black Marble, de la NASA, con el sensor VIIRS del satélite Suomi NPP. Ahora explora tú con las flechas.',
        en: 'This data comes from NASA’s Black Marble, using the VIIRS sensor on the Suomi NPP satellite. Now explore on your own with the arrow keys.',
      },
    ],
    exploreAt: 41,
    rate: 0.6,
  },

  lightning: {
    // Spoken when the track is selected, for people who cannot see the menu.
    menu: {
      id: 'light-menu',
      es: 'Rayos. ¿Dónde y cuándo caen los rayos del planeta? Pulsa espacio para escuchar la historia.',
      en: 'Lightning. Where and when does lightning strike on our planet? Press space to hear the story.',
    },
    question: {
      es: '¿Dónde y cuándo caen los rayos del planeta?',
      en: 'Where and when does lightning strike on our planet?',
    },
    intro: [
      {
        id: 'light-intro-1',
        es: '¿Dónde y cuándo caen los rayos del planeta? Desde la Estación Espacial, el sensor LIS de la NASA detectó rayos en los trópicos y las latitudes medias entre 2017 y 2023.',
        en: 'Where and when does lightning strike on our planet? From the Space Station, NASA’s LIS sensor detected lightning in the tropics and mid-latitudes between 2017 and 2023.',
      },
      {
        id: 'light-intro-2',
        es: 'Cada golpe es un rayo nuevo en la imagen. Muchos golpes seguidos significan muchos rayos; pocos golpes sueltos, pocos rayos; y silencio, ningún rayo. Suena a la izquierda o a la derecha según dónde aparece, y más agudo cuanto más arriba.',
        en: 'Each hit is a new flash of lightning in the image. Many hits in a row mean a lot of lightning; a few scattered hits, little lightning; and silence, none. It sounds left or right depending on where it appears, and higher the further up it is.',
        demo: 'drops',
      },
      {
        id: 'light-intro-3',
        es: 'El trueno grave de fondo solo suena cuando hay tormentas en la imagen: cuanto más fuerte, más tormenta. Empezamos.',
        en: 'The deep background thunder only sounds when there are storms in the image: the louder it is, the bigger the storm. Let’s begin.',
        demo: 'rumble',
      },
    ],
    cues: [
      {
        id: 'light-cue-iss',
        t: 0.5,
        es: 'Marzo de 2017. La Estación Espacial sobrevuela África y detecta los primeros rayos: al principio hay pocos, y casi no oyes golpes.',
        en: 'March 2017. The Space Station flies over Africa and detects its first flashes: at first there are few, and you hardly hear any hits.',
      },
      {
        id: 'light-cue-africa',
        t: 12.5,
        es: 'Ahora cada imagen reúne diez días de rayos. África central: golpes muy seguidos y trueno de fondo. Muchos rayos.',
        en: 'Now each image gathers ten days of lightning. Central Africa: hits close together and background thunder. Lots of lightning.',
      },
      {
        id: 'light-cue-summer',
        t: 22,
        es: 'Los rayos cambian con las estaciones: ahora las tormentas suenan sobre Norteamérica.',
        en: 'Lightning changes with the seasons: now the storms sound over North America.',
      },
      {
        id: 'light-cue-pacific',
        t: 32,
        es: 'Sobre el océano Pacífico hay muy pocos rayos: los golpes se vuelven escasos y se pierde el trueno de fondo.',
        en: 'Over the Pacific Ocean there is very little lightning: the hits become sparse and the background thunder fades.',
      },
      {
        id: 'light-cue-asia',
        t: 42,
        es: 'Asia y Australia: la actividad se mueve de una estación a otra.',
        en: 'Asia and Australia: the activity moves from one season to the next.',
      },
      {
        id: 'light-cue-africa2',
        t: 55.5,
        es: 'De nuevo África: golpes sin parar, muchos rayos.',
        en: 'Africa again: non-stop hits, lots of lightning.',
      },
      {
        id: 'light-quiz',
        t: 60.5,
        quiz: { metric: 'columns', keepPlaying: true, measure: { es: 'de la actividad de rayos visible', en: 'the lightning activity in view' } },
        es: 'Pregunta. Escucha los golpes. ¿Hay más rayos a la izquierda o a la derecha de la imagen? Responde con la flecha izquierda o la flecha derecha.',
        en: 'Question. Listen to the hits. Is there more lightning on the left or on the right of the image? Answer with the left arrow or the right arrow.',
      },
      {
        id: 'light-cue-samerica',
        t: 69,
        es: 'Sudamérica: tormentas sobre la Amazonía y el sur del continente.',
        en: 'South America: storms over the Amazon and the south of the continent.',
      },
    ],
    outro: [
      {
        id: 'light-outro-1',
        es: 'Lo que escuchaste: en esta visualización los rayos se concentran sobre los continentes de los trópicos y casi no aparecen sobre los océanos, y su distribución cambia con las estaciones.',
        en: 'What you heard: in this visualization lightning concentrates over tropical continents and hardly appears over the oceans, and its distribution changes with the seasons.',
      },
      {
        id: 'light-outro-2',
        es: 'Son datos con control de calidad del sensor LIS de la NASA, de 2017 a 2023. Ahora explora tú con las flechas.',
        en: 'This is quality-controlled data from NASA’s LIS sensor, from 2017 to 2023. Now explore on your own with the arrow keys.',
      },
    ],
    exploreAt: 58,
    rate: 1,
  },

  co2: {
    // Spoken when the track is selected, for people who cannot see the menu.
    menu: {
      id: 'co2-menu',
      es: 'Dióxido de carbono. ¿De dónde sale y cómo se mueve? Pulsa espacio para escuchar la historia.',
      en: 'Carbon dioxide. Where does it come from, and how does it move? Press space to hear the story.',
    },
    question: {
      es: '¿De dónde sale el dióxido de carbono y cómo se mueve?',
      en: 'Where does carbon dioxide come from, and how does it move?',
    },
    intro: [
      {
        id: 'co2-intro-1',
        es: '¿De dónde sale el dióxido de carbono y cómo se mueve? Vamos a escuchar un modelo de la NASA de enero a marzo de 2020.',
        en: 'Where does carbon dioxide come from, and how does it move? Let’s listen to a NASA model from January to March 2020.',
      },
      {
        id: 'co2-intro-2',
        es: 'Un acorde limpio y tranquilo significa poco dióxido de carbono. Así suena.',
        en: 'A clean, calm chord means little carbon dioxide. This is how it sounds.',
        demo: 'calm',
      },
      {
        id: 'co2-intro-3',
        es: 'Y cuando la concentración sube, el acorde se desafina y se tensa. Más tensión, más dióxido de carbono.',
        en: 'And when the concentration rises, the chord detunes and grows tense. More tension, more carbon dioxide.',
        demo: 'tense',
      },
      {
        id: 'co2-intro-4',
        es: 'El latido es el ritmo del planeta: más rápido significa más dióxido de carbono en la imagen. Empezamos.',
        en: 'The heartbeat is the planet’s pulse: the faster it beats, the more carbon dioxide in the image. Let’s begin.',
        demo: 'heart',
      },
    ],
    cues: [
      {
        id: 'co2-cue-asia',
        t: 0.3,
        es: 'Enero de 2020, sobre Asia. Según la NASA, en China y el sur de Asia la mayoría de las emisiones viene de centrales eléctricas, industrias y vehículos.',
        en: 'January 2020, over Asia. According to NASA, in China and South Asia most emissions come from power plants, industry and vehicles.',
      },
      {
        id: 'co2-cue-africa',
        t: 11.7,
        es: 'Febrero, África. Escucha cómo el acorde se tensa y se relaja: el mapa late con el día y la noche.',
        en: 'February, Africa. Listen to the chord tighten and relax: the map pulses with day and night.',
      },
      {
        id: 'co2-quiz',
        t: 17.6,
        quiz: { metric: 'columns', measure: { es: 'de las zonas coloreadas de dióxido de carbono', en: 'the coloured carbon dioxide areas' } },
        es: 'Pregunta. Escucha la tensión. ¿Dónde se ve más dióxido de carbono, a la izquierda o a la derecha de la imagen? Responde con la flecha izquierda o la flecha derecha.',
        en: 'Question. Listen to the tension. Where do you find more carbon dioxide, on the left or on the right of the image? Answer with the left arrow or the right arrow.',
      },
      {
        id: 'co2-cue-fires',
        t: 21,
        es: 'Según la NASA, en África y Sudamérica gran parte de las emisiones viene de incendios, que crecen de día y se apagan de noche.',
        en: 'According to NASA, in Africa and South America much of the emissions come from fires, which flare up by day and die down at night.',
      },
      {
        id: 'co2-cue-samerica',
        t: 28,
        es: 'Marzo, Sudamérica. Los vientos reparten el gas por continentes y océanos.',
        en: 'March, South America. The winds spread the gas across continents and oceans.',
      },
    ],
    outro: [
      {
        id: 'co2-outro-1',
        es: 'Lo que escuchaste: el dióxido de carbono no se queda donde se emite. Late con el día y la noche, porque las plantas lo absorben de día y lo liberan de noche, y los vientos lo reparten por el planeta.',
        en: 'What you heard: carbon dioxide does not stay where it is emitted. It pulses with day and night, because plants absorb it by day and release it at night, and the winds spread it around the planet.',
      },
      {
        id: 'co2-outro-2',
        es: 'Según la NASA, es la principal causa del aumento de la temperatura de la Tierra: pasó de unas 278 partes por millón en 1750 a 427 en 2024. Ahora explora tú con las flechas.',
        en: 'According to NASA, it is the primary reason for Earth’s rising temperatures: it went from about 278 parts per million in 1750 to 427 in 2024. Now explore on your own with the arrow keys.',
      },
    ],
    exploreAt: 16,
    rate: 0.6,
  },
};

// Spoken help that is not part of a story (welcome on first visit, H key).
export const EXTRA_LINES = [
  {
    id: 'welcome',
    es: 'Bienvenido a la rocola de información de la Tierra. Hay cinco historias sonoras hechas con datos de la NASA. Pulsa un número del uno al cinco para elegir una, y espacio para escucharla. Pulsa H para escuchar la ayuda.',
    en: 'Welcome to the Earth information jukebox. There are five sound stories made with NASA data. Press a number from one to five to choose one, and space to listen. Press H to hear the help.',
  },
  {
    id: 'help',
    es: 'Ayuda. Espacio: escuchar o pausar la historia. Escape: detener todo el audio. Uno a cinco: cambiar de historia. En las preguntas, responde con flecha izquierda o derecha. N salta a la siguiente frase. Al final puedes explorar la imagen con las flechas, o con la cruceta de botones en el móvil: cada punto suena y te dice su valor. F te lleva al valor más alto. R repite la última frase. D describe lo que suena ahora. M marca un momento en modo libre, y otra vez M lo compara con el anterior. X, en Océanos, salta a lugares frente a la costa de Perú. G escucha la leyenda de sonidos. L cambia el idioma. Más abajo está la playlist de episodios de audio: dentro de un episodio, pulsa H para escuchar sus teclas. Si usas un lector de pantalla como NVDA, todos los controles son botones: recórrelos con Tabulador y actívalos con Enter, o activa el modo foco para usar las teclas. Pulsa H de nuevo para detener esta ayuda.',
    en: 'Help. Space: listen to or pause the story. Escape: stop all audio. One to five: change story. In the questions, answer with the left or right arrow. N skips to the next sentence. At the end you can explore the image with the arrow keys, or with the pad of buttons on a phone: each point sounds and tells you its value. F takes you to the highest value. R repeats the last sentence. D describes what is playing now. M marks a moment in free mode, and M again compares it with the previous one. X, on Oceans, jumps to places off the coast of Peru. G plays the sound legend. L changes the language. Further down is the playlist of audio episodes: inside an episode, press H to hear its keys. If you use a screen reader such as NVDA, every control is a button: move with Tab and activate with Enter, or switch to focus mode to use the keys. Press H again to stop this help.',
  },
  {
    id: 'help-episode',
    es: 'Ayuda de los episodios. Espacio o K: reproducir o pausar. En la barra de posición, las flechas izquierda y derecha mueven cinco segundos, y Re Pág y Av Pág cambian de capítulo. Los botones de capítulo anterior y siguiente hacen lo mismo. Menor que y mayor que cambian la velocidad. Escape detiene todo el audio. H vuelve a empezar o detiene esta ayuda.',
    en: 'Episode help. Space or K: play or pause. On the position bar, the left and right arrows move five seconds, and Page Up and Page Down change chapter. The previous and next chapter buttons do the same. Less-than and greater-than change the speed. Escape stops all audio. H starts or stops this help.',
  },
];

export const storyLines = (story) => [story.menu, ...story.intro, ...story.cues, ...story.outro];
