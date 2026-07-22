import { create } from 'zustand';
import type { AxialCoord, Piece, ReliefLevel, Structure } from '../types/hex';
import { shuffleReliefs } from '../logic/shuffle';
import { canAttackByRelief } from '../logic/relief-rules';
import { coordKey, getBoardHexes } from '../logic/hex-grid';
import { getValidMoves } from '../logic/movement';
import { BOARD_COLS, BOARD_ROWS, SHUFFLE_INTERVAL } from '../constants';
import { CARDS } from '../data/cards';

export type Screen =
  | 'menu'
  | 'splash'
  | 'tactics'
  | 'campaign'
  | 'mode-select'
  | 'pve'
  | 'pvp'
  | 'bestiary'
  | 'cards'
  | 'store'
  | 'profile'
  | 'news'
  | 'config'
  | 'events'
  | 'pase'
  | 'collection'
  | 'draft';

export type BattleResult = 'VICTORIA' | 'DERROTA' | 'EMPATE' | null;

/** Animacion 2D estilo Pokemon rojo fuego de un combate individual. */
export interface BattleScene {
  attackerId: string;
  targetId: string;
  cardId: string | null;
  damageDealt: number;
  isCrit: boolean;
}

/** Ejército seleccionado en el Draft para precargar el tablero. */
export interface DraftArmy {
  vetas: string[];          // ids de piezas vetadas
  selectedIds: string[];    // ids de piezas elegidas
}

interface GameState {
  turn: number;
  reliefs: Map<string, ReliefLevel>;
  pieces: Piece[];
  structures: Structure[];
  selectedPieceId: string | null;
  validMoves: AxialCoord[];
  hoverTargetId: string | null;
  message: string | null;
  shuffledThisTurn: boolean;
  screen: Screen;
  /** Resultado de batalla finalizado; si es no-null se muestra el modal. */
  battleResult: BattleResult;
  /** Animacion 2D de combate activo (style Pokemon fire red). */
  scene2D: BattleScene | null;
  /** Mazo de cartas de batalla (10 elegidas del pool). */
  battleDeck: string[];
  /** Mano actual (2 cartas). */
  hand: string[];
  /** Energia disponible para jugar cartas (regen +1/turno, max 6). */
  energy: number;
  /** Energia de retencion (placeholder, se gana 1 cada 2 turnos). */
  retention: number;
  /** Ejército armado en el Draft (persiste entre pantallas hasta jugar). */
  draftArmy: DraftArmy;

  init: () => void;
  selectPiece: (id: string | null) => void;
  movePiece: (id: string, dest: AxialCoord) => void;
  attackPiece: (attackerId: string, targetId: string) => void;
  endTurn: () => void;
  setHoverTarget: (id: string | null) => void;
  getReliefAt: (coord: AxialCoord) => ReliefLevel;
  recomputeValidMoves: () => void;
  setScreen: (s: Screen) => void;
  /** Marca la batalla como finalizada y la cierra el modal. */
  dismissBattleResult: () => void;
  /** Dispara una animacion 2D de combate (la cierra el componente). */
  triggerBattleScene: (scene: BattleScene) => void;
  dismissBattleScene: () => void;
  /** Juega una carta: la quita de la mano y dispara su efecto (placeholder: trigger escena 2D). */
  playCard: (cardId: string) => void;
  /** Avanza de turno: +1 energia, roba 1 carta, descarta la mas vieja. */
  advanceTurnCards: () => void;
  /** Setea el ejército del Draft. */
  setDraftArmy: (army: DraftArmy) => void;
}

const initialPieces = (): Piece[] => {
  const ally: Piece[] = [
    { id: 'a-king',   role: 'king',   team: 'ally',   position: { q: 5, r: 0 }, hp: 5 },
    { id: 'a-queen',  role: 'queen',  team: 'ally',   position: { q: 6, r: 0 }, hp: 4 },
    { id: 'a-rook',   role: 'rook',   team: 'ally',   position: { q: 4, r: 0 }, hp: 4 },
    { id: 'a-bishop', role: 'bishop', team: 'ally',   position: { q: 7, r: 0 }, hp: 3 },
    { id: 'a-knight', role: 'knight', team: 'ally',   position: { q: 3, r: 0 }, hp: 3 },
    { id: 'a-pawn',   role: 'pawn',   team: 'ally',   position: { q: 8, r: 0 }, hp: 2 },
  ];
  const enemy: Piece[] = [
    { id: 'e-king',   role: 'king',   team: 'enemy',  position: { q: 5, r: BOARD_ROWS - 1 }, hp: 5 },
    { id: 'e-queen',  role: 'queen',  team: 'enemy',  position: { q: 6, r: BOARD_ROWS - 1 }, hp: 4 },
    { id: 'e-rook',   role: 'rook',   team: 'enemy',  position: { q: 4, r: BOARD_ROWS - 1 }, hp: 4 },
    { id: 'e-bishop', role: 'bishop', team: 'enemy',  position: { q: 7, r: BOARD_ROWS - 1 }, hp: 3 },
    { id: 'e-knight', role: 'knight', team: 'enemy',  position: { q: 3, r: BOARD_ROWS - 1 }, hp: 3 },
    { id: 'e-pawn',   role: 'pawn',   team: 'enemy',  position: { q: 8, r: BOARD_ROWS - 1 }, hp: 2 },
  ];
  return [...ally, ...enemy];
};

