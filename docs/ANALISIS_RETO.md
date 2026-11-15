# Análisis frente al reto y a los términos de Space Apps 2026

Rama: `develop`. Fuentes: texto del reto "Earth Jukebox" y *2026 NASA Space Apps Participant Terms and Conditions* (actualizados el 7 de agosto de 2026). No es asesoría legal: son puntos que el equipo debe confirmar.

## 1. Veredicto

- **Alineación con el reto: alta.** Cumple el entregable principal (interfaz web con sonificación en tiempo real a partir de fotogramas del EIC) y también la alternativa (colección curada de audios con explicación del proceso).
- **Cumplimiento de términos: bueno, con 4 puntos que hay que cerrar antes de entregar**, dos de ellos pueden hacer que NASA retire la solución: la licencia de la voz sintética y la cita de todas las fuentes.
- **Mayor oportunidad de valor:** convertir lo "bonito" en algo **demostrado y reutilizable**: prueba con usuarios, controles para baja visión, comparar dos momentos y que cualquiera pueda reproducir el método.

## 2. Términos y condiciones: qué exigen y cómo estamos

| Requisito del texto | Estado | Qué hacer |
|---|---|---|
| La solución aborda directamente un desafío publicado | Cumple | Nada |
| El contenido original debe ser libre u **open source (OSI)**; si no se indica licencia, NASA usa **Apache 2.0** | Falta declararlo | Añadir `LICENSE` y decirlo en README y en la entrega. Recomendado: **Apache 2.0** (coincide con el valor por defecto de NASA) |
| Todo material de terceros debe ser libre o de licencia OSI, y **sus licencias deben identificarse en la documentación**; NASA no acepta soluciones sin esa documentación | Incompleto | Crear `docs/CREDITOS.md` con cada recurso y su licencia (ver sección 3) |
| **Citar todas las fuentes, incluso las abiertas.** NASA puede quitar nominaciones y premios si no se citan | Incompleto | `SUBMISSION.md` solo cita NASA, Tone.js y MDN; faltan React, Vite, Tailwind, lucide, las tres tipografías, Natural Earth, la voz, ffmpeg |
| No incluir **datos personales**. **Nombres, voces o imágenes de menores de 18 no deben aparecer** en ninguna entrega | **Confirmar** | Ahora publicamos los 5 nombres en la página, README y entrega. Si alguien es menor de edad, hay que quitarlo (y su registro debe haberlo hecho un tutor) |
| Las personas adultas que aparezcan aceptan que NASA use su nombre | Informar | Avisar al equipo: al entregar, NASA puede usar nombre, país e información de la solución (cláusula de publicidad y de medios) |
| **Sin material que promocione productos o servicios comerciales** | Cumple | Mencionamos Vercel, Claude y Microsoft solo como herramientas declaradas, sin logotipos ni promoción. Mantenerlo así |
| Sin información sujeta a control de exportación (ITAR/EAR) | Cumple | Solo datos públicos de NASA |
| **Video de 30 s:** trabajo original, sin contenido de terceros que infrinja derechos, sin menores reconocibles; se otorga a EE. UU. una licencia perpetua y libre de regalías | Pendiente | Usar solo imágenes de la NASA con crédito y nuestro propio audio; sin música ajena; sin rostros de menores |
| Participación vinculada a entidades de China (incluidas universidades) no permitida | Confirmar | Ningún integrante debe participar por afiliación a una entidad china. Es un punto de elegibilidad |
| Declarar el uso de IA | Cumple | Ya está en `SUBMISSION.md` |

## 3. Recursos de terceros y su licencia

| Recurso | Uso | Licencia | Estado |
|---|---|---|---|
| React, React DOM, Vite, Tailwind, PostCSS, Tone.js | Código de la página | MIT | Abierta, falta citarla |
| lucide-react | Iconos | ISC | Abierta, falta citarla |
| Fraunces, Inter, JetBrains Mono | Tipografías | SIL OFL 1.1 (abierta) | Hoy se **cargan desde los servidores de Google Fonts**: no está en el repositorio, depende de un tercero y envía la IP de cada visitante. **Mejor alojarlas dentro del proyecto** |
| Natural Earth (mares y océanos) | Nombres de lugares en el mapa del océano | Dominio público | Falta citarla |
| Visualizaciones del SVS/EIC | Videos e imágenes | Material de la NASA, con crédito | Citadas; mantener el aviso "NASA no respalda este proyecto" |
| Voz de la narración (Kokoro, Apache 2.0) | 148 clips MP3 | Pesos abiertos, generada en el equipo | Resuelto: se descartó Edge |
| ffmpeg, Kokoro, kokoro-onnx, onnxruntime, espeak-ng | Solo herramientas de preparación; no se distribuyen con la página | LGPL/GPL, Apache 2.0, MIT | Citadas en `CREDITOS.md` |

### La voz (decisión tomada)
Los términos piden que todo material no NASA sea libre o de licencia OSI. Las voces de Microsoft Edge (`edge-tts`) venían de un servicio propietario sin acceso oficial ni términos claros, así que **se reemplazaron por Kokoro** (Dora en español, Heart en inglés), con pesos Apache 2.0 y generación local. Los 148 clips y los 10 episodios se regeneraron. Ver `docs/VOZ.md`.

## 4. Alineación con el reto

