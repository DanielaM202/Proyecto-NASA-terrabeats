# TerraBeats y NVDA — análisis y protocolo de prueba

> NVDA es el lector de pantalla gratuito más usado en Windows por personas ciegas. Si TerraBeats funciona bien con NVDA, funciona para su público principal.
> **Estado:** este análisis sale de revisar el código y la estructura de la página. **Falta la prueba real con NVDA** (persona C): es lo que convierte "debería funcionar" en "funciona".

## 1. Cómo se relacionan NVDA y TerraBeats
TerraBeats no depende de NVDA: la narración es audio propio y los valores se dicen con la voz del navegador. Pero una persona ciega **llega** a la web con NVDA encendido, así que ambos deben convivir.

| Tema | Qué pasa con NVDA | Cómo lo resolvemos |
|---|---|---|
| **Atajos de una letra** (H, D, F, E, R, 1–4…) | En el "modo exploración" de NVDA esas teclas son suyas (H = siguiente encabezado, 1–4 = encabezados por nivel, D = regiones…). **No llegan a la página.** | Todas las funciones son también **botones**: se recorren con Tab y se activan con Enter. Para usar las teclas, NVDA + Espacio activa el "modo foco". La ayuda hablada (H o botón) lo explica |
| **Flechas en el modo explorar** | NVDA las usaría para leer línea a línea | La imagen se marca como `role="application"`: NVDA pasa las flechas a la página automáticamente |
| **Flechas en la pregunta** | Mismo problema | La pregunta recibe el foco y también es `role="application"`; además hay dos botones |
| **Dos voces a la vez** | NVDA leería los textos mientras suena nuestra voz | Con "Voz integrada" encendida, las regiones de texto vivo se silencian para NVDA. Si la persona prefiere NVDA, apaga "Voz integrada" y los textos pasan a NVDA |
| **Orientación** | Necesita encabezados y regiones | La página tiene `header`, `main`, `footer`, encabezados por sección, enlace "Saltar al reproductor" y botones con nombre y estado (`aria-pressed`) |
| **Reproductor de episodios** | Una barra de posición mal etiquetada dice "slider 43" y no sirve de nada; una que se actualiza cada segundo hace que NVDA hable sin parar | Los botones son nativos y tienen nombre ("Capítulo siguiente"). La barra usa `aria-valuetext` con el tiempo y el capítulo en palabras y **se congela mientras tiene el foco**, para que NVDA no repita cada segundo. Los capítulos son frases, así que cada salto cae al inicio de una frase. Las teclas del episodio solo actúan dentro del reproductor |
| **Dos voces a la vez** | Al pulsar play en un episodio como primera acción, sonaba también la bienvenida; al pausar el episodio, la bienvenida seguía (parecía que no se podía pausar) | Corregido: la ayuda, la bienvenida, la historia y los episodios se pausan unos a otros, y la bienvenida no se activa si la primera acción es un episodio. **Esc** o el botón "Detener todo el audio" lo detiene todo |
| **Primer contacto** | No sabe qué hay en la página | El foco inicial cae en "Escuchar la historia" y suena la bienvenida |

### En el móvil (TalkBack en Android, VoiceOver en iPhone)
- Con un lector táctil activo, arrastrar un dedo **mueve el foco del lector, no llega a la página**. Por eso el modo explorar tiene una **cruceta de botones** (▲ ◀ ▶ ▼, ⌖ y "Pasos grandes"): se navega con deslizamientos del lector y cada botón dice el valor en voz alta.
- La vibración solo funciona en Android con Chrome; en iPhone no existe esa función del navegador y la cruceta con voz es la alternativa.
- Los botones de los auriculares y la pantalla de bloqueo controlan los episodios de la Playlist (capítulo anterior/siguiente).

