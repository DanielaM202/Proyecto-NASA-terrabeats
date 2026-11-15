# Playlist: cómo se generan los episodios

Cada episodio es la **grabación de la historia completa** (voz + sonidos generados en vivo), sin las preguntas interactivas ni los comentarios en vivo (que dependen de la voz del navegador y de que alguien responda).

## Archivos
Por cada pista e idioma, en `public/playlist/`:
- `<pista>-<idioma>.mp3`: el audio (por ejemplo `ocean-es.mp3`).
- `<pista>-<idioma>.json`: los **capítulos**: la hora de inicio de cada frase narrada. El título y el texto de cada capítulo salen de `src/data/chapters.js` y `src/data/stories.js`, así que se pueden corregir sin volver a grabar.

Y `src/data/playlist.js` indica qué idiomas tiene cada pista (`files`).

## Cuándo hay que volver a grabar
- Si cambian los **audios de narración** (por ejemplo, al cambiar de voz: `docs/VOZ.md`).
- Si cambia el **texto del guion** o los **tiempos** (`t`) de las frases.
- Si cambian los **sonidos** de una pista.

## Cómo grabar (unos 5 minutos de preparación y 15 de espera)
1. Terminal A: `npm run dev`
2. Terminal B (desde la carpeta del proyecto): `node scripts/episode-receiver.mjs C:\ruta\a\ffmpeg.exe`
3. Abrir `http://localhost:5173` en Chrome o Edge. Una pestaña por idioma permite grabar los dos a la vez; **no cierren ni minimicen** esas pestañas, y no editen el código mientras graban (la página se recargaría).
4. En la consola del navegador (F12) de cada pestaña:
   ```js
   window.RECORD_LANG = 'es'   // o 'en'
   window.RECORD_ONLY = null   // o ['ocean'] para grabar solo algunas pistas
   ```
   y pegar el contenido de `scripts/record-episodes.js`.
5. Esperar. El progreso está en `window.__recorder.log`; cuando `window.__recorder.done` sea `true`, los archivos ya están en `public/playlist/`.
6. Comprobar un episodio de cada idioma en la sección **Playlist** de la web y subir los cambios.

## Grabar un episodio suelto desde la web
**Ya no hay ningún botón de grabar en la página.** Los episodios se graban con `scripts/record-episodes.js`, que usa una función interna (`window.__terrabeatsRecordEpisode(id)`) disponible solo con `npm run dev` o añadiendo `?equipo` a la dirección. Esa función reproduce la historia y deja el episodio en la misma página, con capítulos y un enlace de descarga (WebM) más otro para los capítulos (JSON). Sirve para probar; para guardarlo en el proyecto, usar el procedimiento anterior.
