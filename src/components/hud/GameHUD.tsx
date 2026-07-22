import { useGameStore } from '../../store/game-store';
import { SHUFFLE_INTERVAL } from '../../constants';

export default function GameHUD() {
  const turn = useGameStore((s) => s.turn);
  const endTurn = useGameStore((s) => s.endTurn);
  const message = useGameStore((s) => s.message);
  const pieces = useGameStore((s) => s.pieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const setScreen = useGameStore((s) => s.setScreen);
  const deselect = () => useGameStore.getState().selectPiece(null);

  const allyCount = pieces.filter((p) => p.team === 'ally').length;
  const enemyCount = pieces.filter((p) => p.team === 'enemy').length;
  const turnsToShuffle = SHUFFLE_INTERVAL - ((turn - 1) % SHUFFLE_INTERVAL);
  const isShuffleNext = turnsToShuffle === 1;

  return (
    <div className="hud">
      {/* Top bar */}
      <div className="hud__top">
        <div className="hud__brand">
          <span className="hud__logo">♛</span>
          <span>RPChess 3D</span>
        </div>
        <div className="hud__turn">
          <span className="hud__label">TURNO</span>
          <span className="hud__value">{turn}</span>
        </div>
        <div className={`hud__shuffle ${isShuffleNext ? 'hud__shuffle--warn' : ''}`}>
          <span className="hud__label">SHUFFLE EN</span>
          <span className="hud__value">{turnsToShuffle}</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hud__bottom">
        <div className="hud__message">{message ?? '—'}</div>
        <div className="hud__actions">
          {selectedPieceId && (
            <button className="hud__btn hud__btn--ghost" onClick={deselect}>
              ✕ Deseleccionar
            </button>
          )}
          <button className="hud__btn hud__btn--menu" onClick={() => setScreen('menu')}>
            ☰ Menú
          </button>
          <button className="hud__btn hud__btn--primary" onClick={endTurn}>
            Pasar turno →
          </button>
        </div>
      </div>

      {/* Right side: piece counts */}
      <div className="hud__side">
        <div className="hud__count hud__count--ally">
          <span className="hud__dot" /> Aliados: <strong>{allyCount}</strong>
        </div>
        <div className="hud__count hud__count--enemy">
          <span className="hud__dot" /> Enemigos: <strong>{enemyCount}</strong>
        </div>
        <div className="hud__legend">
          <div className="hud__legend-title">Regla de ataque</div>
          <div className="hud__legend-row">
            <span className="hud__chip" style={{ background: '#DC2626' }} />Alto → ataca alto y medio
          </div>
          <div className="hud__legend-row">
            <span className="hud__chip" style={{ background: '#16A34A' }} />Medio → ataca medio y bajo
          </div>
          <div className="hud__legend-row">
            <span className="hud__chip" style={{ background: '#2563EB' }} />Bajo → solo ataca bajo
          </div>
        </div>
      </div>
    </div>
  );
}
