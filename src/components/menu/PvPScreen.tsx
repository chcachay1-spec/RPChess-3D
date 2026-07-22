import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/game-store';

type QueueState = 'idle' | 'searching' | 'found';

const GAME_MODES = [
  { id: 'ranked',   name: 'Ranked 1v1',    desc: 'Sube tu rating. Matchmaking por MMR.', emoji: '♛', color: '#A78BFA', players: '2/2' },
  { id: 'casual',   name: 'Casual 1v1',    desc: 'Sin rating. Matchmaking rapido.',      emoji: '☕', color: '#22C55E', players: '0/2' },
  { id: 'tournament',name: 'Torneo Diario', desc: 'Bracket eliminatorio. 8 jugadores.',  emoji: '♘', color: '#FFD700', players: '5/8' },
];

const FAKE_OPPONENTS = [
  { name: 'Sir_Gawain92',  rating: 1520, tier: 4 },
  { name: 'ShadowKnight',  rating: 1890, tier: 5 },
  { name: 'Aldric_Forever', rating: 1450, tier: 4 },
  { name: 'LyraTx',        rating: 1670, tier: 5 },
  { name: 'Bruja_Bosque',  rating: 1390, tier: 3 },
];

export default function PvPScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [mode, setMode] = useState<string>('ranked');
  const [queue, setQueue] = useState<QueueState>('idle');
  const [searchSec, setSearchSec] = useState(0);
  const [opponentIdx, setOpponentIdx] = useState(0);

  useEffect(() => {
    if (queue !== 'searching') return;
    const t = setInterval(() => setSearchSec((s) => s + 1), 1000);
    const foundAt = setTimeout(() => {
      setQueue('found');
      setOpponentIdx(Math.floor(Math.random() * FAKE_OPPONENTS.length));
    }, 3500);
    return () => { clearInterval(t); clearTimeout(foundAt); };
  }, [queue]);

  const startSearch = () => { setQueue('searching'); setSearchSec(0); };
  const cancel      = () => { setQueue('idle'); setSearchSec(0); };

  const accept = () => setScreen('mode-select');
  const decline = () => { setQueue('searching'); setSearchSec(0); };

  const selectedMode = GAME_MODES.find((m) => m.id === mode)!;
  const opp = FAKE_OPPONENTS[opponentIdx];

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--blue">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">MODO PvP</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">⚔</span>
            <span className="subscreen__star-count">Tu rating: 1485</span>
          </div>
        </div>

        <p className="pvp__lead">
          Enfrentate a otros jugadores online. Subi tu rating en Ranked o jugá casuales sin perder puntos.
        </p>

        {/* Game modes */}
        <div className="pvp__modes">
          {GAME_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`pvp-mode ${mode === m.id ? 'is-active' : ''}`}
              onClick={() => { setMode(m.id); setQueue('idle'); }}
              style={{ ['--pvp-color' as any]: m.color }}
            >
              <div className="pvp-mode__icon">{m.emoji}</div>
              <div className="pvp-mode__body">
                <div className="pvp-mode__name">{m.name}</div>
                <div className="pvp-mode__desc">{m.desc}</div>
              </div>
              <div className="pvp-mode__count">
                <div className="pvp-mode__count-num">{m.players}</div>
                <div className="pvp-mode__count-label">jugadores</div>
              </div>
            </button>
          ))}
        </div>

        {/* Queue / matchmaking section */}
        <section className="pvp__queue">
          {queue === 'idle' && (
            <div className="pvp__queue-idle">
              <div className="pvp__queue-icon">⌛</div>
              <h3 className="pvp__queue-title">Listo para buscar partida</h3>
              <p className="pvp__queue-desc">{selectedMode.name} · Matchmaking automatico. Decime cuando estes listo.</p>
              <button type="button" className="menu__btn menu__btn--blue menu__btn--big menu__btn--auth" onClick={startSearch}>
                ▶ Buscar Partida
              </button>
            </div>
          )}

          {queue === 'searching' && (
            <div className="pvp__queue-searching">
              <div className="pvp__spinner">⌛</div>
              <h3 className="pvp__queue-title">Buscando oponente...</h3>
              <p className="pvp__queue-desc">Tiempo de espera: {Math.floor(searchSec / 60)}:{(searchSec % 60).toString().padStart(2, '0')}</p>
              <div className="pvp__queue-skill">Tu rating 1485 \u00b7 Buscando entre 1300-1700</div>
              <button type="button" className="menu__btn menu__btn--red menu__btn--auth" onClick={cancel}>
                ✕ Cancelar
              </button>
            </div>
          )}

          {queue === 'found' && (
            <div className="pvp__queue-found">
              <div className="pvp__found-banner">⚔ PARTIDA ENCONTRADA</div>
              <div className="pvp__found-card">
                <div className="pvp__found-avatar">{opp.name[0]}</div>
                <div className="pvp__found-info">
                  <div className="pvp__found-name gold-glow">{opp.name}</div>
                  <div className="pvp__found-rating">Rating <strong>{opp.rating}</strong> \u00b7 Tier {opp.tier}</div>
                </div>
                <div className="pvp__found-vs">vs</div>
                <div className="pvp__found-info pvp__found-info--you">
                  <div className="pvp__found-name gold-glow">cris</div>
                  <div className="pvp__found-rating">Rating <strong>1485</strong> \u00b7 Tier 4</div>
                </div>
                <div className="pvp__found-avatar pvp__found-avatar--you">C</div>
              </div>
              <div className="pvp__found-actions">
                <button type="button" className="menu__btn menu__btn--red menu__btn--auth" onClick={decline}>
                  ↩ Declinar
                </button>
                <button type="button" className="menu__btn menu__btn--blue menu__btn--auth" onClick={accept}>
                  ⚔ Aceptar y Jugar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Roadmap note */}
        <div className="pvp__roadmap">
          <div className="pvp__roadmap-icon">🚧</div>
          <div>
            <h4 className="pvp__roadmap-title">Próximamente en v2</h4>
            <p className="pvp__roadmap-text">
              Por ahora esta pantalla es un mockup \u2014 el matchmaking real llega cuando integremos Supabase y realtime.
              Mientras tanto podés probar todos los modos de victoria contra la IA en PvE.
            </p>
            <button type="button" className="menu__btn menu__btn--gold menu__btn--auth" onClick={() => setScreen('pve')}>
              \u2192 Ir al modo PvE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
