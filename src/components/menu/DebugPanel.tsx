import { useState } from 'react';
import { useGameStore } from '../../store/game-store';
import type { Screen } from '../../store/game-store';

const SCREENS: { id: Screen; label: string; icon: string }[] = [
  { id: 'menu', label: 'Main Menu', icon: '🏠' },
  { id: 'tactics', label: 'Kingdom Tactics', icon: '♞' },
  { id: 'campaign', label: 'Adventure', icon: '🗺️' },
  { id: 'pve', label: 'PvE', icon: '🛡️' },
  { id: 'pvp', label: 'PvP', icon: '⚔️' },
  { id: 'bestiary', label: 'Bestiary', icon: '📜' },
  { id: 'cards', label: 'Cards', icon: '🃏' },
  { id: 'store', label: 'Store', icon: '🛒' },
  { id: 'collection', label: 'Collection', icon: '📚' },
  { id: 'draft', label: 'Draft', icon: '🎲' },
  { id: 'profile', label: 'User Info', icon: '👤' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'config', label: 'Config', icon: '⚙️' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'pase', label: 'Pase', icon: '🏆' },
];

export default function DebugPanel() {
  const [open, setOpen] = useState(true);
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const turn = useGameStore((s) => s.turn);
  const pieces = useGameStore((s) => s.pieces);
  const init = useGameStore((s) => s.init);

  return (
    <div className="debug-panel">
      <button
        className="debug-panel__toggle"
        onClick={() => setOpen((o) => !o)}
        title="Toggle debug panel"
      >
        🛠️
      </button>

      {open && (
        <div className="debug-panel__body">
          <div className="debug-panel__title">🛠️ DEBUG PANEL</div>
          <div className="debug-panel__info">
            <div>Current: <strong>{screen}</strong></div>
            <div>Turn: {turn}</div>
            <div>Pieces: {pieces.length}</div>
          </div>

          <div className="debug-panel__section">NAVEGAR A:</div>
          <div className="debug-panel__grid">
            {SCREENS.map((s) => (
              <button
                key={s.id}
                className={`debug-panel__btn ${screen === s.id ? 'is-active' : ''}`}
                onClick={() => setScreen(s.id)}
              >
                <span className="debug-panel__btn-icon">{s.icon}</span>
                <span className="debug-panel__btn-label">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="debug-panel__section">ACCIONES:</div>
          <div className="debug-panel__row">
            <button
              className="debug-panel__btn debug-panel__btn--action"
              onClick={() => init()}
              title="Reinicia las piezas y relieves"
            >
              🔄 Reset Piezas
            </button>
            <button
              className="debug-panel__btn debug-panel__btn--action"
              onClick={() => setScreen('menu')}
              title="Volver al menú"
            >
              🏠 Menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
