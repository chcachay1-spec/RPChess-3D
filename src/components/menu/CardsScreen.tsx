import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { CARDS, type CardType, type Rarity } from '../../data/cards';

// Tamaño fijo del mazo de batalla segun diseño de Cris:
// pool 30, deck de batalla 10, mano 2, roba 1 por turno.
const BATTLE_DECK_SIZE = 10;
const HAND_SIZE = 2;

type TypeFilter = 'all' | CardType;

const TYPE_FILTERS: { key: TypeFilter; label: string; emoji: string; color: string }[] = [
  { key: 'all',         label: 'Todo',       emoji: '✦', color: '#FFD700' },
  { key: 'BUFF',        label: 'Magia',      emoji: '⬆', color: '#3B82F6' },
  { key: 'TRAMPA',      label: 'Trampa',     emoji: '☠', color: '#EF4444' },
  { key: 'CONDICIONAL', label: 'Vínculo',    emoji: '⚡', color: '#A78BFA' },
];

const RARITY_COLOR: Record<Rarity, string> = {
  Comun:      '#9CA3AF',
  Rara:       '#3B82F6',
  Epica:      '#A78BFA',
  Legendaria: '#FFD700',
};

export default function CardsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  // Draft de 10 cartas seleccionadas para el mazo de batalla.
  // En el juego 2D, Cris elegía 10 a mano del pool de 30.
  const [battleDeck, setBattleDeck] = useState<string[]>([
    'c-b04', 'c-b02', 'c-x01', 'c-t02', 'c-t05', 'c-b05', 'c-b07', 'c-x02', 'c-t03', 'c-x05',
  ]);

  const filtered = useMemo(() => {
    return CARDS.filter((c) => typeFilter === 'all' || c.type === typeFilter);
  }, [typeFilter]);

  const toggleInDeck = (id: string) => {
    setBattleDeck((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 10) return prev; // cap a 10 (mazo de batalla)
      return [...prev, id];
    });
  };

  const clearDeck = () => setBattleDeck([]);
  const fillDefault = () => setBattleDeck(
    ['c-b01','c-b02','c-b03','c-b04','c-b05','c-b09','c-t02','c-t03','c-t05','c-x01']
  );

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">FORJA DE CARTAS</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">🃏</span>
            <span className="subscreen__star-count">{CARDS.length} cartas</span>
          </div>
        </div>

        <p className="cards__lead">
          Forja tu mazo de 30 cartas. Energia inicial 2, +2 por turno, maximo 6. Solo 1 carta por turno.
        </p>

        {/* Type filter tabs */}
        <div className="cards__type-tabs">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`cards__type-tab ${typeFilter === t.key ? 'is-active' : ''}`}
              style={{ ['--type-color' as any]: t.color }}
              onClick={() => setTypeFilter(t.key)}
            >
              <span className="cards__type-emoji">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid de cartas */}
        <div className="cards__grid">
          {filtered.map((c) => {
            const inDeck = battleDeck.includes(c.id);
            const rarityColor = RARITY_COLOR[c.rarity];
            return (
              <article
                key={c.id}
                className={`card ${inDeck ? 'is-in-deck' : ''}`}
                style={{
                  ['--card-type' as any]: c.previewColor,
                  ['--card-rarity' as any]: rarityColor,
                }}
              >
                <div className="card__preview" style={{ background: c.previewColor + '22' }}>
                  <span className="card__emoji">{c.emoji}</span>
                  <span className="card__cost">{c.cost}</span>
                  <span className="card__type-pill">{c.type}</span>
                </div>
                <div className="card__body">
                  <h3 className="card__name">{c.name}</h3>
                  <div className="card__rarity" style={{ color: rarityColor }}>◆ {c.rarity}</div>
                  <p className="card__effect">{c.effect}</p>
                  <button
                    type="button"
                    className={`card__cta ${inDeck ? 'is-in' : ''}`}
                    onClick={() => toggleInDeck(c.id)}
                    disabled={!inDeck && battleDeck.length >= BATTLE_DECK_SIZE}
                  >
                    {inDeck ? '✕ Quitar' : '+ Agregar al mazo'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Sticky deck bar */}
        <div className="deck-bar">
          <div className="deck-bar__info">
            <span className="deck-bar__label">Tu Mazo</span>
            <span className="deck-bar__count" style={{ color: battleDeck.length === 10 ? '#22C55E' : '#FFD700' }}>
              {battleDeck.length} / {BATTLE_DECK_SIZE}
            </span>
            <span className="deck-bar__hint">
              {battleDeck.length === BATTLE_DECK_SIZE
                ? '✓ mazo listo para jugar'
                : `Elegi 10 cartas del pool. Faltan ${BATTLE_DECK_SIZE - battleDeck.length}`}
            </span>
          </div>
          <div className="deck-bar__actions">
            <button type="button" className="deck-bar__btn" onClick={clearDeck}>Vaciar</button>
            <button type="button" className="deck-bar__btn deck-bar__btn--alt" onClick={fillDefault}>Llenar demo</button>
            <button
              type="button"
              className="deck-bar__btn deck-bar__btn--primary"
              disabled={battleDeck.length === 0}
            >
              💾 Guardar Mazo de Batalla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
