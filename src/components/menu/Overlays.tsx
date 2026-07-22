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
import ConfigScreen from './ConfigScreen';
import NewsScreen from './NewsScreen';
import EventsScreen from './EventsScreen';
import CollectionScreen from './CollectionScreen';
import PvEScreen from './PvEScreen';
import PvPScreen from './PvPScreen';
import DraftScreen from './DraftScreen';
import SplashScreen from './SplashScreen';
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
      {screen === 'config' && <ConfigScreen />}
      {screen === 'news' && <NewsScreen />}
      {screen === 'events' && <EventsScreen />}
      {screen === 'collection' && <CollectionScreen />}
      {screen === 'pve' && <PvEScreen />}
      {screen === 'pvp' && <PvPScreen />}
      {screen === 'draft' && <DraftScreen />}
      {screen === 'splash' && <SplashScreen />}
      {screen !== 'menu' && screen !== 'tactics' && ![
        'campaign','mode-select','bestiary','cards','store','pase','profile',
        'config','news','events','collection','pve','pvp','draft','splash',
      ].includes(screen) && <SubScreenFor screen={screen} />}
    </>
  );
}

function SubScreenFor({ screen }: { screen: Screen }) {
  return <SubScreen screen={screen} />;
}