| Lo que dice el reto | TerraBeats | Estado |
|---|---|---|
| Emparejar fotogramas del EIC con sonificación generada **en tiempo real** | 5 visualizaciones analizadas cada 80 ms con visión por computadora | Cumple |
| Poder **seleccionar** una visualización y oír su paisaje sonoro | Selector de pistas con teclado 1 a 5 | Cumple |
| Herramienta interactiva **o** colección curada de audios con explicación del proceso | Ambas: web interactiva y 10 episodios en dos idiomas con capítulos y transcripción | Cumple |
| Color a tono, densidad a ritmo, reglas artísticas | Altura/temperatura a tono, relámpagos a percusión, CO₂ a tensión y latido | Cumple |
| Equilibrar datos y **musicalidad** | Escalas musicales, pocos sonidos con un significado cada uno, mezcla equilibrada | Cumple |
| **Accesibilidad como tema central**: lector de pantalla, retroalimentación táctil, texto descriptivo | Teclado completo, voz propia, vibración en móvil, transcripción de cada episodio | Cumple en lo técnico |
| Contar el **porqué** de las decisiones artísticas | Leyenda con el motivo de cada sonido, `SIGNIFICADO_SONIDOS.md`, `DESIGN.md` | Cumple |
| Reflejar la **urgencia del cambio climático** y la conexión entre sistemas | CO₂ con tensión; en general mostramos estados, no **cambio** | **Parcial** |
| Personas **ciegas y de baja visión** | Muy buen servicio a personas ciegas; **sin controles específicos de baja visión** (contraste, tamaño) | **Parcial** |
| Evidencia de que funciona | Pruebas técnicas (`PRUEBAS_E2E.md`); **sin prueba con personas ciegas o de baja visión** | **Falta** |

## 5. Valor agregado: propuestas

Ordenadas por impacto frente al reto, esfuerzo y riesgo.

| # | Propuesta | Qué aporta | Esfuerzo |
|---|---|---|---|
| 1 | **Cierre de cumplimiento** (obligatorio): `LICENSE`, `CREDITOS.md`, tipografías alojadas en el proyecto, confirmar mayoría de edad, decidir la voz, actualizar `SUBMISSION.md` | Evita que NASA retire la solución | Bajo |
| 2 | **Panel "Ver mejor" para baja visión**: alto contraste, texto grande, apagar animaciones y fondo, modo solo audio. Se recuerda entre visitas | Cubre a la otra mitad del público del reto y compensa el rediseño visual | Bajo a medio |
| 3 | **Kit de prueba con usuarios** (guion, 4 preguntas, hoja de resultados) y su evidencia en la entrega | Convierte "creemos que funciona" en datos: el punto más débil hoy | Bajo (lo hace el equipo) |
| 4 | **Comparar dos momentos**: marcar un instante, avanzar a otro y que la voz diga qué cambió ("más rayos que antes", "agua más cálida") y suenen los dos | Responde al "planeta que cambia" y al análisis del cambio que pidieron antes | Medio |
| 5 | **Funciona sin conexión (PWA)**: instalable en el teléfono y con los episodios guardados | Alcance real en zonas con mala conexión, como Cajamarca | Medio |
| 6 | **"Mi región"**: atajos del modo explorar a Perú (costa del Pacífico, Amazonía) con lo que dicen los datos; por ejemplo, la temperatura del agua frente a la costa | Cercanía local sin inventar datos | Bajo |
| 7 | Sexta pista (Perpetual Ocean 2, SVS 5425) | Más cobertura temática | Alto |
| 8 | Script que sonifique un video del EIC desde la línea de comandos y genere un WAV | Cumple la opción "script/API" y permite que otros lo reutilicen | Alto |

**Lo que recomiendo hacer en `develop`, en este orden:** 1, 2, 4, 6 y 5 (y que el equipo haga el 3 en paralelo). Dejar 7 y 8 solo si sobra tiempo.

## 6. Estado del cierre de cumplimiento (rama develop)
- Hecho: `LICENSE` (Apache 2.0) y `NOTICE`; `docs/CREDITOS.md` con todas las fuentes y licencias; tipografías alojadas en el proyecto (la página ya no pide nada a Google); README y `SUBMISSION.md` actualizados.
- Confirmado por el equipo: todos son mayores de edad, así que se mantienen los nombres.
- Decidido: voz de Kokoro (Apache 2.0), clips y episodios regenerados.
- Pendiente: grabar el video de 30 s siguiendo la sección 2 y confirmar la cláusula sobre entidades de China.

## 6b. Valor agregado ya construido en develop
- **Ver mejor** (baja visión): alto contraste, texto grande y muy grande, sin movimiento. Se recuerda en el dispositivo.
- **Comparar dos momentos** (tecla M): marca A y B en modo libre y la voz dice qué cambió; botones para volver a cada momento. Probado en las cinco pistas.

- **Mi región** (tecla X, Océanos): el cursor salta a lugares frente a la costa de Perú y la voz dice el lugar y la temperatura medida en el video.
- **Usar sin conexión:** panel que guarda todo en el dispositivo (52 MB, 186 archivos) y funciona instalado como aplicación. Probado apagando el servidor: la página, la historia con voz y sonido, los videos y los episodios siguieron funcionando.

## 7. Qué decide el equipo
1. Voz: Kokoro (decidido).
2. ¿Alguna persona del equipo es menor de 18 años? ¿Se mantienen los nombres en la página?
3. ¿Licencia Apache 2.0 para el código?
4. ¿Qué propuestas del punto 5 entran?
