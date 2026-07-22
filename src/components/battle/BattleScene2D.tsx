import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { HEROES } from '../../data/heroes';
import { CARDS, type CardType } from '../../data/cards';

interface SceneState {
  attackerId: string;       // pieza aliada que ejecuta el ataque
  targetId: string;         // pieza enemiga que recibe
  cardId: string | null;    // carta que activa la animacion (null = ataque base)
  damageDealt: number;      // damage final
  isCrit: boolean;
}

const HERO_MAP = new Map(HEROES.map((h) => [h.name, h]));
const CARD_MAP = new Map(CARDS.map((c) => [c.id, c]));

const TYPE_BG: Record<CardType, string> = {
  BUFF: 'rgba(59, 130, 246, 0.18)',
  TRAMPA: 'rgba(239, 68, 68, 0.18)',
  CONDICIONAL: 'rgba(167, 139, 250, 0.18)',
};
const TYPE_COLOR: Record<CardType, string> = {
  BUFF: '#3B82F6',
  TRAMPA: '#EF4444',
  CONDICIONAL: '#A78BFA',
};

const PHASE_DURATIONS = {
  INTRO:   220,
  ATTACK:  340,
  IMPACT:  180,
  DAMAGE:  280,
  RETREAT: 200,
  DEATH:   380,
} as const;

/**
 * Ventana modal 2D estilo Pokemon rojo fuego.
 * Se dispara cuando hay un ataque con carta o un critico.
 * Total de la animacion: ~1.6s + cualquier retention del jugador antes de cerrar.
 */
export default function BattleScene2D() {
  const scene = useGameStore((s) => s.scene2D);
  const dismissScene = useGameStore((s) => s.dismissBattleScene);
  // Para forzar un re-mount del timer interno cuando cambia el scene
  if (!scene) return null;
  return <BattleSceneInner key={scene.attackerId + scene.targetId + scene.damageDealt} scene={scene} onClose={dismissScene} />;
}

interface BattleSceneInnerProps {
  scene: SceneState;
  onClose: () => void;
}

type Phase = keyof typeof PHASE_DURATIONS;

