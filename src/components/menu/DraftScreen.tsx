import { useState } from 'react';
import { useGameStore } from '../../store/game-store';
import {
  DRAFT_POOL, TIER_COLOR, FACTION_EMOJI,
  MAX_VETOES, MAX_HERO_PICKS, MAX_TROOP_PICKS,
  type DraftPiece,
} from '../../data/draft';

type DraftStep = 'veto' | 'recruit' | 'reveal';

/**
 * Draft / Reclutamiento - flujo de 3 pasos:
 * 1. Veto: el jugador quita 2 piezas del pool enemigo
 * 2. Reclutamiento: elige 6 piezas (heroes + tropas) en orden serpentina
 * 3. Revelacion: muestra el ejercito final y permite empezar batalla
 */
export default function DraftScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [step, setStep] = useState<DraftStep>('veto');
  const [vetoed, setVetoed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [draftOrder, setDraftOrder] = useState<number>(0); // pick sequence 0..7

  const visible = DRAFT_POOL.filter((p) => !vetoed.has(p.id));

  const toggleVeto = (id: string) => {
    setVetoed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_VETOES) next.add(id);
      return next;
    });
  };

  const togglePick = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setDraftOrder((o) => Math.max(0, o - 1));
      } else if (next.size < MAX_HERO_PICKS + MAX_TROOP_PICKS) {
        next.add(id);
        setDraftOrder((o) => o + 1);
      }
      return next;
    });
  };

  const proceedToRecruit = () => {
    setVetoed(new Set([...vetoed]));  // mantiene vetos
    setStep('recruit');
  };

  const proceedToReveal = () => {
    setStep('reveal');
  };

  const maxPick = MAX_HERO_PICKS + MAX_TROOP_PICKS;

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--blue">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">RECLUTAMIENTO</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">♞</span>
            <span className="subscreen__star-count">3 pasos</span>
          </div>
        </div>

        {/* Tabs de paso */}
        <div className="draft__steps">
          {(['veto', 'recruit', 'reveal'] as DraftStep[]).map((s, i) => {
            const isActive = step === s;
            const isPast = ['veto', 'recruit', 'reveal'].indexOf(step) > i;
            return (
              <button
                key={s}
                type="button"
                className={`draft__step ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                onClick={() => isPast && setStep(s)}
                disabled={!isPast && !isActive}
              >
                <span className="draft__step-num">0{i + 1}</span>
                <span className="draft__step-name">{STEP_NAMES[s]}</span>
              </button>
            );
          })}
        </div>

        {/* Veto step */}
        {step === 'veto' && (
          <VetoStep
            pieces={DRAFT_POOL}
            vetoed={vetoed}
            onToggle={toggleVeto}
            onNext={proceedToRecruit}
          />
        )}

        {/* Recruit step */}
        {step === 'recruit' && (
          <RecruitStep
            pieces={visible}
            selected={selected}
            onToggle={togglePick}
            maxPick={maxPick}
            order={draftOrder}
            onNext={proceedToReveal}
            onBack={() => setStep('veto')}
          />
        )}

        {/* Reveal step */}
        {step === 'reveal' && (
          <RevealStep
            pieces={visible.filter((p) => selected.has(p.id))}
            onConfirm={() => setScreen('tactics')}
            onEdit={() => setStep('recruit')}
          />
        )}
      </div>
    </div>
  );
}

const STEP_NAMES: Record<DraftStep, string> = {
  veto:    'Veto',
  recruit: 'Reclutamiento',
  reveal:  'Revelacion',
};

interface VetoStepProps {
  pieces: DraftPiece[];
  vetoed: Set<string>;
  onToggle: (id: string) => void;
  onNext: () => void;
}

function VetoStep({ pieces, vetoed, onToggle, onNext }: VetoStepProps) {
  return (
    <>
      <p className="draft__lead">
        Veta <strong>{MAX_VETOES}</strong> piezas del pool. Tu oponente tambien vetara {MAX_VETOES} mas.
        Mas alla del veto ambos veran la misma lista. Empeza eliminando las que menos te gusten.
      </p>
      <div className="draft__progress">
        <span className="draft__progress-label">Vetos usados</span>
        <div className="draft__progress-bar">
          {Array.from({ length: MAX_VETOES }, (_, i) => (
            <span key={i} className={`draft__progress-cell ${i < vetoed.size ? 'is-used' : ''}`} />
          ))}
        </div>
        <span className="draft__progress-text">{vetoed.size}/{MAX_VETOES}</span>
      </div>
      <div className="draft__grid">
        {pieces.map((p) => {
          const v = vetoed.has(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`draft-piece ${v ? 'is-vetoed' : ''}`}
              style={{ ['--piece-color' as any]: p.color }}
              onClick={() => onToggle(p.id)}
            >
              <div className="draft-piece__top">
                <span className="draft-piece__tier" style={{ background: TIER_COLOR[p.tier] }}>
                  {p.tier}-Tier
                </span>
                <span className="draft-piece__faction">{FACTION_EMOJI[p.faction]}</span>
              </div>
              <div className="draft-piece__portrait" style={{ background: p.color + '22' }}>
                <span className="draft-piece__emoji">{v ? '✕' : p.emoji}</span>
              </div>
              <div className="draft-piece__name">{p.name}</div>
              <div className="draft-piece__title">{p.title}</div>
              <div className="draft-piece__stats">
                <span><strong>{p.hp}</strong> HP</span>
                <span><strong>{p.move}</strong></span>
                <span><strong>{p.attack}</strong></span>
              </div>
              {v && <div className="draft-piece__veto-mark">VETADO</div>}
            </button>
          );
        })}
      </div>
      <div className="draft__footer">
        <button
          type="button"
          className="menu__btn menu__btn--blue menu__btn--big menu__btn--full"
          onClick={onNext}
          disabled={vetoed.size === 0}
        >
          SALTAR VETO →
        </button>
        <p className="draft__hint">{vetoed.size === 0 ? 'Podes saltar el veto y dejar todas las piezas.' : `Veter ${vetoed.size} de ${MAX_VETOES} maximo. Sigue.`}</p>
      </div>
    </>
  );
}

interface RecruitStepProps {
  pieces: DraftPiece[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  maxPick: number;
  order: number;
  onNext: () => void;
  onBack: () => void;
}

function RecruitStep({ pieces, selected, onToggle, maxPick, onNext }: RecruitStepProps) {
  const sorted = [...pieces].sort((a, b) => {
    if (selected.has(a.id) && !selected.has(b.id)) return -1;
    if (!selected.has(a.id) && selected.has(b.id)) return 1;
    return 0;
  });

  return (
    <>
      <p className="draft__lead">
        Elegi <strong>{MAX_HERO_PICKS}</strong> piezas fundamentales + <strong>{MAX_TROOP_PICKS}</strong> tropas.
        Pick en orden serpentina: arrastro 4, rival arrastro 4, arrastro 2 final. Vos elegis primero.
      </p>
      <div className="draft__progress">
        <span className="draft__progress-label">Reclutando</span>
        <div className="draft__progress-bar">
          {Array.from({ length: maxPick }, (_, i) => (
            <span key={i} className={`draft__progress-cell ${i < selected.size ? 'is-used' : ''}`} />
          ))}
        </div>
        <span className="draft__progress-text">{selected.size}/{maxPick}</span>
      </div>
      <div className="draft__grid">
        {sorted.map((p) => {
          const sel = selected.has(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className={`draft-piece ${sel ? 'is-selected' : ''}`}
              style={{ ['--piece-color' as any]: p.color }}
              onClick={() => onToggle(p.id)}
              disabled={!sel && selected.size >= maxPick}
            >
              <div className="draft-piece__top">
                <span className="draft-piece__tier" style={{ background: TIER_COLOR[p.tier] }}>
                  {p.tier}-Tier
                </span>
                <span className="draft-piece__faction">{FACTION_EMOJI[p.faction]}</span>
              </div>
              <div className="draft-piece__portrait" style={{ background: p.color + '22' }}>
                <span className="draft-piece__emoji">{p.emoji}</span>
              </div>
              <div className="draft-piece__name">{p.name}</div>
              <div className="draft-piece__title">{p.title}</div>
              <div className="draft-piece__stats">
                <span><strong>{p.hp}</strong> HP</span>
                <span><strong>{p.move}</strong></span>
                <span><strong>{p.attack}</strong></span>
              </div>
              {sel && <div className="draft-piece__pick-num">#{Array.from(selected).indexOf(p.id) + 1}</div>}
            </button>
          );
        })}
      </div>
      <div className="draft__footer">
        <button
          type="button"
          className="menu__btn menu__btn--blue menu__btn--big menu__btn--full"
          onClick={onNext}
          disabled={selected.size === 0}
        >
          REVELAR EJERCITO →
        </button>
        <p className="draft__hint">{selected.size === 0 ? 'Recluta al menos una pieza para avanzar.' : `Tienes ${selected.size} piezas listas para revisar.`}</p>
      </div>
    </>
  );
}

interface RevealStepProps {
  pieces: DraftPiece[];
  onConfirm: () => void;
  onEdit: () => void;
}

function RevealStep({ pieces, onConfirm, onEdit }: RevealStepProps) {
  const fundamentals = pieces.filter((p) => p.role !== 'pawn' && p.role !== 'bestia');
  const tropas = pieces.filter((p) => p.role === 'pawn');
  const bestias = pieces.filter((p) => p.role === 'bestia');

  return (
    <>
      <p className="draft__lead">Tu ejercito esta listo. La composicion:</p>
      <div className="draft__reveal-summary">
        <div className="draft__reveal-count"><strong>{fundamentals.length}</strong><span>fundamentales</span></div>
        <div className="draft__reveal-count"><strong>{tropas.length}</strong><span>tropas</span></div>
        <div className="draft__reveal-count"><strong>{bestias.length}</strong><span>bestias</span></div>
        <div className="draft__reveal-count draft__reveal-count--total"><strong>{pieces.length}</strong><span>total</span></div>
      </div>
      <div className="draft__grid">
        {pieces.map((p, i) => (
          <article
            key={p.id}
            className="draft-piece is-locked"
            style={{ ['--piece-color' as any]: p.color }}
          >
            <div className="draft-piece__top">
              <span className="draft-piece__tier" style={{ background: TIER_COLOR[p.tier] }}>
                {p.tier}-Tier
              </span>
              <span className="draft-piece__faction">{FACTION_EMOJI[p.faction]}</span>
            </div>
            <div className="draft-piece__portrait" style={{ background: p.color + '22' }}>
              <span className="draft-piece__emoji">{p.emoji}</span>
            </div>
            <div className="draft-piece__name">{p.name}</div>
            <div className="draft-piece__title">{p.title}</div>
            <div className="draft-piece__pick-num">#{i + 1}</div>
          </article>
        ))}
      </div>
      <div className="draft__footer draft__footer--actions">
        <button type="button" className="menu__btn menu__btn--gold menu__btn--auth" onClick={onEdit}>
          ← Editar Seleccion
        </button>
        <button type="button" className="menu__btn menu__btn--blue menu__btn--big menu__btn--auth" onClick={onConfirm}>
          ▶ Iniciar Batalla
        </button>
      </div>
    </>
  );
}
