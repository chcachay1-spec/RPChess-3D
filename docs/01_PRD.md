# RPChess 3D — PRD (Product Requirements Document)
## Especificación Funcional — Fase 1

> **Versión:** 0.1 · **Fecha:** 21 de julio de 2026
> **Estado:** Borrador pendiente de aprobación.
> **Fase:** 1 — Gerente de Producto (Especificar)
> **Trazabilidad:** este PRD se construye sobre el Resumen Educativo (00_resumen_educativo.md) y respeta la Constitución (00_constitucion.md).

---

## 1. Resumen ejecutivo

**RPChess 3D** es la versión 3D en React Three Fiber del juego de ajedrez+RPG táctico RPChess. Mantiene la lógica de juego, los 3 modos de victoria (Regicidio, Captura de Zonas, Roba la Bandera) y el lore del Reino Perdido del proyecto 2D original, pero reemplaza el render pixel-art 2D por **mallas low poly sobre una grilla hexagonal con relieve por color**.

La **diferencia central respecto al 2D** es que el relieve del terreno ya no es solo visual: **rige el ataque de las piezas** (modelo downhill) y se **mezcla al azar cada 6 turnos**, forzando al jugador a re-adaptar su estrategia constantemente.

El objetivo del v1 (vertical slice) es **validar el look & feel** y la **mecánica del relieve en 3D** con un set mínimo de assets: 1 tablero + 6 héroes + 3 estructuras + style guide. Una vez validado, se expande a v2 (todos los 15 héroes, tropas, bestias, cartas, UI completa, 5 biomas).

---

## 2. Usuarios objetivo / Personas

| Persona | Perfil | Qué quiere del 3D |
|---|---|---|
| **Director del proyecto (Cris)** | Creador del juego, gamer PC-primary, no es programador experto. | Validar visualmente que el look low poly y la mecánica del relieve funcionan antes de invertir en todo el set de assets. |
| **Jugador táctico casual** | Jugador de ajedrez / Fire Emblem / Dofus que busca algo nuevo. | Una experiencia visual inmersiva (3D con cámara isométrica) sin perder la profundidad estratégica. |
| **Jugador coleccionista** | Jugador de RPG/CCG que viene por las cartas y la progresión. | Ver a sus héroes favoritos en 3D, personalizar cosméticos. *(fuera de v1)* |

---

## 3. Historias de usuario (formato "Como X quiero Y para Z")

> Numeradas con `US-N` para poder referenciarlas desde los tickets de Fase 2.

### 3.1 Visualización y render

- **US-1: Tablero hexagonal con 3 relieves.** Como jugador, quiero ver un tablero de hexágonos con 3 niveles de altura (alto=tarima roja, medio=llano verde, bajo=foso azul) para entender el terreno y planificar mis movimientos.
- **US-2: Cámara isométrica.** Como jugador, quiero ver el tablero desde un ángulo isométrico fijo para tener perspectiva 3D sin perder la visión completa del campo.
- **US-3: Identificación de bando por color.** Como jugador, quiero distinguir mis piezas de las enemigas de un vistazo (aliado=azul, enemigo=rojo) sin tener que hacer clic para verificar.

### 3.2 Mecánica del relieve (CORE de v1)

- **US-4: Ataque con restricción por relieve (downhill).** Como jugador, cuando ataco a una pieza enemiga, el ataque solo es válido si la pieza objetivo está en un relieve igual o inferior al mío. Pieza en alto (rojo) ataca alto y medio. Pieza en medio (verde) ataca medio y bajo. Pieza en bajo (azul) solo ataca bajo. No se puede atacar hacia arriba.
- **US-5: Shuffle de relieves cada 6 turnos.** Como jugador, cada 6 turnos el sistema reasigna al azar los 3 relieves a las celdas del tablero, mostrándolo con una animación clara para que pueda re-adaptar mi estrategia.
- **US-6: Indicador visual de "puede atacar / no puede atacar".** Como jugador, cuando selecciono una pieza y paso el mouse sobre un enemigo, quiero ver un indicador visual que me diga si el ataque es válido según la regla del relieve (verde = puede, gris tachado = no puede por relieve).

### 3.3 Movimientos y combate (heredados del 2D)

