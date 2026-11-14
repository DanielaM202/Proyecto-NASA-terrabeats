> ⚠️ **Documento histórico (primera versión).** El producto actual está descrito en [`VALOR.md`](VALOR.md) y [`SUBMISSION.md`](SUBMISSION.md).

# TerraBeats — Definición del producto

> Reto: **The Earth Information Jukebox** · NASA Space Apps Challenge 2026 · Sede Cajamarca
> Entrega: hoy, antes de las **17:30**.

## 1. El producto en una frase

**TerraBeats es una rocola web, bilingüe (ES/EN) y accesible, que analiza en tiempo real los fotogramas de cuatro visualizaciones del Earth Information Center (EIC) de la NASA y los convierte en música.** Así, cualquier persona —incluidas las personas ciegas o con baja visión— puede *escuchar* cómo cambia la Tierra.

## 2. Qué se entrega (lo que se sube a la página de Space Apps)

| # | Entregable | Dónde | Estado |
|---|---|---|---|
| 1 | **Web en vivo** (la rocola) | Vercel → `https://<proyecto>.vercel.app` | Código listo; falta publicar |
| 2 | **Repositorio** público | GitHub | Código listo; falta subir |
| 3 | **Video demo** (~30 s, con sonido) | YouTube (no listado) o Drive | Por grabar (guion en §8) |
| 4 | **Texto del proyecto** en inglés | Formulario de Space Apps | Listo en [`SUBMISSION.md`](SUBMISSION.md) |
| 5 | (Opcional) **Playlist de audios** generados | Botón "Grabar audio" → archivos `.webm` | Se pueden grabar desde la web |

## 3. Cómo lo usa una persona

