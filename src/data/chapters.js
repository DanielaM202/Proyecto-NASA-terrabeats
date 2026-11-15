// Short chapter titles for the playlist episodes. Keyed by the id of each story
// line (see stories.js). A chapter = one narrated sentence, so jumping to a
// chapter always lands at the start of a sentence.

export const CHAPTER_TITLES = {
  // ----- Forests (GEDI)
  'forest-intro-1': { es: 'La pregunta', en: 'The question' },
  'forest-intro-2': { es: 'Nota grave: arbusto de 2 metros', en: 'Low note: 2-metre shrub' },
  'forest-intro-3': { es: 'Nota aguda: árbol de 45 metros', en: 'High note: 45-metre tree' },
  'forest-intro-4': { es: 'Pájaros: bosque alto', en: 'Birds: tall forest' },
  'forest-intro-5': { es: 'Olas: océano', en: 'Waves: ocean' },
  'forest-cue-asia': { es: 'Sudeste asiático y Australia', en: 'Southeast Asia and Australia' },
  'forest-cue-india': { es: 'India y océano Índico', en: 'India and the Indian Ocean' },
  'forest-cue-sahara': { es: 'El Sahara', en: 'The Sahara' },
  'forest-cue-congo': { es: 'La selva del Congo', en: 'The Congo rainforest' },
  'forest-cue-amazon': { es: 'La Amazonía', en: 'The Amazon' },
  'forest-cue-namerica': { es: 'Norteamérica', en: 'North America' },
  'forest-cue-pacific': { es: 'El océano Pacífico', en: 'The Pacific Ocean' },
  'forest-cue-back': { es: 'Vuelta completa', en: 'Full circle' },
  'forest-outro-1': { es: 'Lo que escuchaste', en: 'What you heard' },
  'forest-outro-2': { es: 'El dato de la NASA: GEDI', en: 'The NASA fact: GEDI' },
  'forest-outro-3': { es: 'Explora tú', en: 'Your turn to explore' },

  // ----- Oceans (ECCO2)
  'ocean-intro-1': { es: 'La pregunta', en: 'The question' },
  'ocean-intro-2': { es: 'Agua fría: 1 grado', en: 'Cold water: 1 degree' },
  'ocean-intro-3': { es: 'Agua cálida: 30 grados', en: 'Warm water: 30 degrees' },
  'ocean-intro-4': { es: 'Cristales: hielo polar', en: 'Crystals: polar ice' },
  'ocean-intro-5': { es: 'Agua que corre: corrientes', en: 'Running water: currents' },
  'ocean-cue-sweep': { es: 'De polo a polo', en: 'From pole to pole' },
  'ocean-cue-warm': { es: 'La franja cálida del ecuador', en: 'The warm band at the equator' },
  'ocean-cue-currents': { es: 'Corrientes y remolinos', en: 'Currents and eddies' },
  'ocean-cue-seasons': { es: 'Las estaciones', en: 'The seasons' },
  'ocean-cue-south': { es: 'La Antártida', en: 'Antarctica' },
  'ocean-outro-1': { es: 'Lo que escuchaste', en: 'What you heard' },
  'ocean-outro-2': { es: 'El modelo ECCO2', en: 'The ECCO2 model' },

  // ----- Night lights
  'night-intro-1': { es: 'La pregunta', en: 'The question' },
  'night-intro-2': { es: 'Campanillas: regiones iluminadas', en: 'Chimes: lit regions' },
  'night-intro-3': { es: 'Brillo que sube: luces nuevas', en: 'Rising sparkle: new lights' },
  'night-intro-4': { es: 'Nota que cae: luces apagadas', en: 'Falling note: lights out' },
  'night-cue-years': { es: 'Año por año, de 2012 a 2023', en: 'Year by year, 2012 to 2023' },
  'night-cue-change': { es: 'El mapa del cambio', en: 'The map of change' },
  'night-cue-asia': { es: 'Dónde suenan las luces nuevas', en: 'Where the new lights sound' },
  'night-cue-zoom': { es: 'Ucrania y la India de cerca', en: 'Ukraine and India up close' },
  'night-cue-india': { es: 'La India, año tras año', en: 'India, year after year' },
  'night-cue-result': { es: 'El resultado', en: 'The result' },
  'night-outro-1': { es: 'Lo que escuchaste', en: 'What you heard' },
  'night-outro-2': { es: 'Los datos: Black Marble', en: 'The data: Black Marble' },

  // ----- Lightning
  'light-intro-1': { es: 'La pregunta', en: 'The question' },
  'light-intro-2': { es: 'Golpes: rayos nuevos', en: 'Hits: new lightning' },
  'light-intro-3': { es: 'El trueno de fondo', en: 'The background thunder' },
  'light-cue-iss': { es: 'Marzo de 2017: la Estación Espacial', en: 'March 2017: the Space Station' },
  'light-cue-africa': { es: 'África central', en: 'Central Africa' },
  'light-cue-summer': { es: 'El verano del norte', en: 'Northern summer' },
  'light-cue-pacific': { es: 'El silencio del Pacífico', en: 'The silence of the Pacific' },
  'light-cue-asia': { es: 'Asia y Australia', en: 'Asia and Australia' },
  'light-cue-africa2': { es: 'De nuevo África', en: 'Africa again' },
  'light-cue-samerica': { es: 'Sudamérica', en: 'South America' },
  'light-outro-1': { es: 'Lo que escuchaste', en: 'What you heard' },
  'light-outro-2': { es: 'El sensor LIS', en: 'The LIS sensor' },

  // ----- Carbon dioxide
  'co2-intro-1': { es: 'La pregunta', en: 'The question' },
  'co2-intro-2': { es: 'Atmósfera tranquila', en: 'A calm atmosphere' },
  'co2-intro-3': { es: 'Atmósfera tensa', en: 'A tense atmosphere' },
  'co2-intro-4': { es: 'El latido', en: 'The heartbeat' },
  'co2-cue-asia': { es: 'Asia: industria y ciudades', en: 'Asia: industry and cities' },
  'co2-cue-africa': { es: 'África: el mapa late', en: 'Africa: the map pulses' },
  'co2-cue-fires': { es: 'Los incendios', en: 'The fires' },
  'co2-cue-samerica': { es: 'Sudamérica y los vientos', en: 'South America and the winds' },
  'co2-outro-1': { es: 'Lo que escuchaste', en: 'What you heard' },
  'co2-outro-2': { es: 'El CO₂ y la temperatura', en: 'CO₂ and temperature' },
};
