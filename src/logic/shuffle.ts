import type { AxialCoord, ReliefLevel } from '../types/hex';
import { coordKey } from './hex-grid';

/**
 * Shuffle de relieves. Decidido en Fase 1 con el usuario:
 * cada 6 turnos, los relieves se reasignan al azar manteniendo
 * una distribución balanceada (máx ~40% en un solo relieve).
 */
export function shuffleReliefs(
  hexes: AxialCoord[],
  _currentReliefs: Map<string, ReliefLevel>,
  rng: () => number = Math.random,
): Map<string, ReliefLevel> {
  const newReliefs = new Map<string, ReliefLevel>();
  const total = hexes.length;
  const maxPerRelief = Math.floor(total * 0.4);

  const shuffled = [...hexes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const localCounts: [number, number, number] = [0, 0, 0];
  for (const coord of shuffled) {
    const available: ReliefLevel[] = [];
    for (let r = 0 as ReliefLevel; r <= 2; r++) {
      if (localCounts[r] < maxPerRelief) available.push(r);
    }
    const pool: ReliefLevel[] = available.length > 0 ? available : [0, 1, 2];
    const relief = pool[Math.floor(rng() * pool.length)];
    newReliefs.set(coordKey(coord), relief);
    localCounts[relief]++;
  }

  return newReliefs;
}
