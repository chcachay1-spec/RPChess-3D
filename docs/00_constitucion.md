# RPChess 3D — Constitución del Proyecto

> **Versión:** 0.1 · **Fecha:** 21 de julio de 2026
> **Tipo de documento:** Constitución — principios inmutables que gobiernan el proyecto.
> **Estado:** Recomendada. Si la apruebas, sus principios se mantienen durante todo el proyecto salvo acuerdo explícito de cambiarlos.

> **Analogía:** la Constitución es como el reglamento de un juego de mesa. Las reglas de "cómo se mueve una pieza" no cambian a mitad de partida; solo se cambian si todos los jugadores están de acuerdo y se anuncia. Aquí igual: las reglas de cómo producimos y validamos assets no cambian a mitad del proyecto.

---

## Los 5 principios

### 1. **SIMPLE primero**
- Vertical slice antes que librería completa.
- Mínimo viable antes que expansión.
- Decisiones cerradas > opciones abiertas.
- Si una decisión añade más de 2 elementos de complejidad, se replantea o se posterga.

### 2. **Validar antes de avanzar**
- Cada prompt de asset se entrega, Cris lo evalúa, y solo después paso al siguiente.
- El style guide es la primera entrega de v1 y se aprueba antes de cualquier otro asset.
- Si un asset rompe el style guide, se reformula el prompt (no se "parchea" el asset).
- Máximo 1 reformulación por asset antes de replantear el style guide.

### 3. **Style guide es ley**
- Todos los assets generados se ciñen al style guide aprobado.
- Cualquier desviación se documenta en el Changelog del Resumen y se aprueba explícitamente.
- Las piezas aliadas y enemigas se distinguen por **paleta de color del material**, no por modelos distintos (continuidad con el proyecto 2D).

### 4. **Trazabilidad obligatoria**
- Cada prompt indica su propósito (tablero, héroe X, estructura Y).
- Cada entregable se nombra con la convención `NN_nombre_descriptivo.png` o `.glb` (donde `NN` es el número de orden en el batch).
- Cada ticket de Fase 2 enlaza explícitamente al requisito del PRD (Fase 1) que cumple.

### 5. **Pipeline visible y reproducible**
- Yo entrego el prompt → Cris lo corre en la IA → Cris muestra el resultado → yo itero si hace falta.
- Yo no ejecuto la generación de imágenes/modelos. Solo produzco los prompts.
- Los prompts se guardan en una carpeta del proyecto (`/prompts/`) para poder revisarlos y reutilizarlos.

---

## Cuándo se aplica cada principio

| Principio | Aplica en... | Ejemplo |
|---|---|---|
| SIMPLE primero | Decisiones de diseño y arquitectura | "Mejor 1 tablero que 5 biomas en v1" |
| Validar antes de avanzar | Entrega de cada prompt | "No paso al héroe #5 hasta que apruebes el #4" |
| Style guide es ley | Revisión de cualquier asset | "El color de este bando no respeta la paleta del style guide" |
| Trazabilidad | Estructura de archivos y tickets | "Este ticket cumple US-3.2 del PRD" |
| Pipeline visible | Comunicación de avance | "Te paso el prompt #4, espero tu visto bueno" |

---

## Excepciones permitidas (cómo cambiarlas)

Si en algún momento un principio bloquea el progreso o queda obsoleto, se puede modificar **solo si**:
1. Se documenta la razón del cambio en el Changelog del Resumen Educativo.
2. Cris aprueba explícitamente el cambio.
3. El cambio no invalida decisiones ya tomadas (por ejemplo, si el style guide cambió, hay que re-validar los assets previos).

**Violar un principio en silencio NO está permitido.**

---

## Siguiente paso

**¿Apruebas esta Constitución (o querés que ajuste algún principio) para pasar a Fase 1?**
