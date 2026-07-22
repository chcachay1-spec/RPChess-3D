# RPChess 3D

Versión 3D de **RPChess — The Lost Kingdom**, escrita en React + TypeScript con React Three Fiber (Three.js).

> Tablero hexagonal · Relieve por color · Mecánica downhill · 3 modos de victoria

---

## 🚀 Setup

```bash
npm install
npm run dev
```

Abre automáticamente [http://localhost:5173](http://localhost:5173).

## 📦 Build

```bash
npm run build      # genera dist/
npm run preview    # sirve el build localmente
npm run typecheck  # solo TypeScript, sin emitir
```

## 📚 Documentación

Toda la documentación del proyecto está en `docs/`:

- **`00_resumen_educativo.md`** — Visión, stack, decisiones cerradas.
- **`00_constitucion.md`** — Las 5 reglas inmutables del proyecto.
- **`01_PRD.md`** — Especificación funcional con historias de usuario y criterios EARS.
- **`02_arquitectura.md`** — Plan de arquitectura, tech stack, gates y tickets.

Los prompts de assets están en `prompts/` (uno por ticket de asset).

## 🗂️ Estructura

```
RPChess-3D/
├── public/assets/        # Imágenes y modelos 3D (generados por IA)
├── src/
│   ├── components/
│   │   ├── scene/        # Componentes 3D (R3F)
│   │   └── hud/          # UI 2D (HTML overlay)
│   ├── logic/            # Lógica pura (hex-grid, relieve, combate, shuffle)
│   ├── data/             # Datos JSON (heroes, layout, paleta)
│   ├── store/            # Estado global (Zustand)
│   └── types/            # Tipos TypeScript
├── prompts/              # Prompts de assets (uno por ticket)
├── docs/                 # Documentación
└── README.md
```

## 🎫 Estado de tickets (v1 Vertical Slice)

### Fase 3A — Assets (usuario los genera con IA)
- [ ] **T-01** — Style Guide (en curso)
- [ ] T-02 — Tablero hexagonal con 3 relieves
- [ ] T-03 — Rey
- [ ] T-04 — Reina
- [ ] T-05 — Torre (Rook)
- [ ] T-06 — Alfil (Bishop)
- [ ] T-07 — Caballo (Knight)
- [ ] T-08 — Peón (Pawn)
- [ ] T-09 — Validación de tinte de bando
- [ ] T-10 — Torre de captura
- [ ] T-11 — Bandera de base
- [ ] T-12 — Cofre

### Fase 3B — Código (se implementa tras assets)
- [x] **T-13** — Setup del proyecto R3F ← (estás aquí)
- [ ] T-14 — Render del tablero hexagonal
- [ ] T-15 — Render de las 6 piezas
- [ ] T-16 — Lógica de movimiento
- [ ] T-17 — Lógica de ataque con restricción por relieve
- [ ] T-18 — Indicador visual de ataque válido/inválido
- [ ] T-19 — Shuffle cada 6 turnos
- [ ] T-20 — Marcadores de objetivo de victoria

---

**Próximo paso:** corre el prompt de T-01 (style guide) en tu herramienta IA y guardá la imagen en `public/assets/style-guide/01_style_guide_master.png`. Después me la mandás para validarla.
