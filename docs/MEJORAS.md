# Análisis general: cómo subir el valor frente al desafío "Earth Information Jukebox"

El desafío pide una rocola que convierta datos de la NASA (EIC y SVS) en sonido para que **cualquier persona, incluidas las ciegas o con baja visión, pueda explorar la ciencia de la Tierra**. Evaluación honesta de dónde estamos:

## Lo que ya aporta valor
- Cinco pistas con datos reales (GEDI, ECCO2, Black Marble, LIS, DYAMOND CO₂) sonificados **en tiempo real a partir de los píxeles** del video de la NASA, sin datos inventados.
- Historias guiadas bilingües, preguntas que se responden **con el oído**, modo explorar con geografía real (nombre del mar y temperatura), playlist de episodios, ayuda hablada y compatibilidad con lector de pantalla.
- Honestidad: cada afirmación de la voz se contrasta con lo medido (ver `SIGNIFICADO_SONIDOS.md`).

## Qué se encontró y se corrigió
1. **Narración que no coincidía con el sonido** (rayos "silencio" con golpes constantes). Corregido en el motor y en el guion.
2. **El significado no era explícito.** Ahora cada introducción y cada leyenda dice qué significa el sonido *y su ausencia*.
3. **Mezcla desequilibrada** (sonidos 15–35 dB por debajo de la voz). Ahora hay compresión, ganancia por pista medida y ducking más suave.

## Propuestas, de mayor a menor impacto
| Propuesta | Por qué suma | Esfuerzo |
|---|---|---|
| **Panel "Qué estás oyendo"** en vivo (por canal: "golpes: muchos", "trueno: sí") | Hace visible y verificable la relación dato→sonido, también para el jurado y para personas sordociegas con línea braille | Medio |
| **Pista "Todo está conectado"** que combine dos conjuntos (p. ej. CO₂ + luces nocturnas, o aerosoles GEOS 5669 + calidad del aire 5533) | Es lo que el reto llama a hacer con el catálogo EIC; hoy cada pista está aislada | Alto |
| **Comparación antes/después en estéreo** (luces 2012 a la izquierda, 2023 a la derecha) | Convierte el cambio temporal en algo que se oye sin explicación | Medio |
| **"Tu lugar"**: escribir o elegir una ciudad y oír su dato | Personaliza y conecta con el usuario (Cajamarca) | Medio |
| **Pruebas con personas ciegas** y NVDA (`NVDA.md`), con su resultado en `SUBMISSION.md` | Es la evidencia más fuerte de utilidad real; falta una línea TODO | Equipo |
| **Despliegue público** (Vercel) y **video de 30 s** | Sin enlace y video el jurado no puede probarlo | Bajo |
| Pistas del catálogo restante (corrientes 5425, río atmosférico 4960, aerosoles 5669) | Más cobertura temática con el mismo motor | Medio por pista |

## Sobre la mezcla (voz vs. sonidos)
- Causa: la voz está normalizada a −16 LUFS (muy presente), mientras que las pistas son texturas escasas con notas cortas (RMS −31 a −52 dB). Además, el ducking las bajaba otros 14 dB.
- Solución aplicada: ganancia por pista, compresor de "pegamento" y ducking de 9 dB. Objetivo: lecho claro unos 9–12 dB por debajo de la voz, sin tapar la narración.
- Pendiente de validar con oyentes: el nivel exacto es subjetivo; el control de volumen sigue disponible.
