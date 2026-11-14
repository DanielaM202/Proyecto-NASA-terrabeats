# Guion de narración (para ElevenLabs o voz humana)

> Este es el guion **definitivo y verificado**: cada dato sale de la página de la NASA de la visualización o de lo que muestra la imagen. No cambien datos sin avisar.

## Cómo generar los audios

1. Un archivo **MP3 por frase**, con el nombre exacto de la tabla.
2. Guardar en `public/narration/es/` (español) y `public/narration/en/` (inglés), reemplazando los actuales.
3. Tono: cercano y tranquilo, de documental. La misma voz para todo un idioma.
4. **Respetar la duración máxima** de la columna "Máx.": las frases del recorrido están sincronizadas con el video. Si una sale más larga, generen otra toma más rápida.
5. Las respuestas a las preguntas, los comentarios en vivo y los valores del modo explorar **no se graban**: se generan en el momento con los datos, con la voz del navegador.
6. En la entrega hay que **declarar el uso de IA** para la voz (ya está redactado en `SUBMISSION.md`).

## Bienvenida y ayuda

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `welcome.mp3` | libre | Bienvenido a TerraBeats, la rocola de información de la Tierra. Hay cinco historias sonoras hechas con datos de la NASA. Pulsa un número del uno al cinco para elegir una, y espacio para escucharla. Pulsa H para escuchar la ayuda. | Welcome to TerraBeats, the Earth information jukebox. There are five sound stories made with NASA data. Press a number from one to five to choose one, and space to listen. Press H to hear the help. |
| `help.mp3` | libre | Ayuda. Espacio: escuchar o pausar la historia. Escape: detener. Uno a cinco: cambiar de historia. En las preguntas, responde con flecha izquierda o derecha. Al final puedes explorar la imagen con las flechas: cada punto suena y te dice su valor. F te lleva al valor más alto. R repite la última frase. D describe lo que suena ahora. L cambia el idioma. Si usas un lector de pantalla como NVDA, todos los controles son botones: recórrelos con Tabulador y actívalos con Enter, o activa el modo foco para usar las teclas. | Help. Space: listen to or pause the story. Escape: stop. One to five: change story. In the questions, answer with the left or right arrow. At the end you can explore the image with the arrow keys: each point sounds and tells you its value. F takes you to the highest value. R repeats the last sentence. D describes what is playing now. L changes the language. If you use a screen reader such as NVDA, every control is a button: move with Tab and activate with Enter, or switch to focus mode to use the keys. |

