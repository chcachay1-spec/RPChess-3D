# RPChess 3D — Plan de Arquitectura (Fase 2)

> **Versión:** 0.1 · **Fecha:** 21 de julio de 2026
> **Fase:** 2 — Arquitecto (Planificar)
> **Trazabilidad:** este plan se construye sobre el PRD (01_PRD.md) y la Constitución (00_constitucion.md).

---

## 1. Tech stack justificado

> Recordá: el usuario no es experto en programación. Cada elección se justifica con razón simple.

| Capa | Elección | Razón simple | Alternativa descartada |
|---|---|---|---|
| **Lenguaje** | TypeScript | Tipado fuerte evita errores. Ya lo usás en el 2D. | JavaScript puro (más errores). |
| **Framework UI** | React 18 | Ya lo conocés del proyecto 2D. Continuidad. | Vue / Svelte (reaprender desde cero). |
| **Render 3D** | React Three Fiber (R3F) | R3F = "React para 3D". Mantenés el mismo estilo de componentes. | Three.js vanilla (más código de UI). Babylon.js (menos comunidad, más curva). |
| **Motor 3D subyacente** | Three.js | El motor real; R3F es solo una forma más cómoda de usarlo. Viene incluido. | Babylon (más pesado, menos React-friendly). |
| **Bundler / dev server** | Vite | Rápido, liviano, ideal para R3F. | Webpack (lento, complicado). Next.js (overkill si solo necesitamos un juego). |
| **Estilos CSS** | CSS Modules o Tailwind | CSS Modules = simple, sin aprender nada nuevo. Tailwind = rápido pero requiere aprender las clases. | Styled Components (más dependencias). |
| **State management** | Zustand | Liviano, simple, ya hay integración con R3F. | Redux (overkill para v1). Context API nativo (suficiente para v1 también). |
| **Persistencia v1** | Ninguna (en memoria) | v1 no tiene save. | localStorage / IndexedDB (v2). |
| **Hosting futuro** | Vercel / Netlify | Deploy gratis, ideal para React+R3F estático. | Servidor propio (costo, mantenimiento). |

### Dependencias nuevas para v1

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.95.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@types/react": "^18.3.0",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

> **Nota:** las versiones se ajustan al momento de la implementación. Esto es el plan de qué librerías vamos a usar.

---

## 2. Configuración de entorno y servidores MCP

> MCP (Model Context Protocol) = "enchufe" que permite a la IA acceder a archivos locales, bases de datos, etc. desde tu PC.

### Para v1
- **No requiere MCP adicional.** Vite corre local, todo se hace en el navegador. Los assets se cargan desde la carpeta `public/` del proyecto.
- **Para deploy futuro** se puede usar Vercel MCP si se quiere deploy automatizado. No es bloqueante.

### Requisitos del sistema (ya los tenés)
- Node.js 18+ (recomendado LTS 20)
- Navegador moderno con WebGL 2.0
- Editor de código (VS Code recomendado)
- Herramienta de IA generativa (Nanobanana / Midjourney / DALL-E)

---

## 3. Estructura de carpetas (propuesta)

