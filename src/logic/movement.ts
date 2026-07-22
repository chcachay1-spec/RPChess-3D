import type { AxialCoord, HeroRole } from '../types/hex';
import { hexNeighbors, coordKey } from './hex-grid';

/**
 * Reglas de movimiento adaptadas del ajedrez al hex grid.
 *
 * - 3 direcciones axiales (Torre): (1,0), (0,1), (-1,1)
 * - 3 direcciones diagonales (Alfil): (1,-1), (-1,0), (0,-1)
 * - Reina = Torre + Alfil
 * - Caballo = 6 saltos en L
 * - Rey = 1 paso
 * - Peón = 1 paso adelante
 */
export function getValidMoves(
  position: AxialCoord,
  role: HeroRole,
  occupiedHexes: Set<string>,
  forwardDir: 1 | -1 = 1,
): AxialCoord[] {
  switch (role) {
    case 'king':
      return hexNeighbors(position).filter(
        (n) => !occupiedHexes.has(coordKey(n)),
      );

    case 'rook':
      return rayMoves(position, [{ q: 1, r: 0 }, { q: 0, r: 1 }, { q: -1, r: 1 }], occupiedHexes);

    case 'bishop':
      return rayMoves(position, [{ q: 1, r: -1 }, { q: -1, r: 0 }, { q: 0, r: -1 }], occupiedHexes);

    case 'queen':
      return [
        ...getValidMoves(position, 'rook', occupiedHexes, forwardDir),
        ...getValidMoves(position, 'bishop', occupiedHexes, forwardDir),
      ];

    case 'knight': {
      const jumps: AxialCoord[] = [
        { q: 2, r: -1 }, { q: 1, r: 1 }, { q: -1, r: 2 },
        { q: -2, r: 1 }, { q: -1, r: -1 }, { q: 1, r: -2 },
      ];
      return jumps
        .map((j) => ({ q: position.q + j.q, r: position.r + j.r }))
        .filter((t) => !occupiedHexes.has(coordKey(t)));
    }

    case 'pawn': {
      const fwd: AxialCoord = { q: position.q, r: position.r + forwardDir };
      return occupiedHexes.has(coordKey(fwd)) ? [] : [fwd];
    }
  }
}

function rayMoves(
  from: AxialCoord,
  dirs: AxialCoord[],
  occupied: Set<string>,
): AxialCoord[] {
  const result: AxialCoord[] = [];
  for (const d of dirs) {
    let cur = { q: from.q + d.q, r: from.r + d.r };
    while (!occupied.has(coordKey(cur))) {
      result.push({ ...cur });
      cur = { q: cur.q + d.q, r: cur.r + d.r };
    }
  }
  return result;
}