## ¿Dónde están los bosques más altos que midió la NASA?

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `forest-menu.mp3` | libre | Bosques. ¿Dónde están los bosques más altos que midió la NASA? Pulsa espacio para escuchar la historia. | Forests. Where are the tallest forests NASA measured? Press space to hear the story. |
| `forest-intro-1.mp3` | libre | ¿Dónde están los bosques más altos que midió la NASA? Vamos a escucharlo dando una vuelta completa a la Tierra. | Where are the tallest forests NASA measured? Let’s listen as we travel once around the Earth. |
| `forest-intro-2.mp3` | libre | Cada nota es la altura del bosque. Así suena un arbusto de dos metros. | Each note is the height of the forest. This is a two‑metre shrub. |
| `forest-intro-3.mp3` | libre | Y así suena un árbol de cuarenta y cinco metros. | And this is a forty‑five‑metre tree. |
| `forest-intro-4.mp3` | libre | Los pájaros solo cantan donde el bosque supera, aproximadamente, los treinta metros. | Birds only sing where the forest is taller than about thirty metres. |
| `forest-intro-5.mp3` | libre | Y las olas significan océano. Empezamos. | And waves mean ocean. Let’s begin. |
| `forest-cue-asia.mp3` | 13.3 s | Sudeste asiático y Australia. Las islas de Indonesia suenan agudas; Australia, grave: matorral y desierto. | Southeast Asia and Australia. The islands of Indonesia sound high; Australia sounds low: shrubland and desert. |
| `forest-cue-india.mp3` | 7.9 s | Ahora la India y el océano Índico. | Now India and the Indian Ocean. |
| `forest-cue-sahara.mp3` | 9.3 s | Llega África. Arriba, el Sahara: notas muy graves, casi sin vegetación. | Here comes Africa. At the top, the Sahara: very low notes, almost no vegetation. |
| `forest-cue-congo.mp3` | 8.4 s | En el centro, la selva del Congo: notas agudas y pájaros. Es bosque alto. | In the middle, the Congo rainforest: high notes and birds. This is tall forest. |
| `forest-quiz.mp3` | libre | Pregunta. Escucha los pájaros. ¿Se ve más bosque alto a la izquierda, en Sudamérica, o a la derecha, en África? | Question. Listen to the birds. Is there more tall forest in view on the left, in South America, or on the right, in Africa? |
| `forest-cue-amazon.mp3` | 12.1 s | Cruzamos el Atlántico. Sudamérica: la Amazonía, el bosque tropical más grande del mundo. | We cross the Atlantic. South America: the Amazon, the largest tropical forest in the world. |
| `forest-cue-namerica.mp3` | 8.8 s | Centroamérica y Norteamérica. | Central and North America. |
| `forest-cue-pacific.mp3` | 12.1 s | Y el océano Pacífico: solo olas, casi sin tierra. | And the Pacific Ocean: only waves, almost no land. |
| `forest-cue-back.mp3` | 8.8 s | Volvemos a Asia. Vuelta completa. | Back to Asia. Full circle. |
| `forest-outro-1.mp3` | libre | Lo que escuchaste: en esta vuelta, los bosques más altos sonaron en la Amazonía, el Congo y el sudeste asiático. Los desiertos sonaron graves y los océanos solo trajeron olas. | What you heard: on this trip, the tallest forests sounded in the Amazon, the Congo and Southeast Asia. Deserts sounded low and oceans only brought waves. |
| `forest-outro-2.mp3` | libre | Estas alturas las midió GEDI, un láser de la NASA en la Estación Espacial Internacional, entre 2019 y 2020. Conocer la estructura de los bosques ayuda a entender el ciclo del carbono, la biodiversidad y los hábitats. | These heights were measured by GEDI, a NASA laser on the International Space Station, between 2019 and 2020. Knowing the structure of forests helps us understand the carbon cycle, biodiversity and habitats. |
| `forest-outro-3.mp3` | libre | Ahora explora tú. Te dejamos sobre Sudamérica: usa las flechas y escucha la altura de cada lugar. | Now explore on your own. We leave you over South America: use the arrow keys and listen to the height of each place. |

