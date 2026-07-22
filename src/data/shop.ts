/**
 * Seed data para la pantalla Tienda.
 * 4 categorias: ASPECTOS (skins de piezas), TABLEROS (mapas),
 * OBJETOS (consumibles) y EMOTES (animaciones).
 *
 * Cada item tiene: nombre, descripcion, precio en oro y/o gemas, rareza.
 */

export type ShopCategory = 'ASPECTO' | 'TABLERO' | 'OBJETO' | 'EMOTE';
export type ItemRarity = 'Raro' | 'Epico' | 'Legendario';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  description: string;
  emoji: string;
  rarity: ItemRarity;
  /** Precio en monedas de oro. Si esta undefined, item solo en gemas. */
  priceGold?: number;
  /** Precio en gemas. Si esta undefined, item solo en oro. */
  priceGem?: number;
  /** Si true, el item esta vendido y deshabilitado. */
  owned?: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  // === ASPECTOS (8) ===
  { id: 's-a01', name: 'Aspecto Forjador',         category: 'ASPECTO',  emoji: '♛', rarity: 'Legendario', priceGold: 3500, priceGem: 250, description: 'Aspecto premium del Rey con efecto dorado animado en victoria.' },
  { id: 's-a02', name: 'Aspecto Ceniza',           category: 'ASPECTO',  emoji: '♜', rarity: 'Epico',     priceGold: 1800, description: 'Piel de fantasma ceniciento. Aura azul tenue en pieza seleccionada.' },
  { id: 's-a03', name: 'Aspecto Herrero Real',     category: 'ASPECTO',  emoji: '♞', rarity: 'Epico',     priceGold: 1200, description: 'Caballero con armadura roja y destornillador magico (cosmetic).' },
  { id: 's-a04', name: 'Aspecto Hija del Bosque',  category: 'ASPECTO',  emoji: '♝', rarity: 'Raro',      priceGold: 600,  description: 'Bishop con hojas en la mitra y totem de madera en la base.' },
  { id: 's-a05', name: 'Aspecto Lobo',             category: 'ASPECTO',  emoji: '♟', rarity: 'Raro',      priceGold: 500,  description: 'Peon con capucha de lobo gris y aullido en ataque.' },
  { id: 's-a06', name: 'Aspecto Volcanico',        category: 'ASPECTO',  emoji: '♛', rarity: 'Legendario', priceGold: 5000, priceGem: 350, description: 'Reina de magma. Suelta chispas en cada movimiento.' },
  { id: 's-a07', name: 'Aspecto Hielo',            category: 'ASPECTO',  emoji: '♜', rarity: 'Epico',     priceGold: 1500, description: 'Torre azulada con cristales de hielo y brisa congelada.' },
  { id: 's-a08', name: 'Aspecto Playa Dorada',     category: 'ASPECTO',  emoji: '♟', rarity: 'Raro',      priceGold: 450, description: 'Skins veraniegos para peones - gorrito de playa incluido.' },

  // === TABLEROS (6) ===
  { id: 's-b01', name: 'Tablero Invierno',         category: 'TABLERO',  emoji: '❄', rarity: 'Epico',     priceGold: 2000, priceGem: 100, description: 'Hexagonos blancos con huellas sutiles. Copos cayendo en el fondo.' },
  { id: 's-b02', name: 'Tablero Cenizas',          category: 'TABLERO',  emoji: '☁', rarity: 'Raro',      priceGold: 700, description: 'Tablero post-apocaliptico con relieve color sepia y polvo flotante.' },
  { id: 's-b03', name: 'Tablero Reino de Cristal', category: 'TABLERO',  emoji: '✧', rarity: 'Legendario', priceGold: 4500, priceGem: 300, description: 'Hexagonos cristalinos que reflejan el cielo y cambian de color al shuffle.' },
  { id: 's-b04', name: 'Tablero Pantano',          category: 'TABLERO',  emoji: '〰', rarity: 'Raro',      priceGold: 600, description: 'Pantano verde con burbujas y reflejos fluctuantes.' },
  { id: 's-b05', name: 'Tablero Volcan',           category: 'TABLERO',  emoji: '☀', rarity: 'Epico',     priceGold: 1800, description: 'Hexagonos de lava con brasa naranja ascendiendo.' },
  { id: 's-b06', name: 'Tablero Arcano',           category: 'TABLERO',  emoji: '☽', rarity: 'Epico',     priceGold: 1500, description: 'Simbolos magicos rotativos en cada hexagono.' },

  // === OBJETOS / CONSUMIBLES (6) ===
  { id: 's-o01', name: 'Carta Aleatoria',          category: 'OBJETO',   emoji: '?', rarity: 'Raro',      priceGold: 200,  description: 'Una carta aleatoria de tu rareza maxima actual.' },
  { id: 's-o02', name: 'Boost de XP x2 (24h)',     category: 'OBJETO',   emoji: 'x2',rarity: 'Raro',      priceGold: 350,  description: 'Duplica la XP ganada en batallas durante 24 horas.' },
  { id: 's-o03', name: 'Cofre del Amanecer',       category: 'OBJETO',   emoji: '☼', rarity: 'Legendario', priceGold: 3000, priceGem: 150, description: 'Pack garantizado: 1 carta Epica + 3 cartas aleatorias.' },
  { id: 's-o04', name: 'Revivir Rey',              category: 'OBJETO',   emoji: '✚', rarity: 'Raro',      priceGold: 250,  description: 'Revive al Rey caido una vez por partida. Consumible.' },
  { id: 's-o05', name: 'Repeticion de Shuffle',    category: 'OBJETO',   emoji: '⇄', rarity: 'Raro',      priceGold: 180,  description: 'Fuerza un shuffle extra en cualquier momento del turno.' },
  { id: 's-o06', name: 'Tomo Ancestral',           category: 'OBJETO',   emoji: '✦', rarity: 'Epico',     priceGold: 800,  description: 'XP x3 por todas las partidas durante 1 semana.' },

  // === EMOTES (4) ===
  { id: 's-e01', name: 'Emote: Reir',              category: 'EMOTE',    emoji: 'ha', rarity: 'Raro',      priceGold: 250,  description: 'El Rey enemigo se rie en tu direccion al perder.' },
  { id: 's-e02', name: 'Emote: Reverencia',        category: 'EMOTE',    emoji: 'hb', rarity: 'Raro',      priceGold: 250,  description: 'Tu pieza hace reverencia al ejecutar una pieza mayor.' },
  { id: 's-e03', name: 'Emote: Susurro Real',      category: 'EMOTE',    emoji: 'sh', rarity: 'Epico',     priceGold: 800,  description: 'Burbuja de susurro personalizada para el Rey.' },
  { id: 's-e04', name: 'Emote: Grito de Guerra',    category: 'EMOTE',    emoji: 'gg', rarity: 'Epico',     priceGold: 900,  description: 'Cada tropa grita al cargar contra el enemigo.' },
];

/** Cantidad de saldos demo del jugador. */
export const WALLET = { gold: 4250, gems: 80 };
