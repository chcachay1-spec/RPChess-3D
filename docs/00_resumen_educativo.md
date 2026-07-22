# RPChess 3D — Resumen Educativo (Fase 0)

> **Versión:** 0.1 · **Fecha:** 21 de julio de 2026
> **Tipo de documento:** Resumen Educativo — describe la visión, el stack, los riesgos y las decisiones cerradas hasta ahora.
> **Estado:** Borrador pendiente de aprobación.

---

## 1. Visión general del proyecto

**RPChess 3D** es la conversión de **RPChess — The Lost Kingdom** (juego 2D web ya en producción v1.0) a una versión **3D con estética low poly**, manteniendo toda la mecánica, el lore, los 3 modos de victoria y los 24+ héroes del juego original. La diferencia visual es total: pasamos de sprites pixel-art sobre un tablero cuadrado a **mallas low poly** sobre una **malla hexagonal con relieve por color**, con la atmósfera de *Yu-Gi-Oh! The Duelist of the Roses* y la solidez de personaje de *Warcraft 3*.

**El proyecto NO es:**
- Reescribir la lógica del juego (esa se mantiene tal cual desde el 2D).
- Migrar de lenguaje de programación.
- Cambiar los modos de victoria ni el balance.

**El proyecto SÍ es:**
- Cambiar el **render** de 2D a 3D (React Three Fiber).
- Cambiar la **malla** de cuadrada a **hexagonal** con 3 niveles de relieve.
- Cambiar los **assets** de pixel-art a **low poly 3D**.
- Construir un **pipeline de prompts** que genere los modelos en orden, los apruebe el Director del proyecto (Cris) y los integre al juego.

---

## 2. Stack conceptual explicado con analogías

> Analogía general: el 2D era como pintar con pinceles sobre un lienzo plano. El 3D es como **esculpir** arcilla y luego ponerla sobre una mesa con luces. Las "reglas del juego" (el reglamento) son las mismas; lo que cambia es el soporte visual.

| Concepto | Qué es | Analogía llana |
|---|---|---|
| **React Three Fiber (R3F)** | Librería que trae Three.js (motor 3D para web) al mundo de React. | En vez de escribir `div` para mostrar cosas, escribís `mesh` (malla 3D). Las "props" son las mismas que ya conocés. |
| **Three.js** | Motor 3D que renderiza geometrías, luces, materiales y cámaras en el navegador. | Es el "motor" que se encarga de mostrar todo en 3D. R3F es solo una forma más cómoda de hablarle. |
| **Low poly** | Modelos 3D hechos con pocos triángulos (decenas o cientos, no millones). | Como origami: pocos dobleces, forma clara. Lo opuesto sería "high poly" (escultura realista, miles de dobleces). |
| **Flat shaded** | Colorear cada cara de un polígono con un color sólido, sin pintar texturas encima. | Como pintar cada cara de un cubo de un color diferente sin usar pinceladas. El look es limpio, geométrico, indie. |
| **Malla hexagonal** | Tablero dividido en hexágonos en vez de cuadrados. | Como un panal de abejas. Cada celda tiene 6 vecinos en vez de 4 u 8. Cambia la estrategia: hay más opciones de movimiento y el flujo es más orgánico. |
| **Pipeline de assets** | La cadena ordenada para producir un asset: prompt → IA generativa → modelo 3D → revisión → importación. | Como una fábrica de figuritas: primero se diseña la plantilla, después se imprimen, se pintan, se empacan, se entregan. |
| **Style guide** | Documento con el estilo visual aprobado (paleta, texturas, iluminación, ángulos) que sirve de referencia para TODOS los assets. | Como el "manual de marca" de una empresa: define cómo se ven las cosas para que todo sea coherente. |
| **Nanobanana / IA de imagen** | Modelo generativo que crea imágenes a partir de texto (prompts). | Es el "artista IA" al que le pasás una descripción y te dibuja lo que pediste. |
| **GLB / GLTF** | Formato estándar de archivo 3D para web (como el JPG pero para modelos 3D). | Es el "archivo" que abrís en el navegador y muestra el modelo en 3D, con su esqueleto, materiales y animaciones. |
| **HexHeightMap / celda** | En el código del juego, cada celda hexagonal tiene un dato `height` (0=bajo, 1=medio, 2=alto) que viene del color del polígono. | Es como un casillero del tablero de ajedrez, pero en vez de tener solo "blanco" o "negro", tiene "bajo, medio, alto". |

---