- **US-7: Movimiento por rol de ajedrez.** Como jugador, cada pieza se mueve según su rol del ajedrez adaptado: Rey 1 paso, Torre en línea recta, Alfil en diagonal, Caballo en L, Peón adelante, Reina combinada.
- **US-8: Selección y acción de pieza.** Como jugador, hago clic en una pieza aliada para seleccionarla, luego clic en una celda destino válida para moverla. Clic en una pieza enemiga para atacarla (si la regla del relieve lo permite).
- **US-9: Indicador de celdas válidas.** Como jugador, cuando selecciono una pieza, las celdas a las que puedo mover se iluminan para guiarme.

### 3.4 Pipeline de assets

- **US-10: Style guide aprobado.** Como Director del proyecto, quiero que el primer entregable de v1 sea un style guide con la paleta, ángulos, iluminación y acabado, antes de generar cualquier asset individual, para asegurar coherencia visual.
- **US-11: Entrega de assets en orden con validación.** Como Director del proyecto, quiero recibir los prompts de assets uno por uno, en el orden preestablecido, y validar cada uno antes de pasar al siguiente. Si un asset rompe el style guide, se reformula el prompt (no se "parcha" el asset).
- **US-12: Convención de nombres.** Como Director del proyecto, cada entregable se nombra con el patrón `NN_nombre_descriptivo.png` o `.glb` para mantener orden.

---

## 4. Criterios de aceptación EARS simplificado

> Formato: `Dado [contexto] / Cuando [acción] / Entonces [resultado esperado]`.
> Cada US tiene al menos un criterio testeable.

### US-1: Tablero hexagonal con 3 relieves
- **EARS 1.1:** Dado un tablero 3D inicializado, Cuando se renderiza en pantalla, Entonces cada celda es un hexágono con geometría distinta según su relieve (alto=plataforma elevada, medio=llano, bajo=hundido) y color distintivo (rojo/verde/azul).
- **EARS 1.2:** Dado un tablero con 200 celdas, Cuando se ve desde la cámara isométrica, Entonces el jugador distingue claramente al menos 3 niveles de altura por la diferencia de color y elevación.

### US-2: Cámara isométrica
- **EARS 2.1:** Dado que el juego está cargando, Cuando se muestra la primera escena del tablero, Entonces la cámara está en una posición isométrica fija (3/4 desde arriba) que muestra el tablero completo.
- **EARS 2.2:** Dado el tablero en pantalla, Cuando el jugador mueve el mouse, Entonces la cámara NO rota (la cámara es fija en v1).

### US-3: Identificación de bando por color
- **EARS 3.1:** Dado el tablero con piezas, Cuando se renderiza, Entonces las piezas aliadas tienen material con tinte azul y las enemigas con tinte rojo, manteniendo el mismo modelo 3D.

### US-4: Ataque con restricción por relieve (CORE)
- **EARS 4.1:** Dada una pieza aliada en relieve alto (rojo) y una enemiga en relieve medio (verde), Cuando el jugador intenta atacar, Entonces el ataque es válido y la pieza enemiga recibe daño.
- **EARS 4.2:** Dada una pieza aliada en relieve alto (rojo) y una enemiga en relieve bajo (azul), Cuando el jugador intenta atacar, Entonces el ataque es INVÁLIDO (no se puede atacar 2 niveles abajo).
- **EARS 4.3:** Dada una pieza aliada en relieve medio (verde) y una enemiga en relieve alto (rojo), Cuando el jugador intenta atacar, Entonces el ataque es INVÁLIDO (no se puede atacar hacia arriba).
- **EARS 4.4:** Dada una pieza aliada en relieve bajo (azul) y una enemiga en relieve medio (verde), Cuando el jugador intenta atacar, Entonces el ataque es INVÁLIDO (no se puede atacar hacia arriba desde bajo).
- **EARS 4.5:** Dada una pieza aliada en relieve bajo (azul) y una enemiga en relieve bajo (azul), Cuando el jugador intenta atacar, Entonces el ataque es válido.

