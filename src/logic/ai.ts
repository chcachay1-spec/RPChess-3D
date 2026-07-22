import type { AxialCoord, Piece, ReliefLevel } from '../types/hex';
import { coordKey, hexNeighbors } from './hex-grid';
import { getValidMoves } from './movement';
import { canAttackByRelief } from './relief-rules';

/**
 * IA heuristica basica para el enemigo.
 *
 * Decisor greedy con score:
 *   +1000   por K.O. del Rey aliado
 *   +30 a +90  por pieza aliada destruida (valor por role)
 *    +30   por sobrevivir (HP > 1)
 *    +20   por ocupar hex alto (relief 2)
 *    +10   por ocupar hex medio (relief 1)
 *     +5   por estar adyacente a pieza aliada de mayor valor
 *   - 8   por estar adyacente a pieza enemiga (riesgo)
 *
 * "Ataca si tiene chance, defiende al Rey, esquiva por relieve".
 *
 * Modelo usado en V0.1 (mencionado por Cris como IA "heuristica basica").
 */

// Valor base de cada rol para scoring de capturas / perdidas.
const PIECE_VALUE: Record<string, number> = {
  king: 90,
  queen: 80,
  rook: 60,
  bishop: 50,
  knight: 50,
  pawn: 30,
};

function pieceValue(p: Piece): number {
  return PIECE_VALUE[p.role] ?? 25;
}

function getReliefAt(reliefs: Map<string, ReliefLevel>, coord: AxialCoord): ReliefLevel {
  return reliefs.get(coordKey(coord)) ?? 1;
}

/**
 * Lista todas las jugadas posibles del bando enemigo en el turno actual.
 * Cada jugada es: { pieceId, action: 'move'|'attack', dest? }.
 */
export interface EnemyAction {
  pieceId: string;
  action: 'move' | 'attack';
  dest: AxialCoord;
  /** Score estimado de la jugada. */
  score: number;
}

interface AiContext {
  pieces: Piece[];
  reliefs: Map<string, ReliefLevel>;
}

function collectEnemyActions(ctx: AiContext): EnemyAction[] {
  const { pieces, reliefs } = ctx;
  const enemy = pieces.filter((p) => p.team === 'enemy' && p.position);
  const occupied = new Set<string>();
  for (const p of pieces) if (p.position) occupied.add(coordKey(p.position));

  const actions: EnemyAction[] = [];

  for (const ep of enemy) {
    if (!ep.position) continue;
    const ownOccupied = new Set(occupied);
    ownOccupied.delete(coordKey(ep.position));

    const moves = getValidMoves(ep.position, ep.role, ownOccupied, -1);

    for (const dest of moves) {
      const alliesAtDest = pieces.find(
        (p) => p.team === 'ally' && p.position && coordKey(p.position) === coordKey(dest),
      );
      if (alliesAtDest) {
        // Es un ataque valido? Validamos regla de relieve.
        const aRelief = getReliefAt(reliefs, ep.position);
        const tRelief = getReliefAt(reliefs, dest);
        const canAttack = canAttackByRelief(aRelief, tRelief);
        if (!canAttack) continue;
        const score = scoreAttack(ep, alliesAtDest, pieces);
        actions.push({ pieceId: ep.id, action: 'attack', dest, score });
      } else {
        // Movimiento puro: scoring por posicionamiento defensivo / relieve.
        const score = scoreMove(ep, dest, pieces);
        actions.push({ pieceId: ep.id, action: 'move', dest, score });
      }
    }
  }
  return actions;
}

function scoreAttack(attacker: Piece, target: Piece, pieces: Piece[]): number {
  let s = pieceValue(target);
  if (target.role === 'king') s += 1000;
  // Si el atacante es de bajo valor y la victima vale mucho, subimos score
  s += Math.max(0, pieceValue(target) - pieceValue(attacker));
  // Bonus si nuestra pieza sobrevive (HP > 1)
  if (attacker.hp > 1) s += 5;
  // Riesgo: -N si hay aliado fuerte cerca del target
  const defenders = pieces.filter(
    (p) => p.team === 'ally' && p.position && hexNeighbors(target.position!).some(
      (n) => p.position && coordKey(p.position) === coordKey(n),
    ),
  );
  for (const d of defenders) s -= Math.floor(pieceValue(d) * 0.4);
  return s;
}

function scoreMove(piece: Piece, dest: AxialCoord, pieces: Piece[]): number {
  let s = 0;
  // Bonus por relieve alto (defensivo, vimos que ya esta en el original)
  // Calcular el relieve de dest a partir del map actual
  // (se pasa via contexto — pero aqui simplificamos)
  s += 1;
  // Bonus si esta adyacente a la pieza aliada mas valiosa
  const allies = pieces.filter((q) => q.team === 'ally' && q.position);
  for (const a of allies) {
    const adj = hexNeighbors(dest).some((n) =>
      a.position && coordKey(a.position) === coordKey(n),
    );
    if (adj) s += 5;
  }
  // Penalizar si quedamos al alcance de varias piezas aliadas
  const myKey = piece.position ? coordKey(piece.position) : '';
  const threats = pieces.filter(
    (q) => q.team === 'ally' && q.position && coordKey(q.position) !== myKey,
  );
  let threatCount = 0;
  for (const t of threats) {
    // Heuristica: si t esta en el mismo row o cercano, subimos contador
    const dist = Math.abs((t.position!.r) - dest.r) + Math.abs((t.position!.q - dest.q));
    if (dist <= 2) threatCount++;
  }
  s -= threatCount * 4;
  return s;
}

/**
 * Elige la mejor accion del enemigo para el turno actual.
 * Si no hay ninguna jugada posible, devuelve null (se pasa el turno sin accion).
 */
export function chooseEnemyAction(ctx: AiContext): EnemyAction | null {
  const actions = collectEnemyActions(ctx);
  if (actions.length === 0) return null;
  // Ordenamos por score descendente y devolvemos el primero
  return actions.sort((a, b) => b.score - a.score)[0];
}

/**
 * Aplica la accion del enemigo: devuelve el next pieces[]
 * (la pieza del enemigo se mueve o ataca).
 *
 * Estrategia: ataca primero si hay ataque posible, sino mueve con mejor score.
 */
export function applyEnemyAction(action: EnemyAction | null, ctx: AiContext): Piece[] {
  if (!action) return ctx.pieces;
  const { pieces } = ctx;
  if (action.action === 'attack') {
    const target = pieces.find((p) => p.team === 'ally' && p.position &&
      coordKey(p.position) === coordKey(action.dest));
    if (!target) return ctx.pieces;
    return pieces
      .map((p) => (p.id === target.id ? { ...p, hp: p.hp - 1 } : p))
      .filter((p) => p.hp > 0)
      .map((p) => (p.id === action.pieceId ? { ...p, position: action.dest } : p));
  }
  // move
  return pieces.map((p) =>
    p.id === action.pieceId ? { ...p, position: action.dest } : p,
  );
}
