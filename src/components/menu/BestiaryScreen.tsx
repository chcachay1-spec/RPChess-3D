import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { HEROES } from '../../data/heroes';

type TierKey = 'all' | 'S' | 'A' | 'B' | 'C';
type FactionKey = 'all' | 'luz' | 'oscuridad';

const TIER_TABS: { key: TierKey; label: string; tier: number | null }[] = [
  { key: 'all', label: 'Todo',   tier: null },
  { key: 'S',   label: 'S-Tier', tier: 5 },
  { key: 'A',   label: 'A-Tier', tier: 4 },
  { key: 'B',   label: 'B-Tier', tier: 3 },
  { key: 'C',   label: 'C-Tier', tier: 2 },
];

const FACTION_TABS: { key: FactionKey; label: string; emoji: string }[] = [
  { key: 'all',         label: 'Todo',       emoji: '✦' },
  { key: 'luz',         label: 'Luz',        emoji: '☀' },
  { key: 'oscuridad',   label: 'Oscuridad',  emoji: '☾' },
];

const TIER_COLOR: Record<number, string> = {
  5: '#FFD700', // S - dorado
  4: '#A78BFA', // A - violeta
  3: '#3B82F6', // B - azul
  2: '#9CA3AF', // C - gris
  1: '#6B7280',
};

const TIER_LABEL: Record<number, string> = {
  5: 'S',
  4: 'A',
  3: 'B',
  2: 'C',
  1: 'C',
};

// Faccion determinada por color (colores calidos/frios) o por emoji
function factionOf(hero: (typeof HEROES)[number]): FactionKey {
  const c = hero.color.toLowerCase();
  if (c.includes('rgb(') || c.startsWith('#')) {
    // Heuristica simple: colores frios y violetas = luz/orden, rojos/verdes oscuros = oscuridad
    if (c.includes('255, 215') || c.includes('ffd700')) return 'luz'; // oro
    if (c.includes('a78bfa') || c.includes('60a5fa')) return 'luz';  // violeta/azul
    if (c.includes('22c55e') && !c.includes('854d0e')) return 'luz'; // verde
    if (c.includes('fbbf24')) return 'luz';
    return 'oscuridad';
  }
  return 'luz';
}

export default function BestiaryScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [tier, setTier] = useState<TierKey>('all');
  const [faction, setFaction] = useState<FactionKey>('all');

  const filtered = useMemo(() => {
    return HEROES.filter((h) => {
      const tierOk = tier === 'all' || h.tier === TIER_TABS.find((t) => t.key === tier)?.tier;
      const factionOk = faction === 'all' || factionOf(h) === faction;
      return tierOk && factionOk;
    });
  }, [tier, faction]);

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">BESTIARIO</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">📜</span>
            <span className="subscreen__star-count">{filtered.length} / {HEROES.length}</span>
          </div>
        </div>

        <p className="bestiary__lead">
          Las 12 piezas del reino. Conoce sus roles, lore y stats antes de llevarlas al campo.
        </p>

        {/* Tier tabs (Todo / S / A / B / C) */}
        <div className="bestiary__tabs bestiary__tabs--tier">
          {TIER_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`bestiary__tab ${tier === t.key ? 'is-active' : ''}`}
              onClick={() => setTier(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Faction tabs (Todo / Luz / Oscuridad) */}
        <div className="bestiary__tabs bestiary__tabs--faction">
          {FACTION_TABS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`bestiary__tab bestiary__tab--faction ${faction === f.key ? 'is-active' : ''}`}
              onClick={() => setFaction(f.key)}
            >
              <span className="bestiary__tab-emoji">{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bestiary__empty">
            <span className="bestiary__empty-icon">📜</span>
            <p>No hay piezas en esta categoria todavia.</p>
          </div>
        ) : (
          <div className="bestiary__grid">
            {filtered.map((h) => (
              <article
                key={`${h.role}-${h.name}`}
                className="hero-card"
                style={{ ['--hero-color' as any]: h.color }}
              >
                <header className="hero-card__top">
                  <span
                    className="hero-card__tier"
                    style={{ background: TIER_COLOR[h.tier], color: '#1a1100' }}
                    title="Tier"
                  >
                    {TIER_LABEL[h.tier]}-Tier
                  </span>
                  <span className="hero-card__faction" title={factionOf(h)}>
                    {factionOf(h) === 'luz' ? '☀' : '☾'}
                  </span>
                </header>
                <div className="hero-card__portrait" style={{ background: h.color + '22', color: h.color }}>
                  <span className="hero-card__emoji">{h.emoji}</span>
                </div>
                <h3 className="hero-card__name gold-glow">{h.name}</h3>
                <div className="hero-card__title">{h.title}</div>
                <div className="hero-card__stats">
                  <div className="hero-card__stat"><span>HP</span><strong>{h.hp}</strong></div>
                  <div className="hero-card__stat"><span>Mov</span><strong>{h.moveRange}</strong></div>
                  <div className="hero-card__stat"><span>Atq</span><strong>{h.attackRange}</strong></div>
                </div>
                <p className="hero-card__lore">{h.lore}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
