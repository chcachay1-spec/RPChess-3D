import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/game-store';

/**
 * Splash screen que se ve durante la transicion entre el modo-select y el tablero 3D.
 * Muestra un mensaje de carga breve + desvanece. Se autoinicia abajo automaticamente.
 */
export default function SplashScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setScreen('tactics'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setScreen]);

  return (
    <div className="splash">
      <div className="splash__bg" />
      <div className="splash__crown">{'👑'}</div>
      <h1 className="splash__title gold-glow">RPChess 3D</h1>
      <p className="splash__subtitle">The Lost Kingdom</p>

      <div className="splash__phases">
        <div className={`splash__phase ${phase >= 0 ? 'is-on' : ''}`}>
          <span className="splash__phase-icon">{'⚔️'}</span>
          <span className="splash__phase-label">Inicializando tablero</span>
        </div>
        <div className={`splash__phase ${phase >= 1 ? 'is-on' : ''}`}>
          <span className="splash__phase-icon">{'🗺'}</span>
          <span className="splash__phase-label">Asignando piezas</span>
        </div>
        <div className={`splash__phase ${phase >= 2 ? 'is-on' : ''}`}>
          <span className="splash__phase-icon">{'🎮'}</span>
          <span className="splash__phase-label">Listo para batalla</span>
        </div>
      </div>

      <div className="splash__loader">
        <div className="splash__loader-bar" />
      </div>

      <button
        type="button"
        className="splash__skip"
        onClick={() => setScreen('tactics')}
      >
        Saltar ›
      </button>
    </div>
  );
}