## 3. Riesgos técnicos identificados

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | **Consistencia visual entre 11+ assets generados por IA.** Distintos prompts pueden producir estilos diferentes (ángulos, colores, nivel de detalle). | Style guide aprobado como primer entregable. Cada prompt se construye a partir de ese style guide. Si un asset rompe la coherencia, se reformula el prompt. |
| 2 | **El proyecto 2D está en React+TS; el 3D introduce R3F como nueva dependencia.** | R3F es un *wrapper*, no un reemplazo: el código de UI/HUD se mantiene. El motor tácticos del 2D se reutiliza. |
| 3 | **Formato 3D vs 2D**: el proyecto 2D usa PNGs; el 3D necesita GLB/GLTF. Hay que cambiar la pipeline de assets de "imagen" a "modelo 3D". | Empezar por el style guide, después el tablero, después los héroes. Cada paso se valida antes de seguir. |
| 4 | **200 hexágonos × múltiples materiales × 24 unidades = potencial sobrecarga del navegador.** | Para v1 (vertical slice) vamos con 6 unidades + tablero parcial. La optimización de performance se aborda DESPUÉS de validar el look. |
| 5 | **Migración del código táctico del 2D al 3D**: lógica de movimiento debe pasar de coordenadas cartesianas (x, y) a coordenadas axiales/cúbicas de hexágono. | Esto es un ticket específico de Fase 2/3. NO se aborda hasta validar el look visual. |
| 6 | **Color del relieve como dato de juego**: el código del juego actual usa "terrain type" (llanura, bosque, agua, etc.). El nuevo modelo añade "height" (alto/medio/bajo) que el código aún no maneja. | Decisión a cerrar en Fase 1 (PRD): ¿el relieve es solo visual o afecta la mecánica? Si afecta (ej: alto da bonus de visión, bajo da penalización), hay que diseñar cómo. |

---

## 4. Clarificaciones (decisiones cerradas)

> Estas son las decisiones que cerramos juntos en la Fase 0 vía popup. Son **inmutables** salvo acuerdo explícito en sentido contrario.

| # | Decisión | Implicación |
|---|---|---|
| D-01 | **Engine:** React Three Fiber (R3F) sobre stack web/Node, local con opción de deploy a web. | El proyecto 2D se conserva como referencia de datos. El 3D es una capa nueva de render. |
| D-02 | **Polígonos del suelo:** hexágonos (6 lados). | Reemplaza la grilla 10×20 cuadrada del 2D. Mantenemos 200 celdas totales o se ajusta en Fase 1. |
| D-03 | **Relieve:** visualización con color **Y** altura 3D real. Rojo = tarima elevada, verde = llano, azul = foso. | Cada celda tiene geometría 3D distinta según su nivel. El código de juego usará `height` como dato. |
| D-04 | **Estilo de personajes:** low poly chunky (estilo Warcraft 3 en volumen) + colores planos sin textura (estilo indie moderno). Híbrido. | Mallas simples, sin texturas pintadas. Colores sólidos por cara. |
| D-05 | **Alcance de v1:** vertical slice = 1 style guide + 1 tablero de muestra + 6 héroes básicos (rey, reina, torre, alfil, caballo, peón) + 3 estructuras (torre de captura, bandera, cofre). | ~11 prompts. No incluye tropas, bestias, cartas ni UI. Esos vienen en v2. |
| D-06 | **Pipeline:** yo genero el prompt, Cris lo corre en la IA, valida el resultado, y avanzamos. | No ejecuto la generación yo. Entrego prompts uno por uno, en orden, con check de aprobación entre cada uno. |

---

## 5. Preguntas abiertas (mover a Fase 1 / PRD)

> Estas preguntas no son bloqueantes para arrancar el pipeline de assets, pero hay que cerrarlas en Fase 1 (PRD) o Fase 2 (Arquitectura) antes de implementar el código.

### 5.1 Diseño del relieve
- **¿El relieve es solo visual o afecta la mecánica?** ¿Una pieza en hex "alto" (rojo) tiene bonus de visión o defensa? ¿Una pieza en hex "bajo" (azul) tiene penalización? Esto cambia el balance del juego.
- **¿El relieve se puede CAMBIAR durante la partida?** (ej: una carta convierte hex bajo en alto, o un terremoto cambia el mapa). Esto añade complejidad enorme.

