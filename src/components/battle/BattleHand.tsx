import { useGameStore } from '../../store/game-store';
import { CARDS, type CardType } from '../../data/cards';

/**
 * Mano de cartas de batalla — version inicial.
 *
 * Modelo de Cris:
 * - Pool 30 cartas (BUFF/TRAMPA/CONDICIONAL, 10 c/u)
 * - Batalla deck: 10 elegidas por el jugador (placeholder: hardcoded los primeros 10)
 * - Mano: 2 cartas iniciales, cada turno roba 1 (descarta la mas vieja)
 * - Retencion: podes retener 1 pagando 1 de "retention energy" (placeholder)
 * - Energia: +1/turno, max 6 (incrementa y se visualiza en HUD top-left)
 *
 * Estado temporal en demo: hand inicial = ['c-b04', 'c-t02'].
 */

const TYPE_COLOR: Record<CardType, string> = {
  BUFF: '#3B82F6',
  TRAMPA: '#EF4444',
  CONDICIONAL: '#A78BFA',
};

export default function BattleHand() {
  const hand     = useGameStore((s) => s.hand);
  const energy   = useGameStore((s) => s.energy);
  const playCard = useGameStore((s) => s.playCard);

  return (
    <div className="bhand">
      <div className="bhand__left">
        <div className="bhand__energy">
          <span className="bhand__energy-icon">⚡</span>
          <span className="bhand__energy-value">{energy}</span>
          <span className="bhand__energy-max">/6</span>
        </div>
        <div className="bhand__retention">
          <span className="bhand__retention-label">Retencion</span>
          <div className="bhand__retention-pips">
            <span className="bhand__retention-pip" />
          </div>
        </div>
      </div>

      <div className="bhand__cards">
        {hand.length === 0 ? (
          <div className="bhand__empty">Sin cartas en mano. Pasa el turno para robar.</div>
        ) : (
          hand.map((cardId, i) => {
            const c = CARDS.find((x) => x.id === cardId);
            if (!c) return null;
            const playable = energy >= c.cost;
            return (
              <button
                key={`${cardId}-${i}`}
                type="button"
                className={`bhand__card ${playable ? 'is-playable' : 'is-disabled'}`}
                style={{ borderLeftColor: TYPE_COLOR[c.type] }}
                onClick={() => playable ? playCard(cardId) : undefined}
                disabled={!playable}
              >
                <div className="bhand__card-cost" style={{ background: TYPE_COLOR[c.type] }}>
                  {c.cost}
                </div>
                <div className="bhand__card-emoji">{c.emoji}</div>
                <div className="bhand__card-name">{c.name}</div>
                <div className="bhand__card-type" style={{ color: TYPE_COLOR[c.type] }}>{c.type}</div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
