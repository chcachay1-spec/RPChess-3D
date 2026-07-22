import { useGameStore } from '../../store/game-store';
import MainMenu from './MainMenu';
import SubScreen from './SubScreen';
import CampaignScreen from './CampaignScreen';
import ModeSelectScreen from './ModeSelectScreen';
import BestiaryScreen from './BestiaryScreen';
import CardsScreen from './CardsScreen';
import StoreScreen from './StoreScreen';
import SeasonPassScreen from './SeasonPassScreen';
import ProfileScreen from './ProfileScreen';
import type { Screen } from '../../store/game-store';

export default function Overlays() {
  const screen = useGameStore((s) => s.screen);
  return (
    <>
      {screen === 'menu' && <MainMenu />}
      {screen === 'campaign' && <CampaignScreen />}
      {screen === 'mode-select' && <ModeSelectScreen />}
      {screen === 'bestiary' && <BestiaryScreen />}
      {screen === 'cards' && <CardsScreen />}
      {screen === 'store' && <StoreScreen />}
      {screen === 'pase' && <SeasonPassScreen />}
      {screen === 'profile' && <ProfileScreen />}
      {screen !== 'menu' && screen !== 'tactics' && screen !== 'campaign' && screen !== 'mode-select' && screen !== 'bestiary' && screen !== 'cards' && screen !== 'store' && screen !== 'pase' && screen !== 'profile' && <SubScreenFor screen={screen} />}
    </>
  );
}

function SubScreenFor({ screen }: { screen: Screen }) {
  return <SubScreen screen={screen} />;
}
