import { useGameStore } from '../../store/game-store';

/**
 * Pantalla de Perfil de Usuario.
 * Replica del original:
 *  - Cabecera con avatar circular (inicial), nombre, email
 *  - Nivel actual + barra XP
 *  - Saldos (monedas / gemas)
 *  - Grid 2x2 de stats: Victorias / Derrotas / Empates / Tasa%
 *  - Batallas recientes: tipo (VICTORIA/DERROTA), oponente, métricas
 */

interface RecentBattle {
  id: string;
  result: 'VICTORIA' | 'DERROTA' | 'EMPATÉ';
  opponent: string;
  mode: string;
  turns: number;
  durationSec: number;
  date: string;
}

const PLAYER = {
  initial: 'C',
  name: 'cris',
  email: 'chcachay.1@gmail.com',
  level: 8,
  xp: 1280,
  xpNext: 2000,
  wallet: { gold: 4250, gems: 80 },
  stats: {
    victories: 47,
    defeats: 22,
    draws: 5,
    rating: 1485,
  },
};

const RECENT: RecentBattle[] = [
  { id: 'b1', result: 'DERROTA',   opponent: 'IA Medio',     mode: 'Permadeath', turns: 18, durationSec: 412, date: 'Hoy' },
  { id: 'b2', result: 'VICTORIA',  opponent: 'IA Difícil',   mode: 'Zone Capture', turns: 24, durationSec: 588, date: 'Hoy' },
  { id: 'b3', result: 'EMPATÉ',    opponent: 'Sir_Gawain92', mode: 'Capture the Flag', turns: 32, durationSec: 712, date: 'Ayer' },
  { id: 'b4', result: 'VICTORIA',  opponent: 'IA Fácil',     mode: 'Permadeath', turns: 9,  durationSec: 184, date: 'Ayer' },
];

const RESULT_COLOR: Record<RecentBattle['result'], string> = {
  VICTORIA: '#22C55E',
  DERROTA:  '#EF4444',
  EMPATÉ:   '#A78BFA',
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export default function ProfileScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const totalGames = PLAYER.stats.victories + PLAYER.stats.defeats + PLAYER.stats.draws;
  const winRate = totalGames === 0 ? 0 : Math.round((PLAYER.stats.victories / totalGames) * 100);
  const xpPct = (PLAYER.xp / PLAYER.xpNext) * 100;

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">PERFIL</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">★</span>
            <span className="subscreen__star-count">Nv {PLAYER.level}</span>
          </div>
        </div>

        {/* Identity card */}
        <section className="profile-id">
          <div className="profile-id__avatar">{PLAYER.initial}</div>
          <div className="profile-id__info">
            <h2 className="profile-id__name gold-glow">{PLAYER.name}</h2>
            <p className="profile-id__email">{PLAYER.email}</p>
            <div className="profile-id__level">
              <div className="profile-id__level-row">
                <span>Nivel</span>
                <strong>{PLAYER.level}</strong>
              </div>
              <div className="profile-id__xp-bar">
                <div className="profile-id__xp-fill" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="profile-id__xp-meta">
                <span>{PLAYER.xp.toLocaleString()} / {PLAYER.xpNext.toLocaleString()} XP</span>
                <span>{Math.round(xpPct)}% al Nv {PLAYER.level + 1}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet */}
        <section className="profile-wallet">
          <div className="profile-wallet__cell">
            <div className="profile-wallet__symbol" style={{ color: '#FFD700' }}>◈</div>
            <div className="profile-wallet__value">{PLAYER.wallet.gold.toLocaleString()}</div>
            <div className="profile-wallet__label">Monedas</div>
          </div>
          <div className="profile-wallet__cell">
            <div className="profile-wallet__symbol" style={{ color: '#A78BFA' }}>◆</div>
            <div className="profile-wallet__value">{PLAYER.wallet.gems}</div>
            <div className="profile-wallet__label">Gemas</div>
          </div>
          <div className="profile-wallet__cell">
            <div className="profile-wallet__symbol" style={{ color: '#EF4444' }}>♕</div>
            <div className="profile-wallet__value">{PLAYER.stats.rating}</div>
            <div className="profile-wallet__label">Rating</div>
          </div>
        </section>

        {/* Stats grid 2x2 */}
        <section className="profile-stats">
          <h3 className="profile-stats__title gold-glow">Estadísticas Globales</h3>
          <div className="profile-stats__grid">
            <div className="profile-stat">
              <div className="profile-stat__icon" style={{ color: '#22C55E' }}>▲</div>
              <div className="profile-stat__value">{PLAYER.stats.victories}</div>
              <div className="profile-stat__label">Victorias</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__icon" style={{ color: '#EF4444' }}>▼</div>
              <div className="profile-stat__value">{PLAYER.stats.defeats}</div>
              <div className="profile-stat__label">Derrotas</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__icon" style={{ color: '#A78BFA' }}>●</div>
              <div className="profile-stat__value">{PLAYER.stats.draws}</div>
              <div className="profile-stat__label">Empates</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat__icon" style={{ color: '#FFD700' }}>%</div>
              <div className="profile-stat__value">{winRate}%</div>
              <div className="profile-stat__label">Tasa de Victoria</div>
            </div>
          </div>
        </section>

        {/* Recent battles */}
        <section className="profile-recent">
          <h3 className="profile-recent__title gold-glow">Batallas Recientes</h3>
          <div className="profile-recent__list">
            {RECENT.map((b) => (
              <article key={b.id} className="battle-row">
                <div className="battle-row__result" style={{ background: RESULT_COLOR[b.result] + '22', color: RESULT_COLOR[b.result] }}>
                  {b.result}
                </div>
                <div className="battle-row__body">
                  <div className="battle-row__opp">vs <strong>{b.opponent}</strong></div>
                  <div className="battle-row__meta">{b.mode}</div>
                </div>
                <div className="battle-row__stats">
                  <div><span>{b.turns}</span> mov.</div>
                  <div><span>{formatDuration(b.durationSec)}</span></div>
                </div>
                <div className="battle-row__date">{b.date}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
