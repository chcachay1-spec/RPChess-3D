import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/game-store';

type RewardKind = 'gold' | 'gems' | 'card-pack' | 'aspecto' | 'emoji';

interface SeasonReward {
  kind: RewardKind;
  qty: number;
  /** 'free' = linea gratuita, 'premium' = linea premium (con candado antes de pagar) */
  track: 'free' | 'premium';
}

interface SeasonLevel {
  idx: number;             // 1..NivelMax
  xpRequired: number;      // XP total acumulada que se requiere para alcanzar el nivel
  free: SeasonReward | null;
  premium: SeasonReward | null;
}

/* Temporada demo: nombre + fecha */
const SEASON_NAME = 'C\u00C9NIT SOLAR';
const SEASON_SUBTITLE = 'El reino florece';
const SEASON_END_LABEL = 'Termina en 14d 6h';

const TOTAL_LEVELS = 30;
/* Curva XP suave: cada nivel un poco mas caro, max ~30k */
function xpCurve(idx: number): number {
  // 250, 500, 800, 1100, 1400, ... (incrementos de 300, max 30k)
  return Math.min(30000, Math.round(250 + (idx - 1) * (250 + (idx - 1) * 5)));
}

function buildLevels(): SeasonLevel[] {
  const arr: SeasonLevel[] = [];
  let cumXP = 0;
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const rewardXp = xpCurve(i);
    cumXP += rewardXp;
    // Premio gratis: alterna monedas (oro/gemas) con cartas
    const isOddLevel = i % 2 === 1;
    const free: SeasonReward | null = isOddLevel
      ? { kind: i % 4 === 1 ? 'gems' : 'gold', qty: i % 4 === 1 ? 5 : 100 + i * 5, track: 'free' }
      : { kind: 'card-pack', qty: 1, track: 'free' };
    // Premium: mas goloso - aspectos/emotes cada 5 niveles, gemas el resto
    const premium: SeasonReward | null = (() => {
      if (i % 5 === 0) return { kind: 'aspecto', qty: 1, track: 'premium' };
      if (i % 5 === 3) return { kind: 'emoji', qty: 3, track: 'premium' };
      return { kind: 'gems', qty: 25 + i * 2, track: 'premium' };
    })();
    arr.push({ idx: i, xpRequired: cumXP, free, premium });
  }
  return arr;
}

const LEVELS = buildLevels();

/* Estado demo: el jugador tiene 7.200 XP y nivel 12; todos los niveles <= 12 reclamados, 13+ libres */
const DEMO_PLAYER_XP = 7200;
const DEMO_PLAYER_LEVEL = 12;
const DEMO_IS_PREMIUM = false;

const REWARD_EMOJI: Record<RewardKind, string> = {
  'gold':       '\u25C6',
  'gems':       '\u25C6',
  'card-pack':  '🃏',
  aspecto:      '\u265B',
  emoji:        'o.o',
};

const REWARD_NAME: Record<RewardKind, string> = {
  'gold':       'Oro',
  'gems':       'Gemas',
  'card-pack':  'Carta',
  aspecto:      'Aspecto',
  emoji:        'Emote',
};