function BattleSceneInner({ scene, onClose }: BattleSceneInnerProps) {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [hpShown, setHpShown] = useState<number>(0);
  const pieces = useGameStore((s) => s.pieces);

  const attacker = pieces.find((p) => p.id === scene.attackerId);
  const target   = pieces.find((p) => p.id === scene.targetId);
  const heroInfo = attacker ? HERO_MAP.get(attacker.role) : null;
  const targetInfo = target ? HERO_MAP.get(target.role) : null;
  const cardInfo = scene.cardId ? CARD_MAP.get(scene.cardId) : null;
  const cardColor = cardInfo ? TYPE_COLOR[cardInfo.type] : '#FFD700';
  const cardBg = cardInfo ? TYPE_BG[cardInfo.type] : 'rgba(255, 215, 0, 0.15)';

  // Timeline runner — una vez por escena (key fuerza re-mount al cambiar)
  useEffect(() => {
    let isCancelled = false;
    const runTimeline = async () => {
      await sleep(PHASE_DURATIONS.INTRO);   if (isCancelled) return;
      setPhase('ATTACK');
      await sleep(PHASE_DURATIONS.ATTACK);  if (isCancelled) return;
      setPhase('IMPACT');
      await sleep(PHASE_DURATIONS.IMPACT);  if (isCancelled) return;
      setPhase('DAMAGE');
      // Animamos el numero subiendo en pasos
      const target_damage = scene.damageDealt;
      const steps = 6;
      for (let i = 1; i <= steps; i++) {
        if (isCancelled) return;
        setHpShown(Math.round((target_damage * i) / steps));
        await sleep(PHASE_DURATIONS.DAMAGE / steps);
      }
      setPhase('RETREAT');
      await sleep(PHASE_DURATIONS.RETREAT); if (isCancelled) return;
      // Si la pieza objetivo murio, mostramos su animacion de muerte
      const t = useGameStore.getState().pieces.find((p) => p.id === scene.targetId);
      if (!t) {
        setPhase('DEATH');
        await sleep(PHASE_DURATIONS.DEATH);
        if (isCancelled) return;
      }
      onClose();
    };
    void runTimeline();
    return () => { isCancelled = true; };
  }, [scene, onClose]);

  return (
    <div className="bscene-overlay" role="dialog" aria-modal="true">
      <div className="bscene">
        {/* Cabecera: nombre de la escena + carta usada */}
        <div className="bscene__header">
          <div className="bscene__round">Ronda de combate</div>
          {cardInfo && (
            <div className="bscene__card" style={{ background: cardBg, borderColor: cardColor }}>
              <span className="bscene__card-emoji">{cardInfo.emoji}</span>
              <span className="bscene__card-cost" style={{ background: cardColor }}>{cardInfo.cost}</span>
              <span className="bscene__card-name" style={{ color: cardColor }}>{cardInfo.name}</span>
            </div>
          )}
        </div>

        {/* Stage: atacante izquierda vs objetivo derecha */}
        <div className="bscene__stage" data-phase={phase} data-hit={phase === 'IMPACT' || phase === 'DAMAGE' ? 'true' : 'false'}>
          {/* Flash blanco cuando IMPACT */}
          {(phase === 'IMPACT' || phase === 'DAMAGE') && (
            <div className="bscene__flash" />
          )}

          {/* Atacante */}
          <div className="bscene__side bscene__side--attacker">
            <div
              className={`bscene__sprite bscene__sprite--attacker is-${phase}`}
              style={{ background: (heroInfo?.color ?? '#FFD700') + '33', color: heroInfo?.color ?? '#FFD700' }}
            >
              <span className="bscene__sprite-emoji">{heroInfo?.emoji ?? '👑'}</span>
              <div className="bscene__hp">
                <div className="bscene__hp-bar"><div className="bscene__hp-fill" /></div>
                <span className="bscene__hp-text">HP {attacker?.hp ?? '?'}</span>
              </div>
              <div className="bscene__name">{heroInfo?.name ?? 'Atacante'}</div>
            </div>
          </div>

          <div className="bscene__vs">VS</div>

          {/* Objetivo */}
          <div className="bscene__side bscene__side--target">
            <div
              className={`bscene__sprite bscene__sprite--target is-${phase} ${phase === 'DEATH' ? 'is-dying' : ''}`}
              style={{ background: (targetInfo?.color ?? '#EF4444') + '33', color: targetInfo?.color ?? '#EF4444' }}
            >
              <span className="bscene__sprite-emoji">{targetInfo?.emoji ?? '💀'}</span>
              <div className="bscene__hp">
                <div className="bscene__hp-bar"><div className="bscene__hp-fill" /></div>
                <span className="bscene__hp-text">HP {target?.hp ?? '?'}</span>
              </div>
              <div className="bscene__name">{targetInfo?.name ?? 'Objetivo'}</div>
            </div>
            {/* Damage number flotante */}
            {(phase === 'DAMAGE' || phase === 'RETREAT' || phase === 'DEATH') && scene.damageDealt > 0 && (
              <div className="bscene__damage" style={{ color: cardColor }}>
                {scene.isCrit ? '💥' : '-'} {hpShown || scene.damageDealt}
              </div>
            )}
          </div>
        </div>

        {/* Footer: resultado + skip */}
        <div className="bscene__footer">
          <div className="bscene__result">
            {phase === 'INTRO'  && 'Preparando...'}
            {phase === 'ATTACK' && `${heroInfo?.name ?? 'Atacante'} avanza...`}
            {phase === 'IMPACT' && '💥 ¡IMPACTO!'}
            {phase === 'DAMAGE' && `${scene.damageDealt} de dano ${scene.isCrit ? ' critico' : ''}.`}
            {phase === 'RETREAT' && 'ਛuen golpe!'}
            {phase === 'DEATH' && 'La pieza cae.'}
          </div>
          <button
            type="button"
            className="menu__btn menu__btn--gold menu__btn--auth"
            onClick={onClose}
          >
            OK ›
          </button>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