## ¿Dónde guarda el mar su calor y cómo lo mueven las corrientes?

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `ocean-menu.mp3` | libre | Océanos. ¿Dónde guarda el mar su calor y cómo lo mueven las corrientes? Pulsa espacio para escuchar la historia. | Oceans. Where does the sea keep its heat, and how do the currents move it? Press space to hear the story. |
| `ocean-intro-1.mp3` | libre | ¿Dónde guarda el mar su calor y cómo lo mueven las corrientes? Vamos a escuchar un año entero del océano, de marzo de 2007 a marzo de 2008. | Where does the sea keep its heat, and how do the currents move it? Let’s listen to a whole year of the ocean, from March 2007 to March 2008. |
| `ocean-intro-2.mp3` | libre | Cada nota es la temperatura del agua. Así suena el agua a un grado, casi congelada. | Each note is the temperature of the water. This is water at one degree, almost frozen. |
| `ocean-intro-3.mp3` | libre | Y así suena el agua a treinta grados. | And this is water at thirty degrees. |
| `ocean-intro-4.mp3` | libre | Estos cristales son agua polar, a cinco grados o menos. | These crystals are polar water, at five degrees or less. |
| `ocean-intro-5.mp3` | libre | Y el agua que corre son las corrientes en movimiento. Empezamos. | And the running water is the currents in motion. Let’s begin. |
| `ocean-cue-sweep.mp3` | 17.0 s | El cabezal baja del polo norte al polo sur, una y otra vez. Escucha la forma: grave en el Ártico, aguda en el ecuador, y grave otra vez en la Antártida. | The playhead goes down from the North Pole to the South Pole, again and again. Listen to the shape: low in the Arctic, high at the equator, and low again in Antarctica. |
| `ocean-cue-warm.mp3` | 14.6 s | Una franja de agua cálida rodea el ecuador. La más caliente de todas, de más de veintinueve grados, suena a tu derecha: océano Índico y oeste del Pacífico. | A band of warm water circles the equator. The hottest of all, above twenty-nine degrees, sounds on your right: the Indian Ocean and the western Pacific. |
| `ocean-quiz.mp3` | libre | Pregunta. ¿Dónde está el agua más caliente: a la izquierda, del Pacífico central al Atlántico, o a la derecha, de África al oeste del Pacífico? | Question. Where is the hottest water: on the left, from the central Pacific to the Atlantic, or on the right, from Africa to the western Pacific? |
| `ocean-cue-currents.mp3` | 16.7 s | Las líneas que se mueven son corrientes y remolinos. Según la NASA, transportan calor y carbono por todo el océano. | The moving lines are currents and eddies. According to NASA, they transport heat and carbon throughout the ocean. |
| `ocean-cue-seasons.mp3` | 15.3 s | Pasa el año, y la franja más caliente se desplaza con las estaciones. | The year goes by, and the warmest band shifts with the seasons. |
| `ocean-cue-south.mp3` | 17.7 s | Abajo, alrededor de la Antártida, el agua está cerca de cero grados. Escucha los cristales. | At the bottom, around Antarctica, the water is close to zero degrees. Listen to the crystals. |
| `ocean-outro-1.mp3` | libre | Lo que escuchaste: el mar guarda su calor cerca del ecuador, sobre todo en el Índico y el oeste del Pacífico, y es casi hielo en los polos. Las corrientes reparten ese calor. | What you heard: the sea keeps its heat near the equator, especially in the Indian Ocean and the western Pacific, and it is almost ice at the poles. The currents spread that heat around. |
| `ocean-outro-2.mp3` | libre | Es el modelo ECCO2, de la NASA y el MIT, que combina datos de satélites y mediciones en el mar. Ahora explora tú: la voz te dirá el océano y la temperatura de cada punto. | This is the ECCO2 model, by NASA and MIT, which combines satellite data and measurements at sea. Now explore on your own: the voice will tell you the ocean and the temperature of each point. |

## ¿Cómo cambió la luz de la humanidad entre 2012 y 2023?

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `night-menu.mp3` | libre | Luces nocturnas. ¿Cómo cambió la luz de la humanidad entre 2012 y 2023? Pulsa espacio para escuchar la historia. | Night lights. How did humanity’s light change between 2012 and 2023? Press space to hear the story. |
| `night-intro-1.mp3` | libre | ¿Cómo cambió la luz de la humanidad entre 2012 y 2023? Vamos a escuchar el planeta de noche, visto desde el espacio. | How did humanity’s light change between 2012 and 2023? Let’s listen to the planet at night, seen from space. |
| `night-intro-2.mp3` | libre | Un cabezal recorre el mapa de oeste a este. Cada campanilla es una región iluminada: más luz, más fuerte; más al norte, más aguda. | A playhead sweeps the map from west to east. Each chime is a lit region: more light, louder; further north, higher. |
| `night-intro-3.mp3` | libre | Este brillo que sube significa: aquí hay más luz que antes. | This rising sparkle means: there is more light here than before. |
| `night-intro-4.mp3` | libre | Y esta nota que cae significa: aquí la luz se apagó. Empezamos. | And this falling note means: the light went out here. Let’s begin. |
| `night-cue-years.mp3` | 15.1 s | Año por año, de 2012 a 2023. A la izquierda América, en el centro Europa y África, a la derecha Asia. | Year by year, from 2012 to 2023. On the left the Americas, in the middle Europe and Africa, on the right Asia. |
| `night-cue-change.mp3` | 12.1 s | Ahora el mapa del cambio. Morado: lugares que ganaron luz. Naranja: lugares que la perdieron. | Now the map of change. Purple: places that gained light. Orange: places that lost it. |
| `night-cue-asia.mp3` | 14.6 s | Escucha dónde suenan los brillos que suben: son los lugares con luces nuevas. | Listen to where the rising sparkles play: those are the places with new lights. |
| `night-cue-zoom.mp3` | 8.8 s | Ahora, dos lugares de cerca: Ucrania, arriba a la izquierda, y la India, abajo a la derecha. | Now, two places up close: Ukraine, at the top left, and India, at the bottom right. |
| `night-cue-india.mp3` | 19.3 s | Año tras año, de 2012 a 2023. Escucha cómo cambian las campanillas de la India. | Year after year, from 2012 to 2023. Listen to how India’s chimes change. |
| `night-cue-result.mp3` | libre | El resultado. La India aparece casi toda en morado: luces nuevas. En Ucrania hay manchas naranjas: luces que se apagaron, sobre todo en el este y el sur. | The result. India appears almost entirely purple: new lights. In Ukraine there are orange patches: lights that went out, mostly in the east and south. |
| `night-outro-1.mp3` | libre | Lo que escuchaste: según la NASA, las luces nocturnas muestran el crecimiento de las ciudades, el desarrollo de la infraestructura y los cambios en la vida de las comunidades. | What you heard: according to NASA, night lights show urban growth, infrastructure development and changes in the life of communities. |
| `night-outro-2.mp3` | libre | Estos datos son de Black Marble, de la NASA, con el sensor VIIRS del satélite Suomi NPP. Ahora explora tú con las flechas. | This data comes from NASA’s Black Marble, using the VIIRS sensor on the Suomi NPP satellite. Now explore on your own with the arrow keys. |

