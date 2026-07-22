import type { AxialCoord, ReliefLevel } from '../types/hex';
import { HEX_SIZE } from '../constants';

/**
 * Math del hex grid axial.
 *
 * Axial → mundo 3D: cada celda se posiciona en (x, 0, z).
 * - x = size * 1.5 * q
 * - z = size * sqrt(3) * (r + q/2)
 */
export function axialToWorld(
  coord: AxialCoord,
  size: number = HEX_SIZE,
): [number, number, number] {
  const x = size * 1.5 * coord.q;
  const z = size * Math.sqrt(3) * (coord.r + coord.q / 2);
  return [x, 0, z];
}

/** 6 vecinos de un hex en axial. */
export function hexNeighbors(coord: AxialCoord): AxialCoord[] {
  return [
    { q: coord.q + 1, r: coord.r },
    { q: coord.q - 1, r: coord.r },
    { q: coord.q, r: coord.r + 1 },
    { q: coord.q, r: coord.r - 1 },
    { q: coord.q + 1, r: coord.r - 1 },
    { q: coord.q - 1, r: coord.r + 1 },
  ];
}

/** Distancia entre dos hexes (en pasos). */
export function hexDistance(a: AxialCoord, b: AxialCoord): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Genera todas las celdas de un tablero rectangular. */
export function getBoardHexes(cols: number, rows: number): AxialCoord[] {
  const hexes: AxialCoord[] = [];
  for (let q = 0; q < cols; q++) {
    for (let r = 0; r < rows; r++) {
      hexes.push({ q, r });
    }
  }
  return hexes;
}

/** Altura visual 3D del relieve. */
export function reliefHeight(relief: ReliefLevel): number {
  return relief * 0.4;
}

/** Convierte coord a string key para usar en Map. */
export function coordKey(coord: AxialCoord): string {
  return `${coord.q},${coord.r}`;
}