### US-5: Shuffle de relieves cada 6 turnos
- **EARS 5.1:** Dado un tablero con relieves asignados, Cuando se completa el turno número 6, Entonces el sistema reasigna los relieves a las celdas de forma aleatoria.
- **EARS 5.2:** Dado un shuffle, Cuando ocurre, Entonces se reproduce una animación de transición (las celdas "bajan/suben" o "cambian de color") que dura al menos 1 segundo para que el jugador lo note.
- **EARS 5.3:** Dado un shuffle, Cuando ocurre, Entonces se muestra en HUD un mensaje "Los relieves han cambiado" durante al menos 3 segundos.

### US-6: Indicador visual de ataque válido/inválido
- **EARS 6.1:** Dada una pieza seleccionada, Cuando el mouse está sobre una pieza enemiga, Entonces se muestra un indicador verde (puede atacar) o gris tachado (no puede atacar por relieve) en la pieza enemiga.

### US-7: Movimiento por rol de ajedrez
- **EARS 7.1:** Dado el tablero, Cuando selecciono mi Rey y una celda adyacente (hex), Entonces el Rey se mueve 1 paso.
- **EARS 7.2:** Dado el tablero, Cuando selecciono mi Torre y una celda en línea recta (mismo eje o misma fila de hexes), Entonces la Torre se mueve.
- **EARS 7.3:** Dado el tablero, Cuando selecciono mi Caballo y una celda en L, Entonces el Caballo salta a esa celda (puede saltar piezas).

### US-8: Selección y acción de pieza
- **EARS 8.1:** Dado el tablero, Cuando hago clic en una pieza aliada, Entonces la pieza se marca como seleccionada y se iluminan las celdas válidas.

### US-9: Indicador de celdas válidas
- **EARS 9.1:** Dada una pieza seleccionada, Cuando se renderiza, Entonces las celdas a las que puede moverse se iluminan con un overlay azul semi-transparente.

### US-10: Style guide aprobado
- **EARS 10.1:** Dado el inicio del proyecto, Cuando se genera el primer asset, Entonces se entrega un style guide como referencia visual que define paleta exacta, ángulos de cámara, iluminación y acabado de los modelos.
- **EARS 10.2:** Dado el style guide aprobado, Cuando se genera cualquier asset posterior, Entonces ese asset respeta el style guide (validación manual de Cris).

### US-11: Entrega de assets en orden con validación
- **EARS 11.1:** Dado el orden de v1 (style guide → tablero → 6 héroes → 3 estructuras), Cuando se entrega el prompt N, Entonces NO se entrega el prompt N+1 hasta que Cris valide con "ok" o "redefine" el N.
- **EARS 11.2:** Dado un asset que rompe el style guide, Cuando Cris lo rechaza, Entonces se reformula el prompt (1 intento adicional) antes de replantear el style guide.

### US-12: Convención de nombres
- **EARS 12.1:** Dado un entregable, Cuando se nombra el archivo, Entonces sigue el patrón `NN_nombre_descriptivo.png` o `.glb`, donde `NN` es el número de orden dentro del batch.

---

## 5. Requisitos no funcionales

| Categoría | Requisito | Notas |
|---|---|---|
| **Performance** | 60 fps mínimo en navegador moderno (Chrome, Edge, Firefox) con 6 piezas + tablero + 3 estructuras en pantalla. | Optimización de polígonos: máx. ~2,000 tris por pieza. |
| **Resolución** | 1920×1080 mínimo, escalable a 4K. | UI se adapta con CSS estándar. |
| **Plataforma** | Desktop (navegador). | Mobile queda como roadmap v2+. |
| **Stack** | React 18+ · TypeScript · React Three Fiber · Three.js · Vite (build). | R3F es la única dependencia nueva fuerte. |
| **Compatibilidad** | WebGL 2.0 requerido. | Mínimo 95% de navegadores modernos. |
| **Internacionalización** | UI en español (es-VE) en v1. | i18n queda como roadmap. |
| **Persistencia** | Sin persistencia en v1 (partidas locales en memoria). | Save/load queda como roadmap v2. |
| **Accesibilidad** | No es objetivo de v1. | Roadmap v2. |
| **Observabilidad** | Consola de desarrollo con logs de turno, daño, shuffle. | No hay telemetría en v1. |

---

## 6. Reglas de negocio

