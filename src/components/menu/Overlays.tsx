import { useGameStore } from '../../store/game-store';
import MainMenu from './MainMenu';
import SubScreen from './SubScreen';
import type { Screen } from '../../store/game-store';

/**
 * Decide qué overlay mostrar encima del Canvas 3D:
 * - 'menu' → MainMenu
 * - 'tactics' → no overlay (GameHUD se renderiza aparte)
 * - cualquier otro → SubScreen
 */
export default function Overlays() {
  const screen = useGameStore((s) => s.screen);
  return (
    <>
      {screen === 'menu' && <MainMenu />}
      {screen !== 'menu' && screen !== 'tactics' && <SubScreenFor screen={screen} />}
    </>
  );
}

function SubScreenFor({ screen }: { screen: Screen }) {
  return <SubScreen screen={screen} />;
}
