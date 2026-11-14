# TerraBeats: qué busca, para quién y por qué importa

## 1. El problema
- El Earth Information Center (EIC) de la NASA cuenta cómo cambia la Tierra **solo con imágenes**.
- Según la OMS (*Informe mundial sobre la visión*, 2019), al menos **2 200 millones de personas** tienen algún problema de visión, cercana o lejana. Para quien no ve o ve poco, esa ciencia simplemente **no existe**. *(Dato a verificar: persona B.)*
- Un texto alternativo como *"Animación de la Tierra con colores"* no transmite **dónde**, **cuándo** ni **cuánto**, que es justo lo que importa en los datos.

## 2. Lo que logramos (la promesa)
> **Que una persona que no puede ver entienda lo que muestran las visualizaciones de la NASA (dónde, cuándo y cuánto cambia la Tierra) y pueda explorarlas por sí misma, solo escuchando.**

Es la **audiodescripción** del cine aplicada a los datos científicos, con una diferencia: el sonido no es decorado. **Es el dato**, generado en tiempo real a partir de cada fotograma.

## 3. Cómo lo logramos: tres capas
| Capa | Qué hace | Ejemplo (Bosques) |
|---|---|---|
| **Voz** | Da contexto: pregunta, lugar, tiempo y conclusión | *"Llega África. Arriba, el Sahara…"* |
| **Sonido-dato** | Convierte la medida en sonido, con referencia previa | Nota grave = 2 m, nota aguda = 45 m |
| **Sonido-icono** | Algo que se reconoce sin explicación | Pájaros = selva alta, olas = océano |

Lo que hace que tenga sentido:
1. **Primero la referencia:** antes de empezar se escucha qué significa cada sonido.
2. **Contraste:** Sahara frente a Congo, 2012 frente a 2023, tierra frente a océano.
3. **Sincronía:** la voz nombra el lugar justo cuando aparece en la imagen.
4. **Autonomía:** al terminar, la persona explora sola con las flechas. Con **F** salta al punto más alto y con **R** repite la última frase.

## 4. Pensado para quien no ve
- **Bienvenida hablada** en la primera interacción y **ayuda con H**: nadie necesita ver la pantalla para orientarse.
- **Un solo narrador:** nunca hablan dos voces a la vez. Pedir la ayuda (H) durante una historia la pausa en vez de saltarla.
- **Pregunta interactiva** en Bosques, Rayos y CO₂ (← / →): la persona escucha y decide, y la respuesta se calcula **con los datos de ese fotograma**.
- **Comentarios en vivo** generados con los datos del momento (*"¡Ráfaga de 64 rayos a tu derecha!"*).
- **Explorar con voz:** al detener el cursor, una voz dice el valor (*"centro: bosque de unos 32 metros"*), aunque no haya lector de pantalla.
- **Todo se maneja con teclado:** Espacio, Esc, 1–4, H, E, F, R, G, D y L.
- **Menú sonoro:** al cambiar de pista, una voz dice cuál es y qué pregunta responde.
- **La narración es audio grabado:** suena igual en cualquier navegador, sin depender de un lector de pantalla.
- **Además es compatible con lectores** (NVDA, TalkBack): etiquetas, regiones vivas y navegación con teclado.
- **Exploración:** cada punto suena y dice su valor, *"bosque de unos 32 metros"*. Un golpe grave avisa del borde de la imagen y el móvil **vibra** según el valor.
- **Bilingüe**, español e inglés, con la voz en ambos idiomas.

## 5. Cómo sabremos que funciona (prueba de impacto)
Pedimos a una persona con los ojos vendados, o mejor, a una persona ciega, que escuche una historia y responda:
1. ¿Dónde están los bosques más altos? *(Amazonía, Congo, sudeste asiático)*
2. ¿Qué país ganó luz y cuál la perdió? *(India / Ucrania)*
3. ¿Dónde caen más rayos? *(África central, sobre tierra y en los trópicos)*
4. ¿Qué le pasa al CO₂ a lo largo del día? *(Sube y baja: "respira")*

**Meta: 3 de 4 respuestas correctas.** El resultado y una frase de la persona que lo probó van en la entrega (persona C).

## 6. Por qué es un producto y no solo una demo
- **Es replicable:** añadir otra visualización del EIC solo requiere 1) el video, 2) la barra de colores para calibrar y 3) un guion con tiempos. La narración se genera sola con `scripts/build-narration.ps1`.
- **Usos reales:** museos y planetarios (el EIC es una exposición), aulas inclusivas y la web de la NASA como "versión sonora" de cada visualización.
- **Es código abierto** y funciona en el navegador: no necesita servidor ni instalación.

## 7. Límites honestos (decirlos suma credibilidad)
- Los valores salen de los **colores** de la visualización, no de los datos científicos originales. Las alturas son aproximadas y el CO₂ se expresa en relativo.
- La voz actual es sintética. Puede sustituirse por voz humana (ver [`GRABACION.md`](GRABACION.md)).
- Siguiente paso: nombrar regiones geográficas en el modo explorar y añadir más visualizaciones del EIC.
