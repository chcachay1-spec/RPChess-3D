import { useGameStore } from '../../store/game-store';
import MainMenu from './MainMenu';
import SubScreen from './SubScreen';
import CampaignScreen from './CampaignScreen';
import type { Screen } from '../../store/game-store';

/**
 * Decide que overlay mostrar encima del Canvas 3D:
 * - 'menu' -> MainMenu
 * - 'tactics' -> no overlay (GameHUD se renderiza aparte)
 * - 'campaign' -> CampaignScreen custom
 * - cualquier otro -> SubScreen
 */
export default function Overlays() {
  const screen = useGameStore((s) => s.screen);
  return (
    <>
      {screen === 'menu' && <MainMenu />}
      {screen === 'campaign' && <CampaignScreen />}
      {screen !== 'menu' && screen !== 'tactics' && screen !== 'campaign' && <SubScreenFor screen={screen} />}
    </>
  );
}

function SubScreenFor({ screen }: { screen: Screen }) {
  return <SubScreen screen={screen} />;
}