```
RPChess-3D/
├── public/
│   ├── assets/
│   │   ├── style-guide/          # Referencia visual maestra
│   │   │   └── 01_style_guide_master.png
│   │   ├── board/                # Tablero
│   │   │   ├── 02_hex_red.png    # Material para hex alto
│   │   │   ├── 02_hex_green.png
│   │   │   ├── 02_hex_blue.png
│   │   │   └── 02_hex_layout.json # Layout del tablero
│   │   ├── heroes/               # Héroes low poly
│   │   │   ├── 03_king.glb
│   │   │   ├── 04_queen.glb
│   │   │   ├── 05_rook.glb
│   │   │   ├── 06_bishop.glb
│   │   │   ├── 07_knight.glb
│   │   │   └── 08_pawn.glb
│   │   └── structures/           # Estructuras del mapa
│   │       ├── 09_tower.glb
│   │       ├── 10_banner.glb
│   │       └── 11_chest.glb
│   └── models/                   # (alternativa: si se prefiere /models/)
│
├── src/
│   ├── components/               # Componentes React
│   │   ├── scene/
│   │   │   ├── Board.tsx         # Render del tablero hex
│   │   │   ├── HexTile.tsx       # 1 celda hexagonal
│   │   │   ├── Hero.tsx          # 1 pieza low poly
│   │   │   ├── Structure.tsx     # 1 estructura
│   │   │   └── Camera.tsx        # Cámara isométrica
│   │   ├── hud/                  # UI 2D sobre el 3D
│   │   │   ├── TurnCounter.tsx
│   │   │   ├── VictoryBanner.tsx
│   │   │   └── ActionMenu.tsx
│   │   └── App.tsx
│   ├── logic/                    # Lógica del juego (puro, sin nodos)
│   │   ├── hex-grid.ts           # Conversión axial/cube coords
│   │   ├── relief-rules.ts       # Regla de ataque downhill
│   │   ├── shuffle.ts            # Shuffle cada 6 turnos
│   │   ├── movement.ts           # Movimientos por rol
│   │   └── victory.ts            # 3 modos de victoria
│   ├── data/                     # Datos (JSON)
│   │   ├── heroes.json           # Stats y roles de héroes
│   │   ├── relief-colors.json    # Paleta de relieves
│   │   └── board-layout.json     # Disposición de relieves inicial
│   ├── store/                    # Estado global (Zustand)
│   │   ├── game-store.ts         # Estado de la partida
│   │   └── ui-store.ts           # Estado de UI
│   ├── types/                    # Tipos TypeScript
│   │   ├── hero.ts
│   │   ├── hex.ts
│   │   └── game.ts
│   ├── main.tsx
│   └── index.css
│
├── prompts/                      # Registro de todos los prompts usados
│   ├── T-01_style_guide.md
│   ├── T-02_board.md
│   ├── T-03_king.md
│   └── ...
│
├── docs/                         # Documentación del proyecto
│   ├── 00_resumen_educativo.md
│   ├── 00_constitucion.md
│   ├── 01_PRD.md
│   └── 02_arquitectura.md
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> **Nota:** la estructura puede ajustarse en implementación, pero la separación **assets / lógica / UI / datos** se mantiene (principio de la Constitución: SIMPLE y Trazabilidad).

---

## 4. Estimación de tamaño y nivel SDD

### Conteo de tickets
Estimamos **20 tickets** para el v1 vertical slice:
- 12 tickets de assets (style guide + tablero + 6 héroes + 3 estructuras)
- 8 tickets de código (setup, render, lógica, integración)

→ **20 tickets** = nivel **Spec-Anchored** (6-20 tickets) según el SDD.

### Nivel elegido: **Spec-Anchored**

Razón: 20 tickets es justo en el límite superior del rango. Necesitamos Constitución + Gates obligatorios. La spec se mantiene viva durante todo el proyecto.

---

## 5. Resultado de los Gates de Pre-Implementación

> Cada gate es un Sí/No con justificación. Los que fallen requieren documentar la excepción.

| Gate | Resultado | Justificación |
|---|---|---|
| **Gate de Simplicidad** (≤3 módulos iniciales) | ⚠️ PARCIAL | Inicialmente son 4 módulos (`scene`, `hud`, `logic`, `data`). Se justifica porque separar `logic` (puro, testeable) de `scene` (3D) es la práctica estándar de R3F y mantiene la simetría con el motor del 2D. |
| **Gate Anti-Abstracción** (framework directo, sin capas innecesarias) | ✅ SÍ | Usamos R3F directamente. Zustand para estado (no Redux). Sin wrappers propios sobre R3F. |
| **Gate Test-First** (cada ticket con criterio EARS testeable) | ✅ SÍ | Cada ticket referencia un US-X y un EARS del PRD. Los criterios son verificables manualmente. |
| **Gate de Constitución** (los tickets respetan los 5 principios) | ✅ SÍ | SIMPLE: scope limitado a v1. Validar: cada asset se aprueba antes del siguiente. Style guide: T-01 es bloqueante. Trazabilidad: cada ticket referencia US-X. Pipeline: usuario ejecuta los prompts. |

### Excepciones documentadas

- **Gate de Simplicidad parcial**: justificado arriba. Se permiten 4 módulos porque la separación `logic` (puro) de `scene` (3D) es idiomática en R3F y permite testear la lógica sin levantar el navegador. Si en implementación la separación resulta innecesaria, se fusiona `logic` y `data` en un solo módulo `core/`.

---

## 6. Lista de Tickets

> Cada ticket tiene:
> - **Trazabilidad**: `Cumple: US-X` y `EARS: US-X.Y`
> - **Archivos a crear/modificar** (rutas exactas)
> - **Criterios de hecho** (qué debe pasar para considerarlo terminado)
> - **Dependencias** con otros tickets (si los hay)

### Fase 3A — Assets (lo que vos hacés con la IA)

#### T-01: Style Guide
- **Cumple:** US-10, US-11
- **EARS:** US-10.1, US-10.2
- **Qué:** Generar la imagen maestra de referencia visual.
- **Quién lo hace:** Vos (Cris) en tu herramienta IA. Yo entrego el prompt.
- **Entregable:** `public/assets/style-guide/01_style_guide_master.png`
- **Criterio de hecho:** Imagen aprobada por Cris con la checklist visual cumplida.
- **Bloqueante:** 🔴 Sin este ticket, no se puede avanzar a T-02.
- **Estado del prompt:** ✅ Prompt ya entregado (ver `prompts/T-01_style_guide.md`).

#### T-02: Tablero hexagonal con 3 relieves
- **Cumple:** US-1, US-2
- **EARS:** US-1.1, US-1.2
- **Qué:** Generar 1 imagen de referencia del tablero con los 3 relieves visibles.
- **Entregable:** `public/assets/board/02_hex_red.png`, `02_hex_green.png`, `02_hex_blue.png` (o 1 sola imagen con los 3 hexes).
- **Criterio de hecho:** Imagen aprobada. Los 3 relieves se distinguen CLARAMENTE tanto por color como por altura 3D.
- **Depende de:** T-01 (sin style guide, no se puede).

#### T-03: Rey
- **Cumple:** US-7 (movimiento del rey)
- **Qué:** Prompt para el modelo low poly del Rey.
- **Entregable:** `public/assets/heroes/03_king.glb` (o `.png` con 4 ángulos si tu IA no genera 3D directo).
- **Criterio de hecho:** Modelo aprobado, consistente con el style guide, con corona visible y silueta de rey.
- **Depende de:** T-01.

#### T-04: Reina
- **Cumple:** US-7
- **Entregable:** `public/assets/heroes/04_queen.glb`
- **Criterio de hecho:** Modelo aprobado, consistente con style guide, silueta femenina/mágica, con corona más pequeña que el rey.
- **Depende de:** T-01, T-03 (para mantener consistencia con el rey).

#### T-05: Torre (Rook)
- **Cumple:** US-7
- **Entregable:** `public/assets/heroes/05_rook.glb`
- **Criterio de hecho:** Modelo aprobado, silueta CUADRADA y TANQUE, blindaje visible.
- **Depende de:** T-01, T-03.

#### T-06: Alfil (Bishop)
- **Cumple:** US-7
- **Entregable:** `public/assets/heroes/06_bishop.glb`
- **Criterio de hecho:** Modelo aprobado, silueta ETÉREA, con mitra o sombrero alto, postura de "sabio".
- **Depende de:** T-01, T-03.

#### T-07: Caballo (Knight)
- **Cumple:** US-7
- **Entregable:** `public/assets/heroes/07_knight.glb`
- **Criterio de hecho:** Modelo aprobado, silueta DINÁMICA (en movimiento o en pose de carga), con yelmo con penacho o sin él.
- **Depende de:** T-01, T-03.

#### T-08: Peón (Pawn)
- **Cumple:** US-7
- **Entregable:** `public/assets/heroes/08_pawn.glb`
- **Criterio de hecho:** Modelo aprobado, silueta SIMPLE (la más básica del set), bajo en estatura.
- **Depende de:** T-01, T-03.

#### T-09: Tinte de bando (validación visual)
- **Cumple:** US-3
- **EARS:** US-3.1
- **Qué:** Validar que el style guide incluye los 2 tintes (aliado azul, enemigo rojo) y que se ven claramente diferenciados. Este ticket NO genera un asset nuevo; **es la validación** de que el style guide cubre el caso.
- **Criterio de hecho:** Confirmación explícita de Cris en el style guide.
- **Depende de:** T-01.

#### T-10: Torre de captura (estructura)
- **Cumple:** US-1 (como elemento del mapa)
- **Entregable:** `public/assets/structures/09_tower.glb`
- **Criterio de hecho:** Modelo aprobado, estructura defensiva con almenas, escala coherente con los héroes (la torre es 2x la altura de un peón).
- **Depende de:** T-01.

#### T-11: Bandera (marcador de base)
- **Cumple:** US-1
- **Entregable:** `public/assets/structures/10_banner.glb`
- **Criterio de hecho:** Modelo aprobado, tela ondeando (estática OK en v1) en un palo, color AZUL para aliado (en v1 solo hay base aliada, la del enemigo se difiere).
- **Depende de:** T-01.

#### T-12: Cofre (recompensa)
- **Cumple:** US-1
- **Entregable:** `public/assets/structures/11_chest.glb`
- **Criterio de hecho:** Modelo aprobado, madera con detalles metálicos, escala coherente.
- **Depende de:** T-01.

### Fase 3B — Código (lo que hace la IA / vos con mi guía)

#### T-13: Setup del proyecto R3F
- **Cumple:** (infraestructura base, no US directa)
- **Qué:** Crear el proyecto Vite + React + TypeScript + R3F con la estructura de carpetas definida en sección 3.
- **Archivos:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/index.css`, `src/App.tsx`.
- **Criterio de hecho:** `npm install && npm run dev` levanta un servidor que muestra "Hello R3F" en 3D.
- **Depende de:** nada.

