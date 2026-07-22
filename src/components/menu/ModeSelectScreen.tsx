import { useState } from 'react';
import { useGameStore } from '../../store/game-store';

/**
 * Subpantalla: Elegi el modo de victoria.
 * Replica del original:
 *  - 3 modos seleccionables:
 *    1. Permadeath (eliminar al Rey)
 *    2. Zone Capture (3 fortificaciones)
 *    3. Capture the Flag (mejor de 3 capturas)
 *  - Boton "Start Battle" que va al tablero 3D
 *  - Header con migas Menu | JUGAR | ayuda
 */

type ModeKey = 'permadeath' | 'zone' | 'flag';

interface Mode {
  key: ModeKey;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  sample: string;
  recommended?: boolean;
}

const MODES: Mode[] = [
  {
    key: 'permadeath',
    icon: '💀',
    title: 'Permadeath',
    subtitle: 'Elimina al Rey',
    description:
      'El modo clasico. Captura o destruye al Rey enemigo para ganar. Tu Rey tambien puede caer: cada movimiento cuenta.',
    sample: '★ Victoria por K.O. del Rey',
  },
  {
    key: 'zone',
    icon: '🚩',
    title: 'Zone Capture',
    subtitle: '3 Fortificaciones',
    description:
      'Captura el primer stronghold para ganar. El modo del mapa: ventaja de relieve decide el control territorial.',
    sample: '★ Victoria por Control Territorial',
    recommended: true,
  },
  {
    key: 'flag',
    icon: '🚩',
    title: 'Capture the Flag',
    subtitle: 'Mejor de 3 capturas',
    description:
      'Captura la bandera enemiga tres veces. Las cartas y tropas se vuelven cruciales para mantener presion.',
    sample: '★ Primera a 3 capturas gana',
  },
];

export default function ModeSelectScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [selected, setSelected] = useState<ModeKey>('zone');

  const chosen = MODES.find((m) => m.key === selected)!;

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--blue">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">ELEG\u00cd EL MODO DE VICTORIA</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">\u2694</span>
            <span className="subscreen__star-count">3 opciones</span>
          </div>
        </div>

        <p className="mode-select__lead">
          Cada modo cambia las reglas de fin de partida. Elegi uno y arrancamos la batalla.
        </p>

        <div className="mode-select__list">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`mode-card ${selected === m.key ? 'is-selected' : ''}`}
              onClick={() => setSelected(m.key)}
              aria-pressed={selected === m.key}
            >
              <div className="mode-card__check">
                <span aria-hidden="true">{selected === m.key ? '\u25CF' : '\u25CB'}</span>
              </div>
              <div className="mode-card__icon">{m.icon}</div>
              <div className="mode-card__body">
                <div className="mode-card__title">
                  <span className="gold-glow">{m.title}</span>
                  {m.recommended && (
                    <span className="mode-card__tag">RECOMENDADO</span>
                  )}
                </div>
                <div className="mode-card__subtitle">{m.subtitle}</div>
                <p className="mode-card__desc">{m.description}</p>
                <div className="mode-card__sample">{m.sample}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mode-select__cta">
          <button
            className="menu__btn menu__btn--blue menu__btn--big menu__btn--full"
            onClick={() => setScreen('tactics')}
            disabled={!selected}
          >
            <span className="menu__btn-icon">\u25B6</span>
            <span className="menu__btn-label">Start Battle \u2014 {chosen.title}</span>
          </button>
          <p className="mode-select__hint">
            Modo elegido: <strong>{chosen.title}</strong>. Después podes cambiarlo en Configuracion.
          </p>
        </div>
      </div>
    </div>
  );
}
