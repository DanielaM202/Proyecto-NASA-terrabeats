# Pruebas de extremo a extremo antes del despliegue

**Fecha:** 15 de noviembre de 2026 · **Versión probada:** compilación de producción (`npm run build` + `vite preview`), en el navegador integrado, en escritorio (1360×900) y móvil (375×812).
Las mediciones de sonido usan `?equipo`, que solo añade funciones de medición; el comportamiento es el mismo que en la página pública.

## Resultado general
Todas las funciones principales funcionan desde el lado del usuario. Se encontraron y corrigieron 5 problemas (abajo). Quedan 3 pendientes que dependen del equipo.

## Qué se probó

| Área | Prueba | Resultado |
|---|---|---|
| Carga | 178 archivos (148 frases de voz, 10 episodios con capítulos, 5 videos, 5 portadas) responden bien | OK, 0 fallos |
| Carga | Consola sin errores; título, idioma del documento, un solo `h1` y jerarquía de títulos | OK |
| Producción | La versión pública no expone las funciones del equipo ni el botón de grabar | OK |
| Accesibilidad | 111 botones con nombre, 0 imágenes sin `alt`, enlace "Saltar al reproductor", 6 regiones `aria-live` | OK |
| Accesibilidad | Orden de tabulación: saltar, ayuda, detener, idioma, fuente NASA, historia… | OK |
| Accesibilidad | Contraste del texto gris secundario sobre los paneles: 6,4:1 (mínimo AA 4,5:1) | OK |
| Idioma | Cambiar a español cambia todo el texto, el título y `lang` del documento, y se recuerda al recargar | OK |
| Teclado | H reproduce la ayuda y H otra vez la detiene; Esc detiene todo (voz, música, episodios, voz del navegador) | OK |
| Teclado | 1–5 cambia de pista; la barra "Pista" y la fuente NASA SVS se actualizan | OK |
| Historia | Rayos completa: leyenda con ejemplos, recorrido sincronizado, pregunta con flechas, respuesta calculada con la imagen, cierre | OK |
| Datos vs. sonido | Sobre el Pacífico hubo 10–27 píxeles nuevos por imagen (bajo el umbral de 22: casi sin golpes) y en África 65–132 (golpes seguidos) | Coincide con la narración |
| Modo libre | Las 5 pistas suenan; nivel medido tras el ajuste: −16,6 a −17,5 dB (parejas) | OK tras corrección |
| Explorar | E activa y lleva el foco a la imagen; flechas y puntero dicen el mar y la temperatura ("Océano Atlántico sur: unos 24 grados"); F lleva al valor más alto; D describe | OK |
| Playlist | Reproducir episodio, capítulo siguiente (Av Pág) con texto de posición y capítulo, Esc detiene | OK |
| Playlist | "Reproducir toda la playlist" pasa sola al siguiente episodio | OK |
| Móvil | Sin desplazamiento horizontal; botones táctiles ≥ 24 px (solo enlaces dentro del texto son menores, lo cual está permitido) | OK |
| Guion | Todas las frases del recorrido caben en su hueco del video | OK |

## Problemas encontrados y corregidos
1. **CO₂ y Océanos sonaban más fuerte que la voz** en modo libre (−10,7 y −12,5 dB frente a unos −18 dB de la voz). Las mediciones anteriores se hicieron durante la introducción de la historia y no reflejaban el modo libre. Se ajustó la ganancia de cada pista y ahora las cinco suenan parejas; con la voz, la música baja 9 dB.
2. **Rayos empezaba en silencio total** (el video inicia con muy pocos rayos) y parecía que no funcionaba. Ahora, en modo libre, tras 4 segundos sin rayos la voz explica: "Por ahora no hay rayos nuevos en la imagen: por eso hay silencio…".
3. La barra de estado decía **"Ayuda hablada"** al anunciar una pista; ahora dice "Voz" (y "Ayuda hablada" solo para la ayuda).
4. Quedaba un símbolo **"⟲"** en el botón "Reiniciar".
5. El título de la pestaña usaba una **raya larga**; ahora usa "·".

## Observaciones (no son fallos)
- **Espacio sobre un botón activa ese botón** y no inicia la historia. Es el comportamiento estándar y lo que esperan los lectores de pantalla; la página lo respeta a propósito.
- En explorar, en la costa algunos puntos de agua dicen solo "Agua" (≈3 % del agua) porque caen entre los polígonos del mapa de mares.

## Alineación con el desafío "The Earth Information Jukebox"
| Lo que pide el desafío | Cómo lo cumple TerraBeats | Comprobado |
|---|---|---|
| Usar visualizaciones del EIC/SVS de la NASA | 5 visualizaciones de la lista del reto: SVS 4950 (GEDI), 3912 (ECCO2), 5313 (Black Marble), 5011 (LIS), 5196 (DYAMOND CO₂), con enlace a cada fuente | Sí |
| Convertir los datos en sonido | Análisis de cada fotograma en tiempo real (≈ cada 80 ms) y síntesis con Tone.js | Sí |
| Experiencia para personas ciegas o con baja visión | Historias narradas, preguntas por oído, modo explorar con voz, teclado completo, lector de pantalla, móvil | Sí |
| Explicar las decisiones artísticas | Leyenda con el porqué de cada sonido y `docs/SIGNIFICADO_SONIDOS.md` | Sí |
| Rocola (varias pistas, lista de reproducción) | 5 pistas, 10 episodios grabados en español e inglés, reproducción continua | Sí |
| Honestidad con los datos | Cada afirmación de la voz se contrastó con lo medido en el video | Sí |

## Pendientes para el equipo
1. **Volver a grabar los 10 episodios**: se grabaron con la mezcla anterior (CO₂ y Océanos más fuertes). Tarda unos 25 minutos (`docs/PLAYLIST.md`).
2. **Prueba con NVDA y con una persona ciega o con baja visión** (`docs/NVDA.md`) y anotar el resultado en `docs/SUBMISSION.md`.
3. **Revisar las etiquetas de instrumento y periodo** de cada pista, sobre todo la de CO₂ ("DYAMOND · 2020").