#### T-14: Render del tablero hexagonal con 3 relieves
- **Cumple:** US-1, US-2
- **EARS:** US-1.1, US-1.2, US-2.1, US-2.2
- **Archivos:** `src/components/scene/Board.tsx`, `src/components/scene/HexTile.tsx`, `src/components/scene/Camera.tsx`, `src/data/board-layout.json`.
- **Criterio de hecho:** Al cargar la app se ve el tablero 10×20 con celdas hexagonales de 3 alturas, cámara isométrica, paleta de colores correcta.
- **Depende de:** T-13, T-02.

#### T-15: Render de las 6 piezas con tinte de bando
- **Cumple:** US-3, US-7
- **EARS:** US-3.1
- **Archivos:** `src/components/scene/Hero.tsx`, `src/data/heroes.json`, `src/store/game-store.ts`.
- **Criterio de hecho:** Las 6 piezas aliadas se ven en sus posiciones iniciales, con tinte azul. Las 6 enemigas con tinte rojo.
- **Depende de:** T-13, T-03..T-08, T-14.

#### T-16: Lógica de movimiento por rol
- **Cumple:** US-7
- **EARS:** US-7.1, US-7.2, US-7.3
- **Archivos:** `src/logic/hex-grid.ts`, `src/logic/movement.ts`.
- **Criterio de hecho:** Al hacer clic en una pieza, se iluminan las celdas válidas según su rol (Rey 1 paso, Torre línea recta, etc.).
- **Depende de:** T-14, T-15.