### 6.1 Reglas del relieve (CORE, validadas en US-4)
- Cada celda hexagonal tiene un `height: 0 | 1 | 2` donde `0=bajo (azul)`, `1=medio (verde)`, `2=alto (rojo)`.
- El ataque de la pieza A (en hex con `height=hA`) contra la pieza B (en hex con `height=hB`) es válido solo si `hB <= hA`.
- Visualización:
  - `height=0` → geometría hundida (foso) + color azul.
  - `height=1` → geometría llana + color verde.
  - `height=2` → geometría elevada (tarima) + color rojo.

### 6.2 Reglas de movimiento (heredadas del 2D, US-7)
- Las reglas de movimiento de cada pieza son las del ajedrez adaptado a hexágonos:
  - **Rey:** 1 paso a cualquier hex adyacente.
  - **Torre (Rook):** línea recta en cualquiera de las 3 direcciones axiales del hex grid.
  - **Alfil (Bishop):** línea diagonal en hex grid.
  - **Caballo (Knight):** patrón en L (saltando piezas).
  - **Reina (Queen):** combinación de Torre + Alfil.
  - **Peón (Pawn):** 1 paso adelante (en dirección al enemigo), promoción al llegar al borde enemigo.
- El relieve NO limita el movimiento, solo el ataque.

### 6.3 Reglas del shuffle (US-5)
- El contador de turnos es global (suma turnos de ambos jugadores).
- En el turno 6, 12, 18, 24, ... (cada múltiplo de 6) ocurre el shuffle.
- El shuffle es aleatorio pero determinista por seed (para reproducibilidad en simulaciones).
- La distribución debe mantener balance: no más de ~40% de celdas en un solo relieve (para evitar extremos).

