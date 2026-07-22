/**
 * Seed data para la pantalla Forja de Cartas.
 * Definimos un pool base de 30 cartas divididas en 3 tipos (BUFF / TRAMPA / CONDICIONAL)
 * con 3 rarezas cada una y un coste de energia (1-3).
 */

export type CardType = 'BUFF' | 'TRAMPA' | 'CONDICIONAL';
export type Rarity = 'Comun' | 'Rara' | 'Epica' | 'Legendaria';

export interface ForgeCard {
  id: string;
  name: string;
  type: CardType;
  cost: 1 | 2 | 3;
  rarity: Rarity;
  emoji: string;
  previewColor: string; // rgb tupla para color de fondo del preview
  effect: string;
}

const PALETTE: Record<CardType, { color: string; bgGlow: string }> = {
  BUFF:        { color: '#3B82F6', bgGlow: 'rgba(59, 130, 246, 0.18)' },
  TRAMPA:      { color: '#EF4444', bgGlow: 'rgba(239, 68, 68, 0.18)'  },
  CONDICIONAL: { color: '#A78BFA', bgGlow: 'rgba(167, 139, 250, 0.18)' },
};

export const CARDS: ForgeCard[] = [
  // === BUFF (10) ===
  { id: 'c-b01', name: 'Bendicion del Alba',    type: 'BUFF', cost: 1, rarity: 'Comun',      emoji: '🌅', previewColor: PALETTE.BUFF.color,        effect: '+1 HP a un aliado adyacente.' },
  { id: 'c-b02', name: 'Escudo de Hierro',      type: 'BUFF', cost: 2, rarity: 'Rara',       emoji: '🛡', previewColor: PALETTE.BUFF.color,        effect: 'Hasta 2 HP de dano a una pieza.' },
  { id: 'c-b03', name: 'Luz del Paladin',       type: 'BUFF', cost: 2, rarity: 'Rara',       emoji: '✨', previewColor: PALETTE.BUFF.color,        effect: '+1 al radio de movimiento de un aliado.' },
  { id: 'c-b04', name: 'Ira del Guerrero',      type: 'BUFF', cost: 3, rarity: 'Epica',      emoji: '⚔', previewColor: PALETTE.BUFF.color,        effect: '+1 danio a los ataques de tu heroe este turno.' },
  { id: 'c-b05', name: 'Carga de Vanguardia',   type: 'BUFF', cost: 1, rarity: 'Comun',      emoji: '🏹', previewColor: PALETTE.BUFF.color,        effect: 'Tropa aliada se mueve +1 hex adicional.' },
  { id: 'c-b06', name: 'Baluarte Sagrado',      type: 'BUFF', cost: 3, rarity: 'Epica',      emoji: '🔱', previewColor: PALETTE.BUFF.color,        effect: 'Tus torres/banderas no pueden ser capturadas este turno.' },
  { id: 'c-b07', name: 'Renovacion Arcana',     type: 'BUFF', cost: 2, rarity: 'Rara',       emoji: '🌟', previewColor: PALETTE.BUFF.color,        effect: 'Recupera 1 energia adicional este turno.' },
  { id: 'c-b08', name: 'Voto del Paladin',      type: 'BUFF', cost: 3, rarity: 'Legendaria', emoji: '👑', previewColor: PALETTE.BUFF.color,        effect: 'Tu Rey ignora la primera baja de HP.' },
  { id: 'c-b09', name: 'Aura del Clerigo',      type: 'BUFF', cost: 2, rarity: 'Comun',      emoji: '🌙', previewColor: PALETTE.BUFF.color,        effect: 'Cura 1 HP de aliados adyacentes.' },
  { id: 'c-b10', name: 'Canto de Esperanza',    type: 'BUFF', cost: 1, rarity: 'Comun',      emoji: '🕊', previewColor: PALETTE.BUFF.color,        effect: '+1 de suerte al dado de ataque de tu tropa.' },

  // === TRAMPA (10) ===
  { id: 'c-t01', name: 'Terreno Pantanoso',     type: 'TRAMPA', cost: 1, rarity: 'Comun',      emoji: '🐸', previewColor: PALETTE.TRAMPA.color,      effect: 'Reduce la movilidad enemiga en 1 hex este turno.' },
  { id: 'c-t02', name: 'Lluvia de Flechas',     type: 'TRAMPA', cost: 2, rarity: 'Rara',       emoji: '☄', previewColor: PALETTE.TRAMPA.color,      effect: '1 danio a todas las tropas enemigas adyacentes.' },
  { id: 'c-t03', name: 'Niebla de Guerra',      type: 'TRAMPA', cost: 2, rarity: 'Rara',       emoji: '🌫', previewColor: PALETTE.TRAMPA.color,      effect: 'El enemigo no ve tus piezas hasta su proximo turno.' },
  { id: 'c-t04', name: 'Roca Rodante',          type: 'TRAMPA', cost: 3, rarity: 'Epica',      emoji: '🪨', previewColor: PALETTE.TRAMPA.color,      effect: 'Empuja una pieza enemiga 2 hexes cuesta abajo.' },
  { id: 'c-t05', name: 'Trampa de Pincho',      type: 'TRAMPA', cost: 1, rarity: 'Comun',      emoji: '⚠', previewColor: PALETTE.TRAMPA.color,      effect: 'Si el enemigo se mueve a este hex: -2 HP.' },
  { id: 'c-t06', name: 'Oscuridad',             type: 'TRAMPA', cost: 2, rarity: 'Comun',      emoji: '🌑', previewColor: PALETTE.TRAMPA.color,      effect: 'Vision enemiga reducida por 2 turnos.' },
  { id: 'c-t07', name: 'Maldicion del Bosque',  type: 'TRAMPA', cost: 3, rarity: 'Epica',      emoji: '🍂', previewColor: PALETTE.TRAMPA.color,      effect: 'El heroe enemigo pierde su movimiento especial.' },
  { id: 'c-t08', name: 'Mina Explosiva',        type: 'TRAMPA', cost: 2, rarity: 'Rara',       emoji: '💣', previewColor: PALETTE.TRAMPA.color,      effect: 'Al moverse el enemigo sobre este hex: -3 HP.' },
  { id: 'c-t09', name: 'Pesadilla del Rey',     type: 'TRAMPA', cost: 3, rarity: 'Legendaria', emoji: '👁', previewColor: PALETTE.TRAMPA.color,      effect: 'El Rey enemigo no puede mover este turno.' },
  { id: 'c-t10', name: 'Viento Helado',         type: 'TRAMPA', cost: 1, rarity: 'Comun',      emoji: '❄', previewColor: PALETTE.TRAMPA.color,      effect: 'Reduce el dano de ataque enemigo por 1.' },

  // === CONDICIONAL (10) ===
  { id: 'c-x01', name: 'Contraataque',          type: 'CONDICIONAL', cost: 1, rarity: 'Rara',       emoji: '⚡', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si te atacan: deal 1 danio de vuelta al atacante.' },
  { id: 'c-x02', name: 'Embestida',             type: 'CONDICIONAL', cost: 2, rarity: 'Rara',       emoji: '🐎', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si capturas una zona: +2 de danio en tu proximo ataque.' },
  { id: 'c-x03', name: 'Venganza del Capitan',  type: 'CONDICIONAL', cost: 2, rarity: 'Epica',      emoji: '🗡', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si cae tu Rey: tu tropa gana +2 de ataque.' },
  { id: 'c-x04', name: 'Hora Bruja',            type: 'CONDICIONAL', cost: 3, rarity: 'Epica',      emoji: '🕯', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si es tu turno 6+: invoca una bestia aliada adyacente.' },
  { id: 'c-x05', name: 'Carga Heroica',         type: 'CONDICIONAL', cost: 2, rarity: 'Comun',      emoji: '🛡', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si baja tu HP en 1 turno: gana +1 de ataque este turno.' },
  { id: 'c-x06', name: 'Mirada del Dragon',     type: 'CONDICIONAL', cost: 3, rarity: 'Legendaria', emoji: '🐲', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si tienes 3 tropas: el enemigo no puede jugar cartas BUFF.' },
  { id: 'c-x07', name: 'Vinculo Eterno',        type: 'CONDICIONAL', cost: 2, rarity: 'Rara',       emoji: '💞', previewColor: PALETTE.CONDICIONAL.color, effect: 'Cuando un aliado cae, su tropa adyacente gana +1 HP.' },
  { id: 'c-x08', name: 'Chispa de Genio',       type: 'CONDICIONAL', cost: 1, rarity: 'Comun',      emoji: '💡', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si no jugaste carta en 3 turnos: robar una gratis.' },
  { id: 'c-x09', name: 'Ultima Voluntad',       type: 'CONDICIONAL', cost: 2, rarity: 'Rara',       emoji: '⛓', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si tu Rey va a caer: cambia su posicion con una tropa.' },
  { id: 'c-x10', name: 'Muro de Escudos',       type: 'CONDICIONAL', cost: 3, rarity: 'Epica',      emoji: '🪖', previewColor: PALETTE.CONDICIONAL.color, effect: 'Si 2+ aliados en linea: los ataques enemigos pierden 1.' },
];

export const DECK_SIZE = 30;
