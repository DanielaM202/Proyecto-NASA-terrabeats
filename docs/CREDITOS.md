# Créditos y licencias de terceros

Los términos de Space Apps 2026 piden citar **todo** recurso usado, aunque sea abierto, e identificar la licencia de cada material de terceros. Esta es la lista completa.

## Licencia del proyecto
Código y documentación originales del equipo: **Apache License 2.0** (archivo `LICENSE`, aviso en `NOTICE`).
Las visualizaciones de la NASA no quedan cubiertas por esta licencia.

## Datos y visualizaciones de la NASA
Todo el material visual es de la **NASA/Goddard Space Flight Center Scientific Visualization Studio** (SVS) y del Earth Information Center. Los videos de `public/media` son copias recodificadas a tamaño web. NASA no respalda este proyecto.

| Pista | Visualización | Enlace |
|---|---|---|
| Bosques | GEDI Forest Height | https://svs.gsfc.nasa.gov/4950/ |
| Océanos | Global Sea Surface Currents and Temperature (modelo ECCO2, NASA/JPL y MIT) | https://svs.gsfc.nasa.gov/3912/ |
| Luces nocturnas | Change in Night Lights 2012 to 2023, EIC version (Black Marble, Suomi NPP VIIRS) | https://svs.gsfc.nasa.gov/5313/ |
| Rayos | Lightning Events Detected from the ISS 2017 to 2023 (LIS) | https://svs.gsfc.nasa.gov/5011/ |
| CO₂ | DYAMOND Global Carbon Dioxide | https://svs.gsfc.nasa.gov/5196/ |
| Referencia conceptual | Data Sonification: Caldwell 73 | https://svs.gsfc.nasa.gov/13786/ |
| Catálogo | Earth Information Center content database | https://svs.gsfc.nasa.gov/gallery/earth-information-center/ |

## Código que se distribuye con la página
| Recurso | Uso | Licencia |
|---|---|---|
| React y React DOM | Interfaz | MIT |
| Tone.js (con standardized-audio-context y automation-events) | Síntesis de audio en el navegador | MIT |
| lucide-react | Iconos decorativos | ISC |
| @fontsource-variable/inter | Tipografía Inter, alojada en el proyecto | SIL OFL 1.1 |
| @fontsource-variable/fraunces | Tipografía Fraunces, alojada en el proyecto | SIL OFL 1.1 |
| @fontsource-variable/jetbrains-mono | Tipografía JetBrains Mono, alojada en el proyecto | SIL OFL 1.1 |
| @babel/runtime, scheduler, tslib | Dependencias de las anteriores | MIT, MIT, 0BSD |

## Datos de terceros incluidos
| Recurso | Uso | Licencia |
|---|---|---|
| Natural Earth, polígonos marinos 1:50m (https://www.naturalearthdata.com/) | Nombre del mar u océano en el modo explorar (`src/data/marine.json`, simplificado) | Dominio público |

## Herramientas de desarrollo (no se distribuyen con la página)
Vite, Tailwind CSS, PostCSS, Autoprefixer, oxlint (MIT); ffmpeg (para preparar videos y audio); Python con Kokoro (Apache 2.0), `kokoro-onnx`, `onnxruntime` y `espeak-ng`; Git, GitHub y Vercel.

## Voz de la narración
Las frases del recorrido son audios sintéticos generados en el propio equipo con **Kokoro** (voces `ef_dora` en español y `af_heart` en inglés). Los pesos del modelo tienen licencia **Apache 2.0** (https://huggingface.co/hexgrad/Kokoro-82M); se ejecutan con `kokoro-onnx`, `onnxruntime` (MIT) y `espeak-ng` para la fonética, que son herramientas de generación y no se distribuyen. No se envió texto a ningún servicio. Ver `docs/VOZ.md`.

## Inteligencia artificial
Código y documentos se escribieron con ayuda de un asistente de IA (Claude, de Anthropic), dirigido y revisado por el equipo. No hay imágenes, video ni música generados por IA: el sonido se sintetiza en vivo con nuestro código a partir de los píxeles de las visualizaciones de la NASA.

## Referencias
- Tone.js: https://tonejs.github.io/
- MDN Web Audio, Canvas, Web Speech y Vibration API: https://developer.mozilla.org/
