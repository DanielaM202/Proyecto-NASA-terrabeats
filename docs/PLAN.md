# TerraBeats — Plan de mejora para ganar

> Objetivo: que una persona **que solo escucha** entienda qué está pasando en la Tierra, sienta inmersión y pueda explorar por su cuenta.
> Corte de código: **16:00**. Entrega: **17:30**.

---

## 1. Diagnóstico honesto de la versión actual

| # | Problema | Por qué importa |
|---|---|---|
| 1 | **Los sonidos no tienen contexto.** Son sintetizadores abstractos: campanillas, notas, ruido. | Quien no ve oye "música bonita", pero no sabe **qué** representa. Es el fallo principal. |
| 2 | **No hay tiempo ni lugar.** Los videos muestran años (2012–2023) y fechas (enero–marzo 2020), pero el sonido no los dice. | Sin "cuándo" y "dónde" no hay historia. |
| 3 | **En los globos que giran**, izquierda/derecha no es geografía: el paneo no dice "esto es África". | Se pierde el sentido espacial que sí funciona en el mapa plano de luces. |
| 4 | **Valores relativos sin unidades** ("alto", "bajo"). | El jurado valora el rigor. GEDI permite decir **metros**. |
| 5 | **Falta la bienvenida accesible.** Una persona ciega llega a la página y nada le dice qué hacer. | Es la primera impresión para el público objetivo del reto. |
| 6 | **Los textos superpuestos del video** (fechas, barra de colores) se analizan como si fueran datos. | Ensucian la medición. |
| 7 | **No se ha probado en móvil ni con lector de pantalla real.** | Riesgo en la demo. |

## 2. La idea central: tres capas de significado

Para que el sonido **tenga sentido** sin ver, cada pista combina:

1. **Iconos auditivos**: sonidos que se reconocen sin explicación.
   - Rayos → trueno y lluvia.
   - Bosque → viento entre hojas y pájaros.
   - Luces nocturnas → zumbido de ciudad.
   - CO₂ → respiración y latido.
2. **Capa de datos musical**: la medida controla la música.
   - Tono = valor físico. Bosque: metros reales, 0–50 m, leídos de la barra de color del propio video.
   - Volumen = cantidad.
   - Izquierda/derecha = posición.
   - Siempre dentro de escalas musicales.
3. **Capa narrativa (voz)**: un "documental sonoro" con capítulos sincronizados al video, en ES y EN.
   - Ejemplo: *"Año 2012. Escucha las ciudades de la India: casi en silencio…"*.
   - La música baja de volumen mientras habla la voz.

Además:
- **Leyenda auditiva**: antes de empezar, la persona escucha cada sonido aislado y con su nombre. *"Así suena un rayo. Así suena un bosque de 10 metros… y uno de 40 metros."*
- **Regla sonora**: una escala de grave a agudo que marca el rango, de 0 a 50 m.

## 3. Funcionalidades por prioridad

### P0 — Imprescindible (hoy, 12:30 → 14:30)

1. **Leyenda auditiva** por pista: botón y tecla **G**. Reproduce cada sonido con su nombre hablado.
2. **Modo documental guiado**: capítulos con marca de tiempo, narración ES/EN, aviso del año o región y música atenuada bajo la voz. Saltar entre capítulos con **[ y ]**.
3. **Iconos auditivos realistas**, sintetizados sin archivos externos:
   - Rayos: chasquido, trueno retumbante y lluvia según la actividad.
   - GEDI: viento y pájaros donde hay bosque alto; olas en el océano.
   - Luces: zumbido urbano proporcional a la luz.
   - CO₂: respiración que se vuelve agitada y latido.
4. **Unidades reales**:
   - GEDI en **metros**: tabla color → altura sacada de la barra del video (verificada: 0–50 m).
   - Luces: "ganó luz / perdió luz / estable".
   - CO₂: relativo hasta tener fuente (ver §5).
5. **Bienvenida accesible**: la primera tecla pulsada lanza una voz de bienvenida con instrucciones. Tecla **H** = ayuda hablada.
6. **Máscara de textos superpuestos** (fechas y barras de color) para limpiar la medición.

### P1 — Muy valioso (14:30 → 15:30, según tiempo)

7. **Rayos sobre el mapa plano real** (video Science On a Sphere, 4096×2048): la geografía pasa a ser real.
   - Longitud → oído izquierdo/derecho.
   - Latitud → tono.
   - Nombres de regiones: *"tormentas sobre la cuenca del Congo"*.
   - Requiere descargar 334 MB y comprimirlo.