## ¿Dónde y cuándo caen los rayos del planeta?

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `light-menu.mp3` | libre | Rayos. ¿Dónde y cuándo caen los rayos del planeta? Pulsa espacio para escuchar la historia. | Lightning. Where and when does lightning strike on our planet? Press space to hear the story. |
| `light-intro-1.mp3` | libre | ¿Dónde y cuándo caen los rayos del planeta? Desde la Estación Espacial, el sensor LIS de la NASA detectó rayos en los trópicos y las latitudes medias entre 2017 y 2023. | Where and when does lightning strike on our planet? From the Space Station, NASA’s LIS sensor detected lightning in the tropics and mid-latitudes between 2017 and 2023. |
| `light-intro-2.mp3` | libre | Cada golpe significa rayos nuevos en la imagen. Suena a la izquierda o a la derecha según dónde aparecen, y más agudo si aparecen más arriba. | Each hit means new lightning in the image. It sounds left or right depending on where it appears, and higher if it appears further up. |
| `light-intro-3.mp3` | libre | El trueno de fondo crece con la tormenta. Empezamos. | The background thunder grows with the storm. Let’s begin. |
| `light-cue-iss.mp3` | 11.6 s | Marzo de 2017. La Estación Espacial sobrevuela África y detecta los primeros rayos. | March 2017. The Space Station flies over Africa and detects its first flashes. |
| `light-cue-africa.mp3` | 9.1 s | Ahora cada imagen reúne diez días de rayos. Escucha África central: una de las zonas más activas. | Now each image gathers ten days of lightning. Listen to Central Africa: one of the most active areas. |
| `light-cue-summer.mp3` | 9.6 s | Los rayos cambian con las estaciones: ahora las tormentas suenan sobre Norteamérica. | Lightning changes with the seasons: now the storms sound over North America. |
| `light-cue-pacific.mp3` | 9.6 s | Sobre el océano Pacífico se ven muy pocos rayos. Escucha el silencio. | Over the Pacific Ocean very little lightning is seen. Listen to the silence. |
| `light-cue-asia.mp3` | 13.1 s | Asia y Australia: la actividad se mueve de una estación a otra. | Asia and Australia: the activity moves from one season to the next. |
| `light-cue-africa2.mp3` | 4.6 s | De nuevo África: vuelve la percusión intensa. | Africa again: the intense percussion returns. |
| `light-quiz.mp3` | libre | Pregunta. Escucha los golpes. ¿Hay más rayos a la izquierda o a la derecha de la imagen? | Question. Listen to the hits. Is there more lightning on the left or on the right of the image? |
| `light-cue-samerica.mp3` | 16.5 s | Sudamérica: tormentas sobre la Amazonía y el sur del continente. | South America: storms over the Amazon and the south of the continent. |
| `light-outro-1.mp3` | libre | Lo que escuchaste: en esta visualización los rayos se concentran sobre los continentes de los trópicos y casi no aparecen sobre los océanos, y su distribución cambia con las estaciones. | What you heard: in this visualization lightning concentrates over tropical continents and hardly appears over the oceans, and its distribution changes with the seasons. |
| `light-outro-2.mp3` | libre | Son datos con control de calidad del sensor LIS de la NASA, de 2017 a 2023. Ahora explora tú con las flechas. | This is quality-controlled data from NASA’s LIS sensor, from 2017 to 2023. Now explore on your own with the arrow keys. |