### 5.2 Paleta de colores exacta
- **¿Qué rojo?** Crimson (#DC143C), escarlata, terracota, borgoña.
- **¿Qué verde?** Esmeralda, oliva, jade, musgo.
- **¿Qué azul?** Cobalto, zafiro, acero, agua.
- **¿Saturación?** Saturated cartoon (estilo Balatro) o más sobrio (estilo Slay the Spire).

### 5.3 Cámara y ángulo de vista
- **Isométrica** (estilo Fire Emblem, 45° de inclinación).
- **Top-down** (estilo Dofus, vista casi cenital).
- **3rd person** (estilo Duellist of the Roses, ángulo más bajo y dramático).
- **Libre** (orbit con mouse, el jugador decide).

### 5.4 Board theme
- **¿1 tablero genérico** (estilo "campo de batalla medieval")?
- **¿5 tableros por bioma** (llanura, bosque, montaña, fortaleza, etc.) como el 2D?
- **¿Tablero modular** (1 base + 5 sets de decoraciones que se cambian)?

### 5.5 Cartas
- **¿Las cartas son 3D** (volumen real, se ven desde el ángulo de cámara)?
- **¿O son overlay 2D** (imagen PNG en un Canvas, sin volumen 3D)?
- Esto define si entran en el scope de v1 o se dejan para v2.

### 5.6 Animaciones
- **¿Cuántas por pieza?** Idle (parado), walk (camina), attack (ataca), death (muere), victory (celebra).
- **¿Idle mínimo + caminar + attack + death es suficiente para v1?**
- Las animaciones se hacen en Blender o con librerías de R3F (no se generan con IA de imagen, se animan después).

### 5.7 Identificación de bando
- En el 2D se usa **tinte** (aliado azul, enemigo rojo) sobre el mismo sprite.
- **¿En 3D mantenemos la misma lógica** (mismo modelo con material azul/rojo)?
- **O cada bando tiene su propio modelo** (rey aliado + rey enemigo, con detalles distintos).
- Recomendado: misma lógica del 2D por SIMPLE y consistencia, pero se confirma en Fase 1.

---

## 6. Orden de entrega del primer batch (v1 Vertical Slice)

> Esta es la **lista en orden** en la que voy a entregar los prompts. Cada uno se valida con "todo ok" o "redefine" antes de pasar al siguiente.

| # | Asset | Tipo | Para qué sirve | Validación esperada |
|---|---|---|---|---|
| 01 | **Style guide** | Referencia visual | Establece paleta, ángulos, iluminación, acabado. Es la LEY para todos los demás. | "ok, dale con el tablero" o "redefine la paleta a más cálida" |
| 02 | **Tablero hexagonal con 3 relieves** | Modelo 3D / imagen | Valida que el hexágono se ve bien y que los 3 niveles se distinguen claramente. | "ok, los hexes se ven bien" o "el rojo parece más alto de lo que pensé" |
| 03 | **Rey** | Personaje low poly | Valida el estilo de personaje. Es el más icónico, lo elegimos primero. | "ok, el estilo me gusta" o "las facciones están raras" |
| 04 | **Reina** | Personaje low poly | Valida que el estilo se replica con un personaje femenino/mágico. | "ok" o "redefine" |
| 05 | **Torre (Rook)** | Personaje low poly | Valida piezas "tanque" con volumen cuadrado. | "ok" o "redefine" |
| 06 | **Alfil (Bishop)** | Personaje low poly | Valida piezas "etéreo/diagonal" con silueta distinta. | "ok" o "redefine" |
| 07 | **Caballo (Knight)** | Personaje low poly | Valida piezas "móvil/dinámico" con pose activa. | "ok" o "redefine" |
| 08 | **Peón (Pawn)** | Personaje low poly | Valida piezas "básicas" con silueta simple. | "ok" o "redefine" |
| 09 | **Torre de captura** | Estructura | Valida el estilo de estructuras (puntos de control en el mapa). | "ok" o "redefine" |
| 10 | **Bandera (marcador de base)** | Estructura | Valida marcadores de objetivo. | "ok" o "redefine" |
| 11 | **Cofre (recompensa)** | Estructura | Valida elementos interactivos del mapa. | "ok" o "redefine" |

**Total v1:** 11 prompts. Después de validar el look, se expande a v2 con tropas, bestias, cartas y UI.

---

## 7. Próximo paso

Una vez aprobado este resumen (y la Constitución si la creamos), pasamos a **Fase 1 — Gerente de Producto**, donde escribo el **PRD** con criterios EARS, cerrando las preguntas abiertas de la sección 5.

**¿Apruebas este resumen y la Constitución para pasar a Fase 1?**
