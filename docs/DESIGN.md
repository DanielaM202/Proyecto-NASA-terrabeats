# Dirección de diseño

**Idea:** un observatorio científico sobrio. La NASA aporta las imágenes; la interfaz se mantiene en segundo plano y deja que los datos y el audio sean los protagonistas. Sin emojis ni iconos decorativos.

## Reglas que no se rompen
- **El audio y el teclado van primero.** El rediseño solo cambia la presentación: mismos controles, mismas teclas, mismo orden de tabulación y mismos nombres accesibles. "Escuchar ayuda" y "Detener todo" siguen siendo lo primero.
- Contraste alto y un único anillo de foco amarillo, visible en toda la página.
- El movimiento es suave, opcional y se apaga con `prefers-reduced-motion`.
- Ninguna imagen decorativa lleva texto alternativo; las imágenes con significado lo explican.

## Sistema
| Elemento | Decisión |
|---|---|
| Base | Azul casi negro (`slate-950` `#060a12`) con paneles `slate-900` y borde fino |
| Acento de la interfaz | Un solo dorado, `#f2c14e`, para la acción principal y el foco |
| Acento por pista | Tomado de su propio dato: bosques `#8fcf7e`, océanos `#5eb6e8`, luces `#f2c14e`, rayos `#b9a2ff`, CO₂ `#ff9a62` |
| Títulos | Fraunces (serif), para dar carácter editorial |
| Texto | Inter, muy legible; datos y atajos en JetBrains Mono |
| Portada | Fotograma real de la visualización activa de la NASA, oscurecido, con un leve desplazamiento lento, un anillo orbital con un satélite y un resplandor atmosférico en el borde |
| Fondo | Cielo nocturno animado (`Starfield.jsx`: estrellas que titilan, una estrella fugaz cada 9-18 s) y un tenue resplandor de nebulosa; se detiene al ocultar la pestaña y queda estático con movimiento reducido |
| Movimiento | Entrada suave de los paneles, tarjetas que se elevan al pasar el cursor y un ecualizador en la pista que suena |
| Iconos | Solo los del reproductor (SVG propios, `aria-hidden`); el botón siempre tiene nombre accesible |

## Dónde está
- Tokens de color y fuentes: `tailwind.config.js`.
- Estilos base y componentes (`.panel`, `.eyebrow`, animaciones): `src/index.css`.
- Iconos: `src/components/Icon.jsx`. Acentos por pista: `ACCENT` en `src/App.jsx`.

## Créditos
Las imágenes y los videos son de las visualizaciones del Scientific Visualization Studio de la NASA. Se acreditan en el pie de página y en `docs/SUBMISSION.md`. El proyecto no representa ni cuenta con el respaldo de la NASA.

## Pendiente
Repetir las pruebas con NVDA (`NVDA.md`) tras este cambio y revisar con una persona de baja visión el contraste del texto secundario.