## ¿De dónde sale el dióxido de carbono y cómo se mueve?

| Archivo | Máx. | Español | English |
|---|---|---|---|
| `co2-menu.mp3` | libre | Dióxido de carbono. ¿De dónde sale y cómo se mueve? Pulsa espacio para escuchar la historia. | Carbon dioxide. Where does it come from, and how does it move? Press space to hear the story. |
| `co2-intro-1.mp3` | libre | ¿De dónde sale el dióxido de carbono y cómo se mueve? Vamos a escuchar un modelo de la NASA de enero a marzo de 2020. | Where does carbon dioxide come from, and how does it move? Let’s listen to a NASA model from January to March 2020. |
| `co2-intro-2.mp3` | libre | Así suena una atmósfera con poco dióxido de carbono: un acorde limpio y tranquilo. | This is an atmosphere with little carbon dioxide: a clean, calm chord. |
| `co2-intro-3.mp3` | libre | Y así, cuando la concentración sube: el acorde se tensa. | And this is when the concentration rises: the chord grows tense. |
| `co2-intro-4.mp3` | libre | El latido se acelera con el dióxido de carbono. Empezamos. | The heartbeat speeds up with carbon dioxide. Let’s begin. |
| `co2-cue-asia.mp3` | 18.6 s | Enero de 2020, sobre Asia. Según la NASA, en China y el sur de Asia la mayoría de las emisiones viene de centrales eléctricas, industrias y vehículos. | January 2020, over Asia. According to NASA, in China and South Asia most emissions come from power plants, industry and vehicles. |
| `co2-cue-africa.mp3` | 9.4 s | Febrero, África. Escucha cómo el acorde se tensa y se relaja: el mapa late con el día y la noche. | February, Africa. Listen to the chord tighten and relax: the map pulses with day and night. |
| `co2-quiz.mp3` | libre | Pregunta. Escucha la tensión. ¿Dónde se ve más dióxido de carbono, a la izquierda o a la derecha de la imagen? | Question. Listen to the tension. Where do you find more carbon dioxide, on the left or on the right of the image? |
| `co2-cue-fires.mp3` | 11.3 s | Según la NASA, en África y Sudamérica gran parte de las emisiones viene de incendios, que crecen de día y se apagan de noche. | According to NASA, in Africa and South America much of the emissions come from fires, which flare up by day and die down at night. |
| `co2-cue-samerica.mp3` | 18.3 s | Marzo, Sudamérica. Los vientos reparten el gas por continentes y océanos. | March, South America. The winds spread the gas across continents and oceans. |
| `co2-outro-1.mp3` | libre | Lo que escuchaste: el dióxido de carbono no se queda donde se emite. Late con el día y la noche, porque las plantas lo absorben de día y lo liberan de noche, y los vientos lo reparten por el planeta. | What you heard: carbon dioxide does not stay where it is emitted. It pulses with day and night, because plants absorb it by day and release it at night, and the winds spread it around the planet. |
| `co2-outro-2.mp3` | libre | Según la NASA, es la principal causa del aumento de la temperatura de la Tierra: pasó de unas 278 partes por millón en 1750 a 427 en 2024. Ahora explora tú con las flechas. | According to NASA, it is the primary reason for Earth’s rising temperatures: it went from about 278 parts per million in 1750 to 427 in 2024. Now explore on your own with the arrow keys. |

