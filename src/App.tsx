import { Canvas } from '@react-three/fiber';
import Scene3D from './components/scene/Scene3D';
import GameHUD from './components/hud/GameHUD';
import Overlays from './components/menu/Overlays';
import DebugPanel from './components/menu/DebugPanel';
import { useGameStore } from './store/game-store';
import { useEffect, useRef } from 'react';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.35;
      audioRef.current.loop = true;
    }
  }, [screen]);

  return (
    <div className="app">
      <Canvas
        camera={{ position: [28, 28, 28], fov: 42 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene3D />
      </Canvas>

      <Overlays />
      {screen === 'tactics' && <GameHUD />}
      <DebugPanel />

      <audio ref={audioRef} src="/assets/audio/music/01_menu_ambient.mp3" />
    </div>
  );
}
