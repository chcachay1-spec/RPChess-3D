# T-01 — Style Guide (Referencia visual maestra)

> **Ticket:** T-01
> **Cumple:** US-10 (Style guide aprobado), US-11 (Entrega en orden con validación)
> **Criticidad:** 🔴 BLOQUEANTE — sin style guide no se genera ningún otro asset.
> **Trazabilidad Constitución:** Principio 2 (Validar antes de avanzar) y Principio 3 (Style guide es ley).

---

## 🎯 Qué

Una imagen de referencia que establece el **lenguaje visual maestro** de RPChess 3D. Es la "foto fija" que todos los demás assets van a imitar. Sin esto aprobado, los demás prompts van a producir resultados inconsistentes.

## 🤔 Por qué

La Constitución dice "Style guide es ley". Si generamos el tablero y los 6 héroes sin un style guide, cada prompt va a salir con su propio estilo y van a chocar entre sí (peces fuera del agua). El style guide es la plantilla que garantiza coherencia.

## 🛠️ Cómo se genera

**Esta imagen la generas TÚ con tu herramienta (Nanobanana u otra).** Yo te doy el prompt copy-pasteable y los settings sugeridos. Tú lo corres, me mandas el resultado, y validamos.

### Prompt para Nanobanana / generador de imágenes

```
Master visual reference for a 3D low poly chess tactics game.

ISOMETRIC CAMERA, 3/4 view from above (Fire Emblem / Duellist of the Roses angle, 30 degrees tilt). The viewer looks down onto the scene from upper-left.

CENTER OF THE SCENE: a small hex grid (3 rows of 3 hexagons = 9 hexes total) showing all 3 terrain types:
- 3 RED hexes: raised hexagonal platforms (about 2x taller than the others), bright red top surface (#DC2626), slightly darker red sides
- 3 GREEN hexes: flat hexes at ground level, medium green top (#16A34A), slightly darker green sides
- 3 BLUE hexes: sunken hexagonal pits (recessed below ground level), blue top surface (#2563EB), darker blue inside walls

ON THE CENTER GREEN HEX: a KING piece — humanoid low poly figure, chunky geometry, about 500 triangles, with crown, cape, sword, royal silhouette. Solid flat colors per face (no painted textures). Material tint: BLUE (ally team, #3B82F6 accent). Pose: standing tall, sword in hand.

BACKGROUND BEHIND THE BOARD:
- A small low poly STONE TOWER in the upper-right background (capture point structure), grey stone color, with crenellations on top
- A small low poly WOODEN CHEST in the lower-left background (treasure), brown wood with metal hinges
- A BLUE BANNER on a pole in the upper-left background (base marker), blue fabric on a wooden pole

UPPER-RIGHT CORNER: a small color palette swatch showing 5 colored squares in a row, each with a tiny label:
- Red swatch (#DC2626) "high"
- Green swatch (#16A34A) "medium"
- Blue swatch (#2563EB) "low"
- Blue swatch (#3B82F6) "ally"
- Red swatch (#EF4444) "enemy"

LIGHTING: 1 directional light from upper-left, soft shadows on the right and bottom of objects. No bloom, no glow.

BACKGROUND FILL: smooth gradient from dark navy blue at top to near-black at bottom. NO stars, NO clouds, NO landscape.

STYLE:
- Low poly with chunky faceted geometry (Warcraft 3 silhouette in volume)
- FLAT SHADED colors per face (no painted textures, no gradients, no noise)
- NO outlines, NO black lines on edges
- Modern indie aesthetic (clean, not photorealistic, not exaggerated cartoon)
- Saturated colors but not neon

DO NOT INCLUDE:
- Painted hand textures (we are going flat shaded)
- Photorealistic materials or PBR shaders
- Text, UI, HUD elements
- Particle effects, glow, bloom
- Other pieces (queen, rook, bishop, knight, pawn) — only the king
- More than 1 hero total
- Realistic human faces
```

### Settings sugeridos

| Parámetro | Valor | Por qué |
|---|---|---|
| **Aspect ratio** | `16:9` | Panorámico, permite ver tablero + paleta en una sola imagen. |
| **Resolution** | `2K` (2048×1152) | Suficiente detalle sin archivo pesado. |
| **Modelo** | Nanobanana Pro / Midjourney v6 / DALL-E 3 / SDXL | Cualquiera moderna que respete "low poly". |
| **Negative prompt** (si tu IA lo soporta) | "textures, painted details, photorealistic, PBR, glow, bloom, particles, ui, text, multiple heroes" | Refuerza lo que NO queremos. |

### Qué validar (checklist visual)

Después de que generes la imagen, verificá:

- [ ] **Cámara**: ¿se ve isométrica (3/4 desde arriba)?
- [ ] **Tablero**: ¿se ven 9 hexágonos (3 filas de 3)?
- [ ] **3 relieves distintos**: ¿se distingue claramente el rojo elevado, verde plano y azul hundido?
- [ ] **Colores**: ¿rojo/verde/azul SATURADOS pero no chillones? ¿Parecen de un juego indie, no de un paint?
- [ ] **Rey**: ¿se ve HUMAN, low poly, chunky, con corona? ¿Tinta azul en el material?
- [ ] **Torre de fondo**: ¿se ve como una estructura defensiva?
- [ ] **Cofre de fondo**: ¿se ve como un cofre de madera?
- [ ] **Bandera de fondo**: ¿se ve tela azul en un palo?
- [ ] **Paleta esquina**: ¿se ven los 5 swatches de colores?
- [ ] **Sin texturas pintadas**: ¿las superficies son de color PLANO, sin detalles?
- [ ] **Sin outlines negros**: ¿no hay líneas negras en los bordes?
- [ ] **Fondo limpio**: ¿es solo un gradiente, sin elementos distractores?

### Qué hacer si NO te gusta

Respondeme con **qué específicamente** no te gusta y por qué. Ejemplos:
- "El rojo se ve más naranja que rojo"
- "El rey parece muy delgado, lo quiero más robusto"
- "Los hexes azules no se ven suficientemente hundidos"
- "Las estructuras de fondo se ven más importantes que el rey"
- "El estilo se ve más cartoon de lo que quiero"

Con tu feedback reformulo el prompt y volvemos a generar. **Máximo 1 reformulación** antes de replantear el style guide (regla de la Constitución).

---

## 📁 Convención de archivo

Una vez aprobada la imagen, guardala en:
```
C:\Users\CrisACC\Desktop\RPChess-3D\assets\style-guide\01_style_guide_master.png
```

Esa va a ser la **referencia oficial** para todos los demás prompts.

---

## ⏱️ Tiempo estimado

| Tarea | Tiempo |
|---|---|
| Correr el prompt en tu IA | 2-5 min |
| Validar el resultado con la checklist | 3-5 min |
| Si todo OK → aprobar y pasar a T-02 (Tablero) | — |
| Si necesita ajustes → decirme qué y reformulo | +5 min |

---

## ❓ Acción

**Copia el prompt, corré en tu IA, mandame el resultado.**

Si tenés Nanobanana configurado podés ir directo. Si querés que yo te lo corra (a pesar del principio de "yo no ejecuto"), decime y lo hago. Pero la Constitución dice que lo corras vos para que vos seas el veredor visual final.