#### T-17: Lógica de ataque con restricción por relieve (CORE)
- **Cumple:** US-4
- **EARS:** US-4.1, US-4.2, US-4.3, US-4.4, US-4.5
- **Archivos:** `src/logic/relief-rules.ts`.
- **Criterio de hecho:** Al hacer clic en una pieza enemiga, el ataque se valida según la regla downhill. Si no es válido, se muestra mensaje.
- **Depende de:** T-16, T-14.

#### T-18: Indicador visual de ataque válido/inválido
- **Cumple:** US-6
- **EARS:** US-6.1
- **Archivos:** `src/components/scene/Hero.tsx` (modificación).
- **Criterio de hecho:** Al pasar el mouse sobre una pieza enemiga con pieza seleccionada, se ve indicador verde (puede) o gris tachado (no puede).
- **Depende de:** T-17.

#### T-19: Shuffle cada 6 turnos
- **Cumple:** US-5
- **EARS:** US-5.1, US-5.2, US-5.3
- **Archivos:** `src/logic/shuffle.ts`, `src/store/game-store.ts`, `src/components/hud/TurnCounter.tsx`.
- **Criterio de hecho:** Al llegar al turno 6, los relieves se reasignan al azar con una animación de transición. HUD muestra mensaje.
- **Depende de:** T-14, T-17.

#### T-20: Marcadores de objetivo de los 3 modos de victoria
- **Cumple:** US-1 (estructuras), US-3 (banderas)
- **Archivos:** `src/components/scene/Structure.tsx`, `src/data/board-layout.json` (añadir zonas y bases).
- **Criterio de hecho:** El tablero muestra: 1 base aliada, 1 base enemiga, 3 zonas de captura, todos marcados con su estructura correspondiente.
- **Depende de:** T-14, T-10, T-11, T-12.

---

## 7. Orden de ejecución

> Este es el orden recomendado. No es estricto, pero seguirlo evita bloqueos.

```
Fase 3A (assets — primero):
T-01 → T-02 → T-03 → T-04 → T-05 → T-06 → T-07 → T-08 → T-09 → T-10 → T-11 → T-12

Fase 3B (código — después, en paralelo a los assets si querés):
T-13 (setup) → T-14 (tablero) → T-15 (piezas) → T-16 (movimiento) → T-17 (ataque) → T-18 (indicador) → T-19 (shuffle) → T-20 (objetivos)
```

> **Tip:** T-13 (setup) se puede hacer en paralelo a la generación de assets. Yo puedo escribir el código del setup mientras vos validás el style guide.

---

## 8. Próximo paso

Si apruebas este plan, pasamos a **Fase 3 — Implementar**, donde ejecutamos los tickets en orden:

1. **T-01 ya está activo** (te entregué el prompt del style guide). Corrélo en tu IA y mandame el resultado.
2. **Mientras tanto**, yo puedo ir preparando T-13 (setup del proyecto) en paralelo.
3. **Cuando apruebes el style guide**, paso a T-02 (tablero) y entrego el siguiente prompt.

**¿Apruebas la arquitectura y los tickets para iniciar la implementación?**