export default function SeasonPassScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [xp, setXp] = useState(DEMO_PLAYER_XP);
  void setXp;
  const [premium, setPremium] = useState(DEMO_IS_PREMIUM);
  const [claimed, setClaimed] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (let i = 1; i <= DEMO_PLAYER_LEVEL; i++) {
      s.add(`${i}-free`);
    }
    return s;
  });

  const playerLevel = useMemo(() => {
    let lvl = 0;
    for (const L of LEVELS) {
      if (xp >= L.xpRequired) lvl = L.idx;
      else break;
    }
    return lvl;
  }, [xp]);

  const xpForCurrentLevel = LEVELS[playerLevel - 1]?.xpRequired ?? 0;
  const xpForNextLevel    = LEVELS[playerLevel]?.xpRequired ?? xpForCurrentLevel;
  const progressInLevel   = (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel);

  const claim = (levelIdx: number, track: 'free' | 'premium') => {
    if (levelIdx > playerLevel) return;
    if (track === 'premium' && !premium) return;
    const key = `${levelIdx}-${track}`;
    if (claimed.has(key)) return;
    const L = LEVELS[levelIdx - 1];
    const r = track === 'free' ? L.free : L.premium;
    if (!r) return;
    setClaimed((p) => new Set(p).add(key));
  };

  const isClaimable = (levelIdx: number, track: 'free' | 'premium') => {
    if (claimed.has(`${levelIdx}-${track}`)) return false;
    if (levelIdx > playerLevel) return false;
    if (track === 'premium' && !premium) return false;
    return true;
  };

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">PASE DE TEMPORADA</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">{'👑'}</span>
            <span className="subscreen__star-count">Nv {playerLevel}/{TOTAL_LEVELS}</span>
          </div>
        </div>

        {/* Hero band */}
        <section className="season-hero">
          <div className="season-hero__crown">{'👑'}</div>
          <div className="season-hero__info">
            <h2 className="season-hero__name gold-glow">{SEASON_NAME}</h2>
            <p className="season-hero__subtitle">{SEASON_SUBTITLE}</p>
            <div className="season-hero__meta">
              <span className="season-hero__chip">{SEASON_END_LABEL}</span>
              <span className="season-hero__chip">Recompensa: Skin Forjador Dorada</span>
            </div>
          </div>
          <button
            type="button"
            className={`season-hero__upgrade ${premium ? 'is-premium' : ''}`}
            disabled={premium}
            onClick={() => setPremium(true)}
          >
            {premium ? '\u2713 Premium Activo' : '\u2605 Mejorar a Premium'}
            {!premium && <span className="season-hero__upgrade-price">499 Gemas</span>}
          </button>
        </section>

        {/* XP bar */}
        <section className="season-xp">
          <div className="season-xp__row">
            <span className="season-xp__label">XP de Temporada</span>
            <span className="season-xp__count">
              {xp.toLocaleString()} / {xpForNextLevel.toLocaleString()}
              <span className="season-xp__pct">· {Math.round(progressInLevel * 100)}% al Nv {playerLevel + 1}</span>
            </span>
          </div>
          <div className="season-xp__bar">
            <div className="season-xp__bar-fill" style={{ width: `${Math.round(progressInLevel * 100)}%` }} />
            <div className="season-xp__bar-level" style={{ left: `${Math.round(progressInLevel * 100)}%` }}>
              {playerLevel + 1 > TOTAL_LEVELS ? 'MAX' : `Nv ${playerLevel + 1}`}
            </div>
          </div>
        </section>

        {/* Track legend */}
        <div className="season-tracks">
          <span className="season-tracks__pill season-tracks__pill--free">\u25CB Linea Gratis (siempre disponible)</span>
          <span className="season-tracks__pill season-tracks__pill--premium">{'🔑'} Linea Premium (con pase)</span>
        </div>

        {/* Grid de niveles */}
        <div className="season-grid">
          {LEVELS.map((L) => {
            const isCurrent = L.idx === playerLevel + 1 && playerLevel < TOTAL_LEVELS;
            const pastLevel = L.idx <= playerLevel;
            return (
              <div
                key={L.idx}
                className={`season-level ${pastLevel ? 'is-past' : ''} ${isCurrent ? 'is-current' : ''} ${L.idx > playerLevel ? 'is-future' : ''}`}
              >
                <div className="season-level__num">Nv {L.idx}</div>
                <div className="season-level__rewards">
                  <button
                    type="button"
                    className={`season-level__row season-level__row--free ${isClaimable(L.idx, 'free') ? 'is-claimable' : ''} ${claimed.has(`${L.idx}-free`) ? 'is-claimed' : ''}`}
                    onClick={() => claim(L.idx, 'free')}
                    disabled={!isClaimable(L.idx, 'free')}
                    title={`Free reward Nv ${L.idx}`}
                  >
                    {claimed.has(`${L.idx}-free`) ? (
                      <span>\u2713 Reclamado</span>
                    ) : (
                      <>
                        <span className="season-level__row-icon">{L.free ? REWARD_EMOJI[L.free.kind] : '·'}</span>
                        <span className="season-level__row-qty">{L.free ? L.free.qty : '·'}</span>
                        <span className="season-level__row-name">{L.free ? REWARD_NAME[L.free.kind] : ''}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`season-level__row season-level__row--premium ${isClaimable(L.idx, 'premium') ? 'is-claimable' : ''} ${claimed.has(`${L.idx}-premium`) ? 'is-claimed' : ''} ${!premium ? 'is-locked-track' : ''}`}
                    onClick={() => claim(L.idx, 'premium')}
                    disabled={!isClaimable(L.idx, 'premium')}
                    title={`Premium reward Nv ${L.idx}`}
                  >
                    {claimed.has(`${L.idx}-premium`) ? (
                      <span>\u2713 Reclamado</span>
                    ) : !premium ? (
                      <>
                        <span className="season-level__row-icon">{'🔑'}</span>
                        <span className="season-level__row-name">Candado</span>
                      </>
                    ) : (
                      <>
                        <span className="season-level__row-icon">{L.premium ? REWARD_EMOJI[L.premium.kind] : '·'}</span>
                        <span className="season-level__row-qty">{L.premium ? L.premium.qty : '·'}</span>
                        <span className="season-level__row-name">{L.premium ? REWARD_NAME[L.premium.kind] : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
