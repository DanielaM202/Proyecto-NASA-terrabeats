# La voz de TerraBeats: opciones y cómo cambiarla

> **Escuchar las muestras:** abran `muestras-de-voz/muestras-standalone.html` (tiene los 17 audios dentro de la página). Si el navegador no reproduce los archivos sueltos de `muestras-de-voz/index.html`, usen este.

## Qué voz usa hoy
- **Español: Camila (Perú)** · **Inglés: Jenny (Estados Unidos)**, voces neuronales de Microsoft Edge, generadas con `scripts/build-narration-edge.py` (paquete `edge-tts`).
- **Por qué:** en las 17 muestras comparadas (`muestras-de-voz/index.html`) fueron las más naturales, y son las que el navegador Edge ofrece como voces "Natural", de modo que las partes dinámicas (respuestas, comentarios en vivo, valores del modo explorar) pueden sonar con **la misma persona** si el navegador las tiene.
- **Condiciones (hay que declararlas):** es un servicio **no oficial** de Microsoft, sin términos claros para este uso, y el **texto de cada frase se envía a sus servidores** al generar los archivos (solo el guion público; el nombre del proyecto se quitó de la bienvenida). La web en sí **no depende del servicio**: usa archivos MP3 fijos.
- **Respaldo:** la voz anterior de Windows está en la carpeta de copia de seguridad del equipo; la alternativa abierta y sin envío de texto es Kokoro (`scripts/build-narration-kokoro.py`).

### Cómo se hizo menos robótica (además del motor)
1. **Motor neuronal** (entonación y ritmo de persona en vez de melodía plana).
2. **Siglas pronunciadas para el oído** (`GEDI` → "Yédi", `ECCO2` → "Eco dos", `VIIRS`, `LIS`, `MIT`, `Suomi NPP`…), solo para la síntesis; el texto en pantalla no cambia.
3. **Compresión suave y nivelación de volumen** en cada clip, para que todas las frases tengan la misma presencia.
4. **Ritmo ligeramente más lento** (−4 %) y frases cortas.
5. **Misma voz en la parte dinámica** cuando el navegador la tiene (la web prefiere "Camila" y "Jenny").

La voz de Windows (Helena y Zira) suena robótica. Estas son las alternativas gratuitas que probamos. **Las muestras están en `muestras-de-voz/index.html`** (ábranlo en el navegador, con auriculares).

## Qué partes tienen voz
| Parte | Cómo se genera | Cómo mejorarla |
|---|---|---|
| **Narración de las historias** (ayuda, preguntas, recorrido, cierre) | Archivos MP3 en `public/narration/` | Regenerarlos con otra voz (este documento) |
| **Episodios de la playlist** | Grabaciones de las historias (voz + sonidos) en `public/playlist/` | Volver a grabarlos **después** de cambiar la voz (`docs/PLAYLIST.md`) |
| **Respuestas a las preguntas, comentarios en vivo y valores del modo explorar** | Voz del **navegador** (Web Speech), porque dependen de los datos del momento | La web elige sola la voz más natural instalada (en **Edge** hay voces "Natural" de Microsoft) y se puede cambiar en *Más opciones → Voz* |

## Opciones para los archivos de narración
| Opción | Naturalidad | Licencia y privacidad | Esfuerzo |
|---|---|---|---|
| **Kokoro** (modelo abierto) | Buena en inglés, aceptable en español | Apache-2.0. Corre en el propio equipo: **no envía nada a nadie**. Cualquiera del equipo puede repetirlo | Instalar una vez (350 MB) |
| **Voces neuronales de Microsoft Edge** (`edge-tts`) | La mejor, con voces de **Perú** | Gratis, pero es un servicio **no oficial**: envía el texto a Microsoft y no hay términos claros para este uso | 5 minutos |
| ElevenLabs | Excelente | Plan gratuito limitado y con condiciones; hay que declararlo | Cuenta y créditos |
| Voz humana (persona A) | La más cálida | Sin problema | Grabar ~130 frases ([`GRABACION.md`](GRABACION.md)) |

**Recomendación:** voz humana para lo principal si hay tiempo; si no, Kokoro (abierto y reproducible). Las voces de Edge son la mejor calidad, pero conviene decidirlo con el equipo por el envío del texto y la falta de términos oficiales.

## Cambiar la voz con Edge (un comando)
1. Una vez: `python -m venv .venv` y `.venv\Scripts\python -m pip install edge-tts`.
2. Generar todo (unos 5 minutos): `.venv\Scripts\python scripts/build-narration-edge.py --ffmpeg C:\ruta\ffmpeg.exe`. Otras voces: `--es-voice es-MX-DaliaNeural --en-voice en-US-AriaNeural` (lista: `edge-tts --list-voices`).
3. `node scripts/check-narration-timing.mjs C:\ruta\ffmpeg.exe` y, si una frase no cabe, `--only <id> --override <id>=+8%`.
4. Volver a grabar los 10 episodios (`docs/PLAYLIST.md`).

## Cambiar la voz con Kokoro (un comando)
1. Una vez: `python -m venv .venv` y `.venv\Scripts\python -m pip install kokoro-onnx soundfile numpy`.
2. Descargar `kokoro-v1.0.onnx` y `voices-v1.0.bin` de <https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0> en una carpeta.
3. Generar todo (unos 12 minutos):
   ```
   .venv\Scripts\python scripts/build-narration-kokoro.py --ffmpeg C:\ruta\ffmpeg.exe --models C:\modelos\kokoro --es-voice ef_dora --en-voice af_heart
   ```
   Voces en español: `ef_dora`, `em_alex`, `em_santa`. En inglés: `af_heart`, `af_bella`, `af_nicole`, `am_michael`, `am_adam`…
4. **Comprobar los tiempos:** `node scripts/check-narration-timing.mjs C:\ruta\ffmpeg.exe`. Las frases del recorrido están sincronizadas con los videos de la NASA: si una voz nueva habla más despacio y no cabe, el script lo dice. Se arregla acortando la frase, generándola más rápido (`--speed 1.05 --only forest-cue`) o moviendo su tiempo en `src/data/stories.js`.
5. Volver a grabar los 10 episodios (`docs/PLAYLIST.md`).

## Declaración de IA
Sea cual sea la voz, hay que declararla en `docs/SUBMISSION.md` (sección *Use of Artificial Intelligence*): modelo, licencia y que el guion lo escribió el equipo.
