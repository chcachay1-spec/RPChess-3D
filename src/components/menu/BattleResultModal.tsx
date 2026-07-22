import { useGameStore } from '../../store/game-store';

/**
 * Modal de fin de batalla.
 * Se dispara cuando el Rey aliado o enemigo es eliminado.
 * Muestra resumen + XP ganado + botones: Volver al menu o Jugar de nuevo.
 */
export type Result = 'VICTORIA' | 'DERROTA' | 'EMPATE';

interface BattleResultProps {
  result: Result;
  turnsPlayed: number;
  kills: number;
  troopsLost: number;
  xpEarned: number;
  goldEarned: number;
  onDismiss?: () => void;
}

const RESULT_THEME: Record<Result, { color: string; label: string; emoji: string }> = {
  VICTORIA: { color: '#22C55E', label: 'VICTORIA', emoji: '🏆' },
  DERROTA:  { color: '#EF4444', label: 'DERROTA',  emoji: '💀' },
  EMPATE: { color: '#A78BFA', label: 'EMPATE',  emoji: '⚖️' },
};

export default function BattleResultModal({
  result, turnsPlayed, kills, troopsLost, xpEarned, goldEarned,
}: BattleResultProps) {
  const setScreen = useGameStore((s) => s.setScreen);
  const theme = RESULT_THEME[result];

  return (
    <div className="result-overlay" role="dialog" aria-modal="true">
      <div className="result-modal" style={{ borderColor: theme.color }}>
        <div className="result-modal__top" style={{ background: theme.color + '22' }}>
          <div className="result-modal__emoji">{theme.emoji}</div>
          <h2 className="result-modal__title" style={{ color: theme.color, textShadow: `0 0 14px ${theme.color}80` }}>
            {theme.label}
          </h2>
          <p className="result-modal__subtitle">
            {result === 'VICTORIA' && 'Tu estrategia llevo al Rey enemigo a la derrota.'}
            {result === 'DERROTA'  && 'Tu Rey fue capturado. Revisa la siguiente partida.'}
            {result === 'EMPATE' && 'Ambos ejercitos se han retirado.'}
          </p>
        </div>

        <div className="result-modal__stats">
          <div className="result-modal__stat">
            <div className="result-modal__stat-value">{turnsPlayed}</div>
            <div className="result-modal__stat-label">Turnos jugados</div>
          </div>
          <div className="result-modal__stat">
            <div className="result-modal__stat-value" style={{ color: theme.color }}>{kills}</div>
            <div className="result-modal__stat-label">Enemigos eliminados</div>
          </div>
          <div className="result-modal__stat">
            <div className="result-modal__stat-value" style={{ color: '#EF4444' }}>{troopsLost}</div>
            <div className="result-modal__stat-label">Piezas perdidas</div>
          </div>
        </div>

        <div className="result-modal__rewards">
          <h4 className="result-modal__rewards-title">Recompensas</h4>
          <div className="result-modal__rewards-grid">
            <div className="result-modal__reward">
              <span className="result-modal__reward-icon">✦</span>
              <span className="result-modal__reward-qty">+{xpEarned}</span>
              <span className="result-modal__reward-name">XP</span>
            </div>
            <div className="result-modal__reward">
              <span className="result-modal__reward-icon" style={{ color: '#FFD700' }}>◆</span>
              <span className="result-modal__reward-qty">+{goldEarned}</span>
              <span className="result-modal__reward-name">Oro</span>
            </div>
            {result === 'VICTORIA' && (
              <div className="result-modal__reward">
                <span className="result-modal__reward-icon" style={{ color: '#A78BFA' }}>◆</span>
                <span className="result-modal__reward-qty">+5</span>
                <span className="result-modal__reward-name">Gemas</span>
              </div>
            )}
          </div>
        </div>

        <div className="result-modal__actions">
          <button
            type="button"
            className="menu__btn menu__btn--gold menu__btn--big menu__btn--full"
            onClick={() => setScreen('menu')}
          >
            <span className="menu__btn-label">Volver al Menu</span>
          </button>
          <button
            type="button"
            className="menu__btn menu__btn--blue menu__btn--big menu__btn--full"
            onClick={() => setScreen('mode-select')}
          >
            <span className="menu__btn-icon">▶</span>
            <span className="menu__btn-label">Jugar otra vez</span>
          </button>
        </div>
      </div>
    </div>
  );
}
