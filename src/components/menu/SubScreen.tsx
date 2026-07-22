import { useGameStore } from '../../store/game-store';
import type { Screen } from '../../store/game-store';
import { HEROES, REGION_INFO } from '../../data/heroes';

interface SubScreenProps {
  screen: Screen;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'gold' | 'red' | 'blue';
}

const SCREEN_INFO: Record<Screen, { title: string; subtitle: string; variant: 'gold' | 'red' | 'blue' }> = {
  menu: { title: '', subtitle: '', variant: 'gold' },
  splash: { title: 'Cargando', subtitle: 'Iniciando el reino...', variant: 'blue' },
  campaign: { title: 'Adventure', subtitle: 'Campana narrativa por regiones - 4 regiones - 5 nodos cada una', variant: 'gold' },
  tactics: { title: '', subtitle: '', variant: 'blue' },
  'mode-select': { title: 'Mode Select', subtitle: 'Choose your victory mode', variant: 'blue' },
  pve: { title: 'PvE Mode', subtitle: 'Regicidio contra la IA - Dificultad 1-3', variant: 'red' },
  pvp: { title: 'PvP Online', subtitle: 'Matchmaking contra otros jugadores', variant: 'blue' },
  bestiary: { title: 'Bestiary', subtitle: 'Las 12 piezas del reino', variant: 'gold' },
  cards: { title: 'Card Forge', subtitle: 'Build your 30-card deck', variant: 'gold' },
  store: { title: 'Store', subtitle: 'Cosmetics, packs and premium currency', variant: 'gold' },
  profile: { title: 'Profile', subtitle: 'Stats, recent battles and wallet', variant: 'gold' },
  news: { title: 'Latest News', subtitle: 'Patches, eventos y recomendaciones', variant: 'gold' },
  config: { title: 'Configuration', subtitle: 'Audio, IA, idioma y pantalla', variant: 'gold' },
  events: { title: 'Active Events', subtitle: 'Seasonal activities', variant: 'gold' },
  pase: { title: 'Season Pass', subtitle: 'Free and premium rewards', variant: 'gold' },
  collection: { title: 'Collection', subtitle: 'Heroes, tropas, sinergias y arquetipos', variant: 'gold' },
  draft: { title: 'Draft', subtitle: 'Veto and recruitment', variant: 'gold' },
};

export default function SubScreen({ screen, title, subtitle, children, variant }: SubScreenProps) {
  const setScreen = useGameStore((s) => s.setScreen);
  const info = SCREEN_INFO[screen];
  const v = variant ?? info.variant;
  const t = title ?? info.title;
  const s = subtitle ?? info.subtitle;

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className={`subscreen__header subscreen__header--${v}`}>
          <button className="subscreen__back" onClick={() => setScreen('menu')}>← Menú</button>
          <h1 className="subscreen__title gold-glow">{t}</h1>
          <p className="subscreen__subtitle">{s}</p>
        </div>
        <div className="subscreen__body">
          {children ?? <DefaultBody screen={screen} variant={v} />}
        </div>
      </div>
    </div>
  );
}