1. Abre la web. La interfaz aparece en su idioma (español o inglés) y se puede cambiar con un botón o la tecla **L**.
2. Elige una de las **4 pistas** (o pulsa **1–4**):
   1. **Luces nocturnas 2012–2023** (SVS #5313)
   2. **Rayos detectados desde la EEI 2017–2023** (SVS #5011)
   3. **CO₂ global – DYAMOND** (SVS #5196)
   4. **Altura de los bosques – GEDI** (SVS #4950)
3. Pulsa **Reproducir** (o **Espacio**). El video de la NASA corre y la música se genera **en vivo** a partir de lo que se ve.
4. Un **cabezal amarillo** recorre la imagen de izquierda a derecha y unas barras muestran lo que está "leyendo". Con auriculares, el sonido también se mueve de izquierda a derecha.
5. El panel **"Qué estás escuchando"** explica qué significa cada sonido. **"Datos en vivo"** muestra la energía, la cobertura, la intensidad y el centro de actividad.
6. **Accesibilidad**:
   - **Describir ahora (D):** una voz explica lo que pasa en ese momento, por ejemplo: *"Actividad de rayos alta: 40 rayos nuevos, concentrados hacia abajo / la derecha"*.
   - **Narración automática:** repite esa descripción cada 9 s.
   - **Modo explorar (E):** se mueve un cursor por la imagen con las flechas o el ratón, y cada punto **suena** según su valor y se anuncia en texto (*"arriba a la izquierda: valor alto"*).
   - **Vibración** en el móvil con cada rayo.
   - Compatible con lectores de pantalla: regiones `aria-live`, etiquetas, enlace para saltar al reproductor y navegación completa con teclado.
7. **Grabar audio:** se descarga la pista generada (`.webm`). Con esto se puede armar la "playlist" que el reto menciona como entrega alternativa.

## 4. Cómo funciona por dentro

```
Video NASA (SVS)  →  canvas reducido (cada 80 ms)  →  visión por computadora  →  rasgos  →  Tone.js  →  🔊
                                                       (clasificar píxeles según         (sintetizadores,
                                                        la escala de color oficial)        escalas musicales)
```

1. **Fotogramas:** los videos originales se descargaron del Scientific Visualization Studio (SVS). Se reconvirtieron a resolución web (de 0,4 a 4,6 MB cada uno) y se alojan **en la misma web**. Esto evita el bloqueo CORS de los servidores de la NASA, que impide leer los píxeles desde otra web.
2. **Visión por computadora** ([`src/analysis/features.js`](../src/analysis/features.js)): cada píxel se clasifica según la paleta de cada visualización:
   - Luces: tono cálido sobre fondo oscuro. En la fase de cambio, morado = más luz y naranja = menos luz.
   - Rayos: puntos amarillos.
   - CO₂: gris o beige = bajo, naranja o rojo = alto, según la barra de colores oficial.
   - Bosques: marrón o verde oscuro = vegetación baja, verde brillante o blanco = alta. El azul es océano.
3. **Rasgos por fotograma:**
   - cobertura;
   - intensidad;
   - nivel calibrado (0–1);
   - centroide (dónde está la actividad);
   - perfil de **16 columnas** con su valor medio y la fila del pico;
   - porcentaje de océano y de ganancia o pérdida de luz;
   - **rayos nuevos** respecto al fotograma anterior.
4. **Sonido** ([`src/audio/engine.js`](../src/audio/engine.js)): cada pista tiene sus propios instrumentos. **Todas las notas se ajustan a una escala musical**, para que el resultado no sea ruido caótico, como advierte el reto.

### Tabla de traducción imagen → sonido

| Pista | Qué se mide | Qué se oye |
|---|---|---|
| **Luces nocturnas** | Brillo por región, latitud y luz total; morado y naranja en la fase de cambio | Campanillas FM que siguen el mapa de oeste a este. Altura de nota = latitud (norte agudo). Volumen = brillo. El acorde de fondo crece con la luz total. Destellos agudos = ganó luz; notas graves descendentes = perdió luz |
| **Rayos** | Rayos **nuevos** en cada fotograma, su posición y la actividad total | Un golpe de percusión por grupo de rayos, situado a izquierda o derecha según su posición; los del norte suenan más agudos. Trueno grave de fondo y bombo según la actividad total. Vibración en el móvil |
| **CO₂** | Proporción de píxeles naranja o rojo (CO₂ alto) | Acorde sostenido que pasa de **consonante a disonante**: se desafina, entra un tritono y se abre el filtro. Un **latido** que acelera de 56 a 120 pulsos por minuto. Melodía donde hay emisiones altas |
| **Bosques** | Altura (brillo de la vegetación), tierra con vegetación y océano | Cuerda pulsada: **árbol más alto = nota más aguda**. Acorde de fondo según la superficie verde. Rumor de **olas** según la proporción de océano |

## 5. Por qué cumple el reto (punto por punto)

| El reto pide… | TerraBeats |
|---|---|
| Emparejar fotogramas del EIC con sonificación **en tiempo real** | Analiza el fotograma del video cada 80 ms y genera el sonido en vivo |
| Que el usuario **elija una visualización** y la escuche | Rocola con 4 pistas (clic o teclas 1–4) |
| Visión por computadora: color, brillo, densidad o forma → tono, ritmo, volumen o instrumento | Clasificación por paleta, densidad por columnas y centroide, que controlan tono, volumen, paneo, tempo e instrumento |
| Equilibrar dato y musicalidad | Escalas pentatónicas o modales, reverberación y limitador |
| **Accesibilidad** (lector de pantalla, retroalimentación táctil, texto descriptivo) | `aria-live`, modo explorar con teclado, voz integrada, vibración y descripciones en 2 idiomas |
| Contar la historia y su impacto emocional | El CO₂ suena a **tensión** y el bosque a **naturaleza**. Las luces cuentan el crecimiento urbano |
| Alternativa de "playlist" de audios | Botón **Grabar audio** |

## 6. Tecnologías

- **React 19 + Vite 8:** interfaz.
- **Tailwind CSS 3:** estilos y contraste alto.
- **Tone.js 15:** síntesis de audio en tiempo real con Web Audio.
- **Canvas 2D:** lectura de píxeles.
- **Web Speech API** (voz), **Vibration API** (tacto) y **MediaRecorder** (grabación).
- **ffmpeg:** preparación de los videos.
- **Vercel:** publicación.

## 7. Cómo publicarlo en Vercel (≈5 min)

1. Subir el repositorio a GitHub (`git push`).
2. Entrar en vercel.com → **Add New → Project** → importar el repositorio.
3. Vercel detecta **Vite** solo. Build: `npm run build`; salida: `dist`. Pulsar **Deploy**.
4. Copiar la URL y probarla en el móvil (vibración) y con auriculares.

Para probarlo en local:

```bash
npm install
npm run dev
```

## 8. Guion del video demo (30–45 s, en inglés y con subtítulos)

| Tiempo | Imagen | Voz / texto |
|---|---|---|
| 0–5 s | Portada de TerraBeats | "What if you could *hear* our planet change?" |
| 5–12 s | Pulsar Play en **Rayos** | "TerraBeats reads NASA Earth visualizations frame by frame — every lightning flash becomes a beat." |
| 12–20 s | Cambiar a **CO₂** | "Rising CO₂ makes the chord detune and the heartbeat speed up." |
| 20–27 s | **Bosques** + modo explorar con las flechas | "Explore mode lets blind and low-vision users scan the map with the keyboard: taller forests, higher notes." |
| 27–35 s | Pulsar **D** (voz) y cambiar idioma | "Spoken descriptions, Spanish and English, screen-reader ready." |
| 35–40 s | URL | "TerraBeats — the Earth Information Jukebox." |

## 9. Reparto sugerido hasta las 17:30

| Hora | Tarea | Quién |
|---|---|---|
| ahora → 13:00 | Ajustar sonidos y probar con auriculares; comentarios sobre la experiencia | Tú + Claude |
| 13:00 → 13:30 | Subir a GitHub y publicar en Vercel | Tú |
| 13:30 → 15:00 | Grabar el video demo y grabar 4 audios de "playlist" | Tú + 1 compañero |
| 15:00 → 16:30 | Rellenar el formulario con [`SUBMISSION.md`](SUBMISSION.md) | Compañeros (no necesitan buena conexión para redactar) |
| 16:30 → 17:15 | Revisión final y envío | Todos |

## 10. Limitaciones honestas (decirlas suma credibilidad)

- La traducción usa los **colores** de la visualización, no los valores científicos originales. La escala es relativa (bajo → alto), no son ppm ni metros exactos.
- Los textos superpuestos de los videos (fechas, barra de colores) pueden aportar algo de señal.
- La animación de rayos se aceleró 2× y se recortó la introducción para que la demo sea ágil.
- Trabajo futuro: más visualizaciones del EIC, leer los datos numéricos originales, y exportar MIDI.
