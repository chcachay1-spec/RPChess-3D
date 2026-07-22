import { useState } from 'react';
import { useGameStore } from '../../store/game-store';

type Difficulty = 'facil' | 'normal' | 'dificil';

interface DifficultyConfig {
  key: Difficulty;
  emoji: string;
  label: string;
  badge: string;
  color: string;
  enemyTroops: number;
  aiKind: 'Random' | 'Heur\u00edstica b\u00e1sica' | 'Heur\u00edstica 2-turnos';
  description: string;
  rewards: string[];
  recommended?: boolean;
}

const DIFFICULTIES: DifficultyConfig[] = [
  {
    key: 'facil',
    emoji: '\ud83c\udf3c',
    label: 'F\u00e1cil',
    badge: 'PRINCIPIANTE',
    color: '#22C55E',
    enemyTroops: 0,
    aiKind: 'Random',
    description: 'La IA juega al azar. Ideal para aprender las reglas y probar combinaciones de piezas sin presi\u00f3n.',
    rewards: ['+50 XP', '\u00d71 Oro de recompensa'],
  },
  {
    key: 'normal',
    emoji: '\ud83c\udf1f',
    label: 'Normal',
    badge: 'EQUILIBRADO',
    color: '#FFD700',
    enemyTroops: 2,
    aiKind: 'Heur\u00edstica b\u00e1sica',
    description: 'El enemigo mueve con una tropa mediana. Buen desaf\u00edo para una partida media sin perder.',
    rewards: ['+150 XP', '+2 Oro'],
    recommended: true,
  },
  {
    key: 'dificil',
    emoji: '\ud83d\udd25',
    label: 'Dif\u00edcil',
    badge: 'VETERANO',
    color: '#EF4444',
    enemyTroops: 4,
    aiKind: 'Heur\u00edstica 2-turnos',
    description: 'La IA eval\u00faa dos turnos adelante. Combina tropas y cartas; cada movimiento importa.',
    rewards: ['+300 XP', '+5 Gemas'],
  },
];

const TROOP_PREVIEWS = [
  { emoji: '\ud83c\udfaf', name: 'Hostigador' },
  { emoji: '\ud83d\udca2', name: 'Artiller\u00eda' },
  { emoji: '\u2728', name: 'Cl\u00e9rigo' },
  { emoji: '\ud83d\udd2e', name: 'Explorador' },
  { emoji: '\ud83d\udc3a', name: 'Lobo' },
];

export default function PvEScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--red">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">\u2190</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">MODO PvE</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">\ud83d\udee1</span>
            <span className="subscreen__star-count">3 dificultades</span>
          </div>
        </div>

        <p className="pve__lead">
          Regicidio por turnos contra la IA. La dificultad define cu\u00e1nto piensa el enemigo y cu\u00e1ntas tropas aliadas le da.
        </p>

        {/* Difficulty cards */}
        <div className="pve__list">
          {DIFFICULTIES.map((d) => {
            const selected = difficulty === d.key;
            return (
              <button
                key={d.key}
                type="button"
                className={`pve-card ${selected ? 'is-selected' : ''}`}
                onClick={() => setDifficulty(d.key)}
                style={{ ['--pve-color' as any]: d.color }}
              >
                <div className="pve-card__check">
                  <span aria-hidden="true">{selected ? '\u25CF' : '\u25CB'}</span>
                </div>
                <div className="pve-card__icon">{d.emoji}</div>
                <div className="pve-card__body">
                  <div className="pve-card__title-row">
                    <h3 className="pve-card__title"><span className="gold-glow">{d.label}</span></h3>
                    <span className="pve-card__badge" style={{ borderColor: d.color, color: d.color }}>
                      {d.badge}
                    </span>
                    {d.recommended && <span className="pve-card__tag">RECOMENDADO</span>}
                  </div>

                  <div className="pve-card__meta">
                    <div className="pve-card__meta-item">
                      <span>IA</span>
                      <strong>{d.aiKind}</strong>
                    </div>
                    <div className="pve-card__meta-item">
                      <span>Tropas enemigas</span>
                      <strong>{d.enemyTroops}</strong>
                    </div>
                    <div className="pve-card__meta-item">
                      <span>Recompensa</span>
                      <strong style={{ color: d.color }}>{d.rewards[0]}</strong>
                    </div>
                  </div>

                  <p className="pve-card__desc">{d.description}</p>

                  <div className="pve-card__rewards">
                    {d.rewards.map((r, i) => (
                      <span key={i} className="pve-card__reward">\u2726 {r}</span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enemy troops preview (visible solo si dificultad != facil) */}
        {difficulty !== 'facil' && (
          <div className="pve__enemy-preview">
            <h4 className="pve__enemy-title">Tropas aliadas al enemigo ({DIFFICULTIES.find(d => d.key === difficulty)!.enemyTroops})</h4>
            <div className="pve__enemy-grid">
              {TROOP_PREVIEWS.slice(0, DIFFICULTIES.find(d => d.key === difficulty)!.enemyTroops).map((t, i) => (
                <div key={i} className="pve__enemy-cell">
                  <span className="pve__enemy-emoji">{t.emoji}</span>
                  <span className="pve__enemy-name">{t.name}</span>
                </div>
              ))}
            </div>
            <p className="pve__enemy-hint">Las tropas aliadas al enemigo solo se activan en dificultades media y dif\u00edcil.</p>
          </div>
        )}

        {/* CTA */}
        <div className="pve__cta">
          <button
            type="button"
            className="menu__btn menu__btn--red menu__btn--big menu__btn--full"
            onClick={() => setScreen('mode-select')}
          >
            <span className="menu__btn-icon">{DIFFICULTIES.find(d => d.key === difficulty)!.emoji}</span>
            <span className="menu__btn-label">
              Iniciar Partida \u2014 {DIFFICULTIES.find(d => d.key === difficulty)!.label}
            </span>
          </button>
          <p className="pve__cta-hint">
            Primero eleg\u00e9s el modo de victoria, despu\u00e9s arranc\u00e1 la batalla 3D.
          </p>
        </div>
      </div>
    </div>
  );
}
