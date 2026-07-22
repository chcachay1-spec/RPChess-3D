import { useState } from 'react';
import { useGameStore } from '../../store/game-store';

type AiDifficulty = 'facil' | 'media' | 'dificil';
type Language = 'ES' | 'EN';
type GraphicsQuality = 'low' | 'mid' | 'high';

interface Settings {
  audio: { sfx: boolean; music: boolean };
  ai: AiDifficulty;
  language: Language;
  graphics: GraphicsQuality;
  showEmojiNames: boolean;
  showCoordinates: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  audio: { sfx: true, music: false },
  ai: 'media',
  language: 'ES',
  graphics: 'high',
  showEmojiNames: true,
  showCoordinates: true,
};

export default function ConfigScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const patch = (partial: Partial<Settings>) => setSettings((p) => ({ ...p, ...partial }));
  const patchAudio = (key: keyof Settings['audio']) =>
    setSettings((p) => ({ ...p, audio: { ...p.audio, [key]: !p.audio[key] } }));

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">CONFIGURACIÓN</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">⚙</span>
            <span className="subscreen__star-count">Ajustes</span>
          </div>
        </div>

        <p className="config__lead">Ajusta el sonido, la IA, el idioma y la calidad visual. Cambios se guardan al instante.</p>

        {/* Audio */}
        <section className="config__section">
          <h3 className="config__section-title">Ajustes de Audio</h3>
          <div className="config__row">
            <div className="config__row-label">Efectos de sonido</div>
            <label className="config__toggle">
              <input type="checkbox" checked={settings.audio.sfx} onChange={() => patchAudio('sfx')} />
              <span className="config__toggle-track">
                <span className="config__toggle-thumb" />
              </span>
            </label>
          </div>
          <div className="config__row">
            <div className="config__row-label">Música de fondo</div>
            <label className="config__toggle">
              <input type="checkbox" checked={settings.audio.music} onChange={() => patchAudio('music')} />
              <span className="config__toggle-track">
                <span className="config__toggle-thumb" />
              </span>
            </label>
          </div>
          <div className="config__row">
            <div className="config__row-label">Volumen general</div>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={70}
              className="config__slider"
              aria-label="Volumen"
            />
          </div>
        </section>

        {/* AI Difficulty */}
        <section className="config__section">
          <h3 className="config__section-title">Dificultad de la IA</h3>
          <div className="config__segment">
            {(['facil', 'media', 'dificil'] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={`config__segment-btn ${settings.ai === d ? 'is-active' : ''}`}
                onClick={() => patch({ ai: d })}
              >
                {d === 'facil'   ? '🟢 Fácil'   : ''}
                {d === 'media'   ? '🟡 Media'   : ''}
                {d === 'dificil' ? '🔴 Difícil' : ''}
              </button>
            ))}
          </div>
          <p className="config__hint">
            {settings.ai === 'facil'   && 'La IA juega al azar. Recomendada para aprender las reglas.'}
            {settings.ai === 'media'   && 'La IA usa heurísticas simples. Buen balance para jugar cómodo.'}
            {settings.ai === 'dificil' && 'La IA evalúa los próximos turnos. Pensala dos veces antes de mover.'}
          </p>
        </section>

        {/* Language */}
        <section className="config__section">
          <h3 className="config__section-title">Idioma</h3>
          <div className="config__segment">
            {(['ES', 'EN'] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={`config__segment-btn ${settings.language === l ? 'is-active' : ''}`}
                onClick={() => patch({ language: l })}
              >
                {l === 'ES' ? '🇪🇸 Español' : '🇺🇸 English'}
              </button>
            ))}
          </div>
        </section>

        {/* Graphics */}
        <section className="config__section">
          <h3 className="config__section-title">Pantalla y Gráficos</h3>
          <div className="config__row">
            <div className="config__row-label">Calidad gráfica</div>
            <div className="config__segment config__segment--mini">
              {(['low', 'mid', 'high'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`config__segment-btn ${settings.graphics === g ? 'is-active' : ''}`}
                  onClick={() => patch({ graphics: g })}
                >
                  {g === 'low'  ? 'Baja'  : ''}
                  {g === 'mid'  ? 'Media' : ''}
                  {g === 'high' ? 'Alta'  : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="config__row">
            <div className="config__row-label">Mostrar nombre de pieza</div>
            <label className="config__toggle">
              <input
                type="checkbox"
                checked={settings.showEmojiNames}
                onChange={() => patch({ showEmojiNames: !settings.showEmojiNames })}
              />
              <span className="config__toggle-track">
                <span className="config__toggle-thumb" />
              </span>
            </label>
          </div>
          <div className="config__row">
            <div className="config__row-label">Coordenadas del tablero</div>
            <label className="config__toggle">
              <input
                type="checkbox"
                checked={settings.showCoordinates}
                onChange={() => patch({ showCoordinates: !settings.showCoordinates })}
              />
              <span className="config__toggle-track">
                <span className="config__toggle-thumb" />
              </span>
            </label>
          </div>
        </section>

        <div className="config__footer">
          <button type="button" className="config__btn config__btn--ghost" onClick={() => setSettings(DEFAULT_SETTINGS)}>
            ↺ Restaurar valores predeterminados
          </button>
          <button type="button" className="config__btn config__btn--primary" onClick={() => setScreen('menu')}>
            ✓ Guardar y Volver al Menu
          </button>
        </div>
      </div>
    </div>
  );
}
