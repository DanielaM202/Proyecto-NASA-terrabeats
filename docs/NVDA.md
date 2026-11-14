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
| **Primer contacto** | No sabe qué hay en la página | El foco inicial cae en "Escuchar la historia" y suena la bienvenida |

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
