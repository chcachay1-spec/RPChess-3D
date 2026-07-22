import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { HEROES } from '../../data/heroes';

type CollectionTab = 'heroes' | 'tropas' | 'sinergias' | 'arquetipos';
type TierFilter = 'all' | 'S' | 'A' | 'B' | 'C';

const TABS: { key: CollectionTab; label: string }[] = [
  { key: 'heroes',    label: 'Héroes' },
  { key: 'tropas',    label: 'Tropas' },
  { key: 'sinergias', label: 'Sinergias' },
  { key: 'arquetipos',label: 'Arquetipos' },
];

const TIER_FILTERS: { key: TierFilter; label: string }[] = [
  { key: 'all', label: 'Todo' },
  { key: 'S',   label: 'S-Tier' },
  { key: 'A',   label: 'A-Tier' },
  { key: 'B',   label: 'B-Tier' },
  { key: 'C',   label: 'C-Tier' },
];

const TIER_COLOR: Record<number, string> = {
  5: '#FFD700',
  4: '#A78BFA',
  3: '#3B82F6',
  2: '#9CA3AF',
  1: '#6B7280',
};
const TIER_LABEL: Record<number, string> = {
  5: 'S',
  4: 'A',
  3: 'B',
  2: 'C',
  1: 'C',
};

/* Items de ejemplo ya desbloqueados para mostrar el mix de estados */
const OWNED_HERO_IDS = new Set(['a-king', 'a-queen', 'a-rook', 'a-knight']);
const OWNED_TROOP_KEYS = new Set(['Hostigador', 'Clérigo', 'Explorador']);

interface Synergy {
  name: string;
  emoji: string;
  threshold: number;
  effect: string;
  color: string;
}
const SYNERGIES: Synergy[] = [
  { name: 'Amanecer',    emoji: '☀',  threshold: 2, effect: 'Heroes de luz suman +1 de radio cada 2.', color: '#FFD700' },
  { name: 'Centinela',   emoji: '🛡', threshold: 3, effect: '3 tropas con torre reducen daño en 1 a tus torres.', color: '#A78BFA' },
  { name: 'Manada',      emoji: '🐺', threshold: 2, effect: 'Bestias lobo atacan 1 hex extra al cargar.', color: '#22C55E' },
  { name: 'Táctica Oscura', emoji: '☾', threshold: 2, effect: 'Piezas de sombra revelan +1 hex alrededor.', color: '#A78BFA' },
];

interface Archetype {
  name: string;
  pieces: string;
  playstyle: string;
  color: string;
}
const ARCHETYPES: Archetype[] = [
  { name: 'Control',         pieces: 'Rey + Torre + Clerigo + 2 Tropas', playstyle: 'Captura zonas lentas y rompe emparejamientos.',         color: '#3B82F6' },
  { name: 'Agresivo',        pieces: 'Reina + Caballero + 3 Tropas',      playstyle: 'Carrera explosiva contra el Rey enemigo.',              color: '#EF4444' },
  { name: 'Torre Tanque',    pieces: 'Torre x2 + Obispo + Hostigadores',  playstyle: 'Defensas impenetrables, contraataques lentos.',         color: '#94A3B8' },
  { name: 'Magia Arcana',    pieces: 'Reina + Obispo x2 + Clerigo',       playstyle: 'Hechizos progresivos + curación constante.',            color: '#A78BFA' },
];

