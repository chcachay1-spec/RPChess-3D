import { useGameStore } from '../../store/game-store';
import { REGION_INFO } from '../../data/heroes';

type Biome = 'llanura' | 'bosque' | 'altura' | 'fortaleza';

interface BiomeInfo {
  emoji: string;
  emojiNative: string; // svg/path fallback
  color: string;
  colorRgb: string;
  label: string;
}

const BIOME_STYLES: Record<Biome, BiomeInfo> = {
  llanura:   { emoji: '🌾', emojiNative: 'PL', color: '#A3E635', colorRgb: '163,230,53',  label: 'LLANURA' },
  bosque:    { emoji: '🌲', emojiNative: 'FO', color: '#22C55E', colorRgb: '34,197,94',   label: 'BOSQUE' },
  altura:    { emoji: '⛰️', emojiNative: 'PK', color: '#94A3B8', colorRgb: '148,163,184', label: 'ALTURA' },
  fortaleza: { emoji: '🏰', emojiNative: 'FT', color: '#EF4444', colorRgb: '239,68,68',   label: 'FORTALEZA' },
};

const NODE_EMOJI: Record<string, string> = {
  batalla: '⚔️',
  tesoro: '💎',
  jefe: '👹',
};

interface RegionStatus {
  regionIdx: number;
  completed: number;
  total: number;
  unlocked: boolean;
}

/**
 * Pantalla de Aventura / Mapa de Campana.
 * Replica del original:
 *  - Header: <Menu | MAPA DE AVENTURA | O Estrellas N/60>
 *  - Copy: "Recorre las 4 regiones del reino y enfrenta al Monarca Caido"
 *  - 4 region cards (colapsables): biome icon, nombre, subtitulo, descripcion,
 *    dificultad (estrellas), grid de nodos [tipo + estrellas + nombre]
 *  - Suelo: "Disponible en v2" CTA
 *
 * Estado: solo la primera region esta desbloqueada y completa al 100% en el demo.
 */
export default function CampaignScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  // Demo: la primera region completa, resto bloqueada
  const statusByRegion: RegionStatus[] = REGION_INFO.map((region, idx) => ({
    regionIdx: idx,
    completed: idx === 0 ? region.nodes.length : 0,
    total: region.nodes.length,
    unlocked: idx === 0,
  }));
  const totalCompleted = statusByRegion.reduce((acc, r) => acc + r.completed, 0);
  const totalStars = statusByRegion.reduce((acc, r) => acc + r.total, 0) * 3; // 3 estrellas por nodo
  const earnedStars = totalCompleted * 3;

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        {/* Header con navegacion de migas + estrellas */}
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">MAPA DE AVENTURA</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">⭐</span>
            <span className="subscreen__star-count">{earnedStars}/{totalStars}</span>
          </div>
        </div>

        {/* Intro / hero band */}
        <div className="campaign__intro">
          <p className="campaign__intro-lead">
            Recorre las 4 regiones del reino y enfrenta al Monarca Caido en la fortaleza final.
          </p>
          <div className="campaign__progress-bar">
            <div
              className="campaign__progress-fill"
              style={{ width: `${Math.round((earnedStars / totalStars) * 100)}%` }}
            />
          </div>
          <div className="campaign__progress-meta">
            <span>{totalCompleted} / {REGION_INFO.reduce((a, r) => a + r.nodes.length, 0)} nodos completados</span>
            <span>Dificultad total: ★★☆☆</span>
          </div>
        </div>

        {/* Region cards */}
        <div className="campaign__regions">
          {REGION_INFO.map((region, idx) => {
            const biome = BIOME_STYLES[region.biome as Biome];
            const status = statusByRegion[idx];
            return (
              <section
                key={region.id}
                className={`campaign__region ${status.unlocked ? 'is-unlocked' : 'is-locked'}`}
                style={{
                  ['--region-color' as any]: biome.color,
                  ['--region-color-rgb' as any]: biome.colorRgb,
                }}
              >
                <header className="campaign__region-header">
                  <div className="campaign__region-icon">
                    <span className="campaign__region-emoji">{biome.emoji}</span>
                    <span className="campaign__region-biome">{biome.label}</span>
                  </div>
                  <div className="campaign__region-info">
                    <h2 className="campaign__region-name gold-glow">{region.name}</h2>
                    <p className="campaign__region-sub">{region.subtitle}</p>
                  </div>
                  <div className="campaign__region-status">
                    {status.unlocked ? (
                      <>
                        <div className="campaign__region-stars">
                          {Array.from({ length: 3 }, (_, i) => (
                            <span key={i} className={`campaign__region-star ${i < status.completed ? 'is-on' : ''}`}>★</span>
                          ))}
                        </div>
                        <span className="campaign__region-badge campaign__region-badge--go">
                          {status.completed}/{status.total}
                        </span>
                      </>
                    ) : (
                      <div className="campaign__region-lock">
                        <span className="campaign__region-lock-icon">🔒</span>
                        <span className="campaign__region-lock-text">BLOQUEADO</span>
                      </div>
                    )}
                  </div>
                </header>

                <p className="campaign__region-desc">{region.description}</p>

                <div className="campaign__region-difficulty">
                  <span className="campaign__region-diff-label">Dificultad</span>
                  <span className="campaign__region-diff-stars">
                    {'★'.repeat(region.difficulty)}
                    <span className="campaign__region-diff-empty">{'☆'.repeat(4 - region.difficulty)}</span>
                  </span>
                </div>

                {/* Nodos: grid de cards con icono + numero + estrellas + nombre */}
                <div className="campaign__nodes">
                  {region.nodes.map((n, ni) => {
                    const isCompleted = status.unlocked && ni < status.completed;
                    const isCurrent = status.unlocked && ni === status.completed;
                    const isBoss = n.type === 'jefe';
                    return (
                      <div
                        key={n.id}
                        className={`campaign__node campaign__node--${n.type} ${isCompleted ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''} ${!status.unlocked ? 'is-locked' : ''}`}
                      >
                        <div className="campaign__node-num">{ni + 1}</div>
                        <div className="campaign__node-icon">{NODE_EMOJI[n.type] ?? '◆'}</div>
                        <div className="campaign__node-stars">
                          {Array.from({ length: 3 }, (_, i) => (
                            <span key={i} className={i < (isCompleted ? 3 : isCurrent ? 0 : 0) ? 'is-on' : ''}>★</span>
                          ))}
                        </div>
                        <div className="campaign__node-name">{n.name}</div>
                        {isBoss && <div className="campaign__node-boss-mark">JEFE</div>}
                        {isCurrent && <div className="campaign__node-cta">▶ Jugar</div>}
                      </div>
                    );
                  })}
                </div>

                {status.unlocked && status.completed === status.total && (
                  <button className="menu__btn menu__btn--gold menu__btn--auth campaign__region-claim">
                    ✦ Reclamar Recompensa ✦
                  </button>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div className="campaign__footer">
          <p className="campaign__footer-hint">Disponible en v2 — por ahora juga Tacticas del Reino para probar el tablero 3D.</p>
          <button className="menu__btn menu__btn--blue menu__btn--big" onClick={() => setScreen('tactics')}>
            <span className="menu__btn-icon">♞</span>
            <span className="menu__btn-label">Jugar Tacticas del Reino</span>
          </button>
        </div>
      </div>
    </div>
  );
}