## 2. Riesgos conocidos (a confirmar en la prueba)
1. NVDA puede **hablar encima de la narración** al leer el nombre del botón que recibe el foco. Es breve, pero hay que oírlo.
2. La voz del navegador (respuestas, valores) y NVDA usan canales distintos: pueden pisarse si la persona mueve el foco mientras habla.
3. El video puede ser anunciado como "video" sin más; tiene etiqueta y descripción, pero hay que comprobar cómo lo lee.
4. En móvil, con TalkBack o VoiceOver, no hay teclas: todo depende de los botones y del modo explorar táctil. No está probado.

## 3. Protocolo de prueba (20 minutos, persona C)
Instalar NVDA (gratis, nvaccess.org) y abrir la web publicada en Chrome o Edge. **Apagar el monitor o cerrar los ojos.**

| # | Tarea | ¿Se logró? | Observaciones |
|---|---|---|---|
| 1 | Entender qué es la página solo con lo que se oye al entrar | | |
| 2 | Empezar la historia de Bosques (Tab + Enter, o Espacio) | | |
| 3 | Responder la pregunta con las flechas o con los botones | | |
| 4 | Pausar y continuar la historia | | |
| 5 | Al terminar, explorar con las flechas y entender los valores | | |
| 6 | Cambiar a la pista de Rayos sin ayuda | | |
| 7 | Pedir la ayuda hablada | | |
| 8 | Cambiar el idioma a inglés | | |
| 9 | Con "Voz integrada" apagada: ¿NVDA lee los valores al explorar? | | |
| 10 | En un episodio de la Playlist: reproducir, pausar y saltar al capítulo siguiente con los botones | | |
| 11 | Mover la barra de posición con las flechas: ¿NVDA dice el tiempo y el capítulo sin hablar encima del audio? | | |
| 12 | Cambiar la velocidad a 1,5× y a 2×: ¿se entiende bien la narración? | | |
| 13 | Abrir "Capítulos y transcripción" y saltar a un capítulo desde la lista | | |
| 14 | **En el móvil con TalkBack o VoiceOver:** activar el modo explorar y recorrer la imagen solo con la cruceta | | |
| 16 | Con un episodio sonando, pulsar el botón "Escuchar ayuda": ¿el episodio se pausa y solo se oye la ayuda? ¿Y Esc detiene todo? | | |
| 17 | Dentro de un episodio, pulsar H: ¿se entiende la ayuda de los episodios? | | |
| 19 | Pausar la historia a mitad de una frase y de un sonido de ejemplo: ¿se silencia todo al instante y no entra ninguna frase hasta continuar? | | |
| 20 | En una pregunta: ¿se entiende que hay que usar la flecha izquierda o derecha? | | |
| 21 | Modo explorar en Océanos: ¿el nombre del mar y la temperatura coinciden con el color que señalas? | | |
| 22 | Botón "Ver mejor": ¿se anuncia como botón desplegable, y cada opción dice si está activada? | | |
| 23 | En modo libre, M dos veces: ¿se oye el momento A, luego la comparación, y los botones "Ir a A" y "Ir a B" se anuncian bien? | | |
| 18 | "Reproducir toda la playlist": ¿pasa sola de un episodio a otro? | | |
| 15 | Escuchar la leyenda (G): ¿se entiende el "Por qué" después de cada sonido? | | |

Anotar además: momentos en que hablaron dos voces, textos que NVDA leyó mal y cualquier punto donde la persona se perdió.

## 4. Preguntas de comprensión (prueba de impacto)
Después de escuchar, sin ver la pantalla:
1. ¿Dónde sonaron los bosques más altos?
2. ¿Qué país apareció con luces nuevas y dónde se apagaron luces?
3. ¿Dónde se ven más rayos, sobre tierra o sobre océano?
4. ¿Qué le pasa al CO₂ entre el día y la noche?

El resultado (personas, aciertos y una frase textual con permiso) va en `SUBMISSION.md`.

## 5. Referencia
La NASA publicó en 2024 un estudio sobre sus propias sonificaciones ("A Universe of Sound"), probadas con personas ciegas, con baja visión y videntes. Es el precedente directo de este enfoque: sonificación acompañada de descripción, evaluada con sus usuarios. https://www.frontiersin.org/articles/10.3389/fcomm.2024.1288896