const initialStructures = (): Structure[] => [
  { id: 's-tower',  type: 'tower',  team: 'ally',  position: { q: 2, r: 4 } },
  { id: 's-banner', type: 'banner', team: 'ally',  position: { q: 9, r: 1 } },
  { id: 's-chest',  type: 'chest',                position: { q: 9, r: 5 } },
  { id: 's-tower2', type: 'tower',  team: 'enemy', position: { q: 9, r: 4 } },
];

export const useGameStore = create<GameState>((set, get) => ({
  turn: 1,
  reliefs: new Map(),
  pieces: [],
  structures: [],
  selectedPieceId: null,
  validMoves: [],
  hoverTargetId: null,
  message: 'Bienvenido a RPChess 3D — click en una pieza aliada para empezar.',
  shuffledThisTurn: false,
  battleResult: null,
  scene2D: null,
  battleDeck: ['c-b04','c-t02','c-x01','c-b02','c-b05','c-t05','c-b07','c-x02','c-t03','c-x05'],
  hand: ['c-b04', 'c-t02'],
  energy: 2,
  retention: 0,
  draftArmy: { vetas: [], selectedIds: [] },
  // Lee el screen desde la URL: ?screen=campaign, ?screen=pve, etc.
  // Si no hay param, usa 'menu' como default.
  screen: (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('screen') as Screen) || 'menu',

  init: () => {
    const hexes = getBoardHexes(BOARD_COLS, BOARD_ROWS);
    const reliefs = new Map<string, ReliefLevel>();
    for (const h of hexes) {
      reliefs.set(coordKey(h), Math.floor(Math.random() * 3) as ReliefLevel);
    }
    set({ reliefs, pieces: initialPieces(), structures: initialStructures() });
  },

  selectPiece: (id) => {
    if (id === null) {
      set({ selectedPieceId: null, validMoves: [], message: 'Selección cancelada.' });
      return;
    }
    const state = get();
    const piece = state.pieces.find((p) => p.id === id);
    if (!piece) return;
    if (piece.team !== 'ally') {
      set({ message: 'Solo puedes seleccionar piezas aliadas (azules).' });
      return;
    }
    if (!piece.position) return;

    const occupied = new Set<string>();
    for (const p of state.pieces) {
      if (p.position) occupied.add(coordKey(p.position));
    }
    // Permitimos que la pieza seleccionada sea "moved out" de su hex temporalmente
    occupied.delete(coordKey(piece.position));

    const moves = getValidMoves(piece.position, piece.role, occupied, 1);
    set({
      selectedPieceId: id,
      validMoves: moves,
      message: `Pieza ${piece.role} seleccionada — ${moves.length} movimientos posibles. Click en un hex para mover, o click en enemigo para atacar.`,
    });
  },

  movePiece: (id, dest) => {
    const state = get();
    const pieces = state.pieces.map((p) =>
      p.id === id ? { ...p, position: dest } : p,
    );
    set({
      pieces,
      selectedPieceId: null,
      validMoves: [],
      message: `Pieza movida a (${dest.q}, ${dest.r}). Click en "Pasar turno" para continuar.`,
    });
  },

  attackPiece: (attackerId, targetId) => {
    const state = get();
    const attacker = state.pieces.find((p) => p.id === attackerId);
    const target = state.pieces.find((p) => p.id === targetId);
    if (!attacker || !target || !attacker.position || !target.position) return;

    const aRelief = state.getReliefAt(attacker.position);
    const tRelief = state.getReliefAt(target.position);

    if (!canAttackByRelief(aRelief, tRelief)) {
      const msg = aRelief - tRelief > 1
        ? `No puedes atacar 2 niveles abajo (estás en ${aRelief}, enemigo en ${tRelief}).`
        : `No puedes atacar hacia arriba (estás en ${aRelief}, enemigo en ${tRelief}).`;
      set({ message: msg });
      return;
    }

    const damage = 1;
    const newPieces = state.pieces
      .map((p) => (p.id === targetId ? { ...p, hp: p.hp - damage } : p))
      .filter((p) => p.hp > 0);

    // Chequeamos fin de batalla
    const allyAlive  = newPieces.some((p) => p.team === 'ally');
    const enemyAlive = newPieces.some((p) => p.team === 'enemy');
    let battleResult = null as BattleResult;
    if (!allyAlive || !enemyAlive) {
      battleResult = !enemyAlive ? 'VICTORIA' : 'DERROTA';
    }

    set({
      pieces: newPieces,
      selectedPieceId: null,
      validMoves: [],
      message: `¡Ataque exitoso! ${target.role} enemigo recibió ${damage} de daño.`,
      battleResult,
    });
  },

  endTurn: () => {
    const state = get();
    const newTurn = state.turn + 1;
    const hexes = getBoardHexes(BOARD_COLS, BOARD_ROWS);
    let reliefs = state.reliefs;
    let msg = `Turno ${newTurn} — Tu turno.`;
    let shuffled = false;

    if (newTurn > 1 && (newTurn - 1) % SHUFFLE_INTERVAL === 0) {
      reliefs = shuffleReliefs(hexes, state.reliefs);
      shuffled = true;
      msg = `🔄 ¡SHUFFLE! Turno ${newTurn} — Los relieves se han redistribuido.`;
    }

    // Carta + energía: roba 1 (descarta la más vieja), +1 energía (max 6).
    const deck = state.battleDeck;
    let hand = [...state.hand, deck[0] ?? 'c-b04'];
    if (hand.length > 2) hand = hand.slice(-2);
    const energy = Math.min(6, state.energy + 1);

    set({ turn: newTurn, reliefs, message: msg, shuffledThisTurn: shuffled, hand, energy });
  },

  setHoverTarget: (id) => set({ hoverTargetId: id }),

  getReliefAt: (coord) => {
    return get().reliefs.get(coordKey(coord)) ?? 1;
  },

  recomputeValidMoves: () => {
    const state = get();
    if (!state.selectedPieceId) return;
    const piece = state.pieces.find((p) => p.id === state.selectedPieceId);
    if (!piece || !piece.position) return;
    const occupied = new Set<string>();
    for (const p of state.pieces) {
      if (p.position && p.id !== state.selectedPieceId) occupied.add(coordKey(p.position));
    }
    const moves = getValidMoves(piece.position, piece.role, occupied, 1);
    set({ validMoves: moves });
  },

  setScreen: (s) => set({ screen: s }),

  dismissBattleResult: () => set({ battleResult: null }),

  triggerBattleScene: (scene) => set({ scene2D: scene }),
  dismissBattleScene:    () => set({ scene2D: null }),

  /**
   * Jugar carta: la saca de la mano, gasta energía y dispara la escena 2D
   * (placeholder: usa pieza aliada/enemiga cualquiera como atacante/objetivo).
   */
  playCard: (cardId) => {
    const s = get();
    const card = CARDS.find((c) => c.id === cardId);
    const cost = card?.cost ?? 1;
    if (s.energy < cost) return;
    if (!s.hand.includes(cardId)) return;
    const ally  = s.pieces.find((p) => p.team === 'ally');
    const enemy = s.pieces.find((p) => p.team === 'enemy');
    set({
      energy: s.energy - cost,
      hand: s.hand.filter((id) => id !== cardId),
    });
    if (ally && enemy) {
      s.triggerBattleScene({
        attackerId: ally.id,
        targetId: enemy.id,
        cardId,
        damageDealt: 1 + Math.floor(Math.random() * 3),
        isCrit: false,
      });
    }
  },

  /** Cada turno: +1 energia (max 6), roba 1 (descarta el mas viejo). */
  advanceTurnCards: () => {
    const s = get();
    const newEnergy = Math.min(6, s.energy + 1);
    // Draw 1 - descartamos el head (mas viejo). Si no hay deck remaining, reciclamos.
    let deck = s.battleDeck;
    let hand = [...s.hand];
    // Usamos un cursor simple: las cartas en mano son las 2 mas recientes
    hand.push(deck[0] ?? 'c-b04');
    if (hand.length > 2) hand = hand.slice(-2);
    set({ energy: newEnergy, hand });
  },

  setDraftArmy: (army) => set({ draftArmy: army }),
}));