function DefaultBody({ screen, variant }: { screen: Screen; variant: 'gold' | 'red' | 'blue' }) {
  const setScreen = useGameStore((s) => s.setScreen);

  if (screen === 'tactics') return null;

  if (screen === 'pvp') {
    return (
      <div className="subscreen__placeholder">
        <div className="subscreen__big-icon">⚔️</div>
        <h2 className="gold-glow">Próximamente</h2>
        <p>El modo PvP online estará disponible en una actualización futura.</p>
        <p className="subscreen__hint">Mientras tanto, probá el modo Kingdom Tactics contra la IA.</p>
        <button className="menu__btn menu__btn--blue" onClick={() => setScreen('tactics')}>
          Ir a Kingdom Tactics
        </button>
      </div>
    );
  }

  if (screen === 'pve') {
    return (
      <div className="subscreen__placeholder">
        <h2 className="gold-glow">⚔️ Modo PvE</h2>
        <p>Regicidio por turnos contra la IA en el tablero hexagonal 3D.</p>
        <p className="subscreen__hint">La dificultad se endurece con cada victoria. HPs pequeñas, posicionamento &gt; estadísticas.</p>
        <div className="subscreen__difficulty">
          <button className="menu__btn menu__btn--gold" onClick={() => setScreen('tactics')}>
            🟢 Fácil · El IA juega al azar
          </button>
          <button className="menu__btn menu__btn--red" onClick={() => setScreen('tactics')}>
            🟡 Normal · IA heurística básica
          </button>
          <button className="menu__btn menu__btn--red" onClick={() => setScreen('tactics')}>
            🔴 Difícil · IA con minimax
          </button>
        </div>
        <p className="subscreen__hint" style={{ marginTop: 16 }}>
          💡 Para v1 todas las dificultades usan la misma IA heurística. La IA minimax viene en v2.
        </p>
      </div>
    );
  }

  if (screen === 'campaign') {
    return (
      <div className="subscreen__campaign">
        <h2 className="gold-glow">Mapa de campaña</h2>
        <p className="subscreen__lead">Recorré las 4 regiones del reino y enfrentá al Monarca Caído en la fortaleza final.</p>
        <div className="subscreen__regions">
          {REGION_INFO.map((region, idx) => (
            <div key={region.id} className={`subscreen__region subscreen__region--${variant} ${idx === 0 ? 'is-unlocked' : 'is-locked'}`}>
              <div className="subscreen__region-header">
                <div className="subscreen__region-icon">
                  {region.biome === 'llanura' && '🌾'}
                  {region.biome === 'bosque' && '🌲'}
                  {region.biome === 'altura' && '⛰️'}
                  {region.biome === 'fortaleza' && '🏰'}
                </div>
                <div>
                  <div className="subscreen__region-name gold-glow">{region.name}</div>
                  <div className="subscreen__region-sub">{region.subtitle}</div>
                </div>
                {idx > 0 && <div className="subscreen__lock">🔒</div>}
              </div>
              <p className="subscreen__region-desc">{region.description}</p>
              <div className="subscreen__region-difficulty">
                Dificultad: {'★'.repeat(region.difficulty)}{'☆'.repeat(4 - region.difficulty)}
              </div>
              <div className="subscreen__region-nodes">
                {region.nodes.map((n, ni) => (
                  <div key={n.id} className={`subscreen__node subscreen__node--${n.type}`}>
                    <span className="subscreen__node-num">{ni + 1}</span>
                    <span className="subscreen__node-icon">
                      {n.type === 'batalla' && '⚔️'}
                      {n.type === 'tesoro' && '💎'}
                      {n.type === 'jefe' && '👹'}
                    </span>
                    <span className="subscreen__node-name">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="subscreen__hint">Disponible en v2 — por ahora jugá Kingdom Tactics para probar el tablero 3D.</p>
        <button className="menu__btn menu__btn--gold" onClick={() => setScreen('tactics')}>
          Jugar Kingdom Tactics
        </button>
      </div>
    );
  }

  if (screen === 'bestiary') {
    return (
      <div className="subscreen__bestiary">
        <h2 className="gold-glow">Bestiario</h2>
        <p className="subscreen__lead">Las 12 piezas del reino. Conocé sus roles, lore y stats antes de llevarlas al campo.</p>
        <div className="subscreen__heroes">
          {HEROES.map((h) => (
            <div key={h.role + h.name} className="subscreen__hero" style={{ borderColor: h.color + '66' }}>
              <div className="subscreen__hero-top">
                <div className="subscreen__hero-portrait" style={{ background: h.color + '22', color: h.color }}>
                  {h.emoji}
                </div>
                <div className="subscreen__hero-tier">
                  {'★'.repeat(h.tier)}{'☆'.repeat(5 - h.tier)}
                </div>
              </div>
              <div className="subscreen__hero-name gold-glow">{h.name}</div>
              <div className="subscreen__hero-title">{h.title}</div>
              <div className="subscreen__hero-stats">
                <div><span>HP</span><strong>{h.hp}</strong></div>
                <div><span>Mov.</span><strong>{h.moveRange}</strong></div>
                <div><span>Atq.</span><strong>{h.attackRange}</strong></div>
              </div>
              <p className="subscreen__hero-lore">{h.lore}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'cards') {
    const cardTypes = [
      { name: 'BUFF', emoji: '⬆️', desc: 'Efectos positivos sobre tus piezas', count: 20, color: '#3B82F6' },
      { name: 'TRAMPA', emoji: '💣', desc: 'Efectos negativos sobre el rival', count: 20, color: '#EF4444' },
      { name: 'CONDICIONAL', emoji: '⚡', desc: 'Se activan al cumplirse una condición', count: 10, color: '#A78BFA' },
    ];
    return (
      <div className="subscreen__placeholder">
        <h2 className="gold-glow">🃏 Mazo de Cartas</h2>
        <p>50 cartas totales en 3 categorías. Energía inicial 2, +2 por turno, máximo 6.</p>
        <div className="subscreen__cards-types">
          {cardTypes.map((c) => (
            <div key={c.name} className="subscreen__card-type" style={{ borderColor: c.color }}>
              <div className="subscreen__card-type-icon" style={{ background: c.color + '22', color: c.color }}>
                {c.emoji}
              </div>
              <div className="subscreen__card-type-name" style={{ color: c.color }}>{c.name}</div>
              <div className="subscreen__card-type-count">{c.count} cartas</div>
              <p className="subscreen__card-type-desc">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="subscreen__hint">Cartas en mazo: 10 (3 en mano). Solo 1 carta por turno. Disponible en v2.</p>
      </div>
    );
  }

  if (screen === 'store') {
    return (
      <div className="subscreen__placeholder">
        <div className="subscreen__big-icon">🛒</div>
        <h2 className="gold-glow">Tienda</h2>
        <p>Cosméticos, packs y moneda premium. Disponible en v2.</p>
      </div>
    );
  }

  if (screen === 'pase') {
    return (
      <div className="subscreen__placeholder">
        <div className="subscreen__big-icon">🏆</div>
        <h2 className="gold-glow">Pase de Temporada</h2>
        <p>Recompensas gratuitas y premium. Disponible en v2.</p>
      </div>
    );
  }

  if (screen === 'profile') {
    return (
      <div className="subscreen__placeholder">
        <div className="subscreen__big-icon">👤</div>
        <h2 className="gold-glow">Perfil</h2>
        <p>Tu perfil, progresión y estadísticas. Disponible en v2.</p>
      </div>
    );
  }

  if (screen === 'collection') {
    return (
      <div className="subscreen__placeholder">
        <div className="subscreen__big-icon">📚</div>
        <h2 className="gold-glow">Colección</h2>
        <p>Tu colección de piezas y skins. Disponible en v2.</p>
      </div>
    );
  }

  return (
    <div className="subscreen__placeholder">
      <div className="subscreen__big-icon">🚧</div>
      <h2 className="gold-glow">En construcción</h2>
      <p>Esta pantalla forma parte de la versión 2 del juego.</p>
      <p className="subscreen__hint">Por ahora tenemos Kingdom Tactics, PvE contra IA y el bestiario básico.</p>
    </div>
  );
}
