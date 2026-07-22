/**
 * Tipos del dominio de RPChess 3D.
 *
 * Convenciones:
 * - ReliefLevel: 0=low (azul), 1=medium (verde), 2=high (rojo)
 * - Team: 'ally' (azul) | 'enemy' (rojo)
 * - AxialCoord: coordenadas axiales de un hex (q, r)
 */

export type ReliefLevel = 0 | 1 | 2;
export type Team = 'ally' | 'enemy';
export type HeroRole = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type StructureType = 'tower' | 'banner' | 'chest' | 'zone';

export interface AxialCoord {
  q: number;
  r: number;
}

export interface HexCell {
  coord: AxialCoord;
  relief: ReliefLevel;
}

export interface Piece {
  id: string;
  role: HeroRole;
  team: Team;
  position: AxialCoord | null;
  hp: number;
}

export interface Structure {
  id: string;
  type: StructureType;
  team?: Team;
  position: AxialCoord;
  capturePoints?: number;
}