8. **Asistente de voz** (reconocimiento de voz del navegador, en Chrome). Comandos en ES/EN: *"reproducir", "siguiente pista", "¿qué estoy escuchando?", "¿dónde hay más rayos?", "leyenda", "explorar"*. Así la web se maneja **sin pantalla ni teclado**.
9. **Buscar punto caliente** (tecla **F**): lleva el cursor de explorar al lugar de máxima actividad y lo anuncia.
10. **Antes / después** en luces nocturnas: escuchar 2012 contra 2023 seguidos.

### P2 — Después / si sobra tiempo

11. Rediseño estético (lo vemos después, como acordamos).
12. Línea de tiempo de cada pista precalculada, con un "resumen sonoro de 10 s" de toda la pista.
13. Más pistas del EIC (aerosoles GEOS en varias capas) y modo sin conexión (PWA).

## 4. Evaluación del PDF y del análisis de la otra IA

**En qué aciertan (y ya está hecho o entra en el plan):**
- Escalas musicales para evitar ruido.
- Tres capas: fondo, melodía y pulso.
- Rayos en estéreo según dónde caen.
- En GEDI, altura → tono.
- Que el CO₂ "respire".
- Probar en móvil.

**Lo que hay que corregir o matizar:**
- **"CO₂ de 380 a 460 ppm" no está verificado.** La barra oficial (`dyamondCbar`) no trae números en la ficha del SVS, y el texto solo dice *"Global CO2 ppm"*. Si decimos ppm sin fuente y un jurado lo revisa, perdemos credibilidad. → Tarea de la persona D (§5).
- **GEDI 0–50 m: confirmado.** Se ve en la barra "Height Above Ground" dentro del video que usamos.
- **"Usar la imagen estática de rayos de 50 KB"**: pierde la dimensión del tiempo (2017–2023). Mejor el video del mapa plano comprimido (P1-7).
- **"Script en Python que exporte un JSON"**: no hace falta para el tiempo real, porque ya analizamos en el navegador. Sí sirve para la línea de tiempo (P2-12).
- **"LFO de respiración día/noche" para el CO₂**: un oscilador fijo sería **decoración, no dato**. Lo haremos con el cambio **medido** entre fotogramas.
- **Aerosoles y calidad del aire**: buenas ideas, pero no caben hoy. Pueden ir como "trabajo futuro".

## 5. Tareas del equipo (4 personas, aptas para mala conexión)

| Persona | Rol | Qué entrega | Dónde |
|---|---|---|---|
| **A** | **Guion y narración** | Texto de cada capítulo (1–2 frases, ES y EN) para las 4 pistas, usando los tiempos de la plantilla que dejo. Tono documental y emotivo, pero exacto. | `docs/narrativa.md` |
| **B** | **Ciencia y verificación** | 1) Buscar la fuente del rango de CO₂ (ppm) de DYAMOND: página SVS 5196, papers de GEOS/DYAMOND o contacto en la ficha. 2) Verificar cada dato de los textos con su fuente. 3) Glosario corto: LIS, GEDI, LiDAR, ppm, DYAMOND. | `docs/ciencia.md` |
| **C** | **Accesibilidad y pruebas** | 1) Instalar NVDA (Windows, gratis) o usar TalkBack (Android). 2) Probar la web **solo con teclado y lector** en cada versión publicada y anotar fallos. 3) **Ideal:** que una persona ciega o con baja visión la pruebe 10 minutos y dé una frase de opinión con permiso para citarla. Es oro para el jurado. | `docs/pruebas.md` |
| **D** | **Entrega y pitch** | 1) Leer las reglas de Space Apps 2026 (duración del video, nº de diapositivas, declaración de IA, uso de marca NASA). 2) Preparar las diapositivas. 3) Pulir `SUBMISSION.md` y el guion del video. 4) Rellenar el formulario como borrador. | `docs/SUBMISSION.md` |

**Tú + Claude:** todo el código. Tu tarea clave: **escuchar con auriculares** cada versión y decirme qué sientes. Yo no puedo oír el resultado.

## 6. Cronograma

| Hora | Qué |
|---|---|
| 12:30 → 14:30 | P0 completo (Claude programa; tú escuchas cada ~30 min) |
| 14:30 → 15:30 | P1: mapa plano de rayos, asistente de voz, punto caliente |
| 15:30 → 16:00 | **Congelar código**, publicar en Vercel, probar en móvil y con lector |
| 16:00 → 17:00 | Grabar el video demo y completar el formulario |
| 17:00 → 17:30 | Margen y envío |