### 6.4 Reglas de bando (US-3)
- Mismo modelo 3D, distinto `material.color`.
- Aliado: azul (#3B82F6 por defecto, refinar en style guide).
- Enemigo: rojo (#EF4444 por defecto, refinar en style guide).

### 6.5 Reglas del pipeline (US-10, US-11, US-12)
- El style guide se entrega como primer asset.
- Cada prompt de asset individual se entrega DESPUÉS de validar el anterior.
- Convención de nombres: `NN_nombre_descriptivo.{png|glb}`.

---

## 7. Flujos críticos de usuario

### Flujo A: Partida local (v1)

```
1. Jugador abre la app
   → Ve menú principal (placeholder en v1, simplificado)
2. Hace clic en "Iniciar partida"
3. Tablero se renderiza con 6 piezas aliadas vs 6 enemigas, relieves asignados
4. Turno del jugador (Turno 1)
5. Jugador selecciona una pieza → ve celdas válidas iluminadas
6. Jugador selecciona celda destino o pieza enemiga para atacar
7. Sistema valida movimiento/ataque (con regla del relieve)
8. Si válido: pieza se mueve/ataca, turno pasa al enemigo
9. Si inválido: mensaje "no puedes atacar hacia arriba" / "no puedes atacar 2 niveles abajo"
10. Turno del enemigo (IA simple o control manual del otro jugador)
11. Repetir hasta que se cumpla condición de victoria
12. Cada 6 turnos → shuffle con animación
```

### Flujo B: Validación de assets (pipeline)

```
1. Yo entrego prompt #1 (style guide)
2. Cris lo corre en la IA generativa
3. Cris me muestra el resultado
4. Si "ok" → paso al prompt #2
5. Si "redefine" → reformulo el prompt (1 intento)
6. Si tras 1 reformulación sigue mal → replantear el style guide
```

---

## 8. Fuera de alcance (no-objetivos de v1)

> **Importante:** estas funcionalidades NO se implementan en v1. Se mencionan para que la IA no las "rellene" por su cuenta y para que la Constitución quede clara.

- ❌ Modo campaña PvE con regiones narrativas (4 regiones, 5 nodos cada una).
- ❌ 5 tropas (infantería, hostigadores, artillería, clérigo, explorador).
- ❌ 2 bestias neutrales (lobo, jabalí).
- ❌ Las 50 cartas de efecto con su sistema de energía.
- ❌ Sistema de clima zonal (los 5 climas del 2D).
- ❌ 5 biomas diferenciados (1 tablero genérico en v1).
- ❌ UI completa: menú, tienda, bestiario, perfil, pase de temporada.
- ❌ Persistencia (save/load).
- ❌ Modo multijugador online.
- ❌ Sistema de animación complejo (solo idle estático en v1).
- ❌ Mobile / tablet.
- ❌ Internacionalización.
- ❌ Sistema de monetización.

---

## 9. Criterios de aceptación globales del MVP (v1)

> Cuando TODOS estos se cumplan, el vertical slice está "completo".

| # | Criterio | Cómo se valida |
|---|---|---|
| V1-G1 | El tablero se renderiza con hexágonos de 3 relieves diferenciados visualmente. | Cris lo ve y aprueba. |
| V1-G2 | Las 6 piezas aliadas (rey, reina, torre, alfil, caballo, peón) tienen modelos low poly consistentes con el style guide. | Cris las ve y aprueba. |
| V1-G3 | Las 6 piezas aliadas + 6 enemigas se distinguen por color (azul/rojo). | Cris valida visualmente. |
| V1-G4 | La mecánica de ataque downhill funciona: pieza en alto puede atacar alto/medio, pieza en medio puede atacar medio/bajo, pieza en bajo solo puede atacar bajo. | Testeo manual de los 9 casos. |
| V1-G5 | El shuffle ocurre cada 6 turnos con animación visible. | Testeo manual contando turnos. |
| V1-G6 | Los 3 modos de victoria (regicidio, zonas, bandera) están representados al menos con su marcador visual (corona, zona, bandera). | Cris valida. |
| V1-G7 | El style guide se usó como referencia para todos los assets. | Auditoría visual de coherencia. |
| V1-G8 | El juego corre a 60 fps en navegador moderno con el set v1 cargado. | DevTools Performance tab. |

---

## 10. Decisiones tentativas sujetas a aprobación

> Estas son decisiones que tomo como defaults razonables para no bloquear el avance. Si no te gustan, las ajustamos antes de pasar a Fase 2.

| # | Decisión tentativa | Por qué |
|---|---|---|
| T-1 | **Paleta aliados/enemigos**: aliado `#3B82F6` (azul), enemigo `#EF4444` (rojo). | Contraste alto, estándar de UI. |
| T-2 | **Paleta relieves**: rojo `#DC2626`, verde `#16A34A`, azul `#2563EB` (saturados, estilo cartoon tipo Balatro). | Coherencia con la referencia "moderno pero cartoon". |
| T-3 | **Board theme**: 1 tablero genérico "campo de batalla medieval" para v1. Los 5 biomas se difieren a v2. | SIMPLE. Validamos el look antes de diversificar. |
| T-4 | **Cartas**: NO entran en v1. Son overlay 2D cuando se implementen en v2. | Reduce el scope a lo crítico. |
| T-5 | **Animaciones**: solo pose estática (idle) en v1. Walk/attack/death en v2. | Reduce complejidad. Los modelos se ven bien en estático. |
| T-6 | **Identificación de bando**: tinte de material (mismo modelo, color distinto). | Continuidad con el 2D. |
| T-7 | **Tamaño del tablero**: mantener 200 celdas (10×20 equivalente en hex grid ≈ 11×18). | Consistencia con el 2D. Se ajusta en Fase 2 si hace falta. |

---

## 11. Trazabilidad Constitución → PRD

> Cómo se reflejan los 5 principios de la Constitución en este PRD.

| Principio | Aplicación en el PRD |
|---|---|
| **SIMPLE primero** | v1 es vertical slice (no librería completa). Cartas, biomas y tropas fuera de alcance. |
| **Validar antes de avanzar** | US-11 y US-12: cada asset se valida antes del siguiente. Estilo entregado primero. |
| **Style guide es ley** | US-10: el style guide es el primer entregable y referencia obligatoria. |
| **Trazabilidad** | US-X numeradas, EARS numeradas (1.1, 1.2...), tickets en Fase 2 referenciarán estas. |
| **Pipeline visible** | US-11: el flujo de entrega de assets está documentado. |

---

## 12. Próximo paso

Si apruebas este PRD, pasamos a **Fase 2 — Arquitecto (Planificar)**, donde:
- Selecciono el tech stack final justificado.
- Defino la estructura de carpetas.
- Aplico los Gates de Pre-Implementación.
- Divido el proyecto en tickets trazados a estas US.

**¿Apruebas el PRD para pasar a Fase 2?**
