import { useGameStore } from '../../store/game-store';
import { SHUFFLE_INTERVAL } from '../../constants';
import BattleResultModal from '../menu/BattleResultModal';
import BattleScene2D from '../battle/BattleScene2D';
import BattleHand from '../battle/BattleHand';
import PieceInfoPanel from './PieceInfoPanel';

export default function GameHUD() {
  const turn = useGameStore((s) => s.turn);
  const endTurn = useGameStore((s) => s.endTurn);
  const message = useGameStore((s) => s.message);
  const pieces = useGameStore((s) => s.pieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const setScreen = useGameStore((s) => s.setScreen);
  const battleResult = useGameStore((s) => s.battleResult);
  const dismissBattleResult = useGameStore((s) => s.dismissBattleResult);
  const testVictory = () => useGameStore.setState({ battleResult: 'VICTORIA' });
  const testDefeat  = () => useGameStore.setState({ battleResult: 'DERROTA' });
  const testScene2D = () => {
    const a = useGameStore.getState().pieces.find((p) => p.team === 'ally');
    const e = useGameStore.getState().pieces.find((p) => p.team === 'enemy');
    if (a && e) {
      useGameStore.getState().triggerBattleScene({
        attackerId: a.id, targetId: e.id, cardId: 'c-b04', damageDealt: 3, isCrit: false,
      });
    }
  };
  const deselect = () => useGameStore.getState().selectPiece(null);

  const allyCount = pieces.filter((p) => p.team === 'ally').length;
  const enemyCount = pieces.filter((p) => p.team === 'enemy').length;
  const turnsToShuffle = SHUFFLE_INTERVAL - ((turn - 1) % SHUFFLE_INTERVAL);
  const isShuffleNext = turnsToShuffle === 1;

  return (
    <div className="hud">
      {battleResult && (
        <BattleResultModal
          result={battleResult}
          turnsPlayed={turn}
          kills={Math.max(0, 6 - pieces.filter((p) => p.team === 'enemy').length)}
          troopsLost={Math.max(0, 6 - pieces.filter((p) => p.team === 'ally').length)}
          xpEarned={battleResult === 'VICTORIA' ? 150 : 30}
          goldEarned={battleResult === 'VICTORIA' ? 100 : 20}
          onDismiss={dismissBattleResult}
        />
      )}
      <BattleScene2D />

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
        {/*
         * Botones de demo para verificar el modal de fin de batalla
         * sin tener que jugar hasta el final.
         */}
        {!battleResult && (
          <div className="hud__demo">
            <button className="hud__btn hud__btn--ghost" onClick={testVictory}>Test Victoria</button>
            <button className="hud__btn hud__btn--ghost" onClick={testDefeat}>Test Derrota</button>
            <button className="hud__btn hud__btn--ghost" onClick={testScene2D}>Test Escena 2D</button>
          </div>
        )}
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

      {/* Mano de cartas: scroleable, 2 cartas visibles, ya con energy counter */}
      <BattleHand />

      {/* Panel lateral con info de pieza seleccionada */}
      <PieceInfoPanel />
    </div>
  );
}