export default function CollectionScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [tab, setTab] = useState<CollectionTab>('heroes');
  const [tier, setTier] = useState<TierFilter>('all');

  const heroes = HEROES.slice(0, 6); // 6 piezas fundamentales
  const tropas = HEROES.slice(6); // 5 tropas + 2 bestias

  const heroesFiltered = useMemo(
    () => heroes.filter((h) => tier === 'all' || (TIER_LABEL[h.tier] === tier)),
    [heroes, tier]
  );
  const tropasFiltered = useMemo(
    () => tropas.filter((h) => tier === 'all' || (TIER_LABEL[h.tier] === tier)),
    [tropas, tier]
  );

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">COLECCIÓN</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">📚</span>
            <span className="subscreen__star-count">{OWNED_HERO_IDS.size + OWNED_TROOP_KEYS.size} / {HEROES.length}</span>
          </div>
        </div>

        <p className="collection__lead">
          Tu colección de piezas, tropas, sinergias y arquetipos. Desbloquealos jugando.
        </p>

        {/* Tabs principales */}
        <div className="collection__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`collection__tab ${tab === t.key ? 'is-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tier filter (solo heroes/tropas) */}
        {(tab === 'heroes' || tab === 'tropas') && (
          <div className="collection__tier-tabs">
            {TIER_FILTERS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`collection__tier-tab ${tier === t.key ? 'is-active' : ''}`}
                onClick={() => setTier(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* HEROES */}
        {tab === 'heroes' && (
          <div className="collection__grid">
            {heroesFiltered.map((h, idx) => {
              const owned = idx < OWNED_HERO_IDS.size;
              return (
                <article key={h.role + h.name} className={`col-piece ${owned ? 'is-owned' : 'is-locked'}`}>
                  <div className="col-piece__preview" style={{ background: (owned ? h.color : '#666666') + '22' }}>
                    <span className="col-piece__emoji">{owned ? h.emoji : '🔒'}</span>
                    {owned && (
                      <span className="col-piece__tier" style={{ background: TIER_COLOR[h.tier] }}>
                        {TIER_LABEL[h.tier]}
                      </span>
                    )}
                  </div>
                  <div className="col-piece__body">
                    <div className="col-piece__name">{owned ? h.name : '???'}</div>
                    <div className="col-piece__title">{owned ? h.title : `Requiere Nv ${h.tier * 8}`}</div>
                    {!owned && (
                      <button className="col-piece__cta" disabled>🔒 Bloqueado</button>
                    )}
                    {owned && <div className="col-piece__badge">✓ Obtenido</div>}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* TROPAS */}
        {tab === 'tropas' && (
          <div className="collection__grid">
            {tropasFiltered.map((h, idx) => {
              const owned = OWNED_TROOP_KEYS.has(h.name) && idx < OWNED_TROOP_KEYS.size + 2;
              return (
                <article key={h.name} className={`col-piece ${owned ? 'is-owned' : 'is-locked'}`}>
                  <div className="col-piece__preview" style={{ background: (owned ? h.color : '#666') + '22' }}>
                    <span className="col-piece__emoji">{owned ? h.emoji : '🔒'}</span>
                    {owned && (
                      <span className="col-piece__tier" style={{ background: TIER_COLOR[h.tier] }}>
                        {TIER_LABEL[h.tier]}
                      </span>
                    )}
                  </div>
                  <div className="col-piece__body">
                    <div className="col-piece__name">{owned ? h.name : '???'}</div>
                    <div className="col-piece__title">{owned ? h.title : `Requiere 50 tropas`}</div>
                    {!owned && (
                      <button className="col-piece__cta" disabled>🔒 Bloqueado</button>
                    )}
                    {owned && <div className="col-piece__badge">✓ Obtenido</div>}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* SINERGIAS */}
        {tab === 'sinergias' && (
          <div className="collection__grid collection__grid--wide">
            {SYNERGIES.map((s, i) => {
              const owned = i < 2; // dos primeras obtenidas
              return (
                <article key={s.name} className={`col-syn ${owned ? 'is-owned' : 'is-locked'}`} style={{ ['--syn-color' as any]: s.color }}>
                  <div className="col-syn__emoji">{owned ? s.emoji : '🔒'}</div>
                  <div className="col-syn__body">
                    <div className="col-syn__name">{owned ? s.name : '???'}</div>
                    <div className="col-syn__threshold">Activa con {s.threshold} piezas</div>
                    <div className="col-syn__effect">{s.effect}</div>
                    {owned ? (
                      <div className="col-syn__badge">✓ Desbloqueada</div>
                    ) : (
                      <button className="col-syn__cta" disabled>🔒 Pendiente</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ARQUETIPOS */}
        {tab === 'arquetipos' && (
          <div className="collection__grid collection__grid--wide">
            {ARCHETYPES.map((a, i) => {
              const owned = i < 2;
              return (
                <article key={a.name} className={`col-arch ${owned ? 'is-owned' : 'is-locked'}`} style={{ ['--arch-color' as any]: a.color }}>
                  <div className="col-arch__emoji">{owned ? '♛' : '🔒'}</div>
                  <div className="col-arch__body">
                    <div className="col-arch__name">{a.name}</div>
                    <div className="col-arch__pieces">{a.pieces}</div>
                    <p className="col-arch__style">{a.playstyle}</p>
                    {owned ? (
                      <div className="col-arch__badge">✓ Dominado</div>
                    ) : (
                      <button className="col-arch__cta" disabled>🔒 Pendiente</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
