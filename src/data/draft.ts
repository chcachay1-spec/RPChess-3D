/**
 * Pool completo del Draft / Reclutamiento.
 * 12 heroes (6 fundamentales + 2 tropas + 1 rey + 1 reina extra + 2 bestias)
 * 5 tropas desplegables. En total 17 piezas seleccionables en draft.
 */
import type { HeroRole } from '../types/hex';

export type DraftTier = 'S' | 'A' | 'B' | 'C';
export type DraftFaction = 'luz' | 'oscuridad' | 'neutro';

export interface DraftPiece {
  id: string;
  name: string;
  title: string;
  role: HeroRole | 'bestia';
  tier: DraftTier;
  hp: number;
  move: string;
  attack: string;
  faction: DraftFaction;
  emoji: string;
  lore: string;
  color: string;
}

export const DRAFT_POOL: DraftPiece[] = [
  // 6 fundamentales
  { id: 'd-king',   name: 'Rey Aldric',   title: 'El Soberano',           role: 'king',   tier: 'S', hp: 5, move: '1 hex',  attack: 'Adyacente',  faction: 'luz',       emoji: '\u{1F451}', color: '#FFD700', lore: 'Lider del ejercito. Si cae, la partida termina.' },
  { id: 'd-queen',  name: 'Reina Lyra',   title: 'Hechicera Coronada',    role: 'queen',  tier: 'S', hp: 4, move: 'Infinita', attack: 'L/D',       faction: 'luz',       emoji: '\u265B',    color: '#A78BFA', lore: 'Maestra de magia arcana. La pieza mas versatil.' },
  { id: 'd-rook',   name: 'Torre Brutus', title: 'Centinela de Acero',    role: 'rook',   tier: 'A', hp: 4, move: 'Infinita', attack: 'Linea recta', faction: 'luz',     emoji: '\u265C',    color: '#94A3B8', lore: 'Fortaleza andante. Lento pero irrompible.' },
  { id: 'd-bishop', name: 'Albus el Sabio',title: 'Sumo Sacerdote',       role: 'bishop', tier: 'A', hp: 3, move: 'Infinita', attack: 'Diagonal',   faction: 'luz',       emoji: '\u265D',    color: '#60A5FA', lore: 'Guardia de los antiguos saberes.' },
  { id: 'd-knight', name: 'Sir Gawain',   title: 'Caballero Sin Miedo',   role: 'knight', tier: 'B', hp: 3, move: 'L (2+1)',  attack: 'En L',        faction: 'luz',       emoji: '\u265E',    color: '#22C55E', lore: 'Salta sobre lineas enemigas. Llega donde otros no.' },
  { id: 'd-pawn',   name: 'Peon',         title: 'Linea de Infanteria',   role: 'pawn',   tier: 'C', hp: 2, move: '1 adelante',attack: '1 adelante', faction: 'luz',       emoji: '\u265F',    color: '#9CA3AF', lore: 'Promueve si llega a la base enemiga.' },

  // 5 tropas
  { id: 'd-host',   name: 'Hostigador',   title: 'Arquero ligero',        role: 'pawn',   tier: 'B', hp: 2, move: '2 hex',    attack: 'A distancia (v2)', faction: 'luz',    emoji: '\u{1F3F9}', color: '#A16207', lore: 'Hostigan desde lejos sin exponerse.' },
  { id: 'd-art',    name: 'Artilleria',   title: 'Bombarda pesada',       role: 'pawn',   tier: 'A', hp: 3, move: '1 hex',    attack: 'Area (AoE)', faction: 'luz',         emoji: '\u{1F4A3}', color: '#7C2D12', lore: 'Lento pero devastador a distancia.' },
  { id: 'd-cler',   name: 'Clerigo',      title: 'Sacerdote de batalla',  role: 'pawn',   tier: 'B', hp: 2, move: '1 hex',    attack: 'Cura aliados',faction: 'luz',       emoji: '\u2728',    color: '#FBBF24', lore: 'Su rol es sanar, no matar.' },
  { id: 'd-expl',   name: 'Explorador',   title: 'Avanzada rapida',       role: 'pawn',   tier: 'B', hp: 2, move: '3 hex',    attack: 'CC',         faction: 'luz',         emoji: '\u{1F50D}', color: '#0EA5E9', lore: 'Revela niebla y flanquea.' },
  { id: 'd-cap',    name: 'Capitan',      title: 'Comandante veteranio',  role: 'pawn',   tier: 'A', hp: 4, move: '2 hex',    attack: 'Adyacente',  faction: 'luz',       emoji: '\u{1F396}\uFE0F', color: '#DC2626', lore: 'Lidera tropas: cada tropa aliada +1 attack.' },

  // 2 bestias
  { id: 'd-lobo',   name: 'Lobo Sombrio', title: 'Bestia de manada',      role: 'bestia', tier: 'B', hp: 3, move: '3 hex',    attack: 'Salto 2 hex', faction: 'neutro',    emoji: '\u{1F43A}', color: '#4B5563', lore: 'Bestia neutral. Domesticable con cartas.' },
  { id: 'd-jab',    name: 'Jabali Enorme',title: 'Bestia territorial',    role: 'bestia', tier: 'A', hp: 4, move: '2 hex',    attack: 'Carga',      faction: 'neutro',      emoji: '\u{1F417}', color: '#854D0E', lore: 'Ataca a quien entre en su hex.' },
];

export const TIER_COLOR: Record<DraftTier, string> = {
  S: '#FFD700',
  A: '#A78BFA',
  B: '#3B82F6',
  C: '#9CA3AF',
};

export const FACTION_EMOJI: Record<DraftFaction, string> = {
  luz: '\u2600\uFE0F',
  oscuridad: '\u263D\uFE0F',
  neutro: '\u269C\uFE0F',
};

export const MAX_VETOES = 2;
export const MAX_HERO_PICKS = 6;  // cantidad a elegir entre heroes
export const MAX_TROOP_PICKS = 2; // cantidad de tropas a elegir de las 5 disponibles
